import layerController3D from "./lib/layerController3D";
import layerControllerProjection from "./lib/layerControllerProjection";

const layerController = class{
    constructor(original_layer){
        this.name = "layer_controller";

        // [Todo] Here should be changed to more readable code !
        if(original_layer.getLayers){
            this.layers = original_layer.getLayers();
        }else{
            this.layers = [];
            for(let i = 0; i < original_layer.length; i++)
                this.layers.push(original_layer.get(i));
        }
    }

    create = (wmtsLibIdentifer, original_layer, baselayers, overlaylayers) => {
        this._clear();

        const create_element = (suitableInstance) => {
            const main_screen = document.getElementById("main-screen");
            const top_right = this._create_top_left();
            const frame = this._create_frame();
            const leave_mouse = this._create_leave_mouse();       
            const on_mouse = this._create_on_mouse();
            frame.appendChild(leave_mouse);
            frame.appendChild(on_mouse);
            top_right.appendChild(frame);
            main_screen.appendChild(top_right);
            this._addEventListner(suitableInstance);
            return top_right;
        }

        const leaflet = () => {};
        const cesium = () => { 
            const layer_controller = new layerController3D(
                original_layer,
                baselayers,
                overlaylayers
            );
            return create_element(layer_controller);
        };
        const openlayers = () => {
            const layer_controller = new layerControllerProjection(
                original_layer,
                baselayers,
                overlaylayers
            );
            return create_element(layer_controller);
        }
        const suitableFunc = wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
        return suitableFunc();
    }

    _clear = () => {
        if(document.getElementById(this.name) !== null){
            document.getElementById(this.name).remove();
        }
    }

    _create_top_left = () => {
        const top_right = document.createElement("div");
        top_right.setAttribute("id", this.name);
        return top_right;
    }

    _create_frame = () => {
        const frame = document.createElement("div");
        frame.setAttribute("id", "frame");
        return frame;
    }

    _create_leave_mouse = () => {
        const leave_mouse = document.createElement("div");
        leave_mouse.setAttribute("id", "leave_mouse");
        return leave_mouse;
    }

    _create_on_mouse = () => {
        const on_mouse = document.createElement("section");
        on_mouse.setAttribute("id", "on_mouse");

        // [Todo] Here should be changed to more readable code !
        let items = undefined;
        if(this.layers.getArray)
            items = this.layers.getArray();
        else
            items = this.layers;
        
        // ベースレイヤ
        items.forEach((item) => {
            const label = document.createElement("label");
            const div = document.createElement("div");
            const input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("name", "baselayer");
            input.setAttribute("data-bind", "checked: baselayers");
            // [Todo] Here should be changed to more readable code !
            if(item.options)
                input.setAttribute("value", item.options.name);
            else
                input.setAttribute("value", item.name);
            const span = document.createElement("span");
            // [Todo] Here should be changed to more readable code !
            if(item.options)
                span.innerHTML = item.options.name;
            else
                span.innerHTML = item.name;
            div.appendChild(input);
            div.appendChild(span);
            label.appendChild(div);
            on_mouse.appendChild(label);
        });

        const separator = this._create_sparator();
        on_mouse.appendChild(separator);

        // オーバーレイレイヤ
        items.forEach(item => {
            const label = document.createElement("label");
            const div = document.createElement("div");
            const input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", "overlay");
            input.setAttribute("data-bind", "checked: overlaylayers");
            // [Todo] Here should be changed to more readable code !
            if(item.options)
                input.setAttribute("value", item.options.name);
            else
                input.setAttribute("value", item.name);
            const span = document.createElement("span");
            // [Todo] Here should be changed to more readable code !
            if(item.options)
                span.innerHTML = item.options.name;
            else
                span.innerHTML = item.name;
            div.appendChild(input);
            div.appendChild(span);
            label.appendChild(div);
            on_mouse.appendChild(label);
        });

        on_mouse.appendChild(this._create_sparator());
        
        // [Todo] Here should be changed to more readable code !
        if(this.layers.getArray){
            const projection = ["メルカトル図法", "正距方位図法", "モルワイデ図法", "サンソン図法"];
            projection.forEach((name) => {
                const label = document.createElement("label");
                const div = document.createElement("div");
                const input = document.createElement("input");
                input.setAttribute("type", "radio");
                input.setAttribute("name", "projection");
                input.setAttribute("value", name);
                if(name === "メルカトル図法") input.checked = true;
                const span = document.createElement("span");
                span.innerHTML = name;
                div.appendChild(input);
                div.appendChild(span);
                label.appendChild(div);
                on_mouse.appendChild(label);
            });
        }
        
        return on_mouse;
    }

    _create_sparator = () => {
        const separator = document.createElement("div");
        separator.setAttribute("id", "separator");
        return separator;
    }

    _addEventListner = (suitableInstance) => {
        document.getElementsByName("baselayer").forEach( layer => {
            layer.addEventListener("change", suitableInstance.eventListener_for_baselayers);
        });

        document.getElementsByName("overlay").forEach( layer => {
            layer.addEventListener("change", suitableInstance.eventListener_for_overlaylayers);
        });

        if(this.layers.getArray){
            document.getElementsByName("projection").forEach( layer => {
                layer.addEventListener("change", suitableInstance.eventListener_for_projection);
            });
        }
    }
}

export default layerController;