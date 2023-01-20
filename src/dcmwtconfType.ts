import { ProjCodes } from './components/DrawerContents/Drawer-figure/projection_lib';

const types = ['tone', 'vector', 'contour'] as const;
export type DiagramTypes = typeof types[number];

export type Variable = {
  name: [string, string];
  type: DiagramTypes;
  tileSize: { x: number; y: number };
  zoomLevel: { min: number; max: number };
  minZoom: number;
  maxZoom: number;
  fixed: Array<string>;
};

type Layer = {
  name: string;
  show: boolean,
  opacity: number,
  varindex: number;
  fixedindex: number;
  minmax: [number, number] | undefined;
  id?: string, 
}

type LayerTone = Layer & {
  type: 'tone';
  clrindex: number;
};

type LayerVector = Layer & {
  type: 'vector';
  vecinterval: {
    x: number;
    y: number;
  };
};

type LayerContour = Layer & {
  type: 'contour';
  thretholdinterval: number;
};

export type LayerTypes = LayerTone | LayerVector | LayerContour;

export type DefinedOptions = Readonly<{
  root: string;
  variables: Array<Variable>;
}>;

export type DrawingOptions = {
  title: string;
  sumneil: string;
  zoom: number;
  center: [number, number];
  projCode: ProjCodes;
  mathMethods: number;
  layers: Array<LayerTypes>;
  id?: string,
};
