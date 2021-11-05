d3.csv("main-data.csv").then(function(data) {

        


    var keys = data.columns.slice(1);
    console.log(keys);

    var parseTime = d3.timeParse("%Y")

    data.forEach(function(d) {
        d.date = parseTime(d.Date);
        return d;
    }) 

    

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

    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", margin.left)
        .attr("width", width - margin.right - margin.left)
        .attr("height", height)

  
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
    

});