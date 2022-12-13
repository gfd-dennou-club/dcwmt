const wmtsLibTypes = ['Leaflet', 'Cesium', 'OpenLayers'] as const;
export type WMTSLibType = typeof wmtsLibTypes[number];

export class WmtsLibIdentifer {
  constructor(private readonly libtype: WMTSLibType) {}

  whichLib = <T, U, V>(cesium: T, leaflet: U, openlayers: V): T | U | V => {
    switch (this.libtype) {
      case 'Leaflet':
        return leaflet;
      case 'Cesium':
        return cesium;
      case 'OpenLayers':
        return openlayers;
    }
  };
}
