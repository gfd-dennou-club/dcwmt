// ツールバーの要素のインスタンスを作成
const toolbar_tone = new ToolbarTone();
const toolbar_colormap = new ToolbarColormap();
const toolbar_cross_section = new ToolbarCrossSection();
const toolbar_diagram = new ToolbarDiagram();

// ツールバーの大枠を作成
const toolBar = document.createElement("ul");
toolBar.setAttribute("class", "tool_bar");
document.getElementById("header").appendChild(toolBar);

// ツールバーの要素の定義
const toolBarElement = [
    {
        name: "HOME", 
        id: "menu_home",
        menuElement: []
    },
    {
        name: "トーン関連", 
        id: "menu_tone",
        menuElement: toolbar_tone.getMenuElement(),
    },
    {
        name: "カラーマップ関連", 
        id: "menu_colormap",
        menuElement: toolbar_colormap.getMenuElement(),
    },
    {
        name: "断面切り替え", 
        id: "menu_cross_section",
        menuElement: toolbar_cross_section.getMenuElement(),
    },
    {
        name: "図", 
        id: "menu_drawing",
        menuElement: toolbar_diagram.getMenuElement(),
    },
];

// ツールバーの作成
for(tool_bar_element of toolBarElement){
    // 一階層の要素
    const topic = document.createElement("li");
    topic.setAttribute("id", tool_bar_element.id);
    toolBar.appendChild(topic);

    const title = document.createElement("div");
    title.setAttribute("id", "tilte");
    title.innerHTML = tool_bar_element.name;
    topic.appendChild(title);

    // 二階層の要素
    const menu = document.createElement("ul");
    menu.setAttribute("id", "menu");
    topic.appendChild(menu);

    for(menu_element of tool_bar_element.menuElement){
        const menu_element_wrapper = document.createElement("li");
        menu.appendChild(menu_element_wrapper);

        const element = document.createElement("div");
        element.setAttribute("class", "second_layer_element");

        // 名前を追加
        element.innerHTML = menu_element.name;
        
        // コンポーネントを追加
        if (menu_element.component !== undefined){
            element.appendChild(menu_element.component);
        }
        menu_element_wrapper.appendChild(element);

        // イベントハンドラを追加
        if(menu_element.event !== undefined){
            menu_element_wrapper.addEventListener(
                menu_element.event.handler, 
                menu_element.event.event
            );
        }
    }
}