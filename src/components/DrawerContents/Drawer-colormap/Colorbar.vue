<template>
  <canvas :width="width" :height="height"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import { clrmap } from './colormap_lib';
import type { ClrmapType } from './colormap_lib';

export default Vue.extend({
  props: {
    width: Number,
    height: Number,
    clrindex: Number,
  },
  methods: {
    draw: function () {
      if (!this.width || !this.height) {
        throw new Error('width/height of colorbar is undefined');
      }

      // prepare a canvas dom for getting a context in each drawing methods,
      const canvas = this.$el as HTMLCanvasElement;

      // draw a triangle on the left.
      this._drawTriangle(canvas, this.clrmap[0], this.width, this.height, true);

      // draw rectangles colored following colormap.
      const rect_width =
        (this.width - Math.sqrt(3) * this.height) / this.clrmap.length;
      let rect_xpos = (Math.sqrt(3) * this.height) / 2;
      for (let i = 0; i < this.clrmap.length; i++) {
        this._drawRect(
          canvas,
          this.clrmap[i],
          rect_xpos,
          0,
          rect_width,
          this.height
        );
        rect_xpos += rect_width;
      }

      // draw a triangle on the right.
      this._drawTriangle(
        canvas,
        this.clrmap[this.clrmap.length - 1],
        this.width,
        this.height,
        false
      );
    },

    _drawTriangle: function (
      canvas: HTMLCanvasElement,
      color: ClrmapType,
      width: number,
      height: number,
      isLeft: boolean
    ) {
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

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
    },
    _drawRect: function (
      canvas: HTMLCanvasElement,
      color: ClrmapType,
      x: number,
      y: number,
      width: number,
      height: number
    ) {
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      context.fillRect(x, y, width, height);
    },
  },

  computed: {
    clrmap: function (): ClrmapType[] {
      return clrmap[this.clrindex];
    },
  },

  mounted: function () {
    this.draw();
  },

  watch: {
    clrindex: function () {
      this.draw();
    },
  },
});
</script>
