import { GridLayer, Util } from 'leaflet';
import { Diagram } from '../diagram/diagram';

export const LayerCartesian = GridLayer.extend({
  options: {
    coords: { x: 0, y: 0, z: 0 }, // タイルを参照するための座標
  },

  initialize: function (
    urls: string[],
    tileSize: { x: number; y: number },
    zoomLevel: { min: number; max: number },
    diagram: Diagram
  ) {
    const options = {
      tileSize: tileSize,
      minZoom: zoomLevel.min,
      maxZoom: zoomLevel.max,
      urls: urls,
      diagram: diagram,
    };

    Util.setOptions(this, options); // 引数で渡されたプロパティを代入
  },

  createTile: function (coords: { x: number; y: number; z: number }) {
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [
      this.options.tileSize.x,
      this.options.tileSize.y,
    ];
    // @ts-ignore
    const urls = this.options.urls.map((v) =>
      v.concat(`${coords.z}/${coords.x}/${coords.y}.png`)
    );

    return this.options.diagram(urls, canvas);
  },

  getName: function () {
    return this.options.name;
  },
});
