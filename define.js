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
	root_of_dir: "../tile",
	time_of_dir: "time=32125",
	physical_quantity_of_dir: {
		scalar: ["PRCP", ],
		vector: [],
	},
	tile_size: {x: 384,y: 192},
	max_zoom:  2,
	DimentionInfo: [
		{
			name: "lon",
			length: 1536,
			stride: -0.2344,
			start_value: 0.000000,
			end_value: 359.765600,
		},
		{
			name: "lat",
			length: 768,
			stride: -0.23226,
			start_value: -89.920710,
			end_value: 89.820710,
		},
		{
			name: "level",
			length: 0,
			stride: 0.000000,
			start_value: 0.000000,
			end_value: 0.000000,
		},
		{
			name: "time",
			length: 1,
			stride: 0.000000,
			start_value: 32125.000000,
			end_value: 32125.000000,
		},
	],
};