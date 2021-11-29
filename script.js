
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
  
      // svg.append("g").attr("class", "axis")
      // .call(d3.axisLeft(y));
      // svg.append("text")
      //     .attr("x", -150)
      //     .attr("y", -90)
      //     .attr("transform", "rotate(-90)")
      //     .attr("dy", ".4em")
      //     .style("text-anchor", "end")
      //     .style("font-size", "2.45em")
      //     .text("Budget in millions ($)");
    
      // // color palette
      // const color = d3.scaleOrdinal()
      // .domain(keys)
      // .range([
      //   '#e0ffff','#b9d9eb','#7df9ff','#7FFFD4','#6CB4EE','#007FFF','#89CFF0','#0000FF',
      //   '#318CE7','#5072A7','#6699CC','#0039a6','#13274F','#0a2351','#3457D5','#5F9EA0',
      //   '#00BFFF','#0CAFFF','#1034A6','#7DF9FF','#15f4ee','#3F00FF','#6050DC','#1ca9c9',
      //   '#4B9CD3','#B9D9EB','#012169','#6F00FF','#2c3968','#00416A','#0077c0','#002244',
      //   '#2a52be','#00FFFF','#1E90FF','#003399','#073980','#E0FFFF','#00538C',
      //   '#034694','#00BFFF','#008E97','#1877F2','#99FFFF','#87CEFA','#0000CD','#000080'
      // ])  
      // const color = d3.scaleOrdinal()
      // .domain(missions_sorted)
      // .range(
      //   //BLUE ["#000c1e","#1f75fe","#000f28","#297bfe","#001332","#3381fe","#00173c","#3e87fe","#001b47","#488efe","#001f51","#5294fe","#00235b","#5c9afe","#002765","#66a0fe","#012b6f","#70a7fe","#012f79","#7aadfe","#013383","#85b3fe","#01378e","#8fbafe","#013b98","#99c0ff","#013fa2","#a3c6ff","#0142ac","#adccff","#0146b6","#b7d3ff","#014ac0","#c2d9ff","#014ecb","#ccdfff","#0152d5","#d6e6ff","#0156df","#e0ecff","#015ae9","#eaf2ff","#015ef3","#f4f8ff","#0162fd","#feffff","#0b68fe","#00040a","#156efe","#000814","#1f75fe","#000c1e","#297bfe","#000f28","#3381fe","#001332","#3e87fe","#00173c","#488efe","#001b47","#5294fe","#001f51","#5c9afe","#00235b","#66a0fe","#002765","#70a7fe","#012b6f","#7aadfe","#012f79","#85b3fe","#013383","#8fbafe","#01378e","#99c0ff","#013b98","#a3c6ff","#013fa2","#adccff","#0142ac","#b7d3ff","#0146b6","#c2d9ff","#014ac0","#ccdfff","#014ecb","#d6e6ff","#0152d5","#e0ecff","#0156df","#eaf2ff","#015ae9","#f4f8ff","#015ef3","#feffff","#0162fd"]
      //   ["#000000","#6f00ff","#04000a","#740aff","#090014","#7a14ff","#0d001f","#801fff","#120029","#8629ff","#160033","#8b33ff","#1b003d","#913dff","#1f0047","#9747ff","#230052","#9d52ff","#28005c","#a35cff","#2c0066","#a866ff","#310070","#ae70ff","#35007a","#b47aff","#390085","#ba85ff","#3e008f","#bf8fff","#420099","#c599ff","#4700a3","#cba3ff","#4b00ad","#d1adff","#5000b8","#d7b8ff","#5400c2","#dcc2ff","#5800cc","#e2ccff","#5d00d6","#e8d6ff","#6100e0","#eee0ff","#6600eb","#f3ebff","#6a00f5","#f9f5ff","#6f00ff","#000000","#740aff","#04000a","#7a14ff","#090014","#801fff","#0d001f","#8629ff","#120029","#8b33ff","#160033","#913dff","#1b003d","#9747ff","#1f0047","#9d52ff","#230052","#a35cff","#28005c","#a866ff","#2c0066","#ae70ff","#310070","#b47aff","#35007a","#ba85ff","#390085","#bf8fff","#3e008f","#c599ff","#420099","#cba3ff","#4700a3","#d1adff","#4b00ad","#d7b8ff","#5000b8","#dcc2ff","#5400c2","#e2ccff","#5800cc","#e8d6ff","#5d00d6","#eee0ff","#6100e0","#f3ebff","#6600eb","#f9f5ff","#6a00f5"]

      //   )  

      var color = 
              [
                
"#0D001F","#120029","#160034","#1B003E","#1F0048","#240052","#28005C","#2C0067","#310071","#35007B","#3A0085","#3E008F","#43009A","#4700A4","#4B00AE","#5000B8","#5400C2","#5900CD","#5D00D7","#6100E1","#6600EB","#6A00F5","#6F01FF","#750BFF","#7A15FF","#801FFF","#8629FF","#8C34FF","#913EFF","#9748FF","#9D52FF","#A35CFF","#A967FF","#AE71FF","#B47BFF","#BA85FF","#C08FFF","#C59AFF","#CBA4FF","#D1AEFF","#D7B8FF","#DDC2FF","#E2CDFF","#E8D7FF","#EEE1FF","#F4EBFF","#FAF5FF"]

                

      color = color.reverse();
      // console.log(color)
  
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
      // console.log("total budget", total_sorted)

      var missions_sorted = []

      for(var i in total_sorted){
        missions_sorted.push(total_sorted[i][0])
      }

      // console.log("total budget", missions_sorted)



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
          .style("fill", function(d) { 
            // console.log(d.key, missions_sorted.indexOf(d.key), color[missions_sorted.indexOf(d.key)]);
             return color[missions_sorted.indexOf(d.key)]; })
          .style("stroke", "white")
          .style("opacity", 1)
          .attr("d", area)
          .attr("cursor", "pointer")
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .on('click',(event,data)=> {
            // console.log(data["key"]);
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
