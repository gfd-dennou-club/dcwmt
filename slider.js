$(function() {
  $( "#slider_h" ).slider({
    value:0,
    min:0,
    max:dir_dim.length-1,
    step:1,
    range:"min",
    change: function (e, ui) {
      layergroup.getActiveLayer().activeD = ui.value;
      layergroup.getActiveLayer().switchLayer("d",0);

      layergroup.getActiveLayer().redraw();

      drawText(layergroup.getActiveLayer());

    }
  });
});

$(function() {
  $( "#slider_t" ).slider({
    value:0,
    min:0,
    max:dir_time.length-1,
    step:1,
    range:"min",
    change: function (e, ui) {
      layergroup.getActiveLayer().activeT = ui.value;
      layergroup.getActiveLayer().switchLayer("t",0);
      layergroup.getActiveLayer().redraw();
      drawText(layergroup.getActiveLayer());

    }
  });
});
