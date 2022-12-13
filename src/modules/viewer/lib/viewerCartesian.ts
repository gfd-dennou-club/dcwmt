import { map, Map, CRS } from 'leaflet';

export type ReturnedTypeInCartesian = Map;

export const viewerCartesian = (
  mapEl: HTMLDivElement,
  zoomNativeLevel: { min: number; max: number }
): Map =>
  map(mapEl, {
    preferCanvas: true, // Canvasレンダラーを選択
    center: [0, 0],
    crs: CRS.Simple,
    maxZoom: zoomNativeLevel.max,
    minZoom: zoomNativeLevel.min,
    zoom: 0,
  });
