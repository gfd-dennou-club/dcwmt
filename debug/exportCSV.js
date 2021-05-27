////////////////////////////////////////////////////////////////////////////////////////////////////
// このスクリプトは HTML5 の getImageData() の値がブラウザやデバイスによって異なることを示すために使用するものです.
// システムの本質には関係がありません.
////////////////////////////////////////////////////////////////////////////////////////////////////


// @method: exprotRgbCSV(record: Array): Void
// 画像中のRGBそれぞれの値をCSV形式で出力を行う関数です. この関数を該当の箇所に記述してください.
// cxt.getImageData で取得した各画素のRGB値を引数として与えてください. 
const exportRgbCSV = record => {
  const rgba = sliceByNumber(record, 4);
  const RED = 0, GREEN = 1, BLUE = 2;
  [RED, GREEN, BLUE].forEach(color => exportCSV(rgba, color))
}

const exportPnmFromRgb = (record, width, height) => {
  const rgba = sliceByNumber(record, 4);
  const rgb = rgba.map(value => new Uint8Array([value[0], value[1], value[2]]))
  let text = `P3\r\n${width} ${height}\r\n255\r\n`;
  text += rgb.map( value => value.join(' ')).join('\r\n');
  const blob = new Blob([text], {type: "text/ppm"});
  let link = document.createElement('a');
  const csvName = useOS() + '-' + useBlowser() + '.ppm';
  
  if (window.navigator.msSaveOrOpenBlob) {    
    // for Internet Exproler
    window.navigator.msSaveOrOpenBlob(blob, file_name);
  } else if (window.webkitURL && window.webkitURL.createObjectURL) {
    // for chrome (and safari)
    link.href = window.webkitURL.createObjectURL(blob);
    link.download = csvName;
    link.click();
  } else if (window.URL && window.URL.createObjectURL) {
    // for firefox
    link.href = window.URL.createObjectURL(blob);
    link.download = csvName;
    link.click();
  }
}
  
// exprotCSV(rgbaArray: Array, COLOR: Int): Void
// CSV形式でファイル出力を実際に行う関数です. exportRgbCSV関数内で呼び出されます.
const exportColorToCSV = (rgbaArray, COLOR) => {
  let rgb = rgbaArray.map(value => value[COLOR]);
  rgb = sliceByNumber(rgb, 100);
  rgb = rgb.map(value => value.join(',')).join('\r\n');
  let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, rgb], {type:"text/csv"});
  let link = document.createElement('a');
  const csvName = useOS() + '-' + useBlowser() + '-' + convertRgbFromNum(COLOR) + '.csv'; 
  
  if (window.navigator.msSaveOrOpenBlob) {    
    // for Internet Exproler
    window.navigator.msSaveOrOpenBlob(blob, file_name);
  } else if (window.webkitURL && window.webkitURL.createObjectURL) {
    // for chrome (and safari)
    link.href = window.webkitURL.createObjectURL(blob);
    link.download = csvName;
    link.click();
  } else if (window.URL && window.URL.createObjectURL) {
    // for firefox
    link.href = window.URL.createObjectURL(blob);
    link.download = csvName;
    link.click();
  }
}
  
// convertRgbFromNum(rgb: Int): String
// 0から3までの数字が与えられた際に, 該当の色の文字列を返します.
// 色が保存されている配列の添字に引数の値は従います.
const convertRgbFromNum = rgb => {
  switch(rgb){
    case 0: return 'RED';
    case 1: return 'GREEN';
    case 2: return 'BLUE';
    default:return 'NONE';
  }
}
  
// useBlowser(): String
// ユーザが使用しているブラウザーの名前を返します.
const useBlowser = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if(userAgent.indexOf('msie') != -1 
      || userAgent.indexOf('trident') != -1)    { return 'IE';      }
  else if(userAgent.indexOf('edge') != -1)      { return 'Edge';    }
  else if(userAgent.indexOf('chrome') != -1)    { return 'Chrome';  }
  else if(userAgent.indexOf('safari') != -1)    { return 'Safari';  }
  else if(userAgent.indexOf('firefox') != -1)   { return 'FireFox'; } 
  else if(userAgent.indexOf('opera') != -1)     { return 'Opera';   } 
  else                                          { return 'ElseBlowser';    }
}
  
// useOS(): String
// ユーザが使用しているOSの名前を返します.
const useOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if(userAgent.indexOf("windows nt") !== -1)    { return 'Windows'; }
  else if(userAgent.indexOf("android") !== -1)  { return 'Android'; }
  else if(userAgent.indexOf("iphone") !== -1 
            || userAgent.indexOf("ipad") !== -1){ return 'iOS';     }
  else if(userAgent.indexOf("mac os x") !== -1) { return 'Mac';     }
  else                                          { return 'ElseOS';  }
}
  
// sliceByNumber(array: Array, number: Int): Array
// 引数で与えられたnumberの値ごとに配列arrayの次元を増やします.
const sliceByNumber = (array, number) => {
  const length = Math.ceil(array.length / number);
  return new Array(length).fill().map((_, i) =>
    array.slice(i * number, (i + 1) * number)
  );
}