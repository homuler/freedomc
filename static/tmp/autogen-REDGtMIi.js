var timeBar = d3.select("#score-bar")
                .append("div")
                .attr("class", "score-bar");

timeBar.selectAll("div")
       .data([10])
       .enter()
       .append("div")
       .style("width", function(d) { return d*10 * "px" })
       .text(function(d) { return d; });
var timeBar = d3.select("#time-bar")
                .append("div")
                .attr("class", "time-bar");

timeBar.selectAll("div")
       .data([10])
       .enter()
       .append("div")
       .style("width", function(d) { return d*10 * "px" })
       .text(function(d) { return d; });
var fc = fc || {};
fc.graphics = fc.graphics || {};
console.log("graphics");

(function(ns){
    ns.speedGauge = function(container, configuration) {
       var that = {};
       var config = {
           size                        : 200,
           clipWidth                    : 200,
           clipHeight                    : 110,
           ringInset                    : 20,
           ringWidth                    : 20,

           pointerWidth                : 10,
           pointerTailLength            : 5,
           pointerHeadLengthPercent    : 0.9,

           minValue                    : 0,
           maxValue                    : 10,

           minAngle                    : -120,
           maxAngle                    : 120,

           transitionMs                : 750,

           majorTicks                    : 5,
           labelFormat                    : d3.format(',g'),
           labelInset                    : 10,

           arcColorFn                    : d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
      };
      var range = undefined;
      var r = undefined;
      var pointerHeadLength = undefined;
      var value = 0;

      var svg = undefined;
      var arc = undefined;
      var scale = undefined;
      var ticks = undefined;
      var tickData = undefined;
      var pointer = undefined;

      var donut = d3.layout.pie();

      function deg2rad(deg) {
          return deg * Math.PI / 180;
      }

      function newAngle(d) {
          var ratio = scale(d);
          var newAngle = config.minAngle + (ratio * range);
          return newAngle;
      }

      function configure(configuration) {
          var prop = undefined;
          for ( prop in configuration ) {
              config[prop] = configuration[prop];
          }

          range = config.maxAngle - config.minAngle;
          r = config.size / 2;
          pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

          // a linear scale that maps domain values to a percent from 0..1
          scale = d3.scale.linear()
              .range([0,1])
              .domain([config.minValue, config.maxValue]);

          ticks = scale.ticks(config.majorTicks);
          tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});

          arc = d3.svg.arc()
              .innerRadius(r - config.ringWidth - config.ringInset)
              .outerRadius(r - config.ringInset)
              .startAngle(function(d, i) {
                  var ratio = d * i;
                  return deg2rad(config.minAngle + (ratio * range));
              })
              .endAngle(function(d, i) {
                  var ratio = d * (i+1);
                  return deg2rad(config.minAngle + (ratio * range));
              });
      }
      that.configure = configure;

      function centerTranslation() {
          return 'translate('+r +','+ r +')';
      }

      function isRendered() {
          return (svg !== undefined);
      }
      that.isRendered = isRendered;

      function render(newValue) {
          svg = d3.select(container)
              .append('svg:svg')
                  .attr('class', 'gauge')
                  .attr('width', config.clipWidth)
                  .attr('height', config.clipHeight);

          var centerTx = centerTranslation();

          var arcs = svg.append('g')
                  .attr('class', 'arc')
                  .attr('transform', centerTx);

          arcs.selectAll('path')
                  .data(tickData)
              .enter().append('path')
                  .attr('fill', function(d, i) {
                      return config.arcColorFn(d * i);
                  })
                  .attr('d', arc);

          var lg = svg.append('g')
                  .attr('class', 'label')
                  .attr('transform', centerTx);
          lg.selectAll('text')
                  .data(ticks)
              .enter().append('text')
                  .attr('transform', function(d) {
                      var ratio = scale(d);
                      var newAngle = config.minAngle + (ratio * range);
                      return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
                  })
                  .text(config.labelFormat);

          var lineData = [ [config.pointerWidth / 2, 0], 
                          [0, -pointerHeadLength],
                          [-(config.pointerWidth / 2), 0],
                          [0, config.pointerTailLength],
                          [config.pointerWidth / 2, 0] ];
          var pointerLine = d3.svg.line().interpolate('monotone');
          var pg = svg.append('g').data([lineData])
                  .attr('class', 'pointer')
                  .attr('transform', centerTx);

          pointer = pg.append('path')
              .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
              .attr('transform', 'rotate(' +config.minAngle +')');

          update(newValue === undefined ? 0 : newValue);
      }
      that.render = render;

      function update(newValue, newConfiguration) {
          if ( newConfiguration  !== undefined) {
              configure(newConfiguration);
          }
          var ratio = scale(newValue);
          var newAngle = config.minAngle + (ratio * range);
          pointer.transition()
              .duration(config.transitionMs)
              .ease('elastic')
              .attr('transform', 'rotate(' +newAngle +')');
      }
      that.update = update;

      configure(configuration);

      return that;
    };
})(fc.graphics);

//function onDocumentReady() {
//    var powerGauge = fc.graphics.speedGauge('#container-speed', {
 //       size: 200,
//        clipWidth: 200,
 //       clipHeight: 200,
//        ringWidth: 60,
//        maxValue: 10,
//        transitionMs: 4000,
//    });
//    powerGauge.render();

//    function updateReadings() {
        // just pump in random data here...
//        powerGauge.update(Math.random() * 10);
//    }

    // every few seconds update reading values
//    updateReadings();
//    setInterval(function() {
//        updateReadings();
//    }, 5 * 1000);
//}
var fc = fc || {};
fc.graphics = fc.graphics || {};
fc.graphics.scoreSpec = fc.graphics.scoreSpec || {};

(function(ns){
    ns.data = [
        {
            value: 800000,
            color:"#F7464A",
            highlight: "#FF5A5E",
            label: "Correct"
        },
        {
            value: 800000,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Combo"
        },
        {
            value: 800000,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Speed"
        },
        {
            value: 800000,
            color: "#949FB1",
            highlight: "#A8B3C5",
            label: "Bonus"
        },
        {
            value: 800000,
            color: "#4D5360",
            highlight: "#616774",
            label: "Miss"
        }

    ];
    ns.options = {
        //Boolean - Show a backdrop to the scale label
        scaleShowLabelBackdrop : true,

        //String - The colour of the label backdrop
        scaleBackdropColor : "rgba(255,255,255,0.75)",

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero : true,

        //Number - The backdrop padding above & below the label in pixels
        scaleBackdropPaddingY : 2,

        //Number - The backdrop padding to the side of the label in pixels
        scaleBackdropPaddingX : 2,

        //Boolean - Show line for each value in the scale
        scaleShowLine : true,

        //Boolean - Stroke a line around each segment in the chart
        segmentShowStroke : true,

        //String - The colour of the stroke on each segement.
        segmentStrokeColor : "#fff",

        //Number - The width of the stroke value in pixels
        segmentStrokeWidth : 2,

        //Number - Amount of animation steps
        animationSteps : 100,

        //String - Animation easing effect.
        animationEasing : "easeOutBounce",

        //Boolean - Whether to animate the rotation of the chart
        animateRotate : true,

        //Boolean - Whether to animate scaling the chart from the centre
        animateScale : false,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

    };
})(fc.graphics.scoreSpec);
var fc = fc || {};
fc.graphics = fc.graphics || {};
fc.graphics.speedGraph = fc.graphics.speedGraph || {};

(function(ns){
    ns.data = {
        labels: ["", "0:00"],
        datasets: [
            {
                label: "Speed Graph",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [0, 0]
            },
        ]
    };


    ns.options = {

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };
})(fc.graphics.speedGraph);
var fc = fc || {};
fc.graphics = fc.graphics || {};
fc.graphics.scoreGraph = fc.graphics.scoreGraph || {};

(function(ns){
    ns.data = {
        labels: ["", "0:00"],
        datasets: [
            {
                label: "Speed Graph",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [0, 0]
            }
        ]
    };

    ns.options = {

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    };
})(fc.graphics.scoreGraph);var fc = fc || {};
fc.typing = fc.typing || {};
fc.typing.status = fc.typing.status || {};
fc.typing.events = fc.typing.events || {};

fc.typing.events.postRecord = function(){
    var playInfo = fc.typing.status.playInfo;
    $('<form/>', { action: 'http://localhost:3000/freedomc/typing/game', method: 'post'})
    .append($('<input/>', {type: 'hidden', name: 'score-sum-val', value: playInfo.scoreFuncs.getScoreSum()})
    .appendTo(document.body)
    .submit();
};

window.onload = function(){
    $("div.navbar-fixed-top").autoHidingNavbar(
        {showOnUpscroll: true,
         showOnButton: true,
         animationDuration: 200}
    );
    console.log("onload event");
    var gameInfo = fc.typing.status.gameInfo,
        playInfo = fc.typing.status.playInfo;
    gameInfo.problemData = {"lyricSrc":"static/music/daydreamCafe/lyric.txt","musician":"Petit Rabbit's","musicSrc":"/static/music/daydreamCafe/gochiusa.m4v","format":"Video","title":"Daydream cafe","problems":[{"display":"こころぴょんぴょん待ち？","startTime":0.611,"endTime":2.741,"problem":"こころぴょんぴょんまち"},{"display":"考えるふりして　もうちょっと近づいちゃえ","startTime":2.741,"endTime":7.733,"problem":"かんがえるふりしてもうちょっとちかづいちゃえ"},{"display":"簡単には教えないっ","startTime":7.733,"endTime":10.559,"problem":"かんたんにはおしえないっ"},{"display":"こんなに好きなことは内緒なの","startTime":10.559,"endTime":14.179,"problem":"こんなにすきなことはないしょなの"},{"display":"ふわふわどきどき内緒ですよ","startTime":14.179,"endTime":17.207,"problem":"ふわふわどきどきないしょですよ"},{"display":"はじめがかんじん　つーんだつーんだ","startTime":17.207,"endTime":20.427,"problem":"はじめがかんじんつーんだつーんだ"},{"display":"ふわふわどきどき内緒だって","startTime":20.427,"endTime":23.623,"problem":"ふわふわどきどきないしょだって"},{"display":"いたずら笑顔でぴょんぴょん","startTime":23.623,"endTime":26.394,"problem":"いたずらえがおでぴょんぴょん"},{"display":"扉開けたとたん　見知らぬ世界へと","startTime":26.394,"endTime":30.187,"problem":"とびらあけたとたんみしらぬせかいへと"},{"display":"（そんなのないよ）　ありえない","startTime":30.187,"endTime":32.801,"problem":"そんなのないよありえない"},{"display":"それがありえるかも　ミルク色の異次元","startTime":32.801,"endTime":36.617,"problem":"それがありえるかもミルクいろのいじげん"},{"display":"（コーヒーカップ）　覗いたら","startTime":36.617,"endTime":39.382,"problem":"コーヒーカップのぞいたら"},{"display":"私が　私を　見つめてました","startTime":39.782,"endTime":43.217,"problem":"わたしがわたしをみつめてました"},{"display":"なんで？　なんで？　ふたりいる？　（うそ！）","startTime":43.217,"endTime":46.001,"problem":"なんでなんでふたりいるうそ"},{"display":"困りますね　（きっと）　おんなじ趣味　（だから）","startTime":46.001,"endTime":49.044,"problem":"こまりますねきっとおんなじしゅみだから"},{"display":"誰を　（見つめるの？君でしょ！）","startTime":49.044,"endTime":51.187,"problem":"だれをみつめるのきみでしょ"},{"display":"君だけ見てるよ","startTime":51.187,"endTime":52.473,"problem":"きみだけみてるよ"},{"display":"（これは夢　カップの夢　飲みほして　おしまい？）","startTime":52.473,"endTime":58.197,"problem":"これはゆめカップのゆめのみほしておしまい"},{"display":"いつもぴょんぴょん可能！","startTime":58.484,"endTime":60.383,"problem":"いつもぴょんぴょんかのう"},{"display":"楽しさ求めて　もうちょっとはじけちゃえ　（ぴょんぴょんと）","startTime":60.383,"endTime":65.369,"problem":"たのしさもとめてもうちょっとはじけちゃえぴょんぴょんと"},{"display":"一緒なら素敵だーい！","startTime":65.369,"endTime":68.129,"problem":"いっしょならすてきだーい"},{"display":"君に言わせたいから　（言いなさいっ）","startTime":68.129,"endTime":71.151,"problem":"きみにいわせたいからいいなさいっ"},{"display":"こころぴょんぴょん待ち？","startTime":71.151,"endTime":73.179,"problem":"こころぴょんぴょんまち"},{"display":"考えるふりして　もうちょっと近づいちゃえ　（ぴょんぴょんと）","startTime":73.179,"endTime":78.188,"problem":"かんがえるふりしてもうちょっとちかづいちゃえぴょんぴょんと"},{"display":"簡単には教えないっ","startTime":78.188,"endTime":80.939,"problem":"かんたんにはおしえないっ"},{"display":"こんなに好きなことは（好きだってことは…わわわ！）","startTime":80.939,"endTime":85.178,"problem":"こんなにすきなことはすきだってことはわわわ"},{"display":"内緒なの","startTime":85.178,"endTime":88.868,"problem":"ないしょなの"}],"genre":["Anime"],"pictureSrc":null}.problems;
    //document.onkeydown = fc.typing.events.keyDownEvent;
    $(document).on("keypress", fc.typing.events.keyPressEvent);
    $(document).on("keydown", fc.typing.events.controlWithKeys);
    playInfo.flag.loaded = true;
    gameInfo.setProblemList();
    fc.typing.events.callInterval = Math.round(fc.typing.nodes.typingSound.duration/2);
    gameInfo.difficulty = gameInfo.evalDifficulty(gameInfo.problemData);
    fc.typing.graphics.renderGraphics();
    playInfo.scoreConstants.resetValue();
    console.log("loaded");
    console.log(fc.typing.status.gameInfo);
    $("#post-btn").on("click", function(e){
      console.log("form called");
      e.preventDefault();
      fc.typing.events.postRecord();
    });
}
