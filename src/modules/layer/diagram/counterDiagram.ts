import * as contour from 'd3-contour';
import { geoPath, geoIdentity } from 'd3-geo';
import { Diagram } from './diagram';

export class ContourDiagram extends Diagram {
  constructor(
    private readonly split: number,
    protected readonly mathMethod: (x: number) => number,
    range?: { min: number; max: number }
  ) {
    super(range);
  }

  protected drawVisualizedDiagramBasedONNumData = (
    datas: number[][],
    canvas: HTMLCanvasElement
  ): HTMLCanvasElement => {
    const context = canvas.getContext('2d')!;

    const processedData = datas[0].map(this.mathMethod);

    const projection = geoIdentity().scale(1);
    const path = geoPath(projection, context);

    const thretholds = new Array<number>(this.split).map(
      (_, i) =>
        this.range.min + ((this.range.max - this.range.min) / this.split) * i
    );

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1.5;

    for (const threshold of thretholds) {
      context.beginPath();
      const contours = contour.contours().size([canvas.width, canvas.height]);
      const object = contours.contour(processedData, threshold);
      path(object);
      context.stroke();
      context.closePath();
    }

    return canvas;
  };

  // @ts-ignore
  public whichDiagram<T, U, V>(tone: T, contour: U, vector: V): T | U | V {
    return contour;
  }
}
