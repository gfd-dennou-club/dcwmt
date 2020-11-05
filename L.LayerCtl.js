L.LayerCtl = L.Control.Layers.extend({
  getActiveLayer: function(){
    let inputs = this._layerControlInputs,
        input, layer;
    let addedLayers = [];

    this._handlingClick = true;

    for (let i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this._getLayer(input.layerId).layer;
      let obj = this._getLayer(L.Util.stamp(layer));

      if (input.checked) {
        addedLayers.push(layer);

        if(input.type==="radio"){
          this.active=obj;

          return layer;
        }
      }
    }
    return -1;
  },
});

L.layerCtl = function(baseLayers, overlays, options) {
  return new L.LayerCtl(baseLayers, overlays, options);
};
