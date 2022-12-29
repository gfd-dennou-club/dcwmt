import * as olProj from 'ol/proj';
import * as olExtent from 'ol/extent';
import { View, Map } from 'ol';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { createXYZ } from 'ol/tilegrid';

import { ViewerInterface } from './ViewerInterface';
import {
  ProjCodes,
  projections,
} from '../../../components/DrawerContents/Drawer-figure/projection_lib';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LayerController } from '@/modules/layerManager/LayerController';
import { LayerProjection } from '@/modules/layer/lib/layerProjection';
import { LayerTypes } from '@/dcmwtconfType';

export class ViewerProjection extends Map implements ViewerInterface {
  constructor(
    mapEl: HTMLDivElement,
    private readonly projCode: ProjCodes,
    zoomNativeLevel: { min: number; max: number },
    zoom: number,
    center: [number, number]
  ) {
    super({ target: mapEl, layers: new Array<LayerProjection>() });
    const projection = this.createProjection(this.projCode);

    const tileGrid = createXYZ({
      extent: projection.getExtent(),
      maxZoom: zoomNativeLevel.max,
      minZoom: zoomNativeLevel.min,
    });

    const view = this.createView(
      projection,
      tileGrid,
      zoom,
      center,
      zoomNativeLevel
    );

    this.setView(view);
  }

  private createProjection = (projCode: olProj.ProjectionLike) => {
    const getProjection = olProj.get;

    // Register prepared projections
    for (const projection of projections) {
      if (!projection.proj4) {
        continue;
      }
      proj4.defs(projection.title, projection.proj4);
    }
    register(proj4);

    // Get projection for using now.
    const projection = getProjection(projCode);
    if (!projection) {
      throw new Error('Passed projection is undefined title.');
    }

    // Register extent of projection.
    const purposeProj = projections.find((p) =>
      p.code.includes(projCode as string)
    );
    if (!purposeProj) {
      throw new Error('Passed projection is undefined title.');
    }
    const extent = purposeProj.extent || projection.getExtent();
    projection.setExtent(extent);

    return projection;
  };

  private createView = (
    projection: olProj.Projection,
    tileGrid: TileGrid,
    zoom: number,
    center: [number, number],
    zoomNativeLevel: { min: number; max: number }
  ) => {
    const getCenter = olExtent.getCenter;

    return new View({
      projection: projection,
      resolution: tileGrid.getResolution(zoom || zoomNativeLevel.min),
      resolutions: tileGrid.getResolutions(),
      center: center || getCenter(projection.getExtent() || [0, 0, 0, 0]),
      multiWorld: true,
    });
  };

  public register = (layerController: LayerController) => {
    const layerAry = layerController.get() as LayerProjection[];
    for (const layer of layerAry) {
      this.addLayer(layer);
    }
  };

  public set renderingCompleted(eventListener: () => void) {
    this.on('rendercomplete', eventListener);
  }

  public updateLayers = (layers: LayerTypes[]) => {
    //@ts-ignore
    const baseLayers: LayerProjection[] = this.getLayers().getArray();
    if (baseLayers.length !== layers.length) {
      return;
    }
    for (let i = 0; i < baseLayers.length; i++) {
      if (baseLayers[i].name === layers[i].name) {
        if (baseLayers[i].show !== layers[i].show) {
          baseLayers[i].show = layers[i].show;
          break;
        }
        if (baseLayers[i].opacity !== layers[i].opacity) {
          baseLayers[i].opacity = layers[i].opacity;
          break;
        }
      } else {
        const j = baseLayers.map((l) => l.name).indexOf(layers[i].name);
        const updateLayer = baseLayers[i];
        if (i < j) {
          this.raise(updateLayer);
        } else {
          this.lower(updateLayer);
        }
        break;
      }
    }
  };

  private lower(layer: LayerProjection) {
    const layers = this.getLayers();
    const layersAry = layers.getArray();
    for (let i = 0; i < layers.getLength(); i++) {
      if (i > 0 && (layersAry[i] as LayerProjection).name === layer.name) {
        layers.remove(layer);
        layers.insertAt(i - 1, layer);
        break;
      }
    }
    this.setLayers(layers);
  }

  private raise(layer: LayerProjection) {
    const layers = this.getLayers();
    const layersAry = layers.getArray();
    const maxIndex = layers.getLength() - 1;
    for (let i = 0; i < layers.getLength(); i++) {
      if (
        i < maxIndex &&
        (layersAry[i] as LayerProjection).name === layer.name
      ) {
        layers.remove(layer);
        layers.insertAt(i + 1, layer);
        break;
      }
    }
    this.setLayers(layers);
  }
}
