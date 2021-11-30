
var dimensions = {
  width: 800,
  height: 800,
  margin: {
    top: 50,
    bottom: 50,
    right: 50,
    left: 100,
  },
}

d3.csv("data/Timeline.csv").then(function(dataset){

    var parseTime = d3.timeParse("%Y")

    dataset.forEach(function(d) {
        d['LV Cost (2020)'] = d['LV Cost (2020)'].slice(1)
        return d
    }) 
    var yearFormat = d3.timeFormat("%Y")
    var yAccessor = d => +d['LV Cost (2020)']
    var xAccessor = d => d['Launch Date (Fiscal Year)']

    var svg = d3.select("#graph4")
                .style("width", dimensions.width)
                .style("height", dimensions.height)

    var years = dataset.map(xAccessor)
    var cost = dataset.map(yAccessor)
    var x_extent = d3.extent(dataset, d => yearFormat(parseTime(d['Launch Date (Fiscal Year)'])))

    var xScale = d3.scaleBand()
                .domain(years)
                .range([margin.left, width - margin.right])

    var xAxisGen = d3.axisBottom().scale(xScale)
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxisGen)
        .selectAll("text")
        .attr("dx", "-1.5em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-65)");
//d3.extent(dataset, d => d['LV Cost (2020)'])
    
    var y_axis = d3.scaleLinear()
                    .domain([0, 400])
                    .range([
                        height - margin.bottom,
                        margin.top,
                      ])
    var val = Array()
    for (var i = 0; i < dataset.length; i++){
        val.push(dataset[i]['LV Cost (2020)'])
    }
    console.log(val)
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + (margin.left) + ",0)")
        .call(d3.axisLeft(y_axis).ticks(20))

    svg.append("text")
        .attr("x", -150)
        .attr("y", 5)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".4em")
        .style("text-anchor", "end")
        .style("font-size", "1.45em")
        .text("Launch Cost in Millions (Inflation Adjusted for 2020)")
    var i = 0
    // dataset = dataset.filter(function (d){
    //     if (d['LV Cost (2020)'] !== ""){
    //         i++
    //         return d;
    //     }
    // })
    
    svg.append("g")
        .selectAll("dots")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", function(d){
            return d['LV Cost (2020)']
        })
        .attr("r", 2)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "#CC0000")

})