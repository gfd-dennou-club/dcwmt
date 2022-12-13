import type { WmtsLibIdentifer } from '../utility/wmtsLibIdentifer';
import { viewer3D, ReturnedTypeIn3D } from './lib/viewer3D';
import {
  viewerCartesian,
  ReturnedTypeInCartesian,
} from './lib/viewerCartesian';
import {
  viewerProjection,
  ReturnedTypeInProjection,
} from './lib/viewerProjection';

import { Map } from './map';
import { ProjCodes } from '../../components/DrawerContents/Drawer-figure/projection_lib';

export type ViewerTypesForEachLibs =
  | ReturnedTypeIn3D
  | ReturnedTypeInCartesian
  | ReturnedTypeInProjection;

export class Viewer {
  constructor(
    private readonly wmtsLibIdentifer: WmtsLibIdentifer,
    private readonly projection: ProjCodes,
    private readonly zoomNativeLevel: { min: number; max: number },
    private readonly zoom: number,
    private readonly center: [number, number]
  ) {}

  getSuitableViewer = () => {
    const map_obj = new Map('map');
    map_obj.create();
    const map_ele = map_obj.mapEl;

    return this.getViewerWithSuitableLib(map_ele);
  };

  private getViewerWithSuitableLib = (mapEl: HTMLDivElement) => {
    const ceisum = () => this.for3D(mapEl);
    const leaflet = () => this.forCartesian(mapEl);
    const openlayers = () => this.forProjection(mapEl);
    const suitableFunc = this.wmtsLibIdentifer.whichLib(
      ceisum,
      leaflet,
      openlayers
    );
    return suitableFunc();
  };

  private for3D = (mapEl: HTMLDivElement) => viewer3D(mapEl);

  private forCartesian = (mapEl: HTMLDivElement) =>
    viewerCartesian(mapEl, this.zoomNativeLevel);

  private forProjection = (mapEl: HTMLDivElement) => viewerProjection(
      mapEl,
      this.projection,
      this.zoomNativeLevel,
      this.zoom,
      this.center
    );
}
