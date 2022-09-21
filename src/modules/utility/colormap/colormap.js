import clrmap from "./lib/colormap_lib.js";

const colormap = class{
    constructor(clrindex){
        this.clrindex = clrindex;
    }

    getClrmap = () => {
        return clrmap[this.clrindex + 1];
    }

    draw = (width, height) => {
        const canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [ width, height ];

        const clrmap = this.getClrmap();

        this._drawTriangle(canvas, clrmap[0], width, height, true);
        const rect_width = (width - Math.sqrt(3) * height) / (clrmap.length);
        let rect_xpos =  Math.sqrt(3) * height / 2;
        for(let i = 0; i < clrmap.length; i++){
            this._drawRect(canvas, clrmap[i], rect_xpos, 0, rect_width, height);
            rect_xpos += rect_width;
        }
        this._drawTriangle(canvas, clrmap[clrmap.length - 1], width, height, false);

        return canvas;
    }

    _drawTriangle = (canvas, color, width, height, isLeft) => {
        const context = canvas.getContext("2d");

        context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

        context.beginPath();
        if(isLeft){
            context.moveTo(0, height / 2);
            context.lineTo(Math.sqrt(3) * height / 2, 0);
            context.lineTo(Math.sqrt(3) * height / 2, height);
            context.moveTo(0, height / 2);
            context.lineTo(Math.sqrt(3) * height / 2, height);
        }else{
            context.moveTo(width, height / 2);
            context.lineTo(width - Math.sqrt(3) * height / 2, 0);
            context.lineTo(width - Math.sqrt(3) * height / 2, height);
            context.moveTo(width, height / 2);
            context.lineTo(width - Math.sqrt(3) * height / 2, height);
        }

        context.fill();
    }

    _drawRect = (canvas, color, x, y, width, height) => {
        const context = canvas.getContext("2d");
        context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        context.fillRect(x, y, width, height);
    } 
}

export default colormap;