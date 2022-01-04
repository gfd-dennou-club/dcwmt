{// Block Scope
    // == 要素の作成 == 
    // <div id="main-screen">
    // ...
    //   <div id="layer_controller">
    //     <table>
    //       <tbody data-bind="foreach: layers">
    //         <tr data-bind="css: { up: $parent.upLayer === $data, down: $parent.downLayer === $data }">
    //           <td><input type="checkbox" data-bind="checked: show"></td>
    //           <td>
    //             <span data-bind="text: name, visible: !$parent.isSelectableLayer($data)"></span>
    //             <select data-bind="visible: $parent.isSelectableLayer($data), options: $parent.baselayers, optionsText: 'name', value: $parent.selectedLayer"></select>
    //           </td>
    //           <td>
    //             <input type="range" min="0" max="1" step="0.01" data-bind="value: alpha, valueUpdate: 'input'">
    //           </td>
    //           <td>
    //             <button type="button" data-bind="click: function() { $parent.raise($data, $index()); }, visible: $parent.canRaise($index())">
    //               ▲
    //             </button>
    //           </td>
    //           <td>
    //             <button type="button" data-bind="click: function() { $parent.lower($data, $index()); }, visible: $parent.canLower($index())">
    //               ▼
    //             </button>
    //           </td>
    //         </tr>
    //       </tbody>
    //     </table>
    //   </div>
    // </div>

    const main = document.getElementById("main-screen");
    const layer_controller = document.createElement("div");
    layer_controller.setAttribute("id", "layer_controller");
    main.appendChild(layer_controller);

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    tbody.setAttribute("data-bind", "foreach: layers");
    
    const tr = document.createElement("tr");
    tr.setAttribute("data-bind", "css: { up: $parent.upLayer === $data, down: $parent.downLayer === $data }");

    layer_controller.appendChild(table);
    table.appendChild(tbody);
    tbody.appendChild(tr);

    const td = [
        [
            {
                ele: "input",
                attr: [
                    { id: "type", effect: "checkbox" },
                    { id: "data-bind", effect: "checked: show" }
                ]
            }
        ],
        [
            {
                ele: "span",
                attr: [ 
                    { id: "data-bind", effect: "text: name, visible: !$parent.isSelectableLayer($data)" } 
                ]
            },
            {
                ele: "select",
                attr: [
                    { id: "data-bind", effect: "visible: $parent.isSelectableLayer($data), options: $parent.baselayers, optionsText: 'name', value: $parent.selectedLayer" }
                ]
            }
        ],
        [
            {
                ele: "input",
                attr: [
                    { id: "type", effect: "range" },
                    { id: "min", effect: "0" },
                    { id: "max", effect: "1" },
                    { id: "step", effect: "0.01" },
                    { id: "data-bind", effect: "value: alpha, valueUpdate: 'input'" },
                ]
            }
        ],
        [
            {
                ele: "button",
                attr: [
                    { id: "type", effect: "button" },
                    { id: "data-bind", effect: "click: function() { $parent.raise($data, $index()); }, visible: $parent.canRaise($index())" },
                ],
                innerHTML: "▲"
            }
        ],
        [
            {
                ele: "button",
                attr: [
                    { id: "type", effect: "button" },
                    { id: "data-bind", effect: "click: function() { $parent.lower($data, $index()); }, visible: $parent.canLower($index())" },
                ],
                innerHTML: "▼"
            }
        ]
    ];
    
    td.forEach(td_eles => {
        const td = document.createElement("td");
        td_eles.forEach(td_ele => {
            const ele = document.createElement(td_ele.ele);
            td_ele.attr.forEach(attr => {
                ele.setAttribute(attr.id, attr.effect);
            });
            if(typeof td_ele.innerHTML !== undefined)
                ele.innerHTML = td_ele.innerHTML;
            td.appendChild(ele);
        });
        tr.appendChild(td);
    });
}