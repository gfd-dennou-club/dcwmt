require "numru/netcdf"
require 'optparse'
require 'json'

require './makeTileLib/pnm.rb'
require './makeTileLib/getter.rb'
require './makeTileLib/util.rb'
require './makeTileLib/projectionToMercator.rb'
require './makeTileLib/colormap.rb'
require './makeTileLib/tiles.rb'
require './makeTileLib/circle.rb'

# 固定次元についての情報を格納しておく配列を確保
@fix = Array.new()
@fixname = []
# 数値データタイルを保存しておくパス
@dirname = "./"
# 軸とする次元
@axis = { :x => "lon", :y => "lat"}
# バームクーヘン状のマップを作成する際に歪ませる次元名
@warp_dim = false
# カラーマップ
# @clrmap = clrmap_04

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
option.on('-f', '--fix DIMENTION', Array, 'fix dimention'){|dim|
	@fix = dim.map{|v| 
		{ 
			:dimention => v.split('=')[0], 
			:start => v.split('=')[1].split(':')[0].to_f, 
			:end => ( v.split('=')[1].split(':')[1] ? v.split('=')[1].split(':')[1].to_f : v.split('=')[1].split(':')[0].to_f ) 
		} 
	}
	@fixname = dim
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

# オプション以外のコマンドラインの情報を取得
option.parse!(ARGV)

# 物理量を取得
if !ARGV[0].gsub(/^.\//, "").match(/@.*/) then
	STDERR.puts "[ERROR] Please choice physical quantity !"
	exit
end

# 物理量を格納しておく配列
physicalQuantity = ARGV[0].split(',').map {|q| q.match(/@.*/)[0].delete("@") }

# ファイルを開く
netCDF = ARGV[0].split(',').map {|pq| 
	NumRu::NetCDF.open(
		pq.match(/.*\.nc/)[0], 	# ファイル名
		"r",   				# 読み込みモード
		false  				# sharedモードをオフ
	)
} 
@firstNetCDF = netCDF[0]

# ディレクトリツリーを作成
@dirname += '/' if @dirname[-1] != '/'

# 定義オブジェクトを作成
dcwmtConf = {"definedOptions" => {}, "drawingOptions" => {}}
dcwmtConf["definedOptions"]["root"] = "#{@dirname}tile"
dcwmtConf["definedOptions"]["variables"]  = []

variable = {}
variable["name"] = physicalQuantity

if variable["name"].length == 1 then
	variable["type"] = "tone"
elsif variable["name"].length == 2 then
	variable["type"] = "vector"
else
	raise(RuntimeError, "コマンドライン引数で渡された物理量が多すぎます")
end

# 次元を取得
physDim = netCDF[0].var(physicalQuantity[0]).dims
# データを取り出す際の範囲や間隔を設定
dimInfo = physDim.map.with_index{|dim, index| 
	getDimInfo(dim, index)
}

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
otherindex = dimInfo.select{|info| !info[:name].include?(@axis[:x]) && !info[:name].include?(@axis[:y])}.map{|info| info[:index]}.reverse

# 軸として選ばれなかった次元についてnetCDFからの取り出し方を選択
otherindex.each{|o|
	dimInfo[o] = getDimInfo(dimInfo[o], dimInfo[o][:index])
}

# 拡大率を算出
zoomLevel = getMaxZoomLevel(dimInfo[xindex][:length], dimInfo[yindex][:length], 256)

variable["tileSize"] = [256, 256]
variable["minZoom"] = 0
variable["maxZoom"] = zoomLevel
variable["axis"] = [dimInfo[xindex][:name], dimInfo[yindex][:name]]
variable["fixed"] = []
dcwmtConf["drawingOptions"]["title"] = ""
dcwmtConf["drawingOptions"]["sumneil"] = ""
dcwmtConf["drawingOptions"]["zoom"] = 0
dcwmtConf["drawingOptions"]["center"] = [0, 0]
dcwmtConf["drawingOptions"]["projCode"] = "EPSG:3857" 
dcwmtConf["drawingOptions"]["mathMethod"] = 0
dcwmtConf["drawingOptions"]["layers"] = []

# タイルの作成
physicalQuantity.each.with_index {|fp, index|
	if @warp_dim then
		# makeTileForBaumkuchen(dimInfo, fp, countAry, xindex, yindex, otherindex, dirPath) 
	end
	makeTileForPlane(netCDF[index], dimInfo, fp, 0, xindex, yindex, otherindex, "#{@dirname}tile", variable)
}

# 次元でソートする
if variable["fixed"][0].include?('/') then
	2.times {|i|
		variable["fixed"].sort! {|a, b|
			_a = a.split('/')[i]
			_b = b.split('/')[i]
			_a[1].split('=')[1].to_f <=> _b[1].split('=')[1].to_f
		}
	}
else
	variable["fixed"].sort! {|a, b|
		a[1].split('=')[1].to_f <=> b[1].split('=')[1].to_f
	}
end

variable["fixed"].uniq!()
dcwmtConf["definedOptions"]["variables"].push(variable)
lengthOfLayers = dcwmtConf["drawingOptions"]["layers"].length

if variable["type"] === "tone" then
	dcwmtConf["drawingOptions"]["layers"].push(
		{
			"name" => variable["name"][0], 
			"type" => "tone",
			"show" => true,
			"opacity" => 1.0,
			"varindex" => dcwmtConf["definedOptions"]["variables"].length - 1,
			"fixedindex" => 0,
			"clrindex" => 5,
			"id" => lengthOfLayers
		}
	)
	dcwmtConf["drawingOptions"]["layers"].push(
		{
			"name" => "#{variable["name"][0]}_contour", 
			"type" => "contour",
			"show" => true,
			"opacity" => 1.0,
			"varindex" => dcwmtConf["definedOptions"]["variables"].length - 1,
			"fixedindex" => 0,
			"thretholdinterval" => 5,
			"id" => lengthOfLayers
		}
	)
else
	dcwmtConf["drawingOptions"]["layers"].push(
		{
			"name" => "#{variable["name"][0]}-#{variable["name"][1]}", 
			"type" => "vector",
			"show" => true,
			"opacity" => 1.0,
			"varindex" => dcwmtConf["definedOptions"]["variables"].length - 1,
			"fixedindex" => 0,
			"vecinterval" => { "x" => 10, "y" => 10 },
			"id" => lengthOfLayers
		}
	)
end

dcwmtConfPath = "#{@dirname}dcwmtConf.json" 

if File.exist?(dcwmtConfPath) then
	existedFile = File.open(dcwmtConfPath, "r")
	existedDcwmtConf = JSON.load(existedFile.read)
	existedFile.close()
	# ルートディレクトリが一致している
	if existedDcwmtConf["definedOptions"]["root"] == dcwmtConf["definedOptions"]["root"] then
		varNames = existedDcwmtConf["definedOptions"]["variables"].map { |v| v["name"][0] }
		newVar = dcwmtConf["definedOptions"]["variables"][0]
		p varNames
		p newVar["name"][0]
		# 変数名が一致していない
		if !varNames.include?(newVar["name"][0]) then
			existedDcwmtConf["definedOptions"]["variables"].push(newVar)  
			existedDcwmtConf["drawingOptions"]["layers"] += dcwmtConf["drawingOptions"]["layers"]
			file = File.open(dcwmtConfPath, "w")
			JSON.dump(existedDcwmtConf, file)
			file.close()
			exit()
		end
	end
end	
	
File.open(dcwmtConfPath, "w") { |file|
	JSON.dump(dcwmtConf, file)
}