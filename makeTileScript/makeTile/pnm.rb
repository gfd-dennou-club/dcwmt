# @class PNM
# 		
#		@param file(File) : ppmファイル(pngファイルにする際の中間ファイル)
#
# ppmファイルを扱う際に用いる
class PNM
	# @constructor(name: String, optons: Hash) -> void
	def initialize(name, options)
		@file = File.open("#{name}.ppm","w")								# ppmファイルを開く
		@file.puts("P3")                              						# マジックナンバー (Type: Portable pixmap, Encoding: ASCII) 
		@file.puts("#{options[:tileSize][:x]} #{options[:tileSize][:y]}")   # 画像サイズ(X, Y)
      	@file.puts("255")                             						# 色の最大値
	end

	# @method: writeFromByte(num: Number) -> void
	# 引数により与えられた数値をrgbに変換して書き込む
	def writeFromByte(num)
		r = ([num].pack("g").unpack("B*")[0][0,8]).to_i(2)
        g = ([num].pack("g").unpack("B*")[0][8,8]).to_i(2)
        b = ([num].pack("g").unpack("B*")[0][16,8]).to_i(2)
        @file.puts("#{r} #{g} #{b}")
	end

	# @method: write(rgb: Hash) -> void
	#
	#	@param: rgb(Hash):{ 
	#				:r => Number,	# 赤色
	#				:g => Number,	# 緑色
	#				:b => Number,	# 青色
	#			}
	# 
	# 引数により与えられたrgb値をそのまま書き込む
	def write(rgb)
		@file.puts("#{rgb[:r]} #{rgb[:g]} #{rgb[:b]}")
	end

	# @method: end(void) -> void
	# ファイルを閉じる
	def end
		@file.close
	end
end