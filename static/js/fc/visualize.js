var fc = fc || {};
fc.viz = fc.viz || {};
fc.util = fc.util || {};

(function(ns){
    ns.userRecord = function(data){
        return d3.nest()
            .key(function(el){ return el.user.name; }).entries(data);
    };
    ns.renderMusicData = function(html, data, idx){
        console.log(data);
        console.log(idx);
        var tableData = idx >= 0 ? [
            data.records[idx].musicTitle,
            data.records[idx].typingData.difficulty,
            fc.data.maxScoresMap[data.records[idx].typingData.difficulty],
            data.records[idx].typingData["max-type"],
            data.records[idx].typingData["problem-number"]
        ] : [];
        if(tableData.length > 0){
            d3.text(html, function(d){
                d3.select("#music-data-table")
                  .append("div")
                  .attr("class", "panel-body")
                  .html(d);
                d3.selectAll("#music-data-table .music-data")
                  .data(tableData).html(function(p){ return p});
            });
        } else {
            d3.select("#music-data-table")
              .append("div")
              .attr("class", "panel-body")
              .html("<p>Never Played</p>");
        }
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
        var margin = { top: 100, right: 250, bottom: 50, left: 100 };
        var width = 1200 - margin.left - margin.right;
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
                     .x(function(d, i) { console.log("dx = " + x(i)); return x(i+1); })
                     .y(function(d) { console.log(y(d.score)); return y(d.score); });
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
           .attr("r", 3)
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
               return tooltip.style("visibility", "hidden"); });

       /* user.append("text")
            .datum(function(d) { return { name: d.key, value: d.values[0] }; })
            .attr("transform", function(d) { return "translate(" + x(1) + "," + y(d.value.score) + ")";})
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });*/

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
})(fc.viz);

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
