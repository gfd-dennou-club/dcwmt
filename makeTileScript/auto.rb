#!/usr/bin/ruby


#ユーザー定義部分###
scale_x=[0,128000]#netCDFのX軸の計算領域[最小値,最大値]
scale_y=[40060,59940]#netCDFのY軸の計算領域[最小値,最大値]
grid_x = 640; #netCDFのX軸の格子点数(生成するタイルの横の大きさに影響)
grid_y = 160; #netCDFのY軸の格子点数(生成するタイルの縦の大きさに影響)
val_name = ["x","z","y","t"]#図のタテ、ヨコ、断面座標、時刻の変数名(netCDFの変数名と一致させる)
#dim=[47200,51000,55000,60000,65000,75000,85000,95000] #断面にするz軸座標
dim=[100,40100,80100,120100]
dir_root = "../tile_4dim"  #タイルの保存先
value = ["PTemp"]#トーン図かコンター図を描画する物理量
vec = ["VelX","VelZ"]#ベクトル図を描画する物理量(1番目の要素が矢印のX方向の大きさ、1番目の要素がY方向の大きさ)
#################

def getMaxZoomLevel(x, y)
  max_z = 0
  basic_size = 256 #x,yのどちらかがbasic_sizeに近づくまで分割
  while true
    before_x = x
    before_y = y
    if x%2==0 && y%2==0 then
      x = x/2
      y = y/2
      max_z += 1
    else
      return max_z
    end

    if x<basic_size then
      if (x-basic_size).abs < (before_x-basic_size) then
        return max_z
      else
        return max_z-1
      end
    end

    if y<basic_size then
      if (y-basic_size).abs < (before_y-basic_size) then
        return max_z
      else
        return max_z-1
      end
    end
  end
end

dir_dim = []
dir_time=[]
cnt = 0
for v in dim do
  dir_dim.push("#{val_name[2]}=#{dim[cnt]}")
	cnt+=1
end


cnt = 0
tmp = ARGV[0].gsub("","")
if tmp.end_with?("/")
    tmp = tmp.chop
end

Dir::foreach(tmp){|d|
	path = "#{tmp}/#{d}"
#	p path
	if  File::ftype(path)=="link"
		d.gsub!("TIME_", "")
		d.gsub!(/-.+/, "")
		if d.to_i < 1400000
			next
		end
		#p "./makeTile.rb #{d}/PTemp.nc@PTemp,z=40062.5,t=0"
		#system("gpprint #{d}/PTemp.nc@t")
		value.each{|v|
			str = `gpprint #{path}/#{v}.nc@#{val_name[3]}`
			str.gsub!(" ", "")    #スペース削除
			str.gsub!("\n", "")
			t = str.split(",")
			t.each{ |dim_t|
				dir_time.push("#{val_name[3]}=#{dim_t}")
				dim.each{|dim_z|
				#	p "./makeTile.rb #{path}/#{v}.nc@#{v},#{val_name[2]}=#{dim_z},#{val_name[3]}=#{dim_t} #{tmp}/#{val_name[3]}=#{dim_t}/#{val_name[2]}=#{dim_z}"
					#system ("./makeTile.rb #{path}/#{v}.nc@#{v},#{val_name[2]}=#{dim_z},#{val_name[3]}=#{dim_t} #{tmp}/#{v}/#{val_name[3]}=#{dim_t}/#{val_name[2]}=#{dim_z}")
				}
			}
      cnt+=1
		}

		vec.each{|v|
			str = `gpprint #{path}/#{v}.nc@#{val_name[3]}`
			str.gsub!(" ", "")    #スペース削除
			str.gsub!("\n", "")
			t = str.split(",")
			t.each{ |dim_t|
				#dir_time.push(dim_t)
				dim.each{|dim_z|
#					p "./makeTile.rb #{path}/#{v}.nc@#{v},#{val_name[2]}=#{dim_z},#{val_name[3]}=#{dim_t} #{tmp}/#{val_name[3]}=#{dim_t}/#{val_name[2]}=#{dim_z}"
					#system ("./makeTile.rb #{path}/#{v}.nc@#{v},#{val_name[2]}=#{dim_z},#{val_name[3]}=#{dim_t} #{tmp}/#{v}/#{val_name[3]}=#{dim_t}/#{val_name[2]}=#{dim_z}")
				}
			}
		}
	end
}
maxZoom = getMaxZoomLevel(grid_x,grid_y)
tile_size_x = grid_x/(2**maxZoom)
tile_size_y = grid_y/(2**maxZoom)
system("touch define.js")
f = File.open("define.js","w")
f.puts "var scale_x=#{p scale_x};"
f.puts "var scale_y=#{p scale_y};"
f.puts "var dir_root=\"#{p dir_root}\";"
f.puts "var value_name=#{p value};"
f.puts "var value_name_vec=#{p vec};"
f.puts "var dir_time=#{p dir_time};"
f.puts "var dir_dim=#{p dir_dim};"
f.puts "var tile_size_x = #{tile_size_x};"
f.puts "var tile_size_y = #{tile_size_y};"
f.puts "var max_zoom = #{maxZoom};"
f.close;
