const ToolbarTone = class{
    getMenuElement = () => {
        const names = ["不透明度", "トーンの範囲", "数学的操作"];
        const events = this._eventListener();
        const menuElements = Array(names.length).fill(undefined).map((_, index) => {
            return { name: names[index], event: events[index] };
        });
        return menuElements
    }

    _eventListener = () => {
        return [
            {handler: "click", event: this._clickEvent_opacity},
            {handler: "click", event: this._clickEvent_tone_range},
            {handler: "hover", event: this._hoverEvent_mathematical},
        ];
    }

    _clickEvent_opacity = () => {
        const attr = {
            type: "number",
            min: "0",
            max: "255",
            placeholder: "255",
            step: "1",
            style: "width: 80%; margin-top: 3%;",
        };
        const input = this._createInputElement(attr);
        // [Caution] refarences global variables
        global.modal.create("不透明度", input, ["opacity"]);
    }

    _clickEvent_tone_range = () => {

    }

    _hoverEvent_mathematical = () => {

    }

    _createInputElement = (attr) => {
        const input = document.createElement("input");
        Object.keys(attr).forEach((key) => {
            input.setAttribute(key, attr[key]);
        });
        return input;
    }
}