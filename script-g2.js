function barChart (fileName, hasFilter, filterName){
  
  var margin = {top: 40, right: 30, bottom: 50, left: 60},
  // width = 500 - margin.left - margin.right,
  // height = 440 - margin.top - margin.bottom;
  width = document.querySelector('.secondgraph').offsetWidth - margin.left - margin.right ,
  height = document.querySelector('.secondgraph').offsetHeight - margin.top - margin.bottom 
  var svg = d3.select("#barchart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
  d3.csv("./data/" + fileName + ".csv").then( function(data) {
  // Remove fields that are not required
  for(d in data){
  delete data[d]["Notes"];
  delete data[d]["Official LCC"];
  delete data[d]["Total Cost"];
  delete data[d]["Total Cost (inflation adj)"];
  for(prop in data[d]){
    data[d][prop] = +data[d][prop].split('$').join('').replaceAll(",", "");         
  }
  }
  data = data.filter((d) => {
  return d["Fiscal Year"] != "";
  })
  // console.log("Ayy", data[0])
  var values = []
  for(d in data){
    temp = 0
    for(var prop in data[d]){
      if(prop != "Fiscal Year"){
        temp = temp+data[d][prop]
      }
      
    }
    values.push(temp)
  }
  var data_before  = data.map(a => ({...a}));
    // console.log(values)
    var color = ["#66c2a5", "#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]
    var color_map={};
    Object.keys(data[0]).forEach(function(d,i){
      if(d != "Fiscal Year")
      color_map[d] = color[i-1];
    });
    
    console.log("cmap", color_map)
    
  for (d in data){
    if(hasFilter){
      Object.keys(data[d]).forEach(function(dt){
        // console.log("dt",dt)
        if(dt != filterName &&  dt != "Fiscal Year") {
          // console.log("deleted", dt, "filename", filterName)
          delete data[d][dt];
        }
      });
    
    }
    }
    // console.log("data before",data_before)
  const subgroups = Object.keys(data[0]).slice(1)
  const subgroups_uf = Object.keys(data_before[0]).slice(1)
  // console.log("Subgroups",subgroups)
  const groups = []
  for(d in data){
  groups.push(data[d]["Fiscal Year"])
  }
  // console.log("Groups",groups)
  // Add the X-axis
  var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2])
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2)
    .attr("y", (height)+40)
    .style("font-size", "1.45em")
    .text("Year");
  svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");
  // Add the Y-axis
  var y = d3.scaleLinear()
  .domain([0, d3.max(values)])
  .range([ height, 0 ]);
  svg.append("g")
  .call(d3.axisLeft(y));
  svg.append("text")
            .attr("x", -200)
            .attr("y", -40)
            .attr("transform", "rotate(-90)")
            .attr("dy", ".4em")
            .style("text-anchor", "end")
            .style("font-size", "1.45em")
            .text("Budget in millions ($)");
            
    //Title of the chart
    var chartTitle = svg
    .append("text")
    .style("font", "16px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dx", width / 2)
    .attr("dy", -10)
    .text("How has the cost breakdown of " + fileName + " changed over time?")
    
  //stack the data
  var stackedData = d3.stack()
  .keys(subgroups)
  (data)
  var uf_stackedData = d3.stack()
  .keys(subgroups_uf)
  (data_before)
  // console.log("stacked", unfiltered_stackedData)
  // console.log(stackedData)
  // Show the bars
  svg.append("g")
  .selectAll("g")
  .data(stackedData)
  .join("g")
    .attr("fill", function(d){console.log("color val",color_map[d.key]); return color_map[d.key]})
    .attr("class", d => "myRect " + d.key ) 
    .selectAll("rect")
    .data(d => d)
    .join("rect")
      .attr("x", d =>  x(d.data["Fiscal Year"]))
      .attr("y", 0)
      .attr("height", 0)
      .attr("width",x.bandwidth())
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
  svg.selectAll("legends")
  .data(uf_stackedData)
  .enter()
  .append("circle")
  .attr("cx", width - 160)
  .attr("cy", function(d,i){ return 15 + i*20}) 
  .attr("r", 7)
  .style("fill", function(d){  return color_map[d.key]})
    svg.selectAll("mylabels")
    .data(uf_stackedData)
    .enter()
    .append("text")
      .attr("x", width - 150)
      .attr("y", function(d,i){ return 15 + i*20}) 
      .style("fill", "black")
      .text(function(d){ return d.key})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("font-size", "12px")
      svg.selectAll("rect")
        .transition()
        .duration(15)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .delay(function(d,i){ return((i*0.5)*45)})
  })
  
  }

barChart("Galileo");
