const ToolbarColormap = class{
    getMenuElement = () => {
        const menuElement = Array(78).fill(undefined).map(
            (_, i) => {
                const clrmap = new colormap(i + 1);
                const clrmap_component = clrmap.draw(100, 10);
                clrmap_component.setAttribute("style", "pointer-events: none;");
                
                return {
                    name: clrmap.getClrmapName(),
                    component: clrmap_component,
                    event: this._eventListener(),
                }
            }
        )
        return menuElement;
    }

    _eventListener = () => {
        return {handler: "click", event: this._clickEvent};
    }

    _clickEvent = (event) => {
        const clrmap_name = event.target.innerHTML.substr(0, 9);
        const clrmap_index = parseInt(clrmap_name.substr(7, 2));
        const options = { clrindex: clrmap_index };
        // [Caution] refarences global variables
        global.viewer.redraw(options);
    }
}