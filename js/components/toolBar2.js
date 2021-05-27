// ツールバーの大枠を作成
const toolBar = document.createElement("ul");
toolBar.setAttribute("class", "tool_bar");
document.getElementById("header").appendChild(toolBar);

// ツールバーの要素の定義
const toolBarElement = [
    {
        name: "HOME", 
        id: "menu_home",
        item: [],
    },
    {
        name: "トーン関連", 
        id: "menu_tone",
        item: [
            { name: "不透明度", id: "link_set_opacity" },
            { name: "トーンの範囲", id: "link_change_tone_range" },
            { name: "数学的操作", id: "link_math_manipulation" },
        ],
    },
    {
        name: "カラーマップ関連", 
        id: "menu_colormap",
        item: [
            { name: "カラーマップ", id: "link_change_colormap" },
        ],
    },
    {
        name: "断面切り替え", 
        id: "menu_cross_section",
        item: [
            { name: "断面切り替え", id: "link_change_cross_section" },
        ],
    },
    {
        name: "図", 
        id: "menu_drawing",
        item: [
            { name: "図の切り替え", id: "link_change_drawing" },
            { name: "グリッド表示", id: "link_change_grid" },
        ],
    },
];

// ツールバーの作成
for(tool_bar_element of toolBarElement){ 
    let topic = document.createElement("li");
    topic.setAttribute("id", tool_bar_element.id);
    topic.innerHTML = tool_bar_element.name;
    toolBar.appendChild(topic);

    let dropdown_menu = document.createElement("ul");
    dropdown_menu.setAttribute("class", "dropdown_menu");
    topic.appendChild(dropdown_menu);

    for(item of tool_bar_element.item){
        let item_li = document.createElement("li");
        let item_a = document.createElement("a");
        item_a.setAttribute("id", item.id);
        item_a.setAttribute("href", "javascript:void(0);");
        item_a.innerHTML = item.name;
        
        item_li.appendChild(item_a);
        dropdown_menu.appendChild(item_li);
    }
}

$(function(){
    $('ul.tool_bar li').hover(function(){
        $("ul:not(:animated)", this).slideDown();
    }, function(){
        $("ul.dropdown_menu",this).slideUp();
    });
});



