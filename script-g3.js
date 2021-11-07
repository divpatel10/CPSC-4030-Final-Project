
const margin = {top: 30, right: 30, bottom: 95, left: 60},
width = 950 - margin.left - margin.right,
height = 804 - margin.top - margin.bottom;


const svg = d3.select("#graph3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
     


d3.csv("Cassini.csv").then(function (dataset) {

var dst = dataset.filter(
  d => {return (d["Fiscal Year"] == "")}
);
dst = dst[0]
delete dst["Fiscal Year"]

if(dst.hasOwnProperty("Notes")){
  delete dst["Notes"]
}

if(dst.hasOwnProperty("Official LCC")){
  delete dst["Official LCC"]
}

var data = Object.entries(dst).map(([cost_type, cost]) => ({cost_type, cost}));

for(d in data){
  data[d].cost = +data[d].cost.slice(1, data[d].length).replaceAll(",", "");

}
//remove last two elements from the array (total costs)
data.splice(-1)
data.splice(-1)
console.log("data", data);
console.log(typeof(data))

const x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(d => d.cost_type))
  .padding(0.2);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-40)")
    .style("text-anchor", "end");


    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.cost)])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    svg.selectAll("mybar")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.cost_type))
    .attr("y", d => y(d.cost))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.cost))
    .attr("fill", "#d97325")
});
