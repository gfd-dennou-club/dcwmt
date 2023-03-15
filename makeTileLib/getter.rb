# @method getMaxZoomLevel(x: Number, y: Number, devide_size: Number) -> expansion_rate: Number
#
#	@param	x (Number) : 作成する画像の縦軸の大きさ(縦軸に設定する次元の変数の要素数)
#	@param	y (Number) : 作成する画像の横軸の大きさ(横軸に設定する次元の変数の要素数)
#	@param 	devide_size (Number) : 分割サイズの理想値
#
#	@return expantion_rate (Number) : 拡大率
# 
# 画像のサイズから拡大率を取得する
def getMaxZoomLevel(x,y, devide_size)
	current_size = [x, y]	# 現在のタイルの大きさ
	before_size = [x, y]	# タイルを保持しておく
	expansion_rate = 0
	while true do
		before_size = current_size
		if current_size[0]%2==0 && current_size[1]%2==0 then
			current_size = current_size.map{|v| v/2};
			expansion_rate += 1
		else
			return expansion_rate
		end

		index = 0
		current_size.each{|edge|
			if edge < devide_size then
				if (edge-devide_size).abs < (before_size[index]-devide_size).abs then
					return expansion_rate
				else 
					return expansion_rate -1
				end
			end
			index += 1
		}
	end
end

# @method getDimInfo(dim: NetCDF::Dim) -> Hash{ :name: String, :start: Number, :end: Number, :stride: Number}
#
# 	@params	dim (NetCDF::Dim) : 対象としている物理量の次元
# 	@params fname = nil (String) : 走査する際に固定する次元の名前
# 	@params findex = 0 (Number) : 走査する際に固定する次元の値
# 	
# 	@return (Hash) : 取り出す物理量のデータの範囲や間隔
#
# 物理量のデータを取り出す際の範囲や間隔についての情報を返す
def getDimInfo(dim, index, fname = nil, fstart = nil, fend = nil)
	name = dim.name if dim.kind_of?(NumRu::NetCDFDim)
	name = dim[:name] if dim.kind_of?(Hash)

	# 走査する固定次元が設定されていたら
	# 走査する箇所に次元を固定するようにしておく
	if fname && fname === name then
		_length = 1
		_start = fstart
		_end = fend
	else
		# 該当する次元が固定されているかどうか
		isFixed = @fix.select{|s| s[:dimention] === name}

		if isFixed.empty? then
			_start = 0
			_end = 0
			_length = dim.length
		else
			_start = getOtherDimVar(name, isFixed[0][:start])
			_end = getOtherDimVar(name, isFixed[0][:end])
			_length = _start - _end + 1
		end
	end

	# ハッシュ配列にして返す
	return { :name => name, :index => index, :length => _length, :start => _start, :end => _end, :stride => 1 }
end

# @method getVariableRule(dimInfo: Hash) -> Hash
# 	@params dimInfo (Hash) : 
#
# netCDFから変数を取得する際に取得しやすいように, dimInfoの情報を整形して返す
# 以下の例のようにそのまま突っ込めば取り出せる
#
# 例 )
# 	netCDF.var({variable name}).get(getVariableRule(dimInfo))
def getVariableRule(dimInfo)
	startArray = Array.new
	endArray = Array.new
	strideArray = Array.new
	dimInfo.each{|info|
		startArray.push(info[:start])
		endArray.push(info[:end])
		strideArray.push(info[:stride])
	}
	return { "start" => startArray, "end" => endArray, "stride" => strideArray }
end

def getOtherDimVar(name, index)
	option = { "start" => [0], "end" => [-1], "stride" => [1] }
	allvalues = @firstNetCDF.var(name).get(option)

	diff = 6 - index.to_i.abs.to_s.length

	if diff > 0 then
		allvalues *= 10**diff
		index *= 10**diff
	end
	return allvalues.to_i.to_a.find_index(index.to_i)
end
