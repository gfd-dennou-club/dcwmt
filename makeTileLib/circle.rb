# @class: Circle
# 円を描くためのクラス
class Circle
	
	# @method: initialize(centerPos: Hash, radius: Number) -> void
	# コンストラクタ
	def initialize(centerPos, radius = nil)
		@cx, @cy = centerPos[:x], centerPos[:y]
		@count = 0
		@c = 0
		setRadius(radius) if radius != nil
	end

	# @method: setRadius(radius: Number) -> void
	# 半径からわかる情報を保存していきます.
	# コンストラクタにradiusを渡した場合は呼ぶ必要はありません
	def setRadius(radius)
		@radius = radius
		@x, @y = radius, 0
		@F = -2*radius+3
		@c = 0
	end

	# @method: draw(void) -> Hash or nil
	# 円の座標点を返す
	# 円の描画が終了したらnilを返す
	def draw()
		pos = _desidePos()

		if @x < @y then
			@x, @y = @radius, 0
			@F = -2*@radius + 3
			@count += 1
		end

		return pos
	end

	# @method: getRadiusFromCircumference(circumference: Number) -> Number
	# 円周から半径を求める
	def getRadiusFromCircumference(circumference)
		buffer = nil	# ひとつ前の円周の長	さを保持
		radius = 1		# 半径
		loop do
			setRadius(radius)				# 半径をセットする
			while(draw())do end				# 円を作成するまで回す

			# 最終的な円周の長さが引数の円周の長さを超えたら
			if @c >= circumference then	
				break						# 終了
			else
				buffer = @c					# ひとつ前の円周の長さを保持
				@c = 0						# 円周の長さのカウンタを初期化
				radius += 1					# 半径をカウントアップ
			end
		end

		# どちらが円周に近いかを調べる
		if (circumference - @c).abs < (circumference - buffer).abs then
			return radius
		else
			return radius - 1
		end
    end
    
    # @method: getLoopCount(void) -> Number
    # 円を描く際のループの回数を返す
    def getLoopCount()
        return @c
	end
	
	# @method: getCircumferenceFromRadius(r: Number) -> Number
	# 半径をもとに円周の長さを返す
	def getCircumferenceFromRadius(r)
		setRadius(r)
		while (draw()) do end
		return @c
	end

	# @method: _desidePos(void) -> Hash or nil
	# カウント数に応じて, 円の座標点を返す
	def _desidePos()
		_x, _y = nil, nil
		case @count
		when 0 then 
			_x, _y = @cx + @y, @cy - @x 			# 右上上
		when 1 then 
			_x, _y = @cx + @x, @cy - @y				# 右上下
		when 2 then 
			_x, _y = @cx + @x, @cy + @y				# 右下上
		when 3 then
			_x, _y = @cx + @y, @cy + @x				# 右下下
		when 4 then 
			_x, _y = @cx - @y, @cy + @x				# 左下下
		when 5 then 
			_x, _y = @cx - @x, @cy + @y 			# 左下上
		when 6 then 
			_x, _y = @cx - @x, @cy - @y 			# 左上下
		when 7 then
			_x, _y = @cx - @y, @cy - @x				# 左上上
		else
			@count = 0
			return nil
		end

		if @F >= 0 then
			@x -= 1
			@F -= 4*@x
		end
		@y += 1
		@F += 4*@y + 2

		@c += 1
		
		return {:x => _x, :y => _y}
	end
end