import { ProjCodes } from './components/DrawerContents/Drawer-figure/projection_lib';

const types = ['tone', 'vector', 'contour'] as const;
export type DiagramTypes = typeof types[number];

export type Variable = {
  name: string | [string, string];
  type: DiagramTypes;
  tileSize: [number, number];
  minZoom: number;
  maxZoom: number;
  fixed: Array<string>;
};

type LayerTone = {
  name: string;
  type: 'tone';
  clrindex: number;
  minmax: [number, number];
  varindex: number;
  fixedindex: number;
};

type LayerVector = {
  name: string;
  type: 'vector';
  minmax: [number, number];
  varindex: number;
  fixedindex: number;
};

type LayerContour = {
  name: string;
  type: 'contour';
  minmax: [number, number];
  varindex: number;
  fixedindex: number;
};

export type LayerTypes = LayerTone | LayerVector | LayerContour;

export type DefinedOptions = Readonly<{
  root: string;
  title: string;
  axis: [string, string];
  variables: Array<Variable>;
}>;

export type DrawingOptions = {
  zoom: number;
  center: [number, number];
  projection: ProjCodes;
  mathMethods: number;
  layers: Array<LayerTypes>;
};
