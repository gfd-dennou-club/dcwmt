import { UrlTemplateImageryProvider } from 'cesium';
import { Diagram } from '../diagram/diagram';
import { LayerInterface } from './LayerInterface';

export class Layer3D extends UrlTemplateImageryProvider implements LayerInterface{
  public minmax: [number, number] | undefined;

  constructor(
    public readonly name: string,
    private readonly urls: string[],
    tileSize: { x: number; y: number },
    zoomLevel: { min: number; max: number },
    public show: boolean,
    opacity: number,
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

    this.opacity = opacity;
  }

  public requestImage(x: number, y: number, level: number) {
    const urls = new Array<string>();
    for (const url of this.urls) {
      urls.push(url.concat(`/${level}/${x}/${y}.png`));
    }

    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [this.tileWidth, super.tileHeight];

    const drawnCanvas = this.diagram.draw(urls, canvas);
    return drawnCanvas;
  }

  set opacity(value: number){
    this.defaultAlpha = value;
  }
  get opacity(): number {
    if(!this.defaultAlpha) {
      throw new Error("Don't has alpha channel this layer");
    }
    return this.defaultAlpha;
  }

  set colorIndex(value: number) {
    //@ts-ignore
    this.diagram.changeColorMap(value);
  }
  get colorIndex() {
    if(!this.diagram.colorIndex){
      throw new Error("Shouldn't call to this layer");
    }
    return this.diagram.colorIndex;
  }

  set thresholdInterval(value: number) {
    this.diagram.thresholdInterval = value;
  }
  get thresholdInterval() {
    if(!this.diagram.thresholdInterval) {
      throw new Error("Shouldn't call to this layer");
    }
    return this.diagram.thresholdInterval;
  }

  set vectorInterval(value: {x: number, y: number}) {
    this.diagram.vectorInterval = value;
  }
  get vectorInterval() {
    if(!this.diagram.vectorInterval) {
      throw new Error("Shouldn't call to this layer");
    }
    return this.diagram.vectorInterval;
  }
}
