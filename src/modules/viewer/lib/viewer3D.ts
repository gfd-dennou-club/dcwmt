import { LayerTypes } from '@/dcmwtconfType';
import { Viewer, TileCoordinatesImageryProvider, Color } from 'cesium';
import ImageryLayer from 'cesium/Source/Scene/ImageryLayer';
import { Layer3D } from '../../layer/lib/layer3D';
import { LayerController } from '../../layerManager/LayerController';
import { ViewerInterface } from './ViewerInterface';

export type ReturnedTypeIn3D = Viewer;

export class Viewer3D extends Viewer implements ViewerInterface {
  constructor(mapEl: HTMLDivElement) {
    super(mapEl, {
      imageryProvider: new TileCoordinatesImageryProvider(),
      baseLayerPicker: false,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      timeline: false,
      animation: false,
      homeButton: false,
      vrButton: false,
      geocoder: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      skyBox: false,
      skyAtmosphere: false,
    });
    super.scene.backgroundColor = Color.WHITE;
    super.scene.globe.showGroundAtmosphere = false;
  }

  public register = (layerController: LayerController) => {
    const imageryLayers = this.imageryLayers;
    const defaultLayer = imageryLayers.get(0);
    imageryLayers.remove(defaultLayer, false);

    const layerAry = layerController.get() as Layer3D[];
    for (const layer of layerAry) {
      const imageryLayer = new ImageryLayer(layer);
      imageryLayer.alpha = layer.opacity;
      imageryLayer.show = layer.show;
      imageryLayers.add(imageryLayer);
    }
  };

  public set renderingCompleted(eventListener: () => void) {
    super.scene.postRender.addEventListener(eventListener);
  }

  public updateLayers = (layers: LayerTypes[]) => {
    const baseLayers = this.imageryLayers;
    if (baseLayers.length !== layers.length) {
      return;
    }
    for (let i = 0; i < baseLayers.length; i++) {
      const baseLayer = baseLayers.get(i).imageryProvider as Layer3D;
      if (baseLayer.name === layers[i].name) {
        const purposeLayer = baseLayers.get(i);
        const layer = layers[i];
        // updating show props
        if (purposeLayer.show !== layer.show) {
          baseLayers.remove(purposeLayer, false);
          purposeLayer.show = layer.show;
          baseLayers.add(purposeLayer, i);
          break;
        }
        // updating opacity props
        if (purposeLayer.alpha !== layer.opacity) {
          baseLayers.remove(purposeLayer, false);
          purposeLayer.alpha = layer.opacity;
          baseLayers.add(purposeLayer, i);
          break;
        }
      } else {
        // swapping layers. 
        const j = layers.map((l) => l.name).indexOf(baseLayer.name);
        const upLayer = baseLayers.get(i);
        if (i < j) {
          baseLayers.raise(upLayer);
        } else {
          baseLayers.lower(upLayer);
        }
        break;
      }
    }
    this.render();
  };
}
