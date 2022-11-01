const DEFINE = {
	// 数値データタイルセットが置かれているディレクトリのパス		
	ROOT: "./tile",	
	
	// トーン図に関する情報				
	TONE: [								
		{
			NAME: "Ps",					// 物理量の名前		
			FIXED: ["time=32112.0"],	// 固定する次元（ 名前=値 ）		
			SIZE: {X: 256, Y: 256},		// 各タイルのサイズ（ ピクセル数 ）		
			MAXIMUMLEVEL: 2,			// 拡大率		
			AXIS: {X: "lon", Y: "lat"}, // タイルの縦横の軸の名前		
		}
	],

	// 風速ベクトル図に関する情報		
	VECTOR: [
		{
			NAME: ["U", "V"],
			FIXED: ["time=32112.0/sig=0.9987513422966003"],	// 固定する次元（ 名前=値 ）		
			SIZE: {X: 256, Y: 256},		// 各タイルのサイズ（ ピクセル数 ）		
			MAXIMUMLEVEL: 2,			// 拡大率		
			AXIS: {X: "lon", Y: "lat"}, // タイルの縦横の軸の名前		
		}
	],
}
