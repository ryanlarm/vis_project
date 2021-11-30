
/**
 * Constructor for the timeline
 * @param {string} _parentElement ID of the timeline div container
 * @param {[]} _data Array of deaths per year
 */
function Timeline(_parentElement, _data) {
    let self = this;
    self.parent = _parentElement;
    self.displayData = _data;
    self.init();
}


/**
 * Initializer for timeline
 */
Timeline.prototype.init = function() {

    let self = this;
    
    let divTimeline = d3.select("#" + self.parent).classed("timeline", true);
    
    self.margin = {top: 10, right: 10, left: 10, bottom: 20};
    self.svgBounds = divTimeline.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    self.svg = divTimeline.append("svg")
        .attr("width", self.svgWidth + self.margin.left + self.margin.right)
        .attr("height", self.svgHeight + self.margin.top + self.margin.bottom)
        .append("g")
	    .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");


    // Scale and axes
    self.x = d3.scaleTime()
        .range([0, self.svgWidth])
        .domain(
            d3.extent(self.displayData, function(d) { return d.date; })
        );
    
    self.y = d3.scaleLinear()
        .range([self.svgHeight, 0])
        .domain([
            0,
            d3.max(self.displayData, function(d) { return d.fatalities; })
        ]);
        
    self.xAxis = d3.axisBottom()
        .scale(self.x);

    self.area = d3.area()
        .x(function(d) {return self.x(d.date); })
        .y0(self.svgHeight)
        .y1(function(d) {return self.y(d.fatalities); });
    
    self.svg.append("path")
        .datum(self.displayData)
        .attr("fill", "#b2a8c7")
        .attr("d", self.area);


    let brush = d3.brushX()
        .extent([[0,0], [self.svgWidth, self.svgHeight]])
        .on("brush end", brushed);

    let brushGroup = self.svg.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
            .attr("y", 0)
            .attr("height", self.svgHeight)

    // d3.select("body")
    //         .on("wheel", function(d) {
    //             // brushSelection[0] += (d.deltaY * -0.01);
    //             // brushSelection[1] += (d.deltaY * -0.01);
    //             brushSelection[0] += -1 * d.deltaY;
    //             brushSelection[1] += -1 * d.deltaY;

    //             // Only move the brush selection if it's actually on the screen
    //             if(brushSelection) {
    //                 if(d.deltaY < 0) { // Scroll up
    //                     // console.log(brushSelection);
                        
    //                     // brushGroup.call(brush.move, function() {
    //                     //     return [brushSelection];
    //                     // });

    //                 } else { // Scroll down
                        
    //                 }
    //             }
    //         });
    
    self.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0, 100)")
        .call(self.xAxis);

        
}

