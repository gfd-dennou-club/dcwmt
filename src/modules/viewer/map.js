const map = class{
    constructor(name){
        this.name = name || "map";
        this.element = undefined;
    }

    create = () => {
        if(document.getElementById(this.name) !== null){
            document.getElementById(this.name).remove();
        }

        // viewerを表示するためのdiv要素を作成
        const map_ele = document.createElement("div");
        map_ele.setAttribute("id", this.name);

        // viewer_elementを大枠のメインの要素に子要素として追加
        const mainScreen = document.getElementById("main-screen");
        mainScreen.appendChild(map_ele);

        this.element = map_ele;
    }

    getElement = () => {
        return this.element;
    }
}

export default map;