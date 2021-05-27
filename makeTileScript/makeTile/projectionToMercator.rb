# @method mercatorAngleToGeodeticLatitude(mercatorAngle: number) -> number
# メルカカトル座標系の経度から正距円筒図座標系の経度を返す
def mercatorAngleToGeodeticLatitude(mercatorAngle)
    return (Math::PI/2.0) - 2.0 * Math.atan(Math.exp(-mercatorAngle))
end
 
# @method geodeticLatitudeToMercatorAngle(lat: number) -> number
# 正距円筒図座標系の経度からメルカカトル座標系の経度を返す
def geodeticLatitudeToMercatorAngle(lat)
    # 正距円筒座標系における南極・北極の経度の値を計算
    maxLat = mercatorAngleToGeodeticLatitude(Math::PI)
    # 最大(最小)経度を超えるものがあれば, 最大(最小)値にしておく
    if lat > maxLat then
        lat = maxLat
    elsif lat < -maxLat then
        lat = -maxLat
    end
    return 0.5 * Math.log((1.0 + Math.sin(lat)) / (1.0 - Math.sin(lat)))
end