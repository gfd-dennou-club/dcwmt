const layerControllerProjection = class{
    constructor(original_layer, baselayers, overlaylayers){
        this.map = original_layer;
        this.original_layers = original_layer.getLayers();
        this.baselayers = baselayers;
        this.overlaylayers = overlaylayers;
        this.bottomlayer = baselayers[0];
    }

    eventListener_for_baselayers = (value) => {
        const purpose_layer = this.baselayers.find((item) => item.options.name === value.target.value);
        // 選択したレイヤを取得
        this.bottomlayer = purpose_layer;
        this._update();
    }

    eventListener_for_overlaylayers = (value) => {
        // 選択したレイヤを取得
        const purpose_layer = this.overlaylayers.find((item) => item.layer.options.name === value.target.value);
        purpose_layer.show = value.target.checked;
        this._update();
    }

    eventListener_for_projection = (value) => {
        // 選択したレイヤを取得
        const purpose_projection = this.map.projections.find((item) => item.name === value.target.value).proj;
        const getCenter = ol.extent.getCenter;

        const view = new ol.View({
            projection: purpose_projection,
            extent: purpose_projection.getExtent() || [0, 0, 0, 0],
            center: getCenter(purpose_projection.getExtent() || [0, 0, 0, 0]),
            zoom: 0,
        });

        this.map.setView(view);
    }

    _update = () => {
        // 選択したレイヤをレイヤ群のボトムに入れる
        this.original_layers.remove(this.bottomlayer);          // 選択したレイヤをレイヤ群の中から削除
        this.original_layers.push(this.bottomlayer);            // 選択したレイヤをレイヤ群のtopに挿入
        this.original_layers.forEach(layer => {
            // 対象のレイヤだった場合は飛ばす
            if(layer === undefined || layer.options.name === this.bottomlayer.options.name)
                return;  
            else this.original_layers.remove(layer);            // それ以外のレイヤはすべて削除
        });

        // オーバレイレイヤをレイヤ群に挿入していく
        this.overlaylayers.forEach(layer => {
            if(layer.show && layer.layer.options.name !== this.bottomlayer.options.name){
                this.original_layers.push(layer.layer);
            }
        });
    }
}