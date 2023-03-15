import { ProjCodes } from '../../components/DrawerContents/Drawer-figure/projection_lib';
import { WmtsLibIdentifer } from '../utility/wmtsLibIdentifer';

import { Layer3D } from './lib/layer3D';
import { LayerCartesian } from '../layer/lib/layerCartesian';
import { LayerProjection } from './lib/layerProjection';

import { ToneDiagram } from './diagram/toneDiagram';
import { ContourDiagram } from './diagram/counterDiagram';
import { VectorDiagram } from './diagram/vectorDiagram';
import { Diagram } from './diagram/diagram';
import { DiagramTypes } from '../../dcmwtconfType';

export class LayerController {
  private readonly wli: WmtsLibIdentifer;
  private readonly bundler: (Layer3D | LayerCartesian | LayerProjection)[];

  constructor(
    private readonly rootUrl: string,
    private readonly projCode: ProjCodes
  ) {
    if (this.projCode === 'XY') {
      this.wli = new WmtsLibIdentifer('XY');
      this.bundler = new Array<LayerCartesian>();
    } else if (this.projCode === '3d Sphere') {
      this.wli = new WmtsLibIdentifer('3d Sphere');
      this.bundler = new Array<Layer3D>();
    } else {
      this.wli = new WmtsLibIdentifer('Projections');
      this.bundler = new Array<LayerProjection>();
    }
  }

  public create = async (
    type: DiagramTypes,
    name: string,
    url_ary: string[],
    fixed: string,
    tileSize: { x: number; y: number },
    zoomLevel: { min: number; max: number },
    mathMethod: (x: number) => number,
    show: boolean,
    opacity: number,
    minmax: [number, number] | undefined,
    diagramProp: number | { x: number; y: number }
  ) => {
    let diagramObj: Diagram;
    if (type === 'tone') {
      const clrindex = diagramProp as number;
      diagramObj = new ToneDiagram(clrindex, mathMethod, minmax);
      minmax = await this.getMinMax(url_ary, tileSize, diagramObj);
    } else if (type === 'contour') {
      const thretholdinterval = diagramProp as number;
      diagramObj = new ContourDiagram(thretholdinterval, mathMethod, minmax);
      minmax = await this.getMinMax(url_ary, tileSize, diagramObj);
    } else {
      const vecinterval = diagramProp as { x: number; y: number };
      diagramObj = new VectorDiagram(vecinterval, mathMethod);
    }
    const layer = this.getLayerWithSuitableLib(
      name,
      url_ary,
      fixed,
      tileSize,
      zoomLevel,
      show,
      opacity,
      diagramObj
    );
    //@ts-ignore
    layer.minmax = minmax;

    return layer;
  };

  private getMinMax = async (
    url_ary: string[],
    tileSize: { x: number; y: number },
    diagramObj: Diagram
  ) => {
    const level0Url = url_ary.map((url) => `${this.rootUrl}/${url}/0/0/0.png`);
    const canvas = document.createElement('canvas');
    canvas.width = tileSize.x;
    canvas.height = tileSize.y;
    return await diagramObj.calcMinMax(level0Url, canvas);
  };

  public add = (layer: Layer3D | LayerCartesian | LayerProjection) => {
    return this.bundler.push(layer);
  };

  public get = () => {
    return this.bundler;
  };

  private getLayerWithSuitableLib = (
    name: string,
    url_ary: string[],
    fixed: string,
    tileSize: { x: number; y: number },
    zoomLevel: { min: number; max: number },
    show: boolean,
    opacity: number,
    diagramObj: Diagram
  ): Layer3D | LayerCartesian | LayerProjection => {
    const props = [
      name,
      url_ary,
      fixed,
      tileSize,
      zoomLevel,
      show,
      opacity,
      diagramObj,
    ] as const;
    const xy = () =>
      new LayerCartesian(
        name,
        url_ary,
        fixed,
        tileSize,
        zoomLevel,
        show,
        opacity,
        diagramObj
      );
    const sphere = () => new Layer3D(...props);
    const projections = () => new LayerProjection(...props);
    const suitableFunc = this.wli.whichLib(xy, sphere, projections);

    return suitableFunc();
  };
}
