function LineChart(_parentElement, _data) {
    let self = this;
    self.parent = _parentElement;
    self.data = _data;
    self.displayData = _data;
    self.init();
}

LineChart.prototype.init = function() {
    let self = this;

    let divLineChart = d3.select("#" + self.parent).classed("linechart", true);

    self.margin = {top: 20, right: 20, bottom: 50, left: 70};
    self.svgBounds = divLineChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 500 - self.margin.top - self.margin.bottom;

    self.svg = d3.select("#" + self.parent).append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .append("g")
            .attr("transform", "translate(" + self.margin.left + "," + "0" + ")");
    
    self.x = d3.scaleTime()
        .range([0, self.svgWidth])
        .domain(d3.extent(self.data, (d) => {
            return d.year;
        }));
    
    self.y = d3.scaleLinear()
        .range([self.svgHeight, 0])
        .domain([
            0, 
            d3.max(self.data, (d) => {
                return d.fatalities;
            })
        ])
    
    let line = d3.line()
        .x((d) => self.x(d.year))
        .y((d) => self.y(d.fatalities));

    let path = line(self.data);
    
    self.svg.append("path")
        .datum(self.data)
        .attr("stroke", "black")
        .attr("stroke-width", "2px")
        .attr("fill", "none")
        .attr("d", path);

}
