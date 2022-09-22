<template>
    <div id="main-screen"></div>
</template>

<script>
import define from '../define.js';
import viewer from '../modules/viewer/viewer.js';
import layer from '../modules/layer/layer.js';
import layerManager from '../modules/layerManager/layerManager.js';
import wmtsLibIdentifer from '../modules/utility/wmtsLibIdentifer.js';

export default {
    data: {
        wli: new wmtsLibIdentifer("OpenLayers"),
        tone: [],
        vector: [],
        clrindex: 4,
    },
    created: function() {
        const root = define.ROOT;

        define.TONE.forEach((pq) => {
            const url_ary = pq.FIXED.map(fixed => root.concat(`/${pq.NAME}/${fixed}`));
            this.tone.push({
                name: pq.NAME,
                url: url_ary,
                size: pq.SIZE,
                maximumLevel: pq.MAXIMAMLEVEL,
            });
        });

        define.VECTOR.forEach((pq) => {
            const pq_name = pq.NAME[0].concat("-", pq.NAME[1]);
            const urls_ary = pq.NAME.map(name => root.concat(`/${name}/${pq.FIXED[0]}`));
            this.vector.push({
                name: pq_name,
                url: urls_ary,
                size: pq.SIZE,
                maximumLevel: pq.MAXIMUMLEVEL,
            });
        });

        this.draw();
    },
    methods: {
        draw: function() {
            // ビュワーの作成
            const viewer_obj = new viewer({wmtsLibIdentifer: this.wli});
            const suitable_viewer = viewer_obj.getSuitableViewer();

            // レイヤマネージャーを作成
            const layer_manager = new layerManager(this.wli, suitable_viewer);

            // レイヤの作成とマネージャへの追加
            const layer_types = [this.tone, this.vector];
            layer_types.forEach(layer_type => {
                layer_type.forEach(layer_info => {
                    const layer_option = {
                        name: layer_info.name,
                        url: layer_info.url,
                        size: layer_info.size,
                        maximumLevel: layer_info.maximumLevel,
                        minimumLevel: 0,
                        clrindex: this.colormap,
                        opacity: 255,
                    };
                    const layer_obj = new layer(layer_option);
                    layer_manager.addBaseLayer(layer_obj.get(this.wli), layer_info.name);
                    layer_manager.addOverlayLayer(layer_obj.get(this.wli), layer_info.name);
                })
            });

            // レイヤーマネージャのセットアップ
            layer_manager.setup(suitable_viewer);
        }
    }
}
</script>