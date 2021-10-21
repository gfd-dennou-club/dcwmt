const ToolbarColormap = class{
    getMenuElement = () => {
        const menuElement = Array(78).fill(undefined).map(
            (_, i) => {
                const crlbar = new colorbar(i + 1);
                return {
                    name: crlbar.getClrmapName(),
                    component: crlbar.draw(100, 10),
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
        console.log(event.target.innerHTML);
    }
}