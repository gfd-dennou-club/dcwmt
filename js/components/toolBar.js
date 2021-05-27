// ツールバーの大枠を作成
const toolBar = document.createElement("ul");
toolBar.setAttribute("class", "tool_bar");
document.getElementById("header").appendChild(toolBar);

// ツールバーの要素の定義
const toolBarElement = [
    {
        name: "HOME", 
        id: "menu_home",
    },
    {
        name: "トーン関連", 
        id: "menu_tone",
    },
    {
        name: "カラーマップ関連", 
        id: "menu_colormap",
    },
    {
        name: "断面切り替え", 
        id: "menu_cross_section",
    },
    {
        name: "図", 
        id: "menu_drawing",
    },
];

// ツールバーの作成
for(tool_bar_element of toolBarElement){
    let topic = document.createElement("li");
    topic.setAttribute("id", tool_bar_element.id);
    toolBar.appendChild(topic);

    let title = document.createElement("div");
    title.setAttribute("id", "tilte");
    title.innerHTML = tool_bar_element.name;
    topic.appendChild(title);

    let menu = document.createElement("div");
    menu.setAttribute("id", "menu");
    topic.appendChild(menu);
}

// $(function(){
//     $('ul.tool_bar li').hover(function(){
//         $("ul:not(:animated)", this).slideDown();
//     }, function(){
//         $("ul.dropdown_menu",this).slideUp();
//     });
// });



