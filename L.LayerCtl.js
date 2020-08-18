// このスクリプトの機能はどこかにありそう

L.LayerCtl = L.Control.Layers.extend({
  
  // @method getActiveLayer: layer? : Layer
  // ベースレイヤーを PT>U>V>vec_UV の優先度で返す. ベースレイヤーが存在しなければ undefined を返す.
  getActiveLayer: function(){
    let inputs = this._layerControlInputs,
        input, layer;
    this._handlingClick = true;

    for (let i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this._getLayer(input.layerId).layer;

      if (input.checked && input.type === "radio") return layer;
    }
    return undefined;
  },
});

// @factory L.control.layers.dcwmt(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
// (原文)指定されたレイヤーでレイヤーコントロールを作成する. 
// ベースレイヤーはラジオボタンで切り替えられ、オーバーレイはチェックボックスで切り替えられます.
// すべてのベースレイヤーはベースレイヤーオブジェクトで渡される必要がありますが、マップのインスタンス化中には1つだけをマップに追加する必要があります。
L.layerCtl = function(baseLayers, overlays, options) {
 return new L.LayerCtl(baseLayers, overlays, options);
};
