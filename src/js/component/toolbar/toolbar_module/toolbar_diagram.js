const ToolbarDiagram = class{
    getMenuElement = () => {
        const names = ["図の切り替え", "グリッド表示の切り替え", "CesiumJS表示", "Leaflet表示", "OpenLayers表示"];
        const events = this._eventListener();
        const menuElements = Array(names.length).fill(undefined).map((_, index) => {
            return { name: names[index], event: events[index] };
        })
        return menuElements;
    }

    _eventListener = () => {
        return [
            {handler: "hover", event: this._hoverEvent_change_diagram},
            {handler: "click", event: this._clickEvent_grid},
            {handler: "click", event: this._clickEvent_cesiumjs},
            {handler: "click", event: this._clickEvent_leaflet},
            {handler: "click", event: this._clickEvent_openlayers},
        ]
    }

    _clickEvent_cesiumjs = () => {
        const options = { wmtsLibIdentifer: new wmtsLibIdentifer("Cesium") }
        // [Caution] refarences global variables
        global.viewer.redraw(options);
    }

    _clickEvent_leaflet = () => {
        const options = { wmtsLibIdentifer: new wmtsLibIdentifer("Leaflet") }
        // [Caution] refarences global variables
        global.viewer.redraw(options);
    }

    _clickEvent_openlayers = () => {
        const options = { wmtsLibIdentifer: new wmtsLibIdentifer("OpenLayers") }
        // [Caution] refarences global variables
        global.viewer.redraw(options);
    }

}