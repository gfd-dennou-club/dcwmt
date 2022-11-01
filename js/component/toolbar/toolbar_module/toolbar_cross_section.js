const ToolbarCrossSection = class{
    getMenuElement = () => {
        return [{
            name: "断面の切り替え(準備中)",
            event: this._eventListener(),
        }]
    }

    _eventListener = () => {
        return {handler: "click", event: this._clickEvent};
    }

    _clickEvent = (event) => {
        // const clrmap_name = event.target.innerHTML.substr(0, 9);
        // const clrmap_index = parseInt(clrmap_name.substr(7, 2));
        // const options = { clrindex: clrmap_index };
        // // [Caution] refarences global variables
        // global.viewer.redraw(options);
    }
}
