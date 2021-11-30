
    function runMainGraph( isInflation,  fileName, isManned){
      var margin = {top: 60, right: 60, bottom: 50, left: 60},
      // width = screen.width - margin.left - margin.right - 800,
      width = document.querySelector('.maingraph').offsetWidth - 200,
      // height = screen.height - margin.top - margin.bottom - 200 ;
      height = document.querySelector('.maingraph').offsetHeight - margin.top - margin.bottom - 200;
      console.log("height", height)
  // append the svg object to the body of the page
  var svg = d3.select("#main-graph")
          .append("svg")
    
      .attr("width", width + 200)
      .attr("height", height + 200)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`)
      svg.append("text")
      .style("font", "20px sans-serif")
      .style("fill", "black")
      .attr("text-anchor", "middle")
      .attr("dx", width / 2)
      .attr("dy", -30)
      .text("");
  
  // Parse the Data
  d3.csv(fileName).then( function(data) {
  d3.csv("cost-total.csv").then( function(total_cost_data) {

    



    var keys = data.columns.slice(1)
  
  
      // Filter function to remove the apollo mission data from the dataset 
      if(!isManned){

        data.filter(function(d) {
          delete d.Apollo;
          return d;
        })
      }
      
        var lineRange = []
  
        for(let i = 1965; i <= 2022; i+=5){
          lineRange.push(i)
        }
  
  
      // Add X axis
      var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, width ]);

      svg.append("g").attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("font-size", "20px")
      .call(d3.axisBottom(x).tickSize(-height).tickValues(lineRange))
      .select(".domain").remove()
      
      svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

      //add X-axis label:
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", width/2)
          .attr("y", (height)+50)
          .style("font-size", "2.45em")
          .text("Year");
          
    
      //add Y-axis
      var missionWiseData = keys.map(function(id) {
          return {
              id: id,
              values: data.map(d => {return {date: d.date, degrees: +d[id]}})
          };
      });
  

      var yScaleOffset = -500;
      if(!isInflation){
        yScaleOffset = 300;
      }

      if(isManned){
        if(isInflation){
          yScaleOffset = yScaleOffset - 14000;

        }
        else{

          yScaleOffset = yScaleOffset - 1400;
        }
      }
      
      var domain_val = yScaleOffset+d3.max(missionWiseData, d => d3.max(d.values, c => c.degrees))
      console.log("domain_val", domain_val)
      var y = d3.scaleLinear()
      .domain([ -domain_val, domain_val])
      .range([ height, 0 ]);


      var color = 
      ["#0D001F","#120029","#160034","#1B003E","#1F0048","#240052","#28005C","#2C0067","#310071","#35007B","#3A0085","#3E008F","#43009A","#4700A4","#4B00AE","#5000B8","#5400C2","#5900CD","#5D00D7","#6100E1","#6600EB","#6A00F5","#6F01FF","#750BFF","#7A15FF","#801FFF","#8629FF","#8C34FF","#913EFF","#9748FF","#9D52FF","#A35CFF","#A967FF","#AE71FF","#B47BFF","#BA85FF","#C08FFF","#C59AFF","#CBA4FF","#D1AEFF","#D7B8FF","#DDC2FF","#E2CDFF","#E8D7FF","#EEE1FF","#F4EBFF","#FAF5FF"]    
        color = color.reverse();
      console.log(color)
      //stack the data
      var stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
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
    
      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip.style("opacity", 1)

        d3.selectAll(".myArea").style("opacity", .15);
  
        Tooltip2
        .style("opacity", 1)
        .style("position", "absolute");

        d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
        
  
      }

      var total_budget;

      if(isInflation){
        total_budget = total_cost_data[0]
      }
      else{
        
        total_budget = total_cost_data[1]
      }

      var type_of_cost = "(with inflation)";

      if(!isInflation){
        type_of_cost = "(without inflation)"
      }

      var total_sorted = []
      for(var i in total_budget){
        total_sorted.push([i, +total_budget[i]])
      }
      total_sorted.sort(function compare(a,b){
        return (a[1] - b[1])
      })
      console.log("total budget", total_sorted)
      temp = []

      var missions_sorted = []

      for(var i in total_sorted){
        missions_sorted.push(total_sorted[i][0])
      }

//     temp.push(['Cassini', +total_budget['Cassini']])
//       console.log("total budget", missions_sorted.indexOf('Cassini'))
      console.log("total budget", total_sorted)

      // Color Legend 
      // var svgLegend = d3.select("#gradient-legend");
      // var g_legend = svgLegend.append("g").attr("transform", "translate(" + 30 + ", 0)");

      // var legend_xScale = d3.scaleLinear()
      //                     .range([0, 200])
      //                     .domain(d3.extent(total_sorted, function(d) { return d[1]; }))

      // var legend_xAxis = d3.axisBottom(legend_xScale)
      //                   .tickSize(135)  
      //                   .tickValues(total_sorted.filter(d => d[1] % 50 === 0).map(d => d[1]))


      var legendRange = []
      var min_leg = Math.round(total_sorted[0][1]/50)*50;
      var max_leg = Math.round(total_sorted[total_sorted.length-1][1]/50)*50;

      console.log("l2egend range",total_sorted[total_sorted.length-1][1])
      // legendRange.push(min_leg)
      for(let i = min_leg; i <= max_leg; i+=((max_leg - min_leg)/2)){
        temp = Math.round(i/100)*100 ;
        legendRange.push(temp)
        i = i + min_leg;
      }
        legendRange.push(max_leg)
      console.log("legend range",legendRange)

      var svg_legend = d3.select("#gradient-legend");
    // Add X axis
    var x_legend = d3.scaleLinear()
    .domain(d3.extent(total_sorted, function(d) { return d[1];}))
    .range([ 0, 200]);

    


    svg_legend.append("g").attr("class", "axis")
    .attr("transform", "translate(0," + 25 + ")")
    .call(d3.axisBottom(x_legend).tickSize(-25).tickValues(legendRange))
    .selectAll("text")
    .attr("font-size", "12px");

    svg_legend.append("text")
    .style("font", "14px sans-serif")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .attr("dx", 100)
    .attr("dy", 55)
    .text("in millions ($)");
    // .attr("margin-top", "115px")
    // .attr("transform", "rotate(-60)")
  

      // console.log("total cost budget",total_budget)
      var mousemove = function(event, d) {
      //   console.log(d)
        Tooltip2
        .html(d["key"] + "<br><br> Total Budget: $" + total_budget[d["key"]] + " millions" + "<br><br> "+ type_of_cost  )
        .style("left", ((event.x + 50)  + "px"))
        .style("top", (event.y) + "px");
  
  
      }
      var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
        d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "white");
  
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
          // console.log("keyy",d[d["index"]][1]
          .style("fill", function(d) {console.log("key: ", d.key, "color", color[missions_sorted.indexOf(d.key)]); return color[missions_sorted.indexOf(d.key)]; })
          .style("stroke", "white")
          .style("opacity", 1)
          .attr("d", area)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .on('click',(event,data)=> {
            console.log(data["key"]);
            document.getElementById("pieChart").innerHTML = "";
            pieChart(data["key"]);
  
            document.getElementById("barchart").innerHTML = "";
            barChart(data["key"]);
            // call new function here 
        })
  
    });
    });
}

runMainGraph(false, "main-data.csv")
