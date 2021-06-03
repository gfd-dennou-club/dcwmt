import OrthographicProjection from '../lib/projection/orthographic/projection.js';
import OrthographicTilingScheme from '../lib/projection/orthographic/tilingScheme.js';

import {scene, imageryProvider} from './canvas.js';

// 一時的な地図投影を行うためのドロップダウンバー
const pulldown = document.createElement("select");
pulldown.setAttribute("text", "地図投影法");
pulldown.setAttribute("class", "changeProjection");
document.getElementById("footer").appendChild(pulldown);

// プルダウンの要素の定義
const projectionType = [
    {
        name: "Webメルカトル図法",
        value: "WebMercator",
        sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
        mapProjection: new Cesium.WebMercatorProjection(),
        tilingScheme: new Cesium.WebMercatorTilingScheme()
    },
    {
        name: "正距円筒図法",
        value: "Equirectangular",
        sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
        mapProjecrion: new Cesium.GeographicProjection(),
        tilingScheme: new Cesium.GeographicTilingScheme(),
    },
    {
        name: "正射図法",
        value: "Orthographic",
        sceneMode: Cesium.SceneMode.SCENE3D,
        mapProjection: OrthographicProjection,
        tilingScheme: OrthographicTilingScheme,
    },
];

// プルダウンの作成
for(let pulldown_element of projectionType){
    let option = document.createElement("option");
    option.innerHTML = pulldown_element.name;
    pulldown.appendChild(option);
}

pulldown.addEventListener('change', function(){
    const index = this.selectedIndex;
    if(projectionType[index].name === "Webメルカトル図法" || projectionType[index].name === "正距円筒図法")
        scene.morphToColumbusView();
    else
        scene.morphTo3D();
});