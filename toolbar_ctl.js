$(function() {
    /*アニメーションボタン(h)*/
    $( "#play_h" ).button({
      text: false,
      icons: {
        primary: "ui-icon-play"
      }
    })
    .click(function() {
      var options;
      if ( $( this ).text() === "play" ) {
        options = {
          label: "pause",
          icons: {
            primary: "ui-icon-pause"
          }

        };
        startTimer("d");
      } else {
        options = {
          label: "play",
          icons: {
            primary: "ui-icon-play"
          }
        };
        stopTimer();
      }
      $( this ).button( "option", options );
    });

    /*アニメーションボタン(t)*/
    $( "#play_t" ).button({
      text: false,
      icons: {
        primary: "ui-icon-play"
      }
    })
    .click(function() {
      var options;
      if ( $( this ).text() === "play" ) {
        options = {
          label: "pause",
          icons: {
            primary: "ui-icon-pause"
          }
        };
        startTimer("t");
      } else {
        options = {
          label: "play",
          icons: {
            primary: "ui-icon-play"
          }
        };
        stopTimer();

      }
      $( this ).button( "option", options );
    });



});
