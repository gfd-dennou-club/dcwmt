import { map, Map, CRS } from 'leaflet';

export type ReturnedTypeInCartesian = Map;

export const viewerCartesian = (
  mapEl: HTMLDivElement,
  zoomNativeLevel: { min: number; max: number },
  zoom: number,
  center: [number, number]
): Map =>
  map(mapEl, {
    preferCanvas: true, // Canvasレンダラーを選択
    center: center,
    crs: CRS.Simple,
    maxZoom: zoomNativeLevel.max,
    minZoom: zoomNativeLevel.min,
    zoom: zoom
  });
