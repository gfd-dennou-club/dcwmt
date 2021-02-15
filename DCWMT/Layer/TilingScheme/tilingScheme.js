let tilingScheme = new Cesium.GeographicTilingScheme({
    numberOfLevelZeroTilesX: 1,
    numberOfLevelZeroTilesY: 1,
});

// tilingScheme._rectangle = new Cesium.Rectangle(-Math.PI, -Math.PI, Math.PI, Math.PI);

// @method: getNumberOfXTilesAtLevel(level: number) -> number
// 拡大率からタイルの総数を返す
//  @param: _numberOfLevelZeroTilesX(number)
//              拡大率0におけるX方向のタイルの数
tilingScheme.base_getNumberOfXTilesAtLevel = tilingScheme.getNumberOfXTilesAtLevel;
tilingScheme.getNumberOfXTilesAtLevel = (level) => {
    return tilingScheme._numberOfLevelZeroTilesX << level
}

// @method: getNumberOfYTilesAtLevel(level: number) -> number
// 拡大率からタイルの総数を返す
//  @param: _numberOfLevelZeroTilesY(number)
//              拡大率0におけるY方向のタイルの数
tilingScheme.base_getNumberOfYTilesAtLevel = tilingScheme.getNumberOfYTilesAtLevel;
tilingScheme.getNumberOfYTilesAtLevel = (level) => {
    return tilingScheme._numberOfLevelZeroTilesY << level
}

// @method: rectangleToNativeRectangle(
//      // 
//      rectangle: new Cesium.rectange(west, south, east, north), 
//      
//      result: new Cesium.rectange(west, south, east, north))
// 緯度経度の長方形から座標変換された長方形に変換
// untransformに相当
tilingScheme.base_rectangleToNativeRectangle = tilingScheme.rectangleToNativeRectangle;
tilingScheme.rectangleToNativeRectangle = (rectangle, result) => {
    let west = rectangle.west * 180.0 / Math.PI;
    let south = rectangle.south * 180.0 / Math.PI;
    let east = rectangle.east * 180.0 / Math.PI;
    let north = rectangle.north * 180.0 / Math.PI;
    if(!Cesium.defined(result)){ return new Rectangle(west, south, east, north); }
    
    result.west = west;     result.south = south;
    result.east = east;     result.north = north;
    return result;
}

// @method: tileXYToRectangle(x, y, level, result)
// タイルのxyzを元に緯度経度の長方形に変換する
// projectに相当
tilingScheme.base_tileXYToRectangle = tilingScheme.tileXYToRectangle;
tilingScheme.tileXYToRectangle = (x, y, level, result) => {
    // 所持している画像の範囲
    const rectangle = tilingScheme._rectangle;

    // x方向のタイル数
    const xTiles = tilingScheme.getNumberOfXTilesAtLevel(level);
    // y方向のタイル数
    const yTiles = tilingScheme.getNumberOfYTilesAtLevel(level);

    // 地図上のタイル 1つ分の長さ
    const xTileWidth = rectangle.width / xTiles;
    const yTileWidth = rectangle.height / yTiles;

    // タイル一枚分の東西南北
    const west = x * xTileWidth + rectangle.west;
    const east = (x+1) * xTileWidth + rectangle.west;
    const north = rectangle.north - y * yTileWidth;
    const south = rectangle.north - (y+1) * yTileWidth;

    if(!Cesium.defined(result)){ result = new Cesium.Rectangle(west, east, north, south); }

    result.west = west;     result.east = east;
    result.north = north;   result.south = south;

    return result;
}

// @method: tileXYToNativeRectangle(x, y, level, result)
// タイル座標から地図投影された長方形に変換
// transformに相当
tilingScheme.base_tileXYToNativeRectangle = tilingScheme.tileXYToNativeRectangle;
tilingScheme.tileXYToNativeRectangle = (x, y, level, result) => {
    // 一旦, 緯度経度の長方形に変換
    let rectangleRadians = tilingScheme.tileXYToRectangle(x, y, level, result);

    // 
    return tilingScheme.rectangleToNativeRectangle(rectangleRadians, undefined);
} 

// @method: positionToTileXY(position, level, result)
// 緯度経度の長方形からタイルの座標点を求める
// unprojectに相当
tilingScheme.base_positionToTileXY = tilingScheme.positionToTileXY;
tilingScheme.positionToTileXY = (position, level, result) => {
    let rectangle = tilingScheme._rectangle;
    // タイル構造が範囲外だった場合
    if(!Cesium.Rectangle.contains(rectangle, position)){ return undefined; }

    // タイルの総数を取得
    const xTiles = tilingScheme.getNumberOfXTilesAtLevel(level);
    const yTiles = tilingScheme.getNumberOfYTilesAtLevel(level);

    // 一枚あたりのタイルのサイズを取得
    const xTileWidth = rectangle.width / xTiles;
    const yTileHeight = rectangle.height / yTiles;

    // 緯度を取得 (なお, 緯度の方向が逆転している場合は, 2PIを足しておく)
    let longitude = position.longitude;
    if (rectangle.east < rectangle.west) { longitude += 2.0 * Math.PI; }

    // タイルの座標値を取得
    // longitudeから基準値(rectangle.west)を引いた値をタイルの総数でわる
    let xTileCoordinate = ((longitude - rectangle.west) / xTileWidth) | 0;
    if (xTileCoordinate >= xTiles) { xTileCoordinate = xTiles - 1; }

    let yTileCoordinate = ((rectangle.north - position.latitude) / yTileHeight) | 0;
    if (yTileCoordinate >= yTiles) { yTileCoordinate = yTiles - 1; }

    if (!Cesium.defined(result)) {
        return new Cesium.Cartesian2(xTileCoordinate, yTileCoordinate);
    }

    result.x = xTileCoordinate;
    result.y = yTileCoordinate;
    return result;
}
