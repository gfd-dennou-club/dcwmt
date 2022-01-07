// object name:     DEFINE
// role:            数値データタイル生成時に動的に作成されるファイル 
//                  数値データタイルの不変な情報が記されている
// propaty:         scale: {x: Array, y: Array}         ->      地図の縦横の解散領域が記されている
//                  root_of_dir: String                 ->      タイルが格納されている一番上のディレクトリ名
//                  physical_quantity_of_dir:           ->      物理量ディレクトリ名(トーン図やコンター図, ベクトル図など)
//                  {
//                              scalar: Array           ->      トーン図やコンター図のディレクトリ名
//                              vector: Array           ->      ベクトル図のディレクトリ名
//                  }
//                  time_of_dir: Array                  ->      時間のディレクトリ名
//                  z_axios_of_dir: Array               ->      z軸のディレクトリ名
//                  tile_size: {x: Number, y: Number}   ->      データタイルの縦横の解像度
//                  max_zoom: Number                    ->      拡大率

// const DEFINE = {
//     scale:                      {x: [0.18200], y: [0.18200]},
//     root_of_dir:                "../tile",
//     physical_quantity_of_dir:   {
//         scalar: ["PT"],
//         vector: [],
//     },
//     time_of_dir:                ["t=14.5"],
//     z_axios_of_dir:             ["h=6000m"],
//     tile_size:                  {x: 240, y: 240},
//     max_zoom:                   4,
// };

const DEFINE = {
	ROOT: "../tile",
	COUNTER: [
		{
			NAME: "Ps",
			FIXED: ["time=32112"],
			SIZE: {X: 256, Y: 256},
			MAXIMUMLEVEL: 2
		},
	],
	VECTOR: [
		{
			NAME: ["VelX", "VelY"],
			FIXED: ["1.4002e+06/z=47200"],
			SIZE: {X: 320, Y: 320},
			MAXIMUMLEVEL: 1,
		},
	],
};