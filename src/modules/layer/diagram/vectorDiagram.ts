import { Diagram } from './diagram';

export class VectorDiagram extends Diagram {
  constructor(
    private readonly mathMethod: (x: number) => number,
    private readonly numOfVectorInCanvas: { x: number; y: number }
  ) {
    super();
  }

  protected drawVisualizedDiagramBasedONNumData = (
    datas: number[][],
    canvas: HTMLCanvasElement
  ): HTMLCanvasElement => {
    datas = datas.map((data) => data.map(this.mathMethod));

    const Direction = {
      Horizonal: 0,
      Vertical: 1,
    } as const;

    const blockSizeToDrawingOneVector = this.BlockSizeToDrawingOneVector(
      { width: canvas.width, height: canvas.height },
      this.numOfVectorInCanvas
    );

    let arraysCalculatedToMeanPerBlock = new Array<Array<number>>(2);
    // Calculate mean of horizonal direction tile per blocks.
    arraysCalculatedToMeanPerBlock[Direction.Horizonal] =
      this.ArrayCalculatedToMeanPerBlock(
        datas[Direction.Horizonal],
        { width: canvas.width, height: canvas.height },
        blockSizeToDrawingOneVector,
        this.numOfVectorInCanvas.x * this.numOfVectorInCanvas.y
      );
    // Calculate mean of vertical direction tile per blocks.
    arraysCalculatedToMeanPerBlock[Direction.Vertical] =
      this.ArrayCalculatedToMeanPerBlock(
        datas[Direction.Vertical],
        { width: canvas.width, height: canvas.height },
        blockSizeToDrawingOneVector,
        this.numOfVectorInCanvas.x * this.numOfVectorInCanvas.y
      );

    // Get max value to normalize.
    const max = arraysCalculatedToMeanPerBlock.map((meanedData) =>
      Math.max(...meanedData.map(Math.abs))
    );

    // Normarize from -1 to 1.
    const arraysOfNormalizedMeanBlock = arraysCalculatedToMeanPerBlock.map(
      (meanedData, direction) => meanedData.map((data) => data / max[direction])
    );

    // rendering vector
    const context = canvas.getContext('2d')!;
    for (let y = 0; y < this.numOfVectorInCanvas.y; y++) {
      for (let x = 0; x < this.numOfVectorInCanvas.x; x++) {
        const halfOfBlockSize = {
          x: blockSizeToDrawingOneVector.x / 2,
          y: blockSizeToDrawingOneVector.y / 2,
        };

        context.beginPath();
        const arrow = {
          length: 3,
          bold: 1,
          width: 3,
        };

        const startPointOfVector = {
          x: x * blockSizeToDrawingOneVector.x + halfOfBlockSize.x,
          y: y * blockSizeToDrawingOneVector.y + halfOfBlockSize.y,
        };
        const endPointOfVector = {
          x:
            startPointOfVector.x +
            arraysOfNormalizedMeanBlock[Direction.Horizonal][
              x + y * this.numOfVectorInCanvas.x
            ] *
              halfOfBlockSize.x,
          y:
            startPointOfVector.y +
            arraysOfNormalizedMeanBlock[Direction.Vertical][
              x + y * this.numOfVectorInCanvas.x
            ] *
              halfOfBlockSize.y,
        };
        const controlPointOfVector = [
          0,
          arrow.bold,
          -arrow.length,
          arrow.bold,
          -arrow.length,
          arrow.width,
        ];

        // @ts-ignore
        context.arrow(
          startPointOfVector.x,
          startPointOfVector.y,
          endPointOfVector.x,
          endPointOfVector.y,
          controlPointOfVector
        );
        context.fill();
      }
    }

    return canvas;
  };

  private BlockSizeToDrawingOneVector = (
    canvasSize: { width: number; height: number },
    numOfVectorInCanvas: { x: number; y: number }
  ) => {
    return {
      x: canvasSize.width / numOfVectorInCanvas.x,
      y: canvasSize.height / numOfVectorInCanvas.y,
    };
  };

  private ArrayCalculatedToMeanPerBlock = (
    data: number[],
    canvasSize: { width: number; height: number },
    blockSizeToDrawingOneVector: { x: number; y: number },
    totalNumOfBlocksInCanvas: number
  ) => {
    return new Array<number>(totalNumOfBlocksInCanvas).map((_, i) => {
      // Slice Array to get needed section,
      // (Too Complication)
      let applicable_array = new Array<number>();
      const startPoint = {
        x:
          ((i * blockSizeToDrawingOneVector.x) % canvasSize.width) /
          blockSizeToDrawingOneVector.x,
        y: Math.floor((i * blockSizeToDrawingOneVector.x) / canvasSize.width),
      };
      for (let y = 0; y < blockSizeToDrawingOneVector.y; y++) {
        const slice = {
          start:
            startPoint.x * blockSizeToDrawingOneVector.x +
            (startPoint.y * blockSizeToDrawingOneVector.y + y) *
              canvasSize.width,
          end:
            (startPoint.x + 1) * blockSizeToDrawingOneVector.x +
            (startPoint.y * blockSizeToDrawingOneVector.y + y) *
              canvasSize.width,
        };
        const xSlicedArray = data.slice(slice.start, slice.end);
        applicable_array = applicable_array.concat(xSlicedArray);
      }

      // Calculate mean of sliced array.
      const mean = applicable_array.reduce(
        (accumulator, current, _, { length }) => accumulator + current / length
      );
      return mean;
    });
  };

  // @ts-ignore
  public whichDiagram<T, U, V>(tone: T, contour: U, vector: V): T | U | V {
    return vector;
  }
}

