var filename;
function pieChart(fileName) {
  filename = fileName;
  var margin = {top: 20, right: 20, bottom: 20, left: 20}

  var width = document.querySelector('.thirdgraph').offsetWidth - margin.left - margin.right ,
 height = document.querySelector('.thirdgraph').offsetHeight - margin.top - margin.bottom 

  // The radius of the pieplot is half the width or half the height (smallest one).
  var radius = Math.min(width-110, height-110) / 2 ;

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
    .style("font", "20px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dx", width / 2)
    .attr("dy", 40)
    .text("What is the cost distribution of " + fileName);


    // var hoverTitle = d3
    // .select("#pieChart")
    // .append("text")
    // .style("font", "20px sans-serif")
    // .style("fill", "black")
    // .attr("text-anchor", "middle")
    // .style("background-color", "#000")

    // .attr("dx", width / 2)
    // .attr("dy", height - 5)
   



// Scale of the color
  // var color = d3.scaleOrdinal()
  // .range([ '#00bfff','#f4a460','#adff2f','#ff6347','#b0c4de','#ff00ff','#1e90ff','#f0e68c'  ]);
  var color = d3.scaleOrdinal(d3.schemeSet2);

// Create the pie chart based on the data
  var pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      // console.log("AAAA", d.value)
      return d.value;
    });

  var path = d3
    .arc()
    .outerRadius(radius - 30)
    .innerRadius(0);

  var path_pos = d3
  .arc()
  .outerRadius(radius )
  .innerRadius(120);


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
    var data = Object.entries(d).map(([key, value]) => ({
      key,
      value,
    }));

    for (d in data) {
      data[d].value = +data[d].value
        .slice(1, data[d].length)
        .replaceAll(",", "");
    }


    d = data;


    var mousemove = function(event, d) {
      // hoverTitle.text("Cost of " + d.data["key"] + ": $" + d.data["value"]+ "millions");
      d3.select(this)
      .attr('d', function(d){
        return d3.arc().innerRadius(0)
          .outerRadius(radius + 10)(d)
      })
      .attr("stroke", "black");


    }


    var mouseout = function(event, d){
      d3.select(this)
      .transition(300)
      .attr('d', function(d){
        return d3.arc().innerRadius(0)
          .outerRadius(radius - 30)(d)
          
      })
      .attr("stroke", "none");

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
        return color(d.data.key);
      })
      .attr("cursor", "pointer")
      // .attr("d", label)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout)
      .on('click',(event,data)=> {
        console.log(data.data["key"]);
        document.getElementById("barchart").innerHTML = "";
        barChart(fileName, true,data.data["key"] );
        // call new function here 
    })

      // Add the polylines between chart and labels:
arc
.selectAll('allPolylines')
.data(pie(d))
.enter()
.append('polyline')
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 0.8)
  .attr('points', function(d) {
    var posA = path.centroid(d) 
    var posB = path_pos.centroid(d) 
    var posC = path_pos.centroid(d); 
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 
    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
    return [posA, posB, posC]
  })

// Add the polylines between chart and labels:
// Code inspired by Laxmikanta Nayak's pie chart at https://bl.ocks.org/laxmikanta415/dc33fe11344bf5568918ba690743e06f
arc
.selectAll('allLabels')
.data(pie(d))
.enter()
.append('text')
.style("font", "14px sans-serif")
.style("font-weight", "300")
.attr("stroke-width", 0.5)

  .text( function(d) { return "$" + d.data["value"]+ " millions" } )
  .attr('transform', function(d) {
      var pos = path_pos.centroid(d);
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return 'translate(' + pos+ ')';
  })
  .style('text-anchor', function(d) {
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
  })
  });



  
}
// Call the function for the first time for Cassini data

pieChart("Galileo");



function ViewAllCategories(){
  document.getElementById("barchart").innerHTML = "";
  barChart(filename, false, 1);
}
