export interface LayerInterface {
  name: string;
  show: boolean;
  opacity: number;
  minmax: [number, number] | undefined;
}
