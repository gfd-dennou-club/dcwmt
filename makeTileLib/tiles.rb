# @method: searchColDown(ary: array[][], col: number, tileLen: number) -> number or nil
# 与えられた配列において, nilで埋められていない行まで下に向かって列を走査する
def searchColDown(ary, col, tileLen)
	downCol = col + 1
	colLen = ary.transpose[0].length
	return nil if downCol >= colLen
    while ary[downCol].count(nil) == tileLen do
		downCol += 1
		return nil if downCol >= colLen
    end
    return downCol
end

# @method: searchColUp(ary: array[][], col: number, tileLen: number) -> number or nil
# 与えられた配列において, nilで埋められていない行まで上に向かって列を走査する
def searchColUp(ary, col, tileLen)
	upCol = col - 1
	return nil if upCol < 0
    while ary[upCol].count(nil) == tileLen do
		upCol -= 1
		return nil if upCol < 0
    end
    return upCol
end

# @method: linearInterpolation(ary: array[][], rowLen: number, colLen: number) -> array[][]
# 線形補完を行う
def linearInterpolation(ary, rowLen, colLen)
	ary.each.with_index{|row, col|
		# もし, nilしかない行だった場合
	    if row.count(nil) == rowLen then
	        # 列番号が先頭だった場合, 下方向の2点を取得
			if col == 0 then
				c0 = searchColDown(ary, col, rowLen) 
	            c1 = searchColDown(ary, c0, rowLen)
	        # 列番号が末尾だった場合, 上方向の2点を取得
			elsif col == colLen - 1 then
	            c0 = searchColUp(ary, col, rowLen)
	            c1 = searchColUp(ary, c0, rowLen)
	        # それ以外は, 下方向と上方向の2点を取得
			else
				c0 = searchColUp(ary, col, rowLen)
				c1 = searchColDown(ary, col, rowLen)
				# 下方向に値がなければ, 下方向のみで補完する
				if c0 == nil then
					c0 = searchColDown(ary, col, rowLen)
					c1 = searchColDown(ary, c0, rowLen)
				# 上方向に値がなければ, 上方向のみで補完する
				elsif c1 == nil then
					c0 = searchColUp(ary, col, rowLen)
					c1 = searchColUp(ary, c0, rowLen)
				end
	        end
			# 上で取得した2点間で線形補完を行う
			complementValue = row.map.with_index{|v, i| 
				if ary[c1][i] == nil || ary[c0][i] == nil then
					nil
				else
					((ary[c1][i] - ary[c0][i]) / (c1 - c0))*(col - c0) + ary[c0][i]
				end
			}
	        ary[col] = complementValue
	    else
	        ary[col] = row
	    end
	}
	return ary
end

# 次元を固定することはもうすでにされているため
# 次元がもつ優先度を適用するべし
# 今回は最大4次元を想定しており
# time(t) > level(sg) > longtude = latitude
# の優先度で走査されていく
# - timeがあってもいらないからタイル作る必要ないよね...
# - levelは縦軸にはなり得るけど横軸にはなり得ないよね...
#
# dimInfo: Hash{ :name: String, :length: Number, :start: Number, :end: Number, :stride: Number}
# countAry: Hash{ :name: String, :length: 0, ...}
def makeTileForPlane(dimInfo, fp, countAry, xindex, yindex, otherindex, dirPath, file)	
	# 拡大率を計算
	zoomLevel = getMaxZoomLevel(dimInfo[xindex][:length], dimInfo[yindex][:length], 256)

	# タイルサイズを計算 dimInfo[xindex][:length]/(2**zoomLevel)
	# tileSize = { :x => dimInfo[xindex][:length]/(2**zoomLevel), :y => dimInfo[yindex][:length]/(2**zoomLevel)}
	tileSize = { :x => 256, :y => 256 }
	p "tileSize : #{tileSize[:x]} * #{tileSize[:y]}, maxZoomLevel : #{zoomLevel}でタイルを作ります"

	file.puts("\t\t\tSIZE: {X: #{tileSize[:x]}, Y: #{tileSize[:y]}},")
	file.puts("\t\t\tMAXIMUMLEVEL: #{zoomLevel},")
	file.puts("\t\t\tAXIS: {X: \"#{dimInfo[xindex][:name]}\", Y: \"#{dimInfo[yindex][:name]}\"},")

	# ベースとなるタイルのディレクトリパスを作成 および ディレクトリ作成
	option = { "start" => [countAry[otherindex[0]].to_i], "end" => [countAry[otherindex[0]].to_i], "stride" => [1] }
	othervalue = @netCDF.var(dimInfo[otherindex[0]][:name]).get(option)[0].to_i
	tempDirPath_base = "#{dirPath}#{dimInfo[otherindex[0]][:name]}=#{othervalue}/"
	mkdir(tempDirPath_base)

	# 軸の変数を取得
	xAxisAry = @netCDF.var(dimInfo[xindex][:name]).get("start" => [0], "end" => [-1], "stride" => [1])
	yAxisAry = @netCDF.var(dimInfo[yindex][:name]).get("start" => [0], "end" => [-1], "stride" => [1])

	min, max = nil, nil

	# 拡大率の値だけ回す
	(zoomLevel+1).times{|zindex|
		p "---------#{zindex}--------"
		numOfDevision = 2**zindex	# 分割数

		# 軸の変数の値を元に, メルカトル座標系に変換
		# @param: mercator{
		#	@key: :indexOfNetCDF => @value: netCDFを参照する際のインデックス,
		#	@key: :weight		 => @value: メルカトル図法からタイルの座標値に変換した際の真値との差分 [ 0.0 , 1.0 ]	
		# }
		mercatorX = Array.new(tileSize[:x] * numOfDevision).map{Array.new()}
		xAxisAry.each.with_index{|x, i|
			lon = x * Math::PI / 180.0
			mercatorX[(lon * tileSize[:x] * numOfDevision / (2.0 * Math::PI)).to_i].push(
				:indexOfNetCDF => i,
				:weight => 1.0 - ((lon * tileSize[:x] * numOfDevision / (2.0 * Math::PI)) - (lon * tileSize[:x] * numOfDevision / (2.0 * Math::PI)).to_i).abs
			)
		}

		mercatorY = Array.new(tileSize[:y] * numOfDevision).map{Array.new()}
		yAxisAry.each.with_index{|y, i|
			lat = geodeticLatitudeToMercatorAngle(y * Math::PI / 180.0)
			mercatorY[(lat * tileSize[:y] * numOfDevision / (2.0 * Math::PI) + (tileSize[:y] * numOfDevision - 1).to_f/2.0).to_i].push(
				:indexOfNetCDF => i,
				:weight => 1.0 - ((lat * tileSize[:y] * numOfDevision / (2.0 * Math::PI)) - (lat * tileSize[:y] * numOfDevision / (2.0 * Math::PI)).to_i).abs
			)
		}

		# x軸方向の分割数だけ回す
		numOfDevision.times{|devide_x|
			# タイルを保存しておくディレクトリパスを作成 および ディレクトリの作成	
			tempDirPath_x = tempDirPath_base + "#{zindex}/#{devide_x}/"
			mkdir(tempDirPath_x)

			# 分割されたタイルをまたいだx座標値
			offset_x = tileSize[:x]*devide_x
			tempMercatorX = mercatorX[tileSize[:x]*devide_x ... tileSize[:x]*(devide_x+1)]

			# y軸方向の分割数だけ回す
			numOfDevision.times{|devide_y|
				
				# 分割されたタイルをまたいだy座標値
				offset_y = tileSize[:y]*devide_y
				tempMercatorY = mercatorY[tileSize[:y]*devide_y ... tileSize[:y]*(devide_y+1)]

				# タイルを保存しておくディレクトリパスを作成
				tempDirPath_y = tempDirPath_x + "#{numOfDevision - devide_y - 1}"

				# pnmファイルを作成
				options = { :tileSize => {:x => tileSize[:x], :y => tileSize[:y]} }
				pnm = PNM.new(tempDirPath_y, options)

				p "---------( #{devide_x}, #{numOfDevision - devide_y - 1} )---------"

				# 配列を用意
				ary = Array.new(tileSize[:y]).map{Array.new(tileSize[:x]).map{nil}}
				tempMercatorY.each.with_index{|y, yi|
					if !y.empty? then
						tempMercatorX.each.with_index{|x, xi|
							if !x.empty? then
								weightX, weightY = 0.0, 0.0
								value = 0.0

								y.each{|yinfo|
									x.each{|xinfo|
										# netCDFからの情報の取り出し方の設定
										tempInfo = dimInfo.map.with_index{|dim, index|
											if dim[:name] === dimInfo[xindex][:name]  then
												getDimInfo(dim, index, dim[:name], xinfo[:indexOfNetCDF], xinfo[:indexOfNetCDF])
											elsif dim[:name] === dimInfo[yindex][:name] then
												getDimInfo(dim, index, dim[:name], yinfo[:indexOfNetCDF], yinfo[:indexOfNetCDF])
											else
												getDimInfo(dim, index)
											end
										}
										value += @netCDF.var(fp).get(getVariableRule(tempInfo))[0] * xinfo[:weight] * yinfo[:weight]
									}
								}

								# 重みの総量を計算しておく
								y.each{|yinfo| weightY += yinfo[:weight]}
								x.each{|xinfo| weightX += xinfo[:weight]}
							
								# 加重平均をとる
								ary[yi][xi] = value / (weightX * weightY)
							end
						}
					end
				}

				# y軸方向に反転させる
				# 左上が原点となっているため, 画像にすると反転してしまう
				ary = ary.transpose.map{|a| a.reverse}.transpose

				# 線形補完
				ary = linearInterpolation(ary, tileSize[:x], tileSize[:y])						# y軸方向
				ary = linearInterpolation(ary.transpose, tileSize[:y], tileSize[:x]).transpose	# x軸方向

				# PNMファイルに書き込む
				tileSize[:y].times{|y|
					tileSize[:x].times{|x|
						pnm.writeFromByte(ary[y][x])
					}
				}

				# PNMファイルの書き込み終了
				pnm.end()

				system("pnmtopng #{tempDirPath_y}.ppm > #{tempDirPath_y}.png")
      		 	#system("rm -f #{tempDirPath_y}.ppm")
			}
		}
	}

	# ===== 軸ではない次元の作成 =====

	# 軸ではない次元について0番目の次元をカウントアップ
	countAry[otherindex[0]] += 1
	# カウントが次元の長さを超えた場合, 配列の0番目を削除
	otherindex.delete_at(0) if (countAry[otherindex[0]] >= dimInfo[otherindex[0]][:length])
	# 配列が空になった場合
	if otherindex.empty? then
		return																    # 再帰を終了
	else
		makeTileForPlane(dimInfo, fp, countAry, xindex, yindex, otherindex, dirPath)	# 軸ではない次元をカウントアップしたもので再帰
	end
end


# @method: makeTileForBaumkuchen() -> void
# バームクーヘン状の数値タイルを作成する
def makeTileForBaumkuchen(dimInfo, fp, countAry, xindex, yindex, otherindex, dirPath)

	# 円を描くためのインスタンスを生成
	# 引数は中央の点の座標
	circle = Circle.new({:x => 0, :y => 0})

	# 歪ませる軸の長さを円周の長さと見立て, 半径を計算する
	# 余ったもうひとつの軸を円の厚さとする
	windex, tindex = xindex, yindex
	radius = circle.getRadiusFromCircumference(dimInfo[windex][:length])
	level = dimInfo[tindex][:length]

	# 画像のサイズを計算する
	size = 2*radius + 2*level + 1

	# 図を作成するための配列を用意
	# とりあえず nil で埋めておく
	ary = Array.new(size).map{ Array.new(size).map{nil} }

	# 円の厚さごとに円を書いてゆく
	# ここが半端なく長い
	level.times{|l|
		# 暫定的な円の半径
		# (なお, 円の厚さの丁度半分がもっとも誤差が少ないように設定している.
		#  そのようにすることで全体的な誤差が最小に抑えられると考えた) 
		temp_r = radius - level/2 + l
		# 暫定的な円の半径から円周の長さを求める
		temp_circmference = circle.getCircumferenceFromRadius(temp_r)
		# 暫定的な半径を半径に持つ円を描画するためのインスタンスを生成
		circle = Circle.new({:x => 0, :y => 0}, temp_r)

		# もし暫定的な半径が大元の円の半径よりも小さかったら
		if temp_r <= radius then
			# 円周の長さの比率を計算
			# "データ長" を "暫定的な半径から求めた円周の長さ" で割る
			# パディング数を求める
			ratio = dimInfo[windex][:length] / temp_circmference + 1
			
			# データ長と暫定的な円周の長さは diff 分だけ重複している
			diff = dimInfo[windex][:length] % temp_circmference

			# 値を取り出す個数に関する情報がある配列
			takeOut = Array.new(temp_circmference).map.with_index{|v, i|
				if i < diff then
					ratio
				else
					(ratio - 1 <= 0 ? 1 : ratio - 1)
				end
			}
			
			# getCircumferenceFromRadiusメソッドを使用した場合, setRadius()をしたほうが良いです.
			circle.setRadius(temp_r)

			# 一時的に使用する次元に関する情報を保持しておく変数を用意
			tempInfo = dimInfo.map{|d| d}

			# 厚さとする次元のデータを取得
			tempInfo[tindex] = getDimInfo(dimInfo[tindex], tindex, dimInfo[tindex][:name], l, l)
			
			num = Array.new
			# データを取得(四次元配列で帰ってくるため, 一次元にしておく)
			count = 0
			temp_circmference.times{|index|
				tempInfo[windex] = getDimInfo(dimInfo[windex], windex, dimInfo[windex][:name], count, count + takeOut[index] - 1)
				count += takeOut[index]
				# 符号あり整数で計算されているようで普通に計算をするとスタックオーバしてしまう
				# 即席で解決をしたが根本的な解決には至っていない
				num.push(@netCDF.var(fp).get(getVariableRule(tempInfo)).flatten.map{|v| v / takeOut[index].to_f}.sum)
				# num.push(@netCDF.var(fp).get(getVariableRule(dimInfo2)).sum / takeOut[index].to_f)
			}
			count = 0
			while (c = circle.draw()) do
				ary[c[:x] + radius + level][c[:y] + radius + level] = num[count]
				count += 1
			end
		else
			ratio = temp_circmference / dimInfo[windex][:length] + 1

			# データ長と暫定的な円周の長さは diff 分だけ重複している
			diff = temp_circmference - dimInfo[windex][:length]

			# パッディング数を計算
			if diff == 0 then		# 重複していなければ
				ratio = 1
			else
				loop{
					# 重複数を計算
					padding =  diff / temp_circmference
					if padding >= 1 then # 1回以上重複していたら
						ratio += 1					# データから取り出す値をひとつ増やして
						diff -= temp_circmference	# diffから暫定的な円周の長さをひく
					else				 # 1度も重複していなければ 
						break			  
					end
				}
			end

			putOn = Array.new()
			dimInfo[windex][:length].times{|index|
				if index < diff then
					putOn.push(ratio)
				else
					putOn.push(ratio - 1 <= 0 ? 1 : ratio - 1)
				end
			}

			# getCircumferenceFromRadiusメソッドを使用した場合, setRadius()をしたほうが良いです.
			circle.setRadius(temp_r)

			# 一時的に使用する次元に関する情報を保持しておく変数を用意
			tempInfo = dimInfo.map{|d| d}

			# 厚さとする次元のデータを取得
			tempInfo[tindex] = getDimInfo(dimInfo[tindex], tindex, dimInfo[tindex][:name], l, l)

			num = Array.new
			# データを取得(四次元配列で帰ってくるため, 一次元にしておく)
			dimInfo[windex][:length].times{|index|
				tempInfo[windex] = getDimInfo(dimInfo[windex], windex, dimInfo[windex][:name], index, index)
				putOn[index].times{
					num.push(@netCDF.var(fp).get(getVariableRule(tempInfo)).sum)
				}
			}
			count = 0
			while (c = circle.draw()) do
				ary[c[:x] + radius + level][c[:y] + radius + level] = num[count]
				count += 1
			end
		end	
		
		circle = Circle.new({:x => 0, :y => 0}, radius + l + 1)
	}

	# 綺麗に円がかけずできてしまった空白を埋める
	(size).times{|y|
		(size).times{|x|
			if x > 1 then
				if (ary[x-2][y] != -1 && ary[x][y] != -1) && ary[x-1][y] == -1 then
					ary[x-1][y] = ary[x][y]
				end
			end
		}
	}

	# 拡大率を計算
	zoomLevel = getMaxZoomLevel(size, size, 256)
	# タイルサイズを計算
	tileSize = { :x =>  size/(2**zoomLevel), :y => size/(2**zoomLevel)}
	
	p "tileSize : #{tileSize[:x]} * #{tileSize[:y]}, maxZoomLevel : #{zoomLevel}}でタイルを作ります"

	# ディレクトリパスの設定
	p countAry[otherindex[0]]
	tempDirPath_base = "#{dirPath}#{dimInfo[otherindex[0]][:name]}=#{countAry[otherindex[0]].to_i}/"

	# ディレクトリの作成
	mkdir(tempDirPath_base)

	(zoomLevel+1).times{|zindex|
		p "---------#{zindex}--------"
		numOfDevision = 2**zindex	# 分割数
		# 分割数分回す
		numOfDevision.times{|devide_y|
			tempDirPath_y = tempDirPath_base + "#{zindex}/#{numOfDevision - devide_y - 1}/"
			mkdir(tempDirPath_y)
			offset_y = (dimInfo[yindex][:length] / numOfDevision)*devide_y
			numOfDevision.times{|devide_x|	
				
				offset_x = (dimInfo[xindex][:length] / numOfDevision)*devide_x

				options = { :tileSize => {:x => tileSize[:x], :y => tileSize[:y]} }

				tempDirPath_x = tempDirPath_y + "#{devide_x}"
				pnm = PNM.new(tempDirPath_x, options)
				p "---------( #{devide_x}, #{devide_y} )---------"

				# 画像サイズを全ての拡大率で同じにするために平均値をとる
				numOfSum = 2**(zoomLevel-zindex)

				# 配列を用意
				ary = Array.new(tileSize[:y]).map{Array.new(tileSize[:x]).map{0}}

				# タイルを作成
				tileSize[:y].times{|y|
					countAry[yindex] = offset_y + y * numOfSum

					tileSize[:x].times{|x|
						countAry[xindex] = offset_x + x * numOfSum
						
						num = ary[countAry[xindex]...countAry[xindex]+numOfSum][countAry[yindex]...countAry[yindex]+numOfSum].sum / (numOfSum*numOfSum)

						pnm.writeFromByte(num)
					}
				}

				# PNMファイルの書き込み終了
				pnm.end()

				system("pnmtopng #{tempDirPath_x}.ppm > #{tempDirPath_x}.png")
      			system("rm -f #{tempDirPath_x}.ppm")
			}
		}
	}

	# ===== 軸ではない次元の作成 =====

	# 軸ではない次元について0番目の次元をカウントアップ
	countAry[otherindex[0]] += 1
	# カウントが次元の長さを超えた場合, 配列の0番目を削除
	otherindex.delete_at(0) if (countAry[otherindex[0]] >= dimInfo[otherindex[0]][:length])
	# 配列が空になった場合
	if otherindex.empty? then
		return																    # 再帰を終了
	else
		makeTileForPlane(dimInfo, fp, countAry, xindex, yindex, otherindex, dirPath)	# 軸ではない次元をカウントアップしたもので再帰
	end
end