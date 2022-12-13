import * as olProj from 'ol/proj';
import * as olExtent from 'ol/extent';
import { View, Map } from 'ol';
import * as proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { createXYZ } from 'ol/tilegrid';

import {
  projections,
  ProjCodes,
} from '../../../components/DrawerContents/Drawer-figure/projection_lib';

export type ReturnedTypeInProjection = Map;

export const viewerProjection = (
  mapEl: HTMLDivElement,
  projCode: ProjCodes,
  zoomNativeLevel: { min: number, max: number },
  zoom: number,
  center: [number, number]
) => {
  const getProjection = olProj.get;
  const getCenter = olExtent.getCenter;

  // Register prepared projections
  for (const projection of projections) {
    if (!projection.proj4) {
      continue;
    }
    proj4.defs(projection.title, projection.proj4);
  }
  register(proj4);

  // Get projection for using now.
  const projection = getProjection(projCode);
  if (!projection) {
    throw new Error('Passed projection is undefined title.');
  }

  // Register extent of projection.
  const purposeProj = projections.find((p) =>
    p.code.includes(projCode)
  );
  if (!purposeProj) {
    throw new Error('Passed projection is undefined title.');
  }
  const extent = projection.getExtent() || purposeProj.extent;
  projection.setExtent(extent);

  // Create TileGrid Instance
  const tileGrid = createXYZ({
    extent: projection.getExtent(),
    maxZoom: zoomNativeLevel.max,
    minZoom: zoomNativeLevel.min,
  });

  // Create Viewer Instance
  const view = new View({
    projection: projection,
    resolution: tileGrid.getResolution(
      zoom || zoomNativeLevel.min
    ),
    resolutions: tileGrid.getResolutions(),
    center: center || getCenter(projection.getExtent() || [0, 0, 0, 0]),
    multiWorld: true,
  });

  // Create Map Instance
  const map = new Map({
    target: mapEl,
    view: view,
  });

  // Set Viewer Instance to Map Instance.
  map.setView(view);

  return map;
};
