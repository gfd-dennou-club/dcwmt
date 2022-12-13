import { Layer3D } from './lib/layer3D';
import { LayerCartesian } from './lib/layerCartesian';
import { LayerProjection } from './lib/layerProjection';

import { colormap } from '../utility/colormap/colormap.js';
import { ToneDiagram } from './diagram/toneDiagram';
import { ContourDiagram } from './diagram/counterDiagram';
import { VectorDiagram } from './diagram/vectorDiagram';

import { WmtsLibIdentifer } from '../utility/wmtsLibIdentifer';

import { DiagramTypes } from '../../dcmwtconfType';
import { Diagram } from './diagram/diagram';

export class Layer {
  constructor(private readonly wmtsLibIdentifer: WmtsLibIdentifer) {}

  public create = async (
    name: string,
    urls: string[],
    tileSize: { x: number; y: number },
    zoomLevel: { min: number; max: number },
    diagram: DiagramTypes,
    mathMethod: (x: number) => number,
    clrindex?: number,
    range?: { min: number; max: number }
  ) => {
    let diagramObj: ToneDiagram | ContourDiagram | VectorDiagram;
    if (diagram === 'tone') {
      const clrmap = new colormap(clrindex);
      diagramObj = new ToneDiagram(clrmap, mathMethod, range);
      const level0Url = urls.map((url) => url.concat('/0/0/0.png'));
      const canvas = document.createElement('canvas');
      diagramObj.calcMinMax(level0Url, canvas);
    } else if (diagram === 'contour') {
      diagramObj = new ContourDiagram(10, mathMethod, range);
      const level0Url = urls.map((url) => url.concat('/0/0/0.png'));
      const canvas = document.createElement('canvas');
      diagramObj.calcMinMax(level0Url, canvas);
    } else if (diagram === 'vector') {
      diagramObj = new VectorDiagram(mathMethod, { x: 10, y: 10 });
    }

    return this.getLayerWithSuitableLib(
      name,
      urls,
      tileSize,
      zoomLevel,
      // @ts-ignore
      diagramObj
    );
  };

  getProps = () => {
    if (this.maxmin) {
      const maxmin = this.maxmin;
      return { name: this.options.name, max: maxmin.max, min: maxmin.min };
    } else {
      return undefined;
    }
  };

  private getLayerWithSuitableLib = (
    name: string,
    urls: string[],
    tileSize: { x: number; y: number },
    zoomLevel: { min: number; max: number },
    diagram: Diagram
  ) => {
    const cesium = new Layer3D(urls, tileSize, zoomLevel, diagram);
    const leaflet = new LayerCatesian(name, urls, tileSize, zoomLevel, diagram);
    const openlayers = new LayerProjection(
      name,
      urls,
      tileSize,
      zoomLevel,
      diagram
    );
    return this.wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
  };
}
