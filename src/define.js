const DEFINE = {
	ROOT: "../../tile",
	TONE: [
		{
			NAME: "Ps",
			FIXED: ["time=32112"],
			SIZE: {X: 256, Y: 256},
			MAXIMUMLEVEL: 2
		},
		// {
		// 	NAME: "Temp",
		// 	FIXED: ["time=32112"],
		// 	SIZE: {X: 256, Y: 256},
		// 	MAXIMUMLEVEL: 2
		// },
		// {
		// 	NAME: "SLP",
		// 	FIXED: ["time=32112"],
		// 	SIZE: {X: 256, Y: 256},
		// 	MAXIMUMLEVEL: 2
		// },
		// {
		// 	NAME: "PRCP",
		// 	FIXED: ["time=32112"],
		// 	SIZE: {X: 256, Y: 256},
		// 	MAXIMUMLEVEL: 2
		// },
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

export default DEFINE;
