L.LayerCtl = L.Control.Layers.extend({
  _createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;
		return radioFragment.firstChild;
	},
  _addItem: function (obj) {
		var label = document.createElement('label'),
		    checked = this._map.hasLayer(obj.layer),
		    input;

		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		this._layerControlInputs.push(input);
		input.layerId = L.Util.stamp(obj.layer);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		this._checkDisabledLayers();
		return label;
	},
  _getLayer: function (id) {

		for (var i = 0; i < this._layers.length; i++) {

			if (this._layers[i] && L.Util.stamp(this._layers[i].layer) === id) {
				return this._layers[i];
			}
		}
	},
  getActiveLayer: function(){
    var inputs = this._layerControlInputs,
        input, layer;
    var addedLayers = [],
        removedLayers = [];

    this._handlingClick = true;

    for (var i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this._getLayer(input.layerId).layer;
      var obj = this._getLayer(L.Util.stamp(layer));

      if (input.checked) {
        addedLayers.push(layer);

        if(input.type==="radio"){
  //        console.log("アクティブレイヤーは"+obj.name+"です");
          this.active=obj;

          return layer;
        }
      }
    }
    return -1;
  },
  _onInputClick: function () {
    var inputs = this._layerControlInputs,
        input, layer;
    var addedLayers = [],
        removedLayers = [];

    this._handlingClick = true;

    for (var i = inputs.length - 1; i >= 0; i--) {
      input = inputs[i];
      layer = this._getLayer(input.layerId).layer;
      var obj = this._getLayer(L.Util.stamp(layer));



      if (input.checked) {
        addedLayers.push(layer);

        if(input.type==="radio"){
          //console.log("アクティブレイヤーは"+obj.name+"です");
          this.active=obj;
          drawText(layer);
        }

      } else if (!input.checked) {
        removedLayers.push(layer);
      }
    }

    // Bugfix issue 2318: Should remove all old layers before readding new ones
    for (i = 0; i < removedLayers.length; i++) {
      if (this._map.hasLayer(removedLayers[i])) {
        this._map.removeLayer(removedLayers[i]);
      }
    }
    for (i = 0; i < addedLayers.length; i++) {
      if (!this._map.hasLayer(addedLayers[i])) {
        this._map.addLayer(addedLayers[i]);
      }
    }

    this._handlingClick = false;

    this._refocusOnMap();
  }
});

L.layerCtl = function(baseLayers, overlays, options) {
  return new L.LayerCtl(baseLayers, overlays, options);
};
