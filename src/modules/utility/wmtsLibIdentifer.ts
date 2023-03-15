const wmtsLibTypes = ['XY', '3d Sphere', 'Projections'] as const;
export type WMTSLibType = typeof wmtsLibTypes[number];

export class WmtsLibIdentifer {
  constructor(private readonly libtype: WMTSLibType) {}

  whichLib = <T, U, V>(xy: T, sphere: U, projection: V): T | U | V => {
    switch (this.libtype) {
      case 'XY':
        return xy;
      case '3d Sphere':
        return sphere;
      case 'Projections':
        return projection;
    }
  };
}
