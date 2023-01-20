import { WmtsLibIdentifer } from '../utility/wmtsLibIdentifer';
import { Viewer3D } from './lib/viewer3D';
// import { viewerCartesian } from './lib/viewerCartesian';
import { ViewerProjection } from './lib/viewerProjection';

import { ProjCodes } from '../../components/DrawerContents/Drawer-figure/projection_lib';

export class ViewerController {
  private readonly wli: WmtsLibIdentifer;
  private viewer: Viewer3D | ViewerProjection | undefined;

  constructor(
    public projCode: ProjCodes,
    private readonly zoomNativeLevel: { min: number; max: number },
    private readonly zoom: number,
    private readonly center: [number, number]
  ) {
    if (this.projCode === 'XY') {
      this.wli = new WmtsLibIdentifer('Leaflet');
    } else if (this.projCode === '3d Sphere') {
      this.wli = new WmtsLibIdentifer('Cesium');
    } else {
      this.wli = new WmtsLibIdentifer('OpenLayers');
    }
  }

  public create = (mapEl: HTMLDivElement) => {
    this.viewer = this.getViewerWithSuitableLib(mapEl);
    return this.get();
  };

  public get = () => {
    return this.viewer;
  }

  private getViewerWithSuitableLib = (mapEl: HTMLDivElement) => {
    const prop = [
      mapEl,
      this.projCode,
      this.zoomNativeLevel,
      this.zoom,
      this.center,
    ] as const;
    const cesium = () => new Viewer3D(mapEl, this.center);
    const leaflet = () => new Viewer3D(mapEl, this.center);
    const openlayers = () => new ViewerProjection(...prop);
    const suitableFunc = this.wli.whichLib(cesium, leaflet, openlayers);
    return suitableFunc();
  };
}
