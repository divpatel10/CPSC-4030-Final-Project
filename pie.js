function pieChart(fileName) {
  var width = 600;
  height = 600;
  margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one).
  var radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'pieChart'
  var svg = d3
    .select("#pieChart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 4 + "," + height / 4 + ")");

  var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 4 + "," + height / 4 + ")");

//Title of the chart
  var chartTitle = d3
    .select("#pieChart")
    .append("text")
    .style("font", "24px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dx", width / 2)
    .attr("dy", margin - 20)
    .text("Sector wise cost of " + fileName);

// Scale of the color
  var color = d3.scaleOrdinal([
    '#32cd32',
    '#7f007f',
    '#8fbc8f',
    '#b03060',
    '#ff4500',
    '#ffa500',
    '#ffd700',
    '#6a5acd'

  ]);

// Create the pie chart based on the data
  var pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      // console.log("AAAA", d.population)
      return d.population;
    });

  var path = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var label = d3
    .arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  d3.csv("./data/" + fileName + ".csv").then(function (d) {
    var dst = d.filter((d) => {
      return d["Fiscal Year"] == "";
    });
    d = dst[0];
    delete d["Fiscal Year"];
    delete d["Notes"];
    delete d["Official LCC"];
    delete d["Total Cost"];
    delete d["Total Cost (inflation adj)"];

// Restructure the data
    var data = Object.entries(d).map(([age, population]) => ({
      age,
      population,
    }));

    for (d in data) {
      data[d].population = +data[d].population
        .slice(1, data[d].length)
        .replaceAll(",", "");
    }


    d = data;

    // tooltip for showing info about highlighted mission
    var Tooltip2 = d3.select("#pieChart")
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

       // Area generator
       var area = d3.area()
       .x(function(d) { return x(d.data["Fiscal Year"]); })
       .y0(function(d) { return y(d[0]); })
       .y1(function(d) { return y(d[1]); })
       .curve(d3.curveBundle.beta(1));

     // Three function that change the tooltip when user hover / move / leave a cell
     var mouseover = function(d) {

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

      Tooltip2
      .style("opacity", 0)

     }

    var arc = g
      .selectAll(".arc")
      .data(pie(d))
      .enter()
      .append("g")
      .attr("class", "arc")

    arc
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        return color(d.data.age);
      })
    

  
  });
}
// Call the function for the first time for Cassini data
pieChart("Cassini");
