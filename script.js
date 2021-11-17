var margin = {top: 60, right: 230, bottom: 50, left: 100},
    width = screen.width - margin.left - margin.right - 800,
    height = 1100 - margin.top - margin.bottom ;
// append the svg object to the body of the page
var svg = d3.select("#main-graph")
        .append("svg")
  
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("main-data-inflation.csv").then( function(data) {

  var keys = data.columns.slice(1)


    // Filter function to remove the apollo mission data from the dataset 
    data.filter(function(d) {
        delete d.Apollo;
        return d;
    })

    // Add X axis
    var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  
    svg.append("g").attr("class", "axis")
    .attr("transform", "translate(0," + 1.5*height + ")")
    .attr("font-size", "20px")
    .call(d3.axisBottom(x).ticks(5));
    // Customization
    svg.selectAll(".tick line").attr("stroke", "#FFF")
    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", (1.5*height)+50)
        .style("font-size", "2.45em")
        .text("Year");
        
  
    // Add Y axis
    var missionWiseData = keys.map(function(id) {
        return {
            id: id,
            values: data.map(d => {return {date: d.date, degrees: +d[id]}})
        };
    });


    var total_cost_data = 1;
    d3.csv("cost-total.csv",function(dataset){total_cost_data = 5});
    console.log(total_cost_data)

    var y = d3.scaleLinear()
    .domain([ 0, 500+
        d3.max(missionWiseData, d => d3.max(d.values, c => c.degrees))])
    .range([ 1.5*height, 0 ]);

    svg.append("g").attr("class", "axis")
    .call(d3.axisLeft(y));
    svg.append("text")
        .attr("x", -150)
        .attr("y", -90)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".4em")
        .style("text-anchor", "end")
        .style("font-size", "2.45em")
        .text("Budget in millions ($)");
  
    // color palette
    const color = d3.scaleOrdinal()
    .domain(keys)
    .range([
        '#707070','#2f4f4f','#556b2f','#8b4513','#228b22','#7f0000','#191970','#808000',
        '#32cd32','#7f007f','#8fbc8f','#b03060','#ff4500','#ffa500','#ffd700','#6a5acd',
        '#00bfff','#f4a460','#adff2f','#ff6347','#b0c4de','#ff00ff','#1e90ff','#f0e68c',
        '##3cb371','#008080','#b8860b','#4682b4','#d2691e','#9acd32','#cd5c5c','#00008b',
        '#ffff00','#0000cd','#deb887','#00ff00','#9400d3','#00fa9a','#dc143c','#00ffff',
        '#dda0dd','#ff1493','#afeeee','#ee82ee','#98fb98','#7fffd4','#ffc0cb'
    ])  

    //stack the data
    var stackedData = d3.stack()
    //   .offset(d3.stackOffsetSilhouette)
      .keys(keys)
      (data)
  
    // create a tooltip for highlighting hovered mission
    var Tooltip = svg
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("class", "tooltip1")
      .style("opacity", 0)
      .style("font-size", 17)

// tooltip for showing info about highlighted mission
      var Tooltip2 = d3.select("#main-graph")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip2")
      .style("background-color", "#000")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("color", "white")
      .style("padding", "5px")
      .style("position", "absolute")
  
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
      d3.selectAll(".myArea").style("opacity", .15);

      Tooltip2
      .style("opacity", 1);
    
      d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
      

    }
    var mousemove = function(event, d) {
    //   console.log(d)
      Tooltip2
      .html(d["key"] + "<br>Budget: "   )
      .style("left", ((event.x + 50)  + "px"))
      .style("top", (event.y) + "px");


    }
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
      d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
      d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none");

      Tooltip2
      .style("opacity", 0)

     }
  
    // Area generator
    var area = d3.area()
      .x(function(d) { return x(d.data.year); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); })
      .curve(d3.curveBundle.beta(1));
    // Show the areas
    
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", "myArea")
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on('click',(event,data)=> {
          console.log(data["key"]);
          document.getElementById("pieChart").innerHTML = "";
          pieChart(data["key"]);
          // call new function here 
      })

  })