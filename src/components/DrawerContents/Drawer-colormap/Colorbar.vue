<template>
    <canvas :width="width" :height="height"></canvas>
</template>
<script>
import clrmap_ary from "./colormap_lib"; 

export default {
    props: ["width", "height", "clrindex"],
    data: () => ({
        ctx: undefined,
    }),
    methods: {
        draw: function() {
            this._drawTriangle(this.clrmap[0], this.width, this.height, true);
            const rect_width = (this.width - Math.sqrt(3) * this.height) / (this.clrmap.length);
            let rect_xpos =  Math.sqrt(3) * this.height / 2;
            for(let i = 0; i < this.clrmap.length; i++){
                this._drawRect(this.clrmap[i], rect_xpos, 0, rect_width, this.height);
                rect_xpos += rect_width;
            }
            this._drawTriangle(this.clrmap[this.clrmap.length - 1], this.width, this.height, false);
        },
        _drawTriangle: function(color, width, height, isLeft) {
            const context = this.ctx;

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
        },
        _drawRect: function(color, x, y, width, height) {
            const context = this.ctx;
            context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            context.fillRect(x, y, width, height);
        } 
    },
    computed: {
        clrmap: function() {
            return clrmap_ary[this.clrindex];
        },
    },
    mounted: function() {
        this.ctx = this.$el.getContext("2d");
        console.log(this.$el)
        this.draw();
    },
    watch: {
        clrindex: function() {
            this.draw();
        }
    }
}
</script>

