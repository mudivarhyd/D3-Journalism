// @TODO: YOUR CODE HERE!
// Store width and height parameters to be used in later in the canvas
var svgWidth = 960;
var svgHeight = 600;

// Set svg margins 
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
// Create the width and height based svg margins and parameters to fit chart group within the canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv", function(error, statedata) {

// Throw an error if one occurs
if (error) throw error;
//console.log(statedata);

// Format data to number
statedata.map(function (data) {
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
});

// Linear scale with a range between 0 and the width
var xLinerScale = d3.scaleLinear()
  .domain([8.1, d3.max(statedata, data => data.poverty)])
  .range([0, width]);
// Linear scale with a range between height and 0
var yLinearScale = d3.scaleLinear()
  .domain([4.6,d3.max(statedata, data => data.healthcare)])
  .range([height, 0]);

// Create two functions passing scale as argument
//var bottomAxis = d3.axisBottom(xLinerScale).ticks(7);
var bottomAxis = d3.axisBottom(xLinerScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append axis to the chart group
chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
chartGroup.append("g").call(leftAxis);

// Create scatter plot
var circleGroup = chartGroup.selectAll("circle")
  .data(statedata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinerScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("fill", "red")
  .attr("opacity", ".65")

var circleGroup = chartGroup.selectAll()
  .data(statedata)
  .enter()
  .append("text")
  .attr("x", d => xLinerScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .style("font-size", "12px")
  .style("text-anchor", "middle")
  .style("fill", "yellow")
  .text(d => (d.abbr));

// Tool tips
var tooltip = d3.tip()
  .attr("class", "tooltip")
  .offset([80. -60])
  .html(function (d) {
    return (`${d.state}<br>Poverty: ${d.poverty}%<br>healthcare: ${d.healthcare}% `);
  });
chartGroup.call(tooltip);

// Create listner
circleGroup.on("mouseover", function (data) {
  tooltip.show(data, this);
})
  // onmouseout event
  .on("mouseout", function (data) {
    tooltip.hide(data);
  });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left +40)
    .attr("x", 0 - (height/2))
    //.attr("dy", "length")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height+margin.top+30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
});
