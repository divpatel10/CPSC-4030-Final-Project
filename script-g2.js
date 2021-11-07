d3.csv("Cassini.csv").then(function (dataset) {
  const filteredDataset = dataset.filter((dataPoint) => {
    return dataPoint["Fiscal Year"] !== "";
  });
  buildGraph(filteredDataset, "Spacecraft Development");
  document.getElementById("names").addEventListener("change", function (event) {
    const newName = event.target.value;
    document.getElementById("barchart").innerHTML = "";
    buildGraph(filteredDataset, newName);
  });
});

function buildGraph(dataset, title) {

  var cleanNumber = (n) => +n.slice(1, n.length).replaceAll(",", "");
  var xAccessor = (d) => +d["Fiscal Year"];
  var yAccessor = (d) => cleanNumber(d[title]);



  var values = Array();
  for (var i = 0; i < dataset.length; i++) {
    values.push(cleanNumber(dataset[i][title]));
  }
  var dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 70,
      bottom: 50,
      right: 50,
      left: 100,
    },
  };
  var svg = d3
    .select("#barchart")
    .style("width", dimensions.width)
    .style("height", dimensions.height);
  var chartTitle = svg
    .append("text")
    .style("font", "24px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dx", dimensions.width / 2)
    .attr("dy", dimensions.margin.top)
    .text(title + " costs of " + "Cassini");
  var xAxisTitle = svg
    .append("text")
    .style("font", "24px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dx", dimensions.width / 2)
    .attr("dy", dimensions.height)
    .text("Fiscal Year");

  var years = dataset.map(xAccessor);
  xScale = d3
    .scaleBand()
    .domain(years)
    .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
    .padding(0.4);
    console.log(values)
  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(values)])
    .range([
      dimensions.height - dimensions.margin.bottom,
      dimensions.margin.top,
    ]);
  var color = d3.scaleOrdinal().domain(years).range(d3.schemeCategory10);

  var bar = svg
    .selectAll("rect")
    .data(dataset)
    //.data(values)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(xAccessor(d)))
    //.attr("x", (d, i) => xScale(years[i]))
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("width", xScale.bandwidth())
    .attr(
      "height",
      (d) => dimensions.height - dimensions.margin.bottom - yScale(yAccessor(d))
    )
    .attr("fill", "#0277bd");
      console.log(dataset)
  var xAxisgen = d3.axisBottom().scale(xScale);
  var yAxisgen = d3.axisLeft().scale(yScale).ticks(25);

  var xAxis = svg
    .append("g")
    .call(xAxisgen)
    .style(
      "transform",
      `translateY(${dimensions.height - dimensions.margin.bottom}px)`
    )
    .selectAll("text")
    .attr("dx", "-1.5em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-65)");

  var yAxis = svg
    .append("g")
    .call(yAxisgen)
    .style("transform", `translateX(${dimensions.margin.left}px)`);
  
    var yAxisTitle = yAxis
    .append("text")
    .style("font", "24px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "end")
    .attr("x", -dimensions.height / 2 + dimensions.margin.bottom)
    .attr("y", -dimensions.margin.left / 2)
    .attr("transform", "rotate(-90)")
    .text("Amount in millions ($)");
}
