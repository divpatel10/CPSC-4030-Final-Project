d3.csv("main-data-inflation.csv").then(function(data) {

        


    var keys = data.columns.slice(1);
    console.log(keys);

    var parseTime = d3.timeParse("%Y"),
        formatDate = d3.timeFormat("%Y"),
        bisectDate = d3.bisector(d => d.date).left,
        formatValue = d3.format(",.0f");
    data.forEach(function(d) {
        d.date = parseTime(d.Date);
        return d;
    }) 

    
    // Filter function to remove the apollo mission data from the dataset 
    console.log(data.filter(function(d) {
        delete d.Apollo;
        return d;
    }))

    

    var svg = d3.select("#main-graph"),
        margin = {top: 15, right: 35, bottom: 15, left: 45},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleTime()
        .rangeRound([margin.left, width - margin.right])
        .domain(d3.extent(data, d => d.date))

    var y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top]);

    var color = d3.scaleOrdinal(d3.schemePaired);


    var line = d3.line()
        .defined(function(d) { return d; })
        .curve(d3.curveLinear)
        .x(d => x(d.date))
        .y(d => y(d.degrees));

    svg.append("g")
        .attr("class","x-axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).ticks(d3.timeYear.every(5)))

    svg.append("g")
        .attr("class","y-axiss")
        .attr("transform", "translate(" + (margin.left) + ",0)")
        .call(d3.axisLeft(y).ticks(0))
    
    svg.append("text")
        .attr("x", -150)
        .attr("y", 5)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".4em")
        .style("text-anchor", "end")
        .style("font-size", "1.45em")
        .text("Budget in millions ($)");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + ",0)");

    var focus = svg.append("g")
             .attr("class", "focus")
             .style("display", "none");

    focus.append("line").attr("class", "lineHover")
        .style("stroke", "#999")
        .attr("stroke-width", 1)
        .style("shape-rendering", "crispEdges")
        .style("opacity", 0.5)
        .attr("y1", -height)
        .attr("y2",0);

    focus.append("text").attr("class", "lineHoverDate")
        .attr("text-anchor", "middle")
        .attr("font-size", 15);                

    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", margin.left)
        .attr("width", width - margin.right - margin.left)
        .attr("height", height)

        

        var copy = keys.filter(f => f.includes("_1"))
        var copy = keys;

        var missionWiseData = keys.map(function(id) {
            return {
                id: id,
                values: data.map(d => {return {date: d.date, degrees: +d[id]}})
            };
        });
        //  console.log(data)
        // console.log(missionWiseData)

        y.domain([
            d3.min(missionWiseData, d => d3.min(d.values, c => c.degrees)),
            d3.max(missionWiseData, d => d3.max(d.values, c => c.degrees))
        ]);

        svg.selectAll(".y-axis").call(d3.axisLeft(y).tickSize(-width + margin.right + margin.left))

        var mission = svg.selectAll(".missionWiseData")
            .data(missionWiseData);
        mission.exit().remove();

        mission.enter().insert("g", ".focus").append("path")
            .attr("class", function (d,i) {
               return "line missionWiseData-"+i+"";
            })
            .style("stroke", d => color(d.id))
            .merge(mission)
            .attr("d", d => line(d.values))
        
            tooltip(copy);
        var legend = svg.selectAll('.legend')
            .data(keys)
            .enter()
            .append('g')
            .attr('class', 'legend')

        // draw rectangle
        legend.append('rect')
            .attr('x', width - 20)
            .attr('y', function(d, i) {
                return i * 20;
            })
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function(d) {
                return color(d);
            });

        // write mission name
        legend.append('text')
            .attr('x', width - 8)
            .attr('y', function(d, i) {
                return (i * 20) + 9;
            })
            .text(function(d) {
                return d;
            });


            function tooltip(copy) {

                    var labels = focus.selectAll(".lineHoverText")
                        .data(copy)
        
                    labels.enter().append("text")
                        .attr("class", "lineHoverText")
                        .style("fill", d => color(d))
                        .attr("text-anchor", "start")
                        .attr("font-size",12)
                        .attr("dy", (_, i) => 1 + i * 1 + "em")
                        .merge(labels);
        
                    var circles = focus.selectAll(".hoverCircle")
                        .data(copy)
        
                        // draw circles on hovered column
                    circles.enter().append("circle")
                        .attr("class", "hoverCircle")
                        .style("fill", d => color(d))
                        .attr("r", 5)
                        .merge(circles);
        
                    svg.selectAll(".overlay")
                        .on("mouseover", function() { focus.style("display", null); })
                        .on("mouseout", function() { focus.style("display", "none"); })
                        .on("mousemove", mousemove);
        
                    function mousemove() {
                            
                        console.log(d3.pointer(event)[0])
                        var x0 = x.invert(d3.pointer(event)[0]),
                            i = bisectDate(data, x0, 1),
                            d0 = data[i - 1],
                            d1 = data[i];
                            var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                        // Draw a vertical line on hover
                        focus.select(".lineHover")
                            .attr("transform", "translate(" + x(d.date) + "," + height + ")");
                        
                        focus.select(".lineHoverDate")
                            .attr("transform",
                                "translate(" + x(d.date) + "," + (height + margin.bottom) + ")")
                            .text(formatDate(d.date));
        
                        focus.selectAll(".hoverCircle")
                            .attr("cy", e => y(d[e]))
                            .attr("cx", x(d.date));

                        focus.selectAll(".lineHoverText")
                            .attr("transform",
                                "translate(" + (x(d.date)) + "," + height/10  + ")")
                            .text(e => e + " : " + "$" + formatValue(d[e]) + "Million" )
                			.style("display",function(e){
                				return d[e] > 0 ? "block" : "none";    // show only the missions that are greater than 0
                			});
                            
                            // shift text to left after crossing 3/4th the width
                        x(d.date) > (width - width / 4)
                            ? focus.selectAll("text.lineHoverText")
                                .attr("text-anchor", "end")
                                .attr("dx", 10)
                            : focus.selectAll("text.lineHoverText")
                                .attr("text-anchor", "start")
                                .attr("dx", 10)
                    }
                }

});