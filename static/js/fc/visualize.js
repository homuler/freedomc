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
        console.log(userNames);
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
               console.log("mouseover point");
               return tooltip.style("visibility", "visible"); })
           .on("mousemove", function(d){
               console.log("mousemove point");
               return tooltip.style("top", (d3.event.pageY+10) + "px")
                             .style("left", (d3.event.pageX+10) + "px")
                             .html("<dl><dt>User</dt><dd>" + d.user.name + "</dd></dl><dl><dt>Score</dt><dd>" + d.score + "</dd></dt></dl>")})
           .on("mouseout", function(d){
               console.log("mouseout point");
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
        console.log(fc.data.maxScoresMap[typingData.difficulty]);
        console.log(typingData["max-type"]);
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
            console.log(d);
            console.log(d.checked);
            return d.checked;
        }).map(function(i, d){
            console.log(d);
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
        console.log(radarData);
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
            console.log(data);
            var maxIdx = 0;
            for(var i = 1; i < data.length; i++){
                if(data[i].score > data[maxIdx].score){
                    maxIdx = i;
                }
            }
            console.log(data[maxIdx]);
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