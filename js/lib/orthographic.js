// 球体は 世界測地系1984 に準拠
export const OrthographicProjection = new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84);

// 座標変換( 地図投影法 → ピクセル座標 )
// この関数は project, unproject 内で使用するため, 既存機能としては存在していない
OrthographicProjection.transform = ( longlat ) => {
    return {
        x: longlat.longitude, 
        y: longlat.latitude * 2
    };
}

// 座標変換( ピクセル座標 → 地図投影法 )
// この関数は project, unproject 内で使用するため, 既存機能としては存在していない
OrthographicProjection.untransform = ( coords ) => {
    return { 
        latitude: coords.y, 
        longitude: coords.x,
    };
}

OrthographicProjection.Maximum = OrthographicProjection.untransform({y: Math.PI, x: undefined});

// 地図投影法( 緯度経度 → ピクセル座標 )
OrthographicProjection.base_project = OrthographicProjection.project;
OrthographicProjection.project = ( cartographic, result ) => {
    if (!Cesium.defined(cartographic)) { throw new Cesium.DeveloperError("cartographic is required"); }

    const semimajorAxis = OrthographicProjection._semimajorAxis;
    
    const longlat = {latitude: cartographic.latitude, longitude: cartographic.longitude};
    const trans = OrthographicProjection.transform(longlat);

    const x = trans.x * semimajorAxis;
    const y = trans.y * semimajorAxis;
    const z = cartographic.height;

    if (!Cesium.defined(result)) { return new Cesium.Cartesian3(x, y, z); }

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
}

// 地図投影法( ピクセル座標 → 緯度経度 )
OrthographicProjection.base_unproject = OrthographicProjection.unproject;
OrthographicProjection.unproject = ( cartesian, result ) => {
    if (!Cesium.defined(cartesian)) { throw new Cesium.DeveloperError("cartesian is required"); }

    const oneOverEarthSemimajorAxis = OrthographicProjection._oneOverSemimajorAxis;

    const xy = {x: cartesian.x * oneOverEarthSemimajorAxis, y: cartesian.y * oneOverEarthSemimajorAxis};
    const trans = OrthographicProjection.untransform(xy);

    const longitude = trans.longitude;
    const latitude = trans.latitude;
    const height = cartesian.z;

    if (!Cesium.defined(result)) { return new Cesium.Cartographic(longitude, latitude, height); }

    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
}

export const OrthographicTilingScheme = new Cesium.GeographicTilingScheme({
    numberOfLevelZeroTilesX: 1,
    numberOfLevelZeroTilesY: 1,
});

// OrthographicTilingScheme._rectangle = new Cesium.Rectangle(-Math.PI, -Math.PI, Math.PI, Math.PI);

// @method: getNumberOfXTilesAtLevel(level: number) -> number
// 拡大率からタイルの総数を返す
//  @param: _numberOfLevelZeroTilesX(number)
//              拡大率0におけるX方向のタイルの数
OrthographicTilingScheme.base_getNumberOfXTilesAtLevel = OrthographicTilingScheme.getNumberOfXTilesAtLevel;
OrthographicTilingScheme.getNumberOfXTilesAtLevel = (level) => {
    return OrthographicTilingScheme._numberOfLevelZeroTilesX << level
}

// @method: getNumberOfYTilesAtLevel(level: number) -> number
// 拡大率からタイルの総数を返す
//  @param: _numberOfLevelZeroTilesY(number)
//              拡大率0におけるY方向のタイルの数
OrthographicTilingScheme.base_getNumberOfYTilesAtLevel = OrthographicTilingScheme.getNumberOfYTilesAtLevel;
OrthographicTilingScheme.getNumberOfYTilesAtLevel = (level) => {
    return OrthographicTilingScheme._numberOfLevelZeroTilesY << level
}

// @method: rectangleToNativeRectangle(
//      // 
//      rectangle: new Cesium.rectange(west, south, east, north), 
//      
//      result: new Cesium.rectange(west, south, east, north))
// 緯度経度の長方形から座標変換された長方形に変換
// untransformに相当
OrthographicTilingScheme.base_rectangleToNativeRectangle = OrthographicTilingScheme.rectangleToNativeRectangle;
OrthographicTilingScheme.rectangleToNativeRectangle = (rectangle, result) => {
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
OrthographicTilingScheme.base_tileXYToRectangle = OrthographicTilingScheme.tileXYToRectangle;
OrthographicTilingScheme.tileXYToRectangle = (x, y, level, result) => {
    // 所持している画像の範囲
    const rectangle = OrthographicTilingScheme._rectangle;

    // x方向のタイル数
    const xTiles = OrthographicTilingScheme.getNumberOfXTilesAtLevel(level);
    // y方向のタイル数
    const yTiles = OrthographicTilingScheme.getNumberOfYTilesAtLevel(level);

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
OrthographicTilingScheme.base_tileXYToNativeRectangle = OrthographicTilingScheme.tileXYToNativeRectangle;
OrthographicTilingScheme.tileXYToNativeRectangle = (x, y, level, result) => {
    // 一旦, 緯度経度の長方形に変換
    let rectangleRadians = OrthographicTilingScheme.tileXYToRectangle(x, y, level, result);

    // 
    return OrthographicTilingScheme.rectangleToNativeRectangle(rectangleRadians, undefined);
} 

// @method: positionToTileXY(position, level, result)
// 緯度経度の長方形からタイルの座標点を求める
// unprojectに相当
OrthographicTilingScheme.base_positionToTileXY = OrthographicTilingScheme.positionToTileXY;
OrthographicTilingScheme.positionToTileXY = (position, level, result) => {
    let rectangle = OrthographicTilingScheme._rectangle;
    // タイル構造が範囲外だった場合
    if(!Cesium.Rectangle.contains(rectangle, position)){ return undefined; }

    // タイルの総数を取得
    const xTiles = OrthographicTilingScheme.getNumberOfXTilesAtLevel(level);
    const yTiles = OrthographicTilingScheme.getNumberOfYTilesAtLevel(level);

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