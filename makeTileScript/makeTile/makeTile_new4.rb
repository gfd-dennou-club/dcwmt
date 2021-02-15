require "numru/netcdf"
require 'optparse'
require 'pp'

require './pnm.rb'
require './getter.rb'
require './util.rb'
require './projectionToMercator.rb'
require './colormap.rb'
require './makeTile.rb'
require './circle.rb'

# [MEMO]他の次元が存在していない時の処理ができていないよ

# 固定次元についての情報を格納しておく配列を確保
@fix = Array.new()
# 数値データタイルを保存しておくパス
@dirname = "./"
# 軸とする次元
@axis = { :x => "lon", :y => "lat"}
# バームクーヘン状のマップを作成する際に歪ませる次元名
@warp_dim = false
# カラーマップ
@clrmap = clrmap_04

# コマンドライン引数より物理量の抽出
option = OptionParser.new

# 固定する次元を決定(次元名はnetCDFに記述されている名前を正しく記述してください)
# 例)
# 	[ time次元を2174に固定 ]
# 	ruby makeTile.rb -f time=2174 sample.nc@temp
# 	
# 	[ time次元を2174から3156の範囲に絞る ]
# 	ruby makeTile.rb -f time=2174:3156 saple.nc@temp
#
# 	[ time次元を2174に固定. level次元を290に固定]
# 	ruby mekrTile.rb -f time=2174,level=290 sample.nc@temp
# 	(注意)カンマは空白を開けないでください
option.on('-f', '--fix DIMENTION', 'fix dimention'){|dim|
	@fix = dim.split(',').map{|v| 
		{ 
			:dimention => v.split('=')[0], 
			:start => v.split('=')[1].split(':')[0].to_i, 
			:end => ( v.split('=')[1].split(':')[1] ? v.split('=')[1].split(':')[1].to_i : v.split('=')[1].split(':')[0].to_i ) 
		} 
	}
}

# 数値データタイルを保存するディレクトリのパスを決定
# 例 ) 
#	[ WorkSpaceディレクトリを指定 ]
#	ruby makeTile.rb -d ./WorkSpace/ sample.nc@temp
#
# 	[ カレントディレクトリを指定 ]
# 	ruby makeTile.rb sampl.nc@temp
# 	(注意)カレントディレクトリを指定する場合はオプションを書く必要はありません
option.on('-d', '--dirname PATH', 'path of splited tile'){|path|
	@dirname = path
}

# 軸を設定する
# 例 )
#   [作成するグラフのx軸を'lon', y軸を'lat'に設定する]
#	ruby makeTile.rb -a x:lon,y:lat sample.nc@temp
#
#	(注意)デフォルトでは, x軸が'lon', y軸が'lat'です
option.on('-a', '--axis POINT', 'axis of visualize graph'){|point|
	@axis[:x] = point.split('x:')[1].split(',')[0]
	@axis[:y] = point.split('y:')[1].split(',')[0]
}

# バームクーヘン状のマップを作成する際に歪ませる次元を設定する
# 例 )
#	["lon"次元を歪ませる]
# 	ruby makeTile.rb -b warp:lon sample.nc@temp
#	
#	(注意)	
#			- このオプションを用いた場合のみ, 歪んだマップを作成することが可能です
#			- オプションで指定する次元は軸としても指定されていることを想定しています
#			- 歪んだ次元として設定しなかった軸は"level"または"sg"を想定しています
#
option.on('-b', '--baumkuchen', 'Whether to create a map of shape such as baumkuchen'){
	@warp_dim = true
}

option.on('-c', '--clrmap CLRMAP', 'color map'){|color|
	@clrmap = color
}

# オプション以外のコマンドラインの情報を取得
option.parse!(ARGV)

# 物理量を取得
if !ARGV[0].gsub(/^.\//, "").match(/@.*/) then
	puts "[ERROR] Please choice physical quantity !"
	exit
end

# 物理量を格納しておく配列
physicalQuantity = ARGV[0].gsub(/^.\//, "").match(/@.*/)[0].delete("@").split(",")

# ファイルを開く
@netCDF = NumRu::NetCDF.open(
	ARGV[0].match(/.*\.nc/)[0], 	# ファイル名
	"r",   				# 読み込みモード
	false  				# sharedモードをオフ
)

# ディレクトリツリーを作成
@dirname += '/' if @dirname[-1] != '/'

# 定義ファイルを作成
file = File.open("define.js", "w")
file.puts("const DEFINE = {")
file.puts("\tROOT: \"#{@dirname}\",")
file.puts("\tPHYSICAL_QUANTITY: {")


# 物理量の数だけ回す
physicalQuantity.each{|fp|
	file.puts("\t\t#{fp}: {")

	# 物理量のディレクトリツリーを作成
	dirPath = "#{@dirname}tile/#{@netCDF.var(fp).name}/"
	mkdir(dirPath)
	
	# 次元を取得
	physDim = @netCDF.var(fp).dims
	# データを取り出す際の範囲や間隔を設定
	dimInfo = physDim.map.with_index{|dim, index| getDimInfo(dim, index)}

	# ===== 数値データタイルを作成する際に必要なデータを用意 =====

	# 各次元のデータを走査する変数
	countAry = Array.new(dimInfo.length).map{0}
	
	# x軸を決定						
	xindex = dimInfo.select{|info| info[:name].include?(@axis[:x]) }[0][:index]
	throwError(!xindex, "Sorry... x axis can't set correctly, please set x axis by using options such as \'-a x:lon,y:lat\'")

	# y軸を決定
	yindex = dimInfo.select{|info| info[:name].include?(@axis[:y]) }[0][:index]
	throwError(!yindex, "Sorry... y axis can't set correctly, please set y axis by using options such as \'-a x:lon,y:lat\'")
	
	# 軸として選ばれなかった次元を取得
	otherindex = dimInfo.select{|info| !info[:name].include?(@axis[:x]) && !info[:name].include?(@axis[:y])}.map{|info| info[:index]}

	# 軸として選ばれなかった次元についてnetCDFからの取り出し方を選択
	otherindex.each{|o|
		# 固定される次元が空だったら
		if @fix.empty? then
			# 配列の0番目の要素を取得
			dimInfo[o] = getDimInfo(dimInfo[o], dimInfo[o][:index], dimInfo[o][:name], 0, 0)
		else
			# 空でなければ, getDimInfoメソッドに任せる
			dimInfo[o] = getDimInfo(dimInfo[o], dimInfo[o][:index])
		end
		countAry[dimInfo[o][:index]] = dimInfo[o][:start]
	}

	if @warp_dim then
		makeTileForBaumkuchen(dimInfo, fp, countAry, xindex, yindex, otherindex, dirPath) 
	end
	makeTileForPlane(dimInfo, fp, countAry, xindex, yindex, otherindex, dirPath, file)
	file.puts("\t\t}")
}

file.puts("\t}")
file.puts("}")
file.close()
