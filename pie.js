var filename;
function pieChart(fileName) {
  filename = fileName;
  var margin = {top: 20, right: 20, bottom: 20, left: 20}

  var width = document.querySelector('.thirdgraph').offsetWidth - margin.left - margin.right ,
 height = document.querySelector('.thirdgraph').offsetHeight - margin.top - margin.bottom 

  // The radius of the pieplot is half the width or half the height (smallest one).
  var radius = Math.min(width, height) / 2 - 30;

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
    .attr("dy", 30)
    .text("What is the cost distribution of " + fileName);


    var hoverTitle = d3
    .select("#pieChart")
    .append("text")
    .style("font", "20px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .style("background-color", "#000")

    .attr("dx", width / 2)
    .attr("dy", height - 5)
   
// Scale of the color
  // var color = d3.scaleOrdinal()
  // .range([ '#00bfff','#f4a460','#adff2f','#ff6347','#b0c4de','#ff00ff','#1e90ff','#f0e68c'  ]);
  var color = d3.scaleOrdinal(d3.schemeSet2);

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
    // console.log("hereeee",d)
    var dst = d.filter((d) => {
      return d["Fiscal Year"] == "";
    });
    d = dst[0];

    console.log("pie", d)
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



    var mousemove = function(event, d) {
      
      hoverTitle.text("Cost of " + d.data["age"] + ": $" + d.data["population"]+ "millions");

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
      .attr("cursor", "pointer")
      // .attr("d", label)
      .on("mousemove", mousemove)
      .on('click',(event,data)=> {
        console.log(data.data["age"]);
        document.getElementById("barchart").innerHTML = "";

        barChart(fileName, true,data.data["age"] );
        // call new function here 
    })
    

  
  });
}
// Call the function for the first time for Cassini data
pieChart("Galileo");



function ViewAllCategories(){
  document.getElementById("barchart").innerHTML = "";
  barChart(filename, false, 1);
}