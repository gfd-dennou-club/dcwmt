export interface LayerInterface {
  // レイヤーの名前
  name: string;
  // 固定する次元の軸
  fixed: string; 
  // レイヤーの表示, 非表示
  show: boolean;
  // レイヤーの透明度
  opacity: number;
  // レイヤーに描画された数値シミュレーションデータの最大値, 最小値
  minmax: [number, number] | undefined;
  // カラートーン図のトーン番号（カラートーン図を用いる場合のみ使用）
  colorIndex: number;
  // コンター図の等値線の間隔（コンター図を用いる場合のみ使用）
  thresholdInterval: number;
  // ベクトル図のベクトル間隔（ベクトル図を用いる場合のみ使用）
  vectorInterval: { x: number; y: number };
}
