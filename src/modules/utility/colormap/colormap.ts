import { clrmap } from '../../../components/DrawerContents/Drawer-colormap/colormap_lib';

export type Clrmap = {
  r: number;
  g: number;
  b: number;
};

export class ColorMap {
  private clrindex: number;

  constructor(clrindex: number) {
    this.clrindex = clrindex;
  }

  getClrmap = (): Array<Clrmap> => {
    return clrmap[this.clrindex];
  };

  getClrmapName = (): string => {
    const clrindex = this.clrindex + 1;
    return clrindex < 10 ? `clrmap_0${clrindex}` : `clrmap_${clrindex}`;
  };

  draw = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [width, height];

    const clrmap = this.getClrmap();

    this.drawTriangle(canvas, clrmap[0], width, height, true);
    const rect_width = (width - Math.sqrt(3) * height) / clrmap.length;
    let rect_xpos = (Math.sqrt(3) * height) / 2;
    for (let i = 0; i < clrmap.length; i++) {
      this.drawRect(canvas, clrmap[i], rect_xpos, 0, rect_width, height);
      rect_xpos += rect_width;
    }
    this.drawTriangle(canvas, clrmap[clrmap.length - 1], width, height, false);

    return canvas;
  };

  private drawTriangle = (
    canvas: HTMLCanvasElement,
    color: Clrmap,
    width: number,
    height: number,
    isLeft: boolean
  ) => {
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

    context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

    context.beginPath();
    if (isLeft) {
      context.moveTo(0, height / 2);
      context.lineTo((Math.sqrt(3) * height) / 2, 0);
      context.lineTo((Math.sqrt(3) * height) / 2, height);
      context.moveTo(0, height / 2);
      context.lineTo((Math.sqrt(3) * height) / 2, height);
    } else {
      context.moveTo(width, height / 2);
      context.lineTo(width - (Math.sqrt(3) * height) / 2, 0);
      context.lineTo(width - (Math.sqrt(3) * height) / 2, height);
      context.moveTo(width, height / 2);
      context.lineTo(width - (Math.sqrt(3) * height) / 2, height);
    }

    context.fill();
  };

  private drawRect = (
    canvas: HTMLCanvasElement,
    color: Clrmap,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
    context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    context.fillRect(x, y, width, height);
  };
}
