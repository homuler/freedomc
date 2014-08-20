var timeBar=d3.select("#score-bar").append("div").attr("class","score-bar");timeBar.selectAll("div").data([10]).enter().append("div").style("width",function(d){return d*10*"px"}).text(function(d){return d});var timeBar=d3.select("#time-bar").append("div").attr("class","time-bar");timeBar.selectAll("div").data([10]).enter().append("div").style("width",function(d){return d*10*"px"}).text(function(d){return d});var fc=fc||{};fc.graphics=fc.graphics||{};(function(ns){ns.speedGauge=function(container,configuration){var that={},config={size:200,clipWidth:200,clipHeight:110,ringInset:20,ringWidth:20,pointerWidth:10,pointerTailLength:5,pointerHeadLengthPercent:0.9,minValue:0,maxValue:10,minAngle:-120,maxAngle:120,transitionMs:750,majorTicks:5,labelFormat:d3.format(',g'),labelInset:10,arcColorFn:d3.interpolateHsl(d3.rgb('#e8e2ca'),d3.rgb('#3e6c0a'))},range=undefined,r=undefined,pointerHeadLength=undefined,value=0,svg=undefined,arc=undefined,scale=undefined,ticks=undefined,tickData=undefined,pointer=undefined,donut=d3.layout.pie()
function deg2rad(deg){return deg*Math.PI/180}
function newAngle(d){var ratio=scale(d),newAngle=config.minAngle+(ratio*range);return newAngle}
function configure(configuration){var prop=undefined;for(prop in configuration)config[prop]=configuration[prop];range=config.maxAngle-config.minAngle;r=config.size/2;pointerHeadLength=Math.round(r*config.pointerHeadLengthPercent);scale=d3.scale.linear().range([0,1]).domain([config.minValue,config.maxValue]);ticks=scale.ticks(config.majorTicks);tickData=d3.range(config.majorTicks).map(function(){return 1/config.majorTicks});arc=d3.svg.arc().innerRadius(r-config.ringWidth-config.ringInset).outerRadius(r-config.ringInset).startAngle(function(d,i){var ratio=d*i;return deg2rad(config.minAngle+(ratio*range))}).endAngle(function(d,i){var ratio=d*(i+1);return deg2rad(config.minAngle+(ratio*range))})};that.configure=configure
function centerTranslation(){return 'translate('+r+','+r+')'}
function isRendered(){return(svg!==undefined)};that.isRendered=isRendered
function render(newValue){svg=d3.select(container).append('svg:svg').attr('class','gauge').attr('width',config.clipWidth).attr('height',config.clipHeight);var centerTx=centerTranslation(),arcs=svg.append('g').attr('class','arc').attr('transform',centerTx);arcs.selectAll('path').data(tickData).enter().append('path').attr('fill',function(d,i){return config.arcColorFn(d*i)}).attr('d',arc);var lg=svg.append('g').attr('class','label').attr('transform',centerTx);lg.selectAll('text').data(ticks).enter().append('text').attr('transform',function(d){var ratio=scale(d),newAngle=config.minAngle+(ratio*range);return 'rotate('+newAngle+') translate(0,'+(config.labelInset-r)+')'}).text(config.labelFormat);var lineData=[[config.pointerWidth/2,0],[0,-pointerHeadLength],[-(config.pointerWidth/2),0],[0,config.pointerTailLength],[config.pointerWidth/2,0]],pointerLine=d3.svg.line().interpolate('monotone'),pg=svg.append('g').data([lineData]).attr('class','pointer').attr('transform',centerTx);pointer=pg.append('path').attr('d',pointerLine).attr('transform','rotate('+config.minAngle+')');update(newValue===undefined?0:newValue)};that.render=render
function update(newValue,newConfiguration){if(newConfiguration!==undefined)configure(newConfiguration);var ratio=scale(newValue),newAngle=config.minAngle+(ratio*range);pointer.transition().duration(config.transitionMs).ease('elastic').attr('transform','rotate('+newAngle+')')};that.update=update;configure(configuration);return that}})(fc.graphics);var fc=fc||{};fc.graphics=fc.graphics||{};fc.graphics.scoreSpec=fc.graphics.scoreSpec||{};(function(ns){ns.data=[{value:800000,color:"#F7464A",highlight:"#FF5A5E",label:"Correct"},{value:800000,color:"#46BFBD",highlight:"#5AD3D1",label:"Combo"},{value:800000,color:"#FDB45C",highlight:"#FFC870",label:"Speed"},{value:800000,color:"#949FB1",highlight:"#A8B3C5",label:"Bonus"},{value:800000,color:"#4D5360",highlight:"#616774",label:"Miss"}];ns.options={scaleShowLabelBackdrop:true,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBeginAtZero:true,scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,scaleShowLine:true,segmentShowStroke:true,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:true,animateScale:false,legendTemplate:"<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"}})(fc.graphics.scoreSpec);var fc=fc||{};fc.graphics=fc.graphics||{};fc.graphics.speedGraph=fc.graphics.speedGraph||{};(function(ns){ns.data={labels:["","0:00"],datasets:[{label:"Score Graph",fillColor:"rgba(220,220,220,0.2)",strokeColor:"rgba(220,220,220,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(220,220,220,1)",data:[0,0]},]};ns.options={scaleShowGridLines:true,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:true,bezierCurveTension:0.4,pointDot:true,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:true,datasetStrokeWidth:2,datasetFill:true,legendTemplate:"<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"}})(fc.graphics.speedGraph);var fc=fc||{};fc.graphics=fc.graphics||{};fc.graphics.scoreGraph=fc.graphics.scoreGraph||{};(function(ns){ns.data={labels:["","0:00"],datasets:[{label:"Speed Graph",fillColor:"rgba(220,220,220,0.2)",strokeColor:"rgba(220,220,220,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(220,220,220,1)",data:[0,0]}]};ns.options={scaleShowGridLines:true,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:true,bezierCurveTension:0.4,pointDot:true,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:true,datasetStrokeWidth:2,datasetFill:true,legendTemplate:"<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"}})(fc.graphics.scoreGraph);var fc=fc||{};fc.typing=fc.typing||{};fc.typing.status=fc.typing.status||{};window.onload=function(){$("div.navbar-fixed-top").autoHidingNavbar({showOnUpscroll:true,showOnButton:true,animationDuration:200});var options={url:('http://localhost:3000/freedomc/typing/config/37'),dataType:'json',success:function(json){console.log(json);fc.typing.problemData=json.problems;fc.typing.init();document.onkeydown=fc.typing.events.keyDownEvent;fc.typing.status.loaded=true;console.log("loaded")}};console.log("onload event");fc.typing.problemData={"lyricSrc":"static/music/oathSign/oath_sign_small.txt","musician":"LiSA","musicSrc":"/static/music/oathSign/oath_sign_op.m4v","format":"Video","title":"oath sign","problems":[{"display":"繰り返す世界 何度手を伸ばしたら","startTime":14.256,"endTime":20.279,"problem":"くりかえすせかいなんどてをのばしたら"},{"display":"儚い涙は黒い心溶かすの？","startTime":20.279,"endTime":26.504,"problem":"はかないなみだはくろいこころとかすの"},{"display":"芽生え出した思いが胸に響いたなら","startTime":26.885,"endTime":32.772,"problem":"めばえだしたおもいがむねにひびいたなら"},{"display":"君の隣でずっと変わらず護るだろう","startTime":33.128,"endTime":39.202,"problem":"きみのとなりでずっとかわらずまもるだろう"},{"display":"墮ちた希望を拾って明日に繋いでゆけば","startTime":39.972,"endTime":45.866,"problem":"おちたきぼうをひろってあすにつないでゆけば"},{"display":"絡まった歪な願いだってほどける","startTime":46.182,"endTime":53.252,"problem":"からまったいびつなねがいだってほどける"},{"display":"光をかざして躊躇いを消した","startTime":53.674,"endTime":56.563,"problem":"ひかりをかざしてためらいをけした"},{"display":"あげたかったのは未来で","startTime":56.901,"endTime":59.763,"problem":"あげたかったのはみらいで"},{"display":"泣いてる夜抱いたまま嘆きを叫んで","startTime":60.112,"endTime":65.962,"problem":"ないてるよるだいたままなげきをさけんで"},{"display":"踏み入れた足を遠くの理想が","startTime":66.325,"endTime":69.102,"problem":"ふみいれたあしをとおくのりそうが"},{"display":"そっと癒してゆく","startTime":69.496,"endTime":71.094,"problem":"そっといやしてゆく"},{"display":"確かな","startTime":71.468,"endTime":72.613,"problem":"たしかな"},{"display":"絆を強く握り進もうどこまでも","startTime":72.613,"endTime":81.748,"problem":"きずなをつよくにぎりすすもうどこまでも"},{"display":"穢れきった奇跡を背に","startTime":82.155,"endTime":87.733,"problem":"けがれきったきせきをせに"}],"genre":["Anime"],"pictureSrc":null}.problems;for(var i=0;problemData[i];i++)problemData[i].problemList=ns.typing.getRawProblem(problemData[i].display);fc.typing.init();document.onkeydown=fc.typing.events.keyDownEvent;fc.typing.status.loaded=true;console.log("loaded")}