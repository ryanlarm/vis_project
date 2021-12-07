

/**
 * Creates the vis instance variables and inits the vis
 * @param {string} _parentElement ID of parent div for the SVG
 * @param {[]} _data Array of fatalities per year
 */
function LineChart(_parentElement, _data) {
    let self = this;
    self.parent = _parentElement;
    self.data = _data;
    self.displayData = _data;
    self.init();
}

/**
 * Initializes the vis using entire data set
 */
LineChart.prototype.init = function() {
    let self = this;

    let divLineChart = d3.select("#" + self.parent).classed("linechart", true);

    self.margin = {top: 20, right: 20, bottom: 60, left: 50};
    self.svgBounds = divLineChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 500 - self.margin.top - self.margin.bottom;

    self.svg = d3.select("#" + self.parent).append("svg")
        .attr("width", self.svgWidth + self.margin.left + self.margin.right)
        .attr("height", self.svgHeight + self.margin.top + self.margin.bottom)
        .append("g")
            .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    self.x = d3.scaleTime()
        .range([0, self.svgWidth])
        .domain(d3.extent(self.displayData, function(d) { return d.date; }));

    self.y = d3.scaleLinear()
        .range([self.svgHeight, 0])
        .domain([
            0,
            d3.max(self.displayData, function(d) {
                return d.crashes;
            })
        ]);

    self.xAxis = d3.axisBottom()
        .scale(self.x);

    self.yAxis = d3.axisLeft()
        .scale(self.y);

    self.path = self.svg.append("path")
        .attr("class", "path")

    self.lineGenerator = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return self.x(d.date); })
        .y(function(d) { return self.y(d.crashes); });

    self.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + self.svgHeight + ")");

    self.svg.append("g")
        .attr("class", "y-axis axis");

   self.svg.append("text")
        .attr("class", "axis-title")
        .attr("x", -180)
        .attr("y", -41)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".1em")
        .attr("font-family", "Space Mono")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .style("text-anchor", "end")
        .text("# of CRASHES");

    self.svg.append("text")
        .attr("class", "axis-title")
        .attr("x", 300)
        .attr("y", 477)
        .attr("dy", ".1em")
        .attr("font-family", "Space Mono")
        .attr("font-style", "italic")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .style("text-anchor", "end")
        .text("YEAR");

    self.wrangleData();
}

/**
 * Updates the vis to use the selected data
 */
LineChart.prototype.updateVis = function() {
    let self = this;

    // Update y domain
    self.y.domain(d3.extent(self.displayData, function(d) {
        return d.crashes;
    }));



    self.path.datum(self.displayData)
        .transition()
            .duration(1000)
        .attr("d", self.lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", "1px")

    self.svg.select(".x-axis").call(self.xAxis);
    self.svg.select(".y-axis").call(self.yAxis);
}


/**
 * Updates the displayed data before updating
 * using given selection
 */
LineChart.prototype.wrangleData = function() {
    let self = this;
    self.updateVis();
}

LineChart.prototype.onSelectionChange = function(start, end) {
    let self = this;

    // Update displayed data from selected range
    self.displayData = self.data.filter(function(d) {
        return (d.date >= start && d.date <= end) ? true : false;
    });

    // Update the x scale domain
    self.x.domain(d3.extent(self.displayData, function(d) {
        return d.date;
    }));

    self.wrangleData();
}
