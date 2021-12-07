/**
 * Creates the vis instance variables and inits the vis
 * @param {string} _parentElement ID of parent div for the SVG
 * @param {[]} _data
 */
function BubbleChart(_parentElement, _data) {
    let self = this;
    self.parent = _parentElement;
    self.data = _data;
    self.displayData = _data;
    self.init();
}

/**
 * Initializes the vis using entire data set
 */
BubbleChart.prototype.init = function() {
    let self = this;

    let divBubbleChart = d3.select("#" + self.parent).classed("bubblechart", true);

    let data_count = d3.nest()
        .key(function(d) {
            return d.Time;
        })
        .rollup(function(a) {
            return a.length;
        })
        .entries(self.data);

    data_count.forEach(function(d) {
        const tParser = d3.timeParse("%I:%M")
        const hr = tParser(d.key)
        const hr1 = d3.timeFormat("%I:%M")(hr)
        d.key = hr
    });

    console.log(data_count)

    self.margin = {top: 50, right: 80, bottom: 40, left: 80};
    self.svgBounds = divBubbleChart.node().getBoundingClientRect();
    self.svgWidth = 1300 - self.margin.left - self.margin.right;
    self.svgHeight = 160;

    self.svg = d3.select("#" + self.parent).append("svg")
        .attr("width", self.svgWidth + self.margin.left + self.margin.right)
        .attr("height", self.svgHeight + self.margin.top + self.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    self.x = d3.scaleTime()
        .range([0, self.svgWidth])
        .domain(d3.extent(data_count, function(d) { return d.key; }));

    self.xAxis = d3.axisBottom()
        .scale(self.x)
        .tickFormat(d3.timeFormat("%I %p"))
        .tickSize(-160);

    self.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + self.svgHeight + ")");

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#bubblechart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("font-family", "Space Mono")
        .style("font-kerning", "4px")
        .style("font-size", "13px")
        .style("font-style", "italic")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "rgb(36,255,244)")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function(event, d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("Time: " + d.key)
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
    }
    const moveTooltip = function(event, d) {
        tooltip
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
    }
    const hideTooltip = function(event, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    self.svg.select('g')
        .selectAll("dot")
        .data(data_count)
        .join("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d){
            return (self.x(d.key))
        })
        .attr("cy", -80)
        .attr("r", d => (d.value*2))
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip );


    self.wrangleData();
}

/**
 * Updates the vis to use the selected data
 */
BubbleChart.prototype.updateVis = function() {
    let self = this;


    self.svg.select(".x-axis").call(self.xAxis);
}


/**
 * Updates the displayed data before updating
 * using given selection
 */
BubbleChart.prototype.wrangleData = function() {
    let self = this;
    self.updateVis();
}