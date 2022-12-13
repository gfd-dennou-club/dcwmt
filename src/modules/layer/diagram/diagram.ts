export abstract class Diagram {
  protected range: { min: number; max: number };

  constructor(range?: { min: number; max: number }) {
    if (!range) {
      this.range = { min: Infinity, max: -Infinity };
    } else {
      this.range = range;
    }
  }

  /**
   * Fetch Numerical Data Tile from specificated urls.
   *
   * @param urls - An Array of url to localtion stored Numerical Data Tile.
   * @param canvas - A canvases to drawing Numerical Data Tile.
   *
   * @returns A canvases to drawing Numerical Data Tile(same tile of param canvas).
   */
  private async fetchImages(
    urls: string[],
    canvas: HTMLCanvasElement
  ): Promise<HTMLCanvasElement[]> {
    const promises = new Array<Promise<HTMLCanvasElement>>();

    for (const url of urls) {
      const canvasEle = document.createElement('canvas');
      const context = canvasEle.getContext('2d');
      if (!context) {
        throw new Error('Get null contex from getContext method!');
      }
      const promise = new Promise<HTMLCanvasElement>((resolve, reject) => {
        try {
          const img = new Image();

          img.crossOrigin = 'anonymous';
          img.width = canvas.width;
          img.height = canvas.height;
          img.onload = () => {
            context.drawImage(img, 0, 0);
            resolve(canvasEle);
          };
          img.src = url;
        } catch (err) {
          reject(err);
        }
      });

      promises.push(promise);
    }

    const canvases = await Promise.all(promises);
    return canvases;
  }

  /**
   * Get an array of Numerical Data from canvases drawn Numerical Data Tile.
   *
   * @param canvas - A canvas to drawing final data.
   *
   * @returns an array of Numerical Data.
   */
  private getNumData(canvas: HTMLCanvasElement): number[] {
    const context = canvas.getContext('2d')!;

    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const dataView = new DataView(new ArrayBuffer(32));
    const datas = new Array<number>();

    for (let i = 0; i < canvas.width * canvas.height; i++) {
      // Get RGB value of each pixel from Numerical Data Tile
      const bias_index = i * 4;
      const red = rgba[bias_index] << 24;
      const green = rgba[bias_index + 1] << 16;
      const blue = rgba[bias_index + 2] << 8;
      dataView.setUint32(0, red + green + blue);
      const data = dataView.getFloat32(0);

      // Calculate minmax, if this.range is not specified.
      if (!isFinite(this.range.min)) {
        if (data < this.range.min) {
          this.range.min = data;
        }
        if (data > this.range.max) {
          this.range.max = data;
        }
      }

      datas.push(data);
    }

    return datas;
  }

  /**
   *
   * Draw specific diagram to the canvas passed the second parameter based on datas that the first parameter,
   *
   * @param datas - an array of Numerical Data to drawing specific diagram. specifical diagram is drawn based on this data.
   * @param canvas - a HTML Canvas Element to drawing specifical diagram.
   *
   * @returns A HTML Canvas Element drawn specifical diagram
   * */
  protected abstract drawVisualizedDiagramBasedONNumData(
    datas: number[][],
    canvas: HTMLCanvasElement
  ): HTMLCanvasElement;

  public async draw(
    urls: string[],
    canvas: HTMLCanvasElement
  ): Promise<HTMLCanvasElement> {
    const imgs = await this.fetchImages(urls, canvas);

    const datas = imgs.map((img) => this.getNumData(img));

    const visualizedDiagram = this.drawVisualizedDiagramBasedONNumData(
      datas,
      canvas
    );

    return visualizedDiagram;
  }

  public calcMinMax = (urls: string[], canvas: HTMLCanvasElement): void => {
    this.draw(urls, canvas);
  };

  public abstract whichDiagram<T, U, V>(
    tone: T,
    contour: U,
    vector: V
  ): T | U | V;
}
