const ToolbarColormap = class{
    getMenuElement = () => {
        const menuElement = Array(78).fill(undefined).map(
            (_, i) => {
                const clrbar = new colorbar(i + 1);
                const clrbar_component = clrbar.draw(100, 10);
                clrbar_component.setAttribute("style", "pointer-events: none;");
                
                return {
                    name: clrbar.getClrmapName(),
                    component: clrbar_component,
                    event: this.getEventListener(),
                }
            }
        )
        return menuElement;
    }

    getEventListener = () => {
        return [
            {handler: "click", event: this._clickEvent} 
        ];
    }

    _clickEvent = (event) => {
        const clrmap_name = event.target.innerHTML.substr(0, 9);
        const clrmap_index = parseInt(clrmap_name.substr(7, 2));
        const options = { clrindex: clrmap_index };
        viewer.redraw(options);
    }
}