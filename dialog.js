$(function(){
    $('.dropdwn li').hover(function(){
        $("ul:not(:animated)", this).slideDown();
    }, function(){
        $("ul.dropdwn_menu",this).slideUp();
    });
});

$(function() {
		$("#div1").dialog({
      autoOpen:false, //呼ばれ妻で非表示
			modal:true, //モーダル表示
			title:"テストダイアログ1", //タイトル
			buttons: { //ボタン
			  "決定": function() {
				    $(this).dialog("close");
				},
        "キャンセル": function() {
				    $(this).dialog("close");
				}
			}
		});

    $("#link01").click(function() {
		    $("#div1").dialog("open");
	  });
});
$(function() {
	$("#link02").click(function() {
		$("#div2").dialog({
			modal:true, //モーダル表示
      width:300,
      height:300,
			title:"tone range", //タイトル
			buttons: { //ボタン
			"決定": function() {
				$(this).dialog("close");
        updateClrmapRange_New(layergroup.getActiveLayer(), Number($("#toneRangeMax").val()), Number($("#toneRangeMin").val()));
        layergroup.getActiveLayer().redraw();
        drawText(layergroup.getActiveLayer());
				},
			"キャンセル": function() {
				$(this).dialog("close");
				}
			}
		});
	});
});
$(function() {
  //不透明度変更
    $("#dlg_set_opacity").dialog({
      autoOpen:false, //呼ばれ妻で非表示
      modal:true, //モーダル表示
      title:"カラーマップ変更", //タイトル
      buttons: { //ボタン
         "決定": function() {
              layergroup.getActiveLayer().options.opacity = $("#opacity").val(); //要注意 アクセス権限ガバガバ　setter使え
              layergroup.getActiveLayer().redraw();
              drawText( layergroup.getActiveLayer() );
             $(this).dialog("close");
         },
          "キャンセル": function() {
             $(this).dialog("close");
         }
       }
    });
    $("#lnk_set_opacity").click(function() {
		    $("#dlg_set_opacity").dialog("open");
	  });
　//カラーマップ変更
		$("#dlg_ch_clrmap").dialog({
      autoOpen:false, //呼ばれ妻で非表示
			modal:true, //モーダル表示
			title:"カラーマップ変更", //タイトル
			buttons: { //ボタン
			  "決定": function() {
            let obj = document.getElementById("select_clrmap");
            layergroup.getActiveLayer()._colormap = eval( "clrmap_"+obj.value );
            layergroup.getActiveLayer().redraw();
            drawText( layergroup.getActiveLayer() );
				    $(this).dialog("close");
				},
        "キャンセル": function() {
				    $(this).dialog("close");
				}
			}
		});
    $("#lnk_ch_clrmap").click(function() {
		    $("#dlg_ch_clrmap").dialog("open");
	  });
　//断面変更
    $("#dlg_ch_cross_sect").dialog({
      autoOpen:false, //呼ばれ妻で非表示
			modal:true, //モーダル表示
			title:"断面切り替え", //タイトル
			buttons: { //ボタン
			  "決定": function() {
            let obj = document.getElementById("select_cross_sect");
            //Z=0のタイル座標の生成
            let coords  = new L.Point(0, 0);
            coords.z = 0;

            for( key in baseMaps ) {
              if( baseMaps.hasOwnProperty(key) ) {
                baseMaps[key].setURL(obj.value);
                baseMaps[key].getInitRange(coords);
              }
            }
            //インスタンス変数定義
				    $(this).dialog("close");
				},
        "キャンセル": function() {
				    $(this).dialog("close");
				}
			}
		});
    $("#lnk_ch_cross_sect").click(function() {
		    $("#dlg_ch_cross_sect").dialog("open");
	  });
  //図の種類(トーン/コンター)
    $("#dlg_img_type").dialog({
      autoOpen:false, //呼ばれ妻で非表示
      modal:true, //モーダル表示
      title:"断面切り替え", //タイトル
      buttons: { //ボタン
        "決定": function() {
            layergroup.getActiveLayer().setImgType($("#check_tone").prop('checked'), $("#check_countour").prop('checked'));
            $(this).dialog("close");
        },
        "キャンセル": function() {
            $(this).dialog("close");
        }
      }
    });
    $("#lnk_img_type").click(function() {
        $("#dlg_img_type").dialog("open");
    });
  //グリッドon-off
    $("#dlg_is_grid").dialog({
      autoOpen:false, //呼ばれ妻で非表示
      modal:true, //モーダル表示
      title:"断面切り替え", //タイトル
      buttons: { //ボタン
        "決定": function() {
            layergroup.getActiveLayer().setIsGrid($("#check_is_grid").prop('checked'));
            $(this).dialog("close");
        },
        "キャンセル": function() {
            $(this).dialog("close");
        }
      }
    });
    $("#lnk_is_grid").click(function() {
        $("#dlg_is_grid").dialog("open");
    });

    $("#dlg_math").dialog({
      autoOpen:false, //呼ばれ妻で非表示
      modal:true, //モーダル表示
      title:"数学的操作", //タイトル
      buttons: { //ボタン
        "決定": function() {
          
            layergroup.getActiveLayer().setOperation( $("input[name='math']:checked").val()  );
            $(this).dialog("close");
        },
        "キャンセル": function() {
            $(this).dialog("close");
        }
      }
    });
    $("#lnk_math").click(function() {
        $("#dlg_math").dialog("open");
    });
});