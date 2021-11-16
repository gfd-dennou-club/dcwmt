// ツールバーの要素のインスタンスを作成
const toolbar_colormap = new ToolbarColormap();

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
        menuElement: []
    },
    {
        name: "カラーマップ関連", 
        id: "menu_colormap",
        menuElement: toolbar_colormap.getMenuElement(),
    },
    {
        name: "断面切り替え", 
        id: "menu_cross_section",
        menuElement: []
    },
    {
        name: "図", 
        id: "menu_drawing",
        menuElement: [
            { name: "コンタ図" },
            { name: "ベクタ図" }
        ]
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
        element.innerHTML = menu_element.name;
        if (menu_element.component !== undefined){
            element.appendChild(menu_element.component);
        }
        menu_element_wrapper.appendChild(element);

        // イベントハンドラを追加
        if(menu_element.event !== undefined){
            for(eventListener of menu_element.event){
                menu_element_wrapper.addEventListener(
                    eventListener.handler, 
                    eventListener.event
                );
            }
        }
    }
}