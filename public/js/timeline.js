/**
 * Constructor for the timeline
 * @param {string} _parentElement ID of the timeline div container
 * @param {[]} _data Array of deaths per year
 * @param {} eventHandler Event Handler for selection changes when brushing
 */
 function Timeline(_parentElement, _data, eventHandler) {
    let self = this;
    self.parent = _parentElement;
    self.displayData = _data;
    self.eventHandler = eventHandler;
    self.init();
}

/**
 * Initializer for timeline
 */
Timeline.prototype.init = function() {
    let self = this;
    timelineDiv = d3.select("#" + self.parent).classed("linechart", true);

    // Create SVG
    self.margin = {top: 20, bottom: 20, left: 80, right: 20};
    self.svgBounds = timelineDiv.node().getBoundingClientRect();
    // self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgWidth = 1400 - self.margin.left - self.margin.right;
    self.svgHeight = 150 - self.margin.bottom - self.margin.top;

    self.svg = timelineDiv.append("svg")
        .attr("width", self.svgWidth + self.margin.left + self.margin.right)
        .attr("height", self.svgHeight + self.margin.top + self.margin.bottom)
        .append("g")
            .attr("transform", "translate(80," + self.margin.top + ")");
    
    // Axes and scales
    self.y = d3.scaleLinear()
        .range([self.svgHeight, 0])
        .domain([
            0,
            d3.max(self.displayData, function(d) {
                return d.fatalities;
            })]);
    self.x = d3.scaleTime()
        .range([0, self.svgWidth])
        .domain(d3.extent(self.displayData, function(d) { return d.date; }));

    self.xAxis = d3.axisBottom()
        .scale(self.x)
        .tickSize(-110);



    self.yAxis = d3.axisLeft()
        .scale(self.y)
        .ticks(4);


    self.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + self.svgHeight + ")");

    self.svg.append("g")
        .attr("class", "y-axis axis");

    self.path = self.svg.append("path")
            .attr("fill", "rgba(55,239,224,0.15)")
            .attr("stroke", "rgba(14,232,232,0.79)")
            .attr("stroke-width", 1.5)
            .attr("class", "timeline-path")


    self.svg.append("text")
        .attr("class", "axis-title")
        .attr("x", -10)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".1em")
        .attr("font-family", "Space Mono")
        .attr("font-size", "11px")
        .attr("font-style", "italic")
        .attr("fill", "rgba(55,239,224,0.76)")
        .style("text-anchor", "end")
        .text("# of fatalities");

    self.svg.append("text")
        .attr("class", "axis-title")
        .attr("x", 300)
        .attr("y", 477)
        .attr("dy", ".1em")
        .attr("font-family", "Space Mono")
        .attr("font-style", "italic")
        .attr("font-size", "14px")
        .attr("fill", "rgba(55,239,224,0.15)")
        .style("text-anchor", "end")
        .text("YEAR");

    // Area generator for the vis
    self.area = d3.area()
        .curve(d3.curveBasis)
        .x(function(d) { return self.x(d.date); })
        .y0(self.svgHeight)
        .y1(function(d) { return self.y(d.fatalities); });

    // Update domains for updated selections
    let brush = d3.brushX()
        .on("brush", function({selection}) {
            if(selection == null) {
                $(self.eventHandler).trigger("selectionChanged", self.x.domain());
            } else {
                $(self.eventHandler).trigger("selectionChanged", selection.map(self.x.invert));
            }
        })
        .on("end", function(e) {

            // Reset domain when brush is removed
            if(e.selection == null) {
                $(self.eventHandler).trigger("selectionChanged", self.x.domain());
            }
        });

    self.svg.append("g")
        .call(brush)
        .selectAll("rect")
            .attr("height", self.svgHeight);

    self.wrangleData();
}

Timeline.prototype.wrangleData = function() {
    let self = this;
    self.updateVis();
}

/**
 * Renders the timeline
 */
Timeline.prototype.updateVis = function() {
    let self = this;

    // Draw the timeline
    self.path.datum(self.displayData)
        .attr("d", self.area);
        
    self.svg.select(".x-axis").call(self.xAxis);
    self.svg.select(".y-axis").call(self.yAxis);

}

/**
 * Event handler for when brushed selection is changed
 * @param {*} selectionStart 
 * @param {*} selectionEnd 
 */
Timeline.prototype.onSelectionChange = function(selectionStart, selectionEnd) {
    let self = this;
    self.wrangleData();
}
