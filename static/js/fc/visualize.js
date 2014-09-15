var fc = fc || {};
fc.viz = fc.viz || {};
fc.viz.template = fc.viz.template || {};
fc.util = fc.util || {};

(function(ns){
    ns.preData = {};
    ns.userRecord = function(data){
        return d3.nest()
            .key(function(el){ return el.user.name; }).entries(data);
    };
    ns.renderMusicData = function(html, typingData, musicData){
        var tableData = [musicData.title];
        if(typingData && typingData.difficulty){
            tableData.push(typingData.difficulty);
            tableData.push(fc.data.maxScoresMap[typingData.difficulty]);
            tableData.push(typingData["max-type"]);
            tableData.push(typingData["problem-number"]);
        } else {
            tableData.push("Unknown");
            tableData.push("Unknown");
            tableData.push("Unknown");
            tableData.push("Unknown");
        }
        d3.text(html, function(d){
            d3.select("#music-data-table")
              .append("div")
              .attr("class", "panel-body")
              .html(d);
            d3.selectAll("#music-data-table .music-data")
              .data(tableData).html(function(p){ return p});
        });
    };
    ns.renderUserLineGraph = function(data){
        var users = d3.nest()
                      .key(function(el){ return el.user.name })
                      .entries(data);
        for(var i = 0; i < users.length; i++){
            for(var j = 0; j < users[i].values.length; j++){
                users[i].values[j].index = j+1;
            }
        }
        var userNames = users.map(function(d){ return d.key; });
        var margin = { top: 10, right: 100, bottom: 50, left: 100 };
        var width = $("#main").width() - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;
        var x = d3.scale.linear()
                  .range([width, 0]);
        var y = d3.scale.linear()
                  .range([height, 0]);
        x.domain([1, d3.max(users, function(d){
            return d.values.length;
        })]);
        y.domain([0, d3.max(users, function(d){
            return d3.max(d.values, function(el){ return el.score; });
        })]);
        var color = d3.scale.category10();
        color.domain(userNames);

        var tickValues = fibList(d3.max(users, function(d){
                             return d.values.length;
                         }));
        var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom")
                      .tickFormat(d3.format(function(d){
                          var formatter = d3.format(",d");
                          return formatter(d) + "times ago";}))
                      .tickValues(tickValues);
        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");
        var line = d3.svg.line()
                     .interpolate("linear")
                     .x(function(d, i) { return x(i+1); })
                     .y(function(d) { return y(d.score); });
        var svg = d3.select("#user-graph")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0, " + height + ")")
           .call(xAxis)
           .append("text")
           .attr("x", width)
           .attr("y", -20)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text("History");

        svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text("Score");

        var tooltip = d3.select("#music-record")
                        .append("div")
                        .style("position", "absolute")
                        .style("z-index", "10")
                        .style("visibility", "hidden")
                        .attr("class", "d3tip")
                        .text("simple tooltip");

        var dataDetails = d3.select("#music-record")
                            .append("div")
                            .style("position", "absolute")
                            .style("z-index", "10")
                            .style("visibility", "hidden")
                            .attr("class", "d3tip");

        var user = svg.selectAll(".userdata")
                      .data(users)
                      .enter()
                      .append("g")
                      .attr("class", "userdata");

        user.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.key); })
            .on("mouseover", function(d){
                return tooltip.style("visibility", "visible"); })
            .on("mousemove", function(d){
                return tooltip.style("top", (d3.event.pageY+10) + "px")
                              .style("left", (d3.event.pageX+10) + "px")
                              .html("<dl><dt>User</dt><dd>" + d.key + "</dd></dl>"
                                   + "<dl><dt>Played</dt><dd>" + d.values.length + "</dd></dl>"
                                   + "<dl><dt>Average</dt><dd>" + d3.mean(d.values, function(el){ return el.score; }) + "</dd></dl>")})
            .on("mouseout", function(d){
                return tooltip.style("visibility", "hidden"); });

        svg.selectAll(".userdatapoint")
           .data(data)
           .enter()
           .append("g")
           .attr("class", "userdatapoint")
           .append("circle")
           .attr("r", 5)
           .attr("cx", function(d){ return x(d.index); })
           .attr("cy", function(d){ return y(d.score); })
           .style("stroke", function(d) { return color(d.user.name); })
           .on("mouseover", function(d){
               return tooltip.style("visibility", "visible"); })
           .on("mousemove", function(d){
               return tooltip.style("top", (d3.event.pageY+10) + "px")
                             .style("left", (d3.event.pageX+10) + "px")
                             .html("<dl><dt>User</dt><dd>" + d.user.name + "</dd></dl><dl><dt>Score</dt><dd>" + d.score + "</dd></dt></dl>")})
           .on("mouseout", function(d){
               return tooltip.style("visibility", "hidden"); })
           .on("click", function(d){
               ns.preData = d;
               ns.renderRecordDetails(data, d.typingData); });

        function fibList(n){
            var ret = [1];
            for(var i = 1; ret[ret.length-1] < n; i++){
                var x = fc.util.fib(i);
                if(x < n){
                    ret.push(x);
                } else {
                    break;
                }
            }
            ret.push(n);
            return ret;
        }
    };
    ns.renderRecordDetails = function(totalData, typingData){
        var range = [0, 120];
        var scale = {
            score: d3.scale.linear()
                     .range(range)
                     .domain([0, 1.2*fc.data.maxScoresMap[typingData.difficulty]]),
            correct: d3.scale.linear()
                       .range(range)
                       .domain([0, 1.2*typingData["max-type"]]),
            avgSpeed: d3.scale.linear()
                        .range(range)
                        .domain([0, 600]),
            solved: d3.scale.linear()
                      .range(range)
                      .domain([0, 1.2*typingData["problem-number"]]),
            maxCombo: d3.scale.linear()
                        .range(range)
                        .domain([0, 1.2*typingData["max-type"]]),
            maxSpeed: d3.scale.linear()
                        .range(range)
                        .domain([0, 720]),
            correctRate: d3.scale.linear()
                           .range(range)
                           .domain([0, 1.2])
        };
        var radarData = [];

        var graphFilters$ = $(".graph-filter");
        var checkedValue = graphFilters$.filter(function(i, d){
            return d.checked;
        }).map(function(i, d){
            return d.value;
        });
        for(var i = 0; i < checkedValue.length; i++){
            switch (checkedValue[i]){
                case "1": radarData.push(getMaxData(totalData));
                          break;
                case "2": radarData.push(getAvgData(totalData));
                          break;
                case "3": if(ns.preData.user){
                              radarData.push(toRadarData(ns.preData, ns.preData.user.name));
                          }
                          break;
                default: break;
            }
        }
        if(radarData.length == 0){
            radarData.push(defaultRadarData());
        }
        var radarOptions = {
            w: 400,
            h: 400
        };
        fc.viz.template.RadarChart.draw("#record-details", radarData, radarOptions);
        function defaultRadarData(){
            var defaultData = {
                score: 0,
                correct: 0,
                miss: 0,
                speed: 0.0,
                solved: 0,
                "max-combo": 0,
                "max-speed": 0.0
            };
            return toRadarData(defaultData);
        }
        function toRadarData(data, className){
            var typeSum = data.correct + data.miss,
                correctRate = typeSum == 0 ? 0 : data.correct / typeSum;
            return {
                className: className,
                axes: [
                    {axis: "score", value: scale.score(data.score)},
                    {axis: "correct", value: scale.correct(data.correct)},
                    {axis: "average speed", value: scale.avgSpeed(data.speed)},
                    {axis: "solved", value: scale.solved(data.solved)},
                    {axis: "max combo", value: scale.maxCombo(data["max-combo"])},
                    {axis: "max speed", value: scale.maxSpeed(data["max-speed"])},
                    {axis: "correction rate", value: scale.correctRate(correctRate)}
                ]
            }
        }
        function getMaxData(data){
            var maxIdx = 0;
            for(var i = 1; i < data.length; i++){
                if(data[i].score > data[maxIdx].score){
                    maxIdx = i;
                }
            }
            return toRadarData(data[maxIdx], "max-data");
        }
        function getAvgData(data){
            var avgData = {
                score: d3.mean(data, function(el){
                    return el.score;
                }),
                correct: d3.mean(data, function(el){
                    return el.correct;
                }),
                miss: d3.mean(data, function(el){
                    return el.miss;
                }),
                speed: d3.mean(data, function(el){
                    return el.speed;
                }),
                solved: d3.mean(data, function(el){
                    return el.solved;
                }),
                "max-combo": d3.mean(data, function(el){
                    return el["max-combo"];
                }),
                "max-speed": d3.mean(data, function(el){
                    return el["max-speed"];
                })
            };
            return toRadarData(avgData, "avg-data");
        }
    };
    ns.renderTimeBar = function(div, sound){
        var timeBar = fc.viz.template.timeBar.draw(div, sound);
        timeBar.update();
    };
})(fc.viz);

(function(ns){
    ns.RadarChart = {
        defaultConfig: {
            containerClass: 'radar-chart',
            w: 400,
            h: 400,
            factor: 0.95,
            factorLegend: 1,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            color: d3.scale.category10(),
            axisLine: true,
            axisText: true,
            circles: true,
            radius: 5,
            axisJoin: function(d, i) {
                return d.className || i;
            },
            transitionDuration: 300
        },
        chart: function() {
            // default config
            var cfg = Object.create(ns.RadarChart.defaultConfig);

            function radar(selection) {
                selection.each(function(data) {
                    var container = d3.select(this);

                    // allow simple notation
                    data = data.map(function(datum) {
                        if(datum instanceof Array) {
                            datum = {axes: datum};
                        }
                        return datum;
                    });

                    var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d) {
                        return d3.max(d.axes, function(o){ return o.value; });
                    }));

                    var allAxis = data[0].axes.map(function(i, j){ return i.axis; });
                    var total = allAxis.length;
                    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

                    container.classed(cfg.containerClass, 1);

                    function getPosition(i, range, factor, func){
                        factor = typeof factor !== 'undefined' ? factor : 1;
                        return range * (1 - factor * func(i * cfg.radians / total));
                    }
                    function getHorizontalPosition(i, range, factor){
                        return getPosition(i, range, factor, Math.sin);
                    }
                    function getVerticalPosition(i, range, factor){
                        return getPosition(i, range, factor, Math.cos);
                    }

                    // levels && axises
                    var levelFactors = d3.range(0, cfg.levels).map(function(level) {
                        return radius * ((level + 1) / cfg.levels);
                    });

                    var levelGroups = container.selectAll('g.level-group').data(levelFactors);

                    levelGroups.enter().append('g');
                    levelGroups.exit().remove();

                    levelGroups.attr('class', function(d, i) {
                        return 'level-group level-group-' + i;
                    });

                    var levelLine = levelGroups.selectAll('.level').data(function(levelFactor) {
                        return d3.range(0, total).map(function() { return levelFactor; });
                    });

                    levelLine.enter().append('line');
                    levelLine.exit().remove();

                    levelLine
                        .attr('class', 'level')
                        .attr('x1', function(levelFactor, i){ return getHorizontalPosition(i, levelFactor); })
                        .attr('y1', function(levelFactor, i){ return getVerticalPosition(i, levelFactor); })
                        .attr('x2', function(levelFactor, i){ return getHorizontalPosition(i+1, levelFactor); })
                        .attr('y2', function(levelFactor, i){ return getVerticalPosition(i+1, levelFactor); })
                        .attr('transform', function(levelFactor) {
                            return 'translate(' + (cfg.w/2-levelFactor) + ', ' + (cfg.h/2-levelFactor) + ')';
                        });

                    if(cfg.axisLine || cfg.axisText) {
                        var axis = container.selectAll('.axis').data(allAxis);

                        var newAxis = axis.enter().append('g');
                        if(cfg.axisLine) {
                            newAxis.append('line');
                        }
                        if(cfg.axisText) {
                            newAxis.append('text');
                        }

                        axis.exit().remove();

                        axis.attr('class', 'axis');

                        if(cfg.axisLine) {
                            axis.select('line')
                                .attr('x1', cfg.w/2)
                                .attr('y1', cfg.h/2)
                                .attr('x2', function(d, i) { return getHorizontalPosition(i, cfg.w / 2, cfg.factor); })
                                .attr('y2', function(d, i) { return getVerticalPosition(i, cfg.h / 2, cfg.factor); });
                        }

                        if(cfg.axisText) {
                            axis.select('text')
                                .attr('class', function(d, i){
                                    var p = getHorizontalPosition(i, 0.5);

                                    return 'legend ' +
                                        ((p < 0.4) ? 'left' : ((p > 0.6) ? 'right' : 'middle'));
                                })
                                .attr('dy', function(d, i) {
                                    var p = getVerticalPosition(i, 0.5);
                                    return ((p < 0.1) ? '1em' : ((p > 0.9) ? '0' : '0.5em'));
                                })
                                .text(function(d) { return d; })
                                .attr('x', function(d, i){ return getHorizontalPosition(i, cfg.w / 2, cfg.factorLegend); })
                                .attr('y', function(d, i){ return getVerticalPosition(i, cfg.h / 2, cfg.factorLegend); });
                        }
                    }

                    // content
                    data.forEach(function(d){
                        d.axes.forEach(function(axis, i) {
                            axis.x = getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
                            axis.y = getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(axis.value, 0))/maxValue)*cfg.factor);
                        });
                    });

                    var polygon = container.selectAll(".area").data(data, cfg.axisJoin);

                    polygon.enter().append('polygon')
                        .classed({area: 1, 'd3-enter': 1})
                        .on('mouseover', function (d){
                            container.classed('focus', 1);
                            d3.select(this).classed('focused', 1);
                        })
                        .on('mouseout', function(){
                            container.classed('focus', 0);
                            d3.select(this).classed('focused', 0);
                        });

                    polygon.exit()
                        .classed('d3-exit', 1) // trigger css transition
                        .transition().duration(cfg.transitionDuration)
                        .remove();

                    polygon
                        .each(function(d, i) {
                            var classed = {'d3-exit': 0}; // if exiting element is being reused
                            classed['radar-chart-serie' + i] = 1;
                            if(d.className) {
                                classed[d.className] = 1;
                            }
                            d3.select(this).classed(classed);
                        })
                            // styles should only be transitioned with css
                            .style('stroke', function(d, i) { return cfg.color(i); })
                        .style('fill', function(d, i) { return cfg.color(i); })
                        .transition().duration(cfg.transitionDuration)
                    // svg attrs with js
                        .attr('points',function(d) {
                            return d.axes.map(function(p) {
                                return [p.x, p.y].join(',');
                            }).join(' ');
                        })
                        .each('start', function() {
                            d3.select(this).classed('d3-enter', 0); // trigger css transition
                        });

                    if(cfg.circles && cfg.radius) {
                        var tooltip = container.selectAll('.tooltip').data([1]);
                        tooltip.enter().append('text').attr('class', 'tooltip');

                        var circleGroups = container.selectAll('g.circle-group').data(data, cfg.axisJoin);

                        circleGroups.enter().append('g').classed({'circle-group': 1, 'd3-enter': 1});
                        circleGroups.exit()
                            .classed('d3-exit', 1) // trigger css transition
                            .transition().duration(cfg.transitionDuration).remove();

                        circleGroups
                            .each(function(d) {
                                var classed = {'d3-exit': 0}; // if exiting element is being reused
                                if(d.className) {
                                    classed[d.className] = 1;
                                }
                                d3.select(this).classed(classed);
                            })
                                .transition().duration(cfg.transitionDuration)
                            .each('start', function() {
                                d3.select(this).classed('d3-enter', 0); // trigger css transition
                            });

                        var circle = circleGroups.selectAll('.circle').data(function(datum, i) {
                            return datum.axes.map(function(d) { return [d, i]; });
                        });

                        circle.enter().append('circle')
                            .classed({circle: 1, 'd3-enter': 1})
                            .on('mouseover', function(d){
                                tooltip
                                    .attr('x', d[0].x - 10)
                                    .attr('y', d[0].y - 5)
                                    .text(d[0].value)
                                    .classed('visible', 1);

                                container.classed('focus', 1);
                                container.select('.area.radar-chart-serie'+d[1]).classed('focused', 1);
                            })
                            .on('mouseout', function(d){
                                tooltip.classed('visible', 0);

                                container.classed('focus', 0);
                                container.select('.area.radar-chart-serie'+d[1]).classed('focused', 0);
                            });

                        circle.exit()
                            .classed('d3-exit', 1) // trigger css transition
                            .transition().duration(cfg.transitionDuration).remove();

                        circle
                            .each(function(d) {
                                var classed = {'d3-exit': 0}; // if exit element reused
                                classed['radar-chart-serie'+d[1]] = 1;
                                d3.select(this).classed(classed);
                            })
                                // styles should only be transitioned with css
                            .style('fill', function(d) { return cfg.color(d[1]); })
                            .transition().duration(cfg.transitionDuration)
                        // svg attrs with js
                            .attr('r', cfg.radius)
                            .attr('cx', function(d) {
                                return d[0].x;
                            })
                            .attr('cy', function(d) {
                                return d[0].y;
                            })
                            .each('start', function() {
                                d3.select(this).classed('d3-enter', 0); // trigger css transition
                            });

                        // ensure tooltip is upmost layer
                        var tooltipEl = tooltip.node();
                        tooltipEl.parentNode.appendChild(tooltipEl);
                    }
                });
            }

            radar.config = function(value) {
                if(!arguments.length) {
                    return cfg;
                }
                if(arguments.length > 1) {
                    cfg[arguments[0]] = arguments[1];
                }
                else {
                    d3.entries(value || {}).forEach(function(option) {
                        cfg[option.key] = option.value;
                    });
                }
                return radar;
            };

            return radar;
        },
        draw: function(id, d, options) {
            var chart = ns.RadarChart.chart().config(options);
            var cfg = chart.config();

            d3.select(id).select('svg').remove();
            d3.select(id)
                .append("svg")
                .attr("width", cfg.w)
                .attr("height", cfg.h)
                .datum(d)
                .call(chart);
        }
    };
    ns.TimeBar = {
        target$: null,
        config: null,
        loaded: false,
        xScale: null,
        timeBar: null,
        draw: function(div, audio, options){
            this.config = this.defaultConfig();
            for(x in options){
                this.config[x] = options[x];
            }
            this.target$ = $(audio);
            var svg = d3.select(div)
                    .append("svg")
                    .attr("width", this.config.width)
                    .attr("height", this.config.height);

            var barW = this.config.width - this.config.margin.left - this.config.margin.right,
                barH = this.config.height - this.config.margin.top - this.config.margin.bottom;
            var curTime = this.target$[0].currentTime,
                dur = this.target$[0].duration;
            if(isFinite(dur)){
                this.loaded = true;
            } else {
                dur = 100;
            }
            this.xScale = d3.scale.linear()
                       .range([0, barW])
                       .domain([0, dur]);
            this.timeBar = svg.append("g")
                .append("rect")
                .attr("x", this.config.margin.left)
                .attr("y", this.config.margin.top)
                .style("fill", this.config.color)
                .attr("height", barH)
                .attr("width", this.xScale(dur));

            if(this.config.label){
                var label = this.config.label;
                svg.select("g").append("text")
                            .attr("x", 0)
                            .attr("y", this.config.margin.top + 15)
                            .text(function(){ return label; })
                            .attr("font-size", "1em")
                            .attr("fill", "white");
            }
            return this;
        },
        update: function(){
            var curTime = this.target$[0].currentTime;
            var dur = this.target$[0].duration;
            if(!this.loaded){
                if(isFinite(dur)){
                    this.loaded = true;
                    var barW = this.config.width - this.config.margin.left - this.config.margin.right;
                    this.xScale = d3.scale.linear()
                                    .range([0, barW])
                                    .domain([0, dur]);
                }
            }
            this.timeBar//.transition().duration(this.config.interval)
                        .attr("width", this.xScale(curTime));
            return this;
        },
        loop: function(){

        },
        defaultConfig: function(cfg){
            if(cfg){
                for(x in cfg){
                    config.x = cfg.x;
                }
                return;
            }
            var margin = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            };
            var width = $(window).width()/3,
                height = 20,
                color = "blue";
            return {
                interval: 100,
                width: width,
                height: height,
                color: color,
                margin: margin
            };
        }
    };
    ns.BarGraph = {
        config: null,
        xScale: null,
        barGraph: null,
        draw: function(div, options){
            this.config = this.defaultConfig();
            for(x in options){
                this.config[x] = options[x];
            }
            var svg = d3.select(div)
                    .append("svg")
                    .attr("width", this.config.width)
                    .attr("height", this.config.height);

            var barW = this.config.width - this.config.margin.left - this.config.margin.right,
                barH = this.config.height - this.config.margin.top - this.config.margin.bottom;
            this.xScale = d3.scale.linear()
                            .range([0, barW])
                            .domain([0, this.config.maxValue]);
            this.barGraph = svg.append("g")
                .append("rect")
                .attr("x", this.config.margin.left)
                .attr("y", this.config.margin.top)
                .style("fill", this.config.color(this.config.maxValue))
                .attr("height", barH)
                .attr("width", this.xScale(this.config.maxValue));
            if(this.config.label){
                var label = this.config.label;
                svg.select("g").append("text")
                            .attr("x", 0)
                            .attr("y", this.config.margin.top + 15)
                            .text(function(){ return label; })
                            .attr("font-size", "1em")
                            .attr("fill", "white");
            }

            return this;
        },
        update: function(){
            var val = this.config.update();
            this.barGraph//.transition().duration(this.config.interval)
                        .attr("width", this.xScale(val))
                        .style("fill", this.config.color(val));
            return this;
        },
        defaultConfig: function(cfg){
            if(cfg){
                for(x in cfg){
                    config.x = cfg.x;
                }
                return;
            }
            var margin = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            };
            var width = $(window).width()/3,
                height = 20,
                color = "blue";
            return {
                interval: 100,
                width: width,
                height: height,
                margin: margin,
                maxValue: 1500000,
                color: function(val){
                    var colors = d3.scale.quantize()
                                   .range(["#aec7e8", "#1f77b4", "#9467bd",
                                           "#e377c2", "#ff9896", "#ffbb78",
                                           "#ff7f0e", "#d62728"])
                                   .domain([0, this.maxValue]);
                    return colors(val);
                },
                update: function(){
                    return;
                }
            };
        }
    };
    ns.DonutChart = {
        config: null,
        data: null,
        donutChart: null,
        draw: function(div, options){
            this.config = this.defaultConfig();
            for(x in options){
                this.config[x] = options[x];
            }
            var config = this.config;
            this.data = config.data;
            console.log(this.data);
            var arc = d3.svg.arc()
                        .outerRadius(config.outerR)
                        .innerRadius(config.innerR);

            var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d){ return d.value; });
            var svg = d3.select(div)
                    .append("svg")
                    .attr("width", config.width)
                    .attr("height", config.height)
                    .append("g")
                    .attr("transform", "translate(" + (config.width/2 + config.margin.left/2) + ", " + (config.height/2 + config.margin.top/2) + ")");
            svg.append("text")
               .attr("class", "label")
               .attr("text-anchor", "middle")
               .attr("transform", "translate(0, " + config.fontSize/2 + ")")
               .style("font-size", config.fontSize + "px")
               .style("fill", config.fontColor)
               .text(config.label);
            this.donutChart = svg.selectAll(".arc")
                                 .data(pie(this.data))
                                 .enter()
                                 .append("g")
                                 .attr("class", function(d){
                                     return d.data.dummy ? "arc dummy" : "arc";
                                 });
            this.donutChart.append("path")
                           .attr("d", arc)
                           .style("fill", function(d){ return config.color(d.data); });
        },
        update: function(){

        },
        defaultConfig: function(){
            return {
                fontSize: 15,
                fontColor: "black",
                width: 200,
                height: 200,
                innerR: 60,
                outerR: 90,
                color: d3.scale.quantize()
                         .range(["#6baed6", "#74c476", "#fd8d3c",
                                 "#e377c2", "#bcbd22", "#7b4173"])
                         .domain([1, 6])
            };
        }
    };
    ns.LineAreaGraph = {
        config: null,
        divId: null,
        x: null,
        y: null,
        svg: null,
        area: null,
        stack: null,
        names: null,
        draw: function(div, data, options){
            this.divId = div;
            console.log(data);
            this.config = this.defaultConfig();
            if(options){
                for(var x in options){
                    this.config[x] = options[x];
                }
            }
            var config = this.config;
            this.x = d3.scale.linear()
                       .rangeRound([0, config.width])
                       .domain([0, config.maxValue.x]);
            this.y = d3.scale.linear()
                       .rangeRound([0, config.height])
                       .domain([config.maxValue.y, 0]);
            var xScale = this.x;
            var yScale = this.y;
            var xAxis = d3.svg.axis()
                          .scale(this.x)
                          .orient(config.orient.x);
            var yAxis = d3.svg.axis()
                          .scale(this.y)
                          .orient(config.orient.y);
            this.stack = d3.layout.stack()
                           .offset("zero")
                           .values(function(d) { return d.values; })
                           .x(function(d) { return xScale(d.label); })
                           .y(function(d) { return d.value; });
            this.area = d3.svg.area()
                         .interpolate("basis")
                         .x(function(d) { return xScale(d.label); })
                         .y0(function(d) { return yScale(d.y0); })
                         .y1(function(d) { return yScale(d.y0 + d.y); });

            var area = this.area;
            var colors = this.config.color;
            this.svg = d3.select(div).append("svg")
                         .attr("width", config.width + config.margin.left + config.margin.right)
                         .attr("height", config.height + config.margin.top + config.margin.bottom)
                         .append("g")
                         .attr("transform", "translate(" + config.margin.left + ", " + config.margin.top + ")");

            this.names = [];
            for(var x in data[0].values){
                this.names.push(x);
            }
            var names = this.names;
            this.config.color.domain(names);

            var seriesArr = this.convertData(data);

            this.stack(seriesArr);

            this.svg.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + config.height + ")")
               .call(xAxis);

            this.svg.append("g")
               .attr("class", "y axis")
               .call(yAxis)
               .append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 6)
               .attr("dy", ".71em")
               .style("text-anchor", "end")
               .text("Score");

            var selection = this.svg.selectAll(".series")
                               .data(seriesArr)
                               .enter()
                               .append("g")
                               .attr("class", "series");

            selection.append("path")
                     .attr("class", "streamPath")
                     .attr("d", function(d) { return area(d.values); })
                     .style("fill", function(d) { return colors(d.name); })
                     .style("stroke", "grey");

            var points = this.svg.selectAll(".seriesPoints")
                             .data(seriesArr)
                             .enter()
                             .append("g")
                             .attr("class", "seriesPoints");
            var showPopover = this.showPopover,
                removePopovers = this.removePopovers;
            points.selectAll(".point")
                  .data(function(d) { return d.values; })
                  .enter()
                  .append("circle")
                  .attr("class", "point")
                  .attr("cx", function(d) { return xScale(d.label); })
                  .attr("cy", function(d) { return yScale(d.y0 + d.y); })
                  .attr("r", "10px")
                  .style("fill", function(d) { return colors(d.name); })
                  .on("mouseover", function(d) { showPopover.call(this, d); })
                  .on("mouseout", function(d) { removePopovers(); });

            var legend = this.svg.selectAll(".legend")
                             .data(names.slice().reverse())
                             .enter()
                             .append("g")
                             .attr("class", "legend")
                             .attr("transform", function(d, i) { return "translate(55, " + i*20 + ")"; });

            legend.append("rect")
                  .attr("x", config.width - 10)
                  .attr("width", 10)
                  .attr("height", 10)
                  .style("fill", colors)
                  .style("stroke", "grey");

            legend.append("text")
                  .attr("x", config.width - 12)
                  .attr("y", 6)
                  .attr("dy", ".35em")
                  .style("text-anchor", "end")
                  .text(function(d) { return d; });
            return this;

        },
        update: function(data, options){
            console.log(data);
            if(options){
                for(var x in options){
                    this.config[x] = options[x];
                }
                var config = this.config;
                this.x = d3.scale.linear()
                           .rangeRound([0, config.width])
                           .domain([0, config.maxValue.x]);
                this.y = d3.scale.linear()
                           .rangeRound([0, config.height])
                           .domain([config.maxValue.y, 0]);
                var xScale = this.x;
                var yScale = this.y;
                var xAxis = d3.svg.axis()
                              .scale(this.x)
                              .orient(config.orient.x);
                var yAxis = d3.svg.axis()
                              .scale(this.y)
                              .orient(config.orient.y);
                this.stack = d3.layout.stack()
                               .offset("zero")
                               .values(function(d) { return d.values; })
                               .x(function(d) { return xScale(d.label); })
                               .y(function(d) { return d.value; });
                this.area = d3.svg.area()
                             .interpolate("basis")
                             .x(function(d) { return xScale(d.label); })
                             .y0(function(d) { return yScale(d.y0); })
                             .y1(function(d) { return yScale(d.y0 + d.y); });

                var area = this.area;
                var colors = this.config.color;
                this.svg
                    .attr("width", config.width + config.margin.left + config.margin.right)
                    .attr("height", config.height + config.margin.top + config.margin.bottom)
                this.svg.select("g")
                        .attr("transform", "translate(" + config.margin.left + ", " + config.margin.top + ")");

                var names = this.names;
                this.config.color.domain(names);


                this.svg.select(".x")
                    .attr("transform", "translate(0," + config.height + ")")
                    .call(xAxis);

                this.svg.select(".y")
                    .call(yAxis);

                var legend = this.svg.selectAll(".legend");

                legend.selectAll("rect")
                      .attr("x", config.width - 10)
                      .style("fill", colors);

                legend.selectAll("text")
                      .attr("x", config.width - 12)
                      .attr("y", 6);
            }
            var seriesArr = this.convertData(data);
            var selection = this.svg.selectAll(".series")
            var xScale = this.x;
            var yScale = this.y;
            var colors = this.config.color;
            var area = this.area;

            console.log(seriesArr);
            this.stack(seriesArr);
            selection.select("path")
                     .data(seriesArr)
                     .attr("d", function(d) { return area(d.values); })
                     .style("fill", function(d) { return colors(d.name); })
                     .style("stroke", "grey");

            var points = this.svg.selectAll(".seriesPoints")
                             .data(seriesArr);

            var showPopover = this.showPopover,
                removePopovers = this.removePopovers;
            points.selectAll(".point")
                  .data(function(d) { console.log(d); return d.values; })
                  .enter()
                  .append("circle")
                  .attr("class", "point")
                  .attr("cx", function(d) { return xScale(d.label); })
                  .attr("cy", function(d) { return yScale(d.y0 + d.y); })
                  .attr("r", "10px")
                  .style("fill", function(d) { return colors(d.name); })
                  .on("mouseover", function(d) { showPopover.call(this, d); })
                  .on("mouseout", function(d) { removePopovers(); });

            return this;
        },
        removePopovers: function(){
            $('.popover').each(function(){
                $(this).remove();
            });
        },
        showPopover: function(d){
            $(this).popover({
                title: d.name,
                placement: 'auto top',
                container: 'body',
                trigger: 'manual',
                html: true,
                content: function() {
                    return "Time : " + d.label + "<br/>Score: " + d3.format(",")(d.value !== undefined ? d.value: d.y1 - d.y0);
                }
            });
            $(this).popover('show');
        },
        convertData: function(data){
            var seriesArr = [], series = {};
            var names = this.names;
            names.forEach(function(name){
                series[name] = { name: name, values: [] };
                seriesArr.push(series[name]);
            });
            data.forEach(function(d){
                names.map(function(name){
                    series[name].values.push({ name: name, label: d.label, value: d.values[name] });
                });
            });

            return seriesArr;
        },
        defaultConfig: function(){
            return {
                margin: {
                    top: 20,
                    right: 0,
                    bottom: 20,
                    left: 50
                },
                maxValue: {
                    x: 100,
                    y: 1500000
                },
                width: 800,
                height: 400,
                color: d3.scale.ordinal()
                         .range(["#756bb1", "#6baed6", "#74c476",
                                 "#bcbd22", "#3182bd", "#31a354"]),
                orient: {
                    x: "bottom",
                    y: "left"
                }
            };
        }
    };
})(fc.viz.template = fc.viz.template || {});

(function(ns){
    ns.fib = (function(){
        var memo = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
        return function fib(n){
            if(n < 0){
                return 0;
            } else if(memo[n]){
                return memo[n];
            }
            return memo[n] = fib(n-1) + fib(n-2);
        };
    })();
})(fc.util = fc.util || {});
