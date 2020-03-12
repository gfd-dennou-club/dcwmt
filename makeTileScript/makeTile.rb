#!/usr/bin/ruby

require "numru/gphys"
require "numru/gphys/gpcommon"
include NumRu


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
#------------------------ print help message ------------------------

help  if ARGV.length != 1 or /^-+h/ =~ ARGV[0]
gturl = ARGV[0]
gp = GPhys::IO.open_gturl(gturl)

first_dim_len  = (gp.shape[0]||1)
second_dim_len = (gp.shape[1]||1)
fmt = "%g"
y = second_dim_len - 1
x = 0
ary = Array.new(second_dim_len).map{Array.new(first_dim_len)}
ary2= Array.new(second_dim_len).map{Array.new(first_dim_len)}
#p first_dim_len
#p second_dim_len
gp.val.each do |v|
  ary[y][x] = v
  #puts ary[y][x]
  x += 1
  if (x % first_dim_len == 0)
    #print "\n"
    x = 0
    y -= 1
  end
end

#1番目の引数からファイル名を抽出
tmp = ARGV[0]
filename = tmp.match(/.+\.nc/)[0]

#2番目の引数はファイル格納先ディレクトリ 未指定の場合はカレントディレクトリ
if ARGV[1]==nil then
  dir = "."
else
  dir = ARGV[1]
end


elem_x = first_dim_len
elem_y = second_dim_len

#p "#{filename}の計算領域 : #{elem_x}x#{elem_y}"

maxZoom = getMaxZoomLevel(elem_x,elem_y)

tile_size_x = elem_x/(2**maxZoom)
tile_size_y = elem_y/(2**maxZoom)


p "tilesize : #{tile_size_x} * #{tile_size_y}, maxZoomLevel : #{maxZoom}でタイルを作ります"
num = 0
tile = Array.new(tile_size_y).map{Array.new(tile_size_x)}

coords_z = maxZoom
#coords_z = 0
while coords_z>=0
  #各ズームレベルごとのループ
  puts("---------#{coords_z}--------")
  (2**coords_z).times do |coords_x|
    system("mkdir -p #{dir}/#{coords_z}/#{coords_x}")
    offset_x = ( elem_x / (2**coords_z) ) * coords_x #offset:各ズームレベルにおけるタイル境界の幅
    (2**coords_z).times do |coords_y|
      system("touch #{dir}/#{coords_z}/#{coords_x}/#{coords_y}.png")

      f = File.open("#{dir}/#{coords_z}/#{coords_x}/#{coords_y}.txt","w")
      f.puts "# ImageMagick pixel enumeration: #{tile_size_x},#{tile_size_y},255,srgb"
      offset_y = ( elem_y / (2**coords_z) ) * coords_y
      #一枚のタイルごとのループ
     puts("---------( #{coords_x}, #{coords_y} )---------")
     (tile_size_y).times do |y|
        (tile_size_x).times do |x|

          #if coords_z==0
          #puts("#{dir}/#{coords_z}/#{coords_x}/#{coords_y}.pngのx:#{x}, y:#{y}の値を取得します #{(2**(maxZoom-coords_z))*(2**(maxZoom-coords_z))}点の平均をとります )")
          #end
          #1つの画素ごとのループ

          (2**(maxZoom-coords_z)).times do |sub_y|
            (2**(maxZoom-coords_z)).times do |sub_x|

                  #puts "ary[#{offset_y + y * (2**(maxZoom-coords_z)) + sub_y}][#{offset_x + x * (2**(maxZoom-coords_z)) + sub_x}]"

               num += ary[offset_y + y * (2**(maxZoom-coords_z)) + sub_y][offset_x + x * (2**(maxZoom-coords_z)) + sub_x]

            end
          end
        #  print num
          num /=((2**(maxZoom-coords_z))*(2**(maxZoom-coords_z)))
          #puts num
          r = ([num].pack("g").unpack("B*")[0][0,8]).to_i(2)
          g = ([num].pack("g").unpack("B*")[0][8,8]).to_i(2)
          b = ([num].pack("g").unpack("B*")[0][16,8]).to_i(2)
          num = 0
          f.puts "#{x},#{y}: (#{r},#{g},#{b})"
          #end of 一個の画素

        end#end of x
      end#end of y
      #end of 一枚のタイル
      f.close
      system("convert #{dir}/#{coords_z}/#{coords_x}/#{coords_y}.txt #{dir}/#{coords_z}/#{coords_x}/#{coords_y}.png")
      system("rm #{dir}/#{coords_z}/#{coords_x}/#{coords_y}.txt")
    end#end of coords_y
  end#end of coords_x
  #end of 各解像度
  coords_z -= 1
end
#end of while
