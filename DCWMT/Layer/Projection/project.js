// 球体は 世界測地系1984 に準拠
const proj = new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84);

// 座標変換( 地図投影法 → ピクセル座標 )
// この関数は project, unproject 内で使用するため, 既存機能としては存在していない
proj.transform = ( longlat ) => {
    const firstProjection = "EPSG:4326";
    // const secondProjection = `+proj=merc +a=1.0 +b=1.0 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs`;
    const secondProjection = `+proj=moll +a=1.0m +b=1.0 +lon_0=0 +x_0=0 +y_0=0 +units=m no_defs`;

    if(longlat.latitude >= (Math.PI / 2.0)-(5.0 * Math.PI / 180.0)){ longlat.latitude = 85.0 * Math.PI / 180.0; }
    else if (longlat.latitude <= -(Math.PI / 2.0)+(5.0 * Math.PI / 180.0)){ longlat.latitude = -85.0 * Math.PI / 180.0; }

    const data = proj4(firstProjection, secondProjection, 
        {
            x: longlat.longitude * 180.0 / Math.PI, 
            y: longlat.latitude * 180.0 / Math.PI,
        }
    );

    // return {x: data.x, y: data.y};
    return {x: longlat.longitude, y: longlat.latitude};

    // sinLat = Math.sin(longlat.latitude);
    // return {
    //     y: 0.5 * Math.log((1.0 + sinLat)/(1.0 - sinLat)),
    //     x: longlat.longitude,
    // };        
}

// 座標変換( ピクセル座標 → 地図投影法 )
// この関数は project, unproject 内で使用するため, 既存機能としては存在していない
proj.untransform = ( coords ) => {
    // latitude = (Math.PI/2.0) - 2.0 * Math.atan(Math.exp(-coords.y));
    return {
       latitude: coords.y,
       longitude: coords.x,
    };
}

proj.Maximum = proj.untransform({y: Math.PI, x: undefined});

// 地図投影法( 緯度経度 → ピクセル座標 )
proj.base_project = proj.project;
proj.project = ( cartographic, result ) => {
    if (!Cesium.defined(cartographic)) { throw new Cesium.DeveloperError("cartographic is required"); }

    const semimajorAxis = proj._semimajorAxis;
    
    const longlat = {latitude: cartographic.latitude, longitude: cartographic.longitude};
    const trans = proj.transform(longlat);

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
proj.base_unproject = proj.unproject;
proj.unproject = ( cartesian, result ) => {
    if (!Cesium.defined(cartesian)) { throw new Cesium.DeveloperError("cartesian is required"); }

    const oneOverEarthSemimajorAxis = proj._oneOverSemimajorAxis;

    const xy = {x: cartesian.x * oneOverEarthSemimajorAxis, y: cartesian.y * oneOverEarthSemimajorAxis};
    const trans = proj.untransform(xy);

    const longitude = trans.longitude;
    const latitude = trans.latitude;
    const height = cartesian.z;

    if (!Cesium.defined(result)) { return new Cesium.Cartographic(longitude, latitude, height); }

    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
}