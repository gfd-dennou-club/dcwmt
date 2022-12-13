import { UrlTemplateImageryProvider } from 'cesium';
import { Diagram } from '../diagram/diagram';

export class Layer3D extends UrlTemplateImageryProvider {
  constructor(
    private readonly urls: string[],
    tileSize: { x: number; y: number },
    zoomLevel: { max: number; min: number },
    private readonly diagram: Diagram
  ) {
    const options: UrlTemplateImageryProvider.ConstructorOptions = {
      url: '',
      tileWidth: tileSize.x,
      tileHeight: tileSize.y,
      maximumLevel: zoomLevel.max,
      minimumLevel: zoomLevel.min,
    };
    super(options);
  }

  public async requestImage(x: number, y: number, level: number) {
    const urls = new Array<string>();
    for (const url of this.urls) {
      urls.push(url.concat(`/${level}/${x}/${y}.png`));
    }

    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [this.tileWidth, this.tileHeight];

    return this.diagram.draw(urls, canvas);
  }
}

