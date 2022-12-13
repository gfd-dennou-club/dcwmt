export type Projection = {
  title: string;
  code: string;
  extent: [number, number, number, number] | undefined;
  proj4: string | undefined;
};

export const projections: readonly Projection[] = [
  {
    title: 'メルカトル図法',
    code: 'EPSG:3857',
    extent: undefined,
    proj4: undefined,
  },
  {
    title: '正距方位図法',
    code: 'ESRI:54032',
    extent: [-21e6, -21e6, 21e6, 21e6],
    proj4:
      '+proj=aeqd +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
  },
  {
    title: 'モルワイデ図法',
    code: 'ESRI:54009',
    extent: [-18e6, -9e6, 18e6, 9e6],
    proj4:
      '+proj=aeqd +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
  },
  {
    title: 'サンソン図法',
    code: 'ESRI:54008',
    extent: [-18e6, -9e6, 18e6, 9e6],
    proj4: '+proj=sinu +lon_0=0 +x_0=0 +y_0=0 +datum=wgs84 +units=m +no_defs',
  },
  {
    title: '3次元球面への投影',
    code: '3d Sphere',
    extent: undefined,
    proj4: undefined,
  },
  {
    title: 'デカルト座標平面への投影',
    code: 'XY',
    extent: undefined,
    proj4: undefined,
  },
];

const codes = [
  'EPSG:3857',
  'ESRI:54032',
  'ESRI:54009',
  'ESRI:54008',
  '3d Sphere',
  'XY'
] as const;
export type ProjCodes = typeof codes[number];
