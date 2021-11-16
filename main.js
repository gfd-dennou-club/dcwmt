window.onload = function(){
    const view = (name) => {
        // 既にマップが存在するのであれば, html要素を消しておく
        if(document.getElementById("map") !== null)
            document.getElementById("map").remove();

        // div要素のmain-screenの中にmapを作成
        const mainDiv = document.getElementById("main-screen");
        const map = document.createElement("div");
        map.setAttribute("id", "map");
        mainDiv.appendChild(map);
 
        const diagram = new CounterDiagram(clrmap_04);

        switch(name){
            case "Cesium":
                viewer3D(map, diagram);
                break;
            case "Leaflet":
                map.setAttribute("style", "height: 500px;");
                viewerCartesian(map, diagram);
                break;
            case "OpenLayers":
                map.setAttribute("style", "height: 700px; width: 100%;");
                viewerProjection(map, diagram);
                break;
        }
        return true;
    }

    let viewModel = {
        names: [ "Cesium", "Leaflet", "OpenLayers"],     // 座標系の種類
        view: view,
    }

    const selecter = document.getElementById("selecter");
    ko.applyBindings(viewModel, selecter);
}