var timeBar=d3.select("#score-bar").append("div").attr("class","score-bar");timeBar.selectAll("div").data([10]).enter().append("div").style("width",function(d){return d*10*"px"}).text(function(d){return d});var timeBar=d3.select("#time-bar").append("div").attr("class","time-bar");timeBar.selectAll("div").data([10]).enter().append("div").style("width",function(d){return d*10*"px"}).text(function(d){return d});var fc=fc||{};fc.graphics=fc.graphics||{};console.log("graphics");(function(ns){ns.speedGauge=function(container,configuration){var that={},config={size:200,clipWidth:200,clipHeight:110,ringInset:20,ringWidth:20,pointerWidth:10,pointerTailLength:5,pointerHeadLengthPercent:0.9,minValue:0,maxValue:10,minAngle:-120,maxAngle:120,transitionMs:750,majorTicks:5,labelFormat:d3.format(',g'),labelInset:10,arcColorFn:d3.interpolateHsl(d3.rgb('#e8e2ca'),d3.rgb('#3e6c0a'))},range=undefined,r=undefined,pointerHeadLength=undefined,value=0,svg=undefined,arc=undefined,scale=undefined,ticks=undefined,tickData=undefined,pointer=undefined,donut=d3.layout.pie()
function deg2rad(deg){return deg*Math.PI/180}
function newAngle(d){var ratio=scale(d),newAngle=config.minAngle+(ratio*range);return newAngle}
function configure(configuration){var prop=undefined;for(prop in configuration)config[prop]=configuration[prop];range=config.maxAngle-config.minAngle;r=config.size/2;pointerHeadLength=Math.round(r*config.pointerHeadLengthPercent);scale=d3.scale.linear().range([0,1]).domain([config.minValue,config.maxValue]);ticks=scale.ticks(config.majorTicks);tickData=d3.range(config.majorTicks).map(function(){return 1/config.majorTicks});arc=d3.svg.arc().innerRadius(r-config.ringWidth-config.ringInset).outerRadius(r-config.ringInset).startAngle(function(d,i){var ratio=d*i;return deg2rad(config.minAngle+(ratio*range))}).endAngle(function(d,i){var ratio=d*(i+1);return deg2rad(config.minAngle+(ratio*range))})};that.configure=configure
function centerTranslation(){return 'translate('+r+','+r+')'}
function isRendered(){return(svg!==undefined)};that.isRendered=isRendered
function render(newValue){svg=d3.select(container).append('svg:svg').attr('class','gauge').attr('width',config.clipWidth).attr('height',config.clipHeight);var centerTx=centerTranslation(),arcs=svg.append('g').attr('class','arc').attr('transform',centerTx);arcs.selectAll('path').data(tickData).enter().append('path').attr('fill',function(d,i){return config.arcColorFn(d*i)}).attr('d',arc);var lg=svg.append('g').attr('class','label').attr('transform',centerTx);lg.selectAll('text').data(ticks).enter().append('text').attr('transform',function(d){var ratio=scale(d),newAngle=config.minAngle+(ratio*range);return 'rotate('+newAngle+') translate(0,'+(config.labelInset-r)+')'}).text(config.labelFormat);var lineData=[[config.pointerWidth/2,0],[0,-pointerHeadLength],[-(config.pointerWidth/2),0],[0,config.pointerTailLength],[config.pointerWidth/2,0]],pointerLine=d3.svg.line().interpolate('monotone'),pg=svg.append('g').data([lineData]).attr('class','pointer').attr('transform',centerTx);pointer=pg.append('path').attr('d',pointerLine).attr('transform','rotate('+config.minAngle+')');update(newValue===undefined?0:newValue)};that.render=render
function update(newValue,newConfiguration){if(newConfiguration!==undefined)configure(newConfiguration);var ratio=scale(newValue),newAngle=config.minAngle+(ratio*range);pointer.transition().duration(config.transitionMs).ease('elastic').attr('transform','rotate('+newAngle+')')};that.update=update;configure(configuration);return that}})(fc.graphics);var fc=fc||{};fc.graphics=fc.graphics||{};fc.graphics.scoreSpec=fc.graphics.scoreSpec||{};(function(ns){ns.data=[{value:800000,color:"#F7464A",highlight:"#FF5A5E",label:"Correct"},{value:800000,color:"#46BFBD",highlight:"#5AD3D1",label:"Combo"},{value:800000,color:"#FDB45C",highlight:"#FFC870",label:"Speed"},{value:800000,color:"#949FB1",highlight:"#A8B3C5",label:"Bonus"},{value:800000,color:"#4D5360",highlight:"#616774",label:"Miss"}];ns.options={scaleShowLabelBackdrop:true,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBeginAtZero:true,scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,scaleShowLine:true,segmentShowStroke:true,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:true,animateScale:false,legendTemplate:"<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"}})(fc.graphics.scoreSpec);var fc=fc||{};fc.graphics=fc.graphics||{};fc.graphics.speedGraph=fc.graphics.speedGraph||{};(function(ns){ns.data={labels:["","0:00"],datasets:[{label:"Speed Graph",fillColor:"rgba(220,220,220,0.2)",strokeColor:"rgba(220,220,220,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(220,220,220,1)",data:[0,0]},]};ns.options={scaleShowGridLines:true,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:true,bezierCurveTension:0.4,pointDot:true,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:true,datasetStrokeWidth:2,datasetFill:true,legendTemplate:"<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"}})(fc.graphics.speedGraph);var fc=fc||{};fc.graphics=fc.graphics||{};fc.graphics.scoreGraph=fc.graphics.scoreGraph||{};(function(ns){ns.data={labels:["","0:00"],datasets:[{label:"Speed Graph",fillColor:"rgba(220,220,220,0.2)",strokeColor:"rgba(220,220,220,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(220,220,220,1)",data:[0,0]}]};ns.options={scaleShowGridLines:true,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:true,bezierCurveTension:0.4,pointDot:true,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:true,datasetStrokeWidth:2,datasetFill:true,legendTemplate:"<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"}})(fc.graphics.scoreGraph);var fc=fc||{};fc.typing=fc.typing||{};fc.typing.status=fc.typing.status||{};window.onload=function(){$("div.navbar-fixed-top").autoHidingNavbar({showOnUpscroll:true,showOnButton:true,animationDuration:200});console.log("onload event");var gameInfo=fc.typing.status.gameInfo,playInfo=fc.typing.status.playInfo;gameInfo.problemData={"lyricSrc":"static/music/カラフル/lyric.txt","musician":"ClariS","musicSrc":"/static/music/カラフル/colorful_full.mp3","format":"Sound","title":"カラフル","problems":[{"display":"いつもモノクロだった瞳の奥の","startTime":22.855,"endTime":28.254,"problem":"いつもモノクロだったひとみのおくの"},{"display":"景色捨てたら夢見つけた","startTime":28.254,"endTime":33.65,"problem":"けしきすてたらゆめみつけた"},{"display":"何もない世界で創る絆は","startTime":33.65,"endTime":39.322,"problem":"なにもないせかいでつくるきずなは"},{"display":"強い意志与えた","startTime":39.322,"endTime":44.086,"problem":"つよいいしあたえた"},{"display":"裏返した日常でまた走って行く先に","startTime":44.086,"endTime":54.226,"problem":"うらがえしたにちじょうでまたはしってゆくさきに"},{"display":"君はいた","startTime":54.226,"endTime":58.864,"problem":"きみはいた"},{"display":"触れた心は輝いた　鮮やかな色になって","startTime":60.266,"endTime":67.699,"problem":"ふれたこころはかがやいたあざやかないろになって"},{"display":"羽ばたくよ希望乗せて","startTime":67.699,"endTime":72.067,"problem":"はばたくよきぼうのせて"},{"display":"無限に広がる空の下集まった","startTime":72.067,"endTime":77.775,"problem":"むげんにひろがるそらのしたあつまった"},{"display":"願い守り進めば","startTime":77.775,"endTime":83.219,"problem":"ねがいまもりすすめば"},{"display":"まだ誰も知らない明日へと","startTime":83.219,"endTime":92.024,"problem":"まだだれもしらないあしたへと"},{"display":"引き寄せられるように覗いた瞬間","startTime":94.332,"endTime":99.682,"problem":"ひきよせられるようにのぞいたしゅんかん"},{"display":"光の糸は君包んだ","startTime":99.682,"endTime":105.088,"problem":"ひかりのいとはきみつつんだ"},{"display":"細く千切れそうな絡まった運命","startTime":105.088,"endTime":110.778,"problem":"ほそくちぎれそうなからまったうんめい"},{"display":"きっとまだ変われる","startTime":110.778,"endTime":115.473,"problem":"きっとまだかわれる"},{"display":"間違えでも信じた道は新しい景色を","startTime":115.473,"endTime":125.659,"problem":"まちがえでもしんじたみちはあたらしいけしきを"},{"display":"照らすだろう","startTime":125.659,"endTime":131.027,"problem":"てらすだろう"},{"display":"巡る時の中笑って　様々な想い持って","startTime":131.741,"endTime":139.129,"problem":"めぐるときのなかわらってさまざまなおもいもって"},{"display":"始めようまた一から","startTime":139.129,"endTime":143.496,"problem":"はじめようまたいちから"},{"display":"辿り着いた儚い奇跡壊れないように","startTime":143.496,"endTime":149.188,"problem":"たどりついたはかないきせきこわれないように"},{"display":"手を伸ばし繋げば","startTime":149.188,"endTime":154.673,"problem":"てをのばしつなげば"},{"display":"ほら君は側でいつまでも…","startTime":154.673,"endTime":162.816,"problem":"ほらきみはそばでいつまでも"},{"display":"まだ透明な私たちはどんな色にでも","startTime":163.316,"endTime":170.856,"problem":"まだとうめいなわたしたちはどんないろにでも"},{"display":"染まることが出来るから夢叶えよう","startTime":170.856,"endTime":178.726,"problem":"そまることができるからゆめかなえよう"},{"display":"走って行く先に君はいた","startTime":195.112,"endTime":204.586,"problem":"はしってゆくさきにきみはいた"},{"display":"触れた","startTime":205.908,"endTime":208.545,"problem":"ふれた"},{"display":"心は輝いた　鮮やかな色になって","startTime":208.545,"endTime":213.997,"problem":"こころはかがやいたあざやかないろになって"},{"display":"羽ばたくよ希望乗せて","startTime":213.997,"endTime":218.383,"problem":"はばたくよきぼうのせて"},{"display":"無限に広がる空の下集まった","startTime":218.383,"endTime":224.039,"problem":"むげんにひろがるそらのしたあつまった"},{"display":"願い守り行けば","startTime":224.039,"endTime":228.122,"problem":"ねがいまもりゆけば"},{"display":"君と誓ったあの日の記憶","startTime":228.122,"endTime":232.071,"problem":"きみとちかったあのひのきおく"},{"display":"今超えて過去から","startTime":232.071,"endTime":237.616,"problem":"いまこえてかこから"},{"display":"まだ誰も知らない明日へと","startTime":237.616,"endTime":245.391,"problem":"まだだれもしらないあしたへと"}],"genre":["Anime"],"pictureSrc":"/static/music/カラフル/madohomu_108.png"}.problems;document.onkeydown=fc.typing.events.keyDownEvent;playInfo.flag.loaded=true;gameInfo.setProblemList();fc.typing.graphics.renderGraphics();fc.typing.events.callInterval=Math.round(fc.typing.nodes.typingSound.duration/2);gameInfo.difficulty=gameInfo.evalDifficulty(gameInfo.problemData);playInfo.scoreConstants.resetValue();console.log("loaded");console.log(fc.typing.status.gameInfo)}