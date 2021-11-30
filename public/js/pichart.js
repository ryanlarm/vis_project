function PiChart(_parentElement, _data) {
    let self = this;
    self.parent = _parentElement;
    self.data = _data;
    self.displayData = _data;
    self.init();
}

PiChart.prototype.init = function() {
    let self = this;
    let divPiChart = d3.select("#" + self.parent).classed("pichart", true);

    self.margin = {top: 10, left: 10, right: 10, bottom: 10};
    self.svgBounds = divPiChart.node().getBoundingClientRect();
    self.svgWidth = (self.svgBounds.width - self.margin.left - self.margin.right) / 2;
    self.svgHeight = self.svgWidth;

    self.svg = divPiChart.append("svg")
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight)
        .append("g")
        .attr("transform", "translate(" + self.svgWidth / 2 + "," + self.svgHeight / 2 + ")");

    let radius = Math.min(self.svgWidth, self.svgHeight) / 2;

    let pie = d3.pie()
        .value((d) => {
            return (d.count > 20) ? d.count : 0;
        });
    
    let max = d3.max(self.data, (d) => { return d.count; });
    let domain = [0, max];
    let range = d3.schemeAccent;

    let colors = d3.scaleOrdinal()
        .domain(domain)
        .range(range);

    let arc = d3.arc()
        .innerRadius(radius / 2)
        .outerRadius(radius);

    let arcs = self.svg.selectAll("arc")
        .data(pie(self.data))
        .enter()
        .append("g")
            .attr("class", "arc");
    
    arcs.append("path")
        .attr("fill",(d) => {
            return colors(d.value);
        })
        .attr("d", arc)
        .attr("stroke", "black")
        .append("title")
            .text(function(d) {
                return  "Aircraft: " + d.data.aircraft + 
                        "\nCrashes: " + d.data.count;
            })

    self.wrangleData();
}

PiChart.prototype.wrangleData = function() {
    let self = this;
    self.displayData = self.updatedData;
    self.updateVis();
}

PiChart.prototype.updateVis = function() {
    let self = this;

    
}