import { Diagram } from './diagram';
import { Clrmap } from '../../utility/colormap/colormap';

export class ToneDiagram extends Diagram {
  private readonly colormap: Clrmap[];
  private readonly mathMethod: (x: number) => number;

  constructor(
    colormap: Clrmap[],
    mathMethod: (x: number) => number,
    minmax?: [number, number]
  ) {
    super(minmax);

    this.colormap = colormap;
    this.mathMethod = mathMethod;
  }

  protected drawVisualizedDiagramBasedONNumData = (
    datas: number[][],
    canvas: HTMLCanvasElement
  ): HTMLCanvasElement => {
    let imageData = new ImageData(canvas.width, canvas.height);

    for (let i = 0; i < canvas.height * canvas.width; i++) {
      const bias_index = i * 4;
      const data = this.mathMethod(datas[0][i]);
      const clrmap = this.getClrMap(data);
      imageData.data[bias_index + 0] = clrmap.r;
      imageData.data[bias_index + 1] = clrmap.g;
      imageData.data[bias_index + 2] = clrmap.b;
      imageData.data[bias_index + 3] = 255;
    }

    const context = canvas.getContext('2d')!;
    context.putImageData(imageData, 0, 0);

    return canvas;
  };

  private getClrMap = (data: number): Clrmap => {
    const colormap_per_scalardata =
      this.colormap.length / (this.minmax[1] - this.minmax[0]);
    const colormap_index = Math.round(
      colormap_per_scalardata * (data - this.minmax[0])
    );

    // 読み込み失敗時は白を返す
    if (data === 0.0) {
      return { r: 255, g: 255, b: 255 };
    } else if (this.colormap.length <= colormap_index) {
      return this.colormap[this.colormap.length - 1];
    } else if (0 > colormap_index) {
      return this.colormap[0];
    } else {
      return this.colormap[colormap_index]; // それ以外は対応する色を返す
    }
  };

  //@ts-ignore
  public whichDiagram<T, U, V>(tone: T, contour: U, vector: V): T | U | V {
    return tone;
  }
}
