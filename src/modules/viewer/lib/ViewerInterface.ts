import { LayerTypes } from '@/dcmwtconfType';
import { LayerController } from '../../layer/LayerController';

export interface ViewerInterface {
  /**
   * 表示したいレイヤー群の登録
   *
   * @param {LayerController} layerController
   */
  register(layerController: LayerController): void;
  /**
   * レイヤー群の更新
   *
   * @param {LayerTypes[]} layers
   */
  updateLayers(layers: LayerTypes[]): void;
  // 拡大率
  zoom: number;
  // 画面の中央座標
  center: [number, number];
}
