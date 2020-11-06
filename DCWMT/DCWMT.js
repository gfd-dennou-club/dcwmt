//  object name:    DCWMT
//  role:           システムdcwmtの主な機能の継承元
//  propaty:        Layer: {}      -> シミュレーションデータの表示に関するオブジェクト
//                  Handler: {}    -> 表示外の処理を行うオブジェクト
//                  Control: {}    -> シミュレーションデータ上に常に表示されているものに関するオブジェクト
//                  Module: {}     -> シミュレーションデータの外に存在するものに関するオブジェクト

let DCWMT = {};

DCWMT.Layer = L.GridLayer.extend({
 
});

DCWMT.Handler = L.Handler.extend({
   
});

DCWMT.Control = L.Control.extend({
   
});

DCWMT.Module = {

};

// factory関数
DCWMT.layer = {}
DCWMT.control = {}
DCWMT.handler = {}
DCWMT.module = {}
