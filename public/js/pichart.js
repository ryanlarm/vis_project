/**
 * TODO:
 * - [ ] Transition
 * - [ ] Change fill color with index into color scheme
 */

var numDisplay = 10; // Number of aircrafts to display in chart

/**
 * Constructor for the pi chart
 * @param {string} _parentElement Name of div containing chart
 * @param {[]} _data The entire dataset
 */
function PiChart(_parentElement, _data) {
    let self = this;
    self.parent = _parentElement;
    self.data = _data;
    self.displayData = [];
    self.selectedData = _data;
    self.init();
}

/**
 * Initializes the SVG
 */
PiChart.prototype.init = function() {
    let self = this;

    let piChartDiv = d3.select("#" + self.parent).classed("pichart", true);

    self.margin = {top: 10, left: 10, right: 10, bottom: 10};
    self.svgBounds = piChartDiv.node().getBoundingClientRect();
    self.svgWidth = (self.svgBounds.width / 2) - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth;

    self.svg = piChartDiv.append("svg")
        .attr("width", self.svgWidth + self.margin.left + self.margin.right)
        .attr("height", self.svgHeight + self.margin.left + self.margin.right)
        .append("g")
            .attr("transform", "translate(" + self.svgWidth / 2 + "," + self.svgHeight / 2 + ")");

    self.getData(self.data[0].Date, self.data[self.data.length - 1].Date);

    let radius = Math.min(self.svgWidth, self.svgHeight) / 2;
    self.colors = d3.scaleOrdinal()
        .range(d3.schemeAccent)
        .domain([
            0,
            d3.max(self.displayData, function(d) {return d.count; })
        ]);

    self.pie = d3.pie()
        .value(function(d) {
            return (d.count > numDisplay) ? d.count : 0;
        });

    self.arc = d3.arc()
        .innerRadius(radius / 2)
        .outerRadius(radius);

    self.arcs = self.svg.selectAll("arc")
        .data(self.pie(self.displayData))
        .enter()
        .append("g")
            .attr("class", "arc");

    self.wrangleData();
}

/**
 * Fitlers from entire data for top numDisplay points to display
 * @param {Date} start Start date for current selection
 * @param {Date} end End date for current selection
 */
PiChart.prototype.getData = function(start, end) {
    let self = this;

    // Filter out points not in range
    self.selectedData = self.data.filter(function(d) {
        return (d.Date >= start && d.Date <= end) ? true : false;
    });

    // Count number of plane crashes per type in given range
    self.displayData = [];
    let indexCounter = [];
    self.selectedData.forEach(function(d) {
        if(d.Type && d.Type !== "") {
            let index = indexCounter.indexOf(d.Type);
            if(index !== -1) {
                self.displayData[index].count += 1;
            } else {
                let tempData = {
                    "count": 1,
                    "aircraft": d.Type,
                };
                self.displayData.push(tempData);
                indexCounter.push(d.Type);
            }
        }
    });

    // Take top numDisplay elements to display in the pi chart
    self.displayData = self.displayData.sort((a, b) => b.count - a.count).slice(0, numDisplay);
}

PiChart.prototype.wrangleData = function() {
    let self = this;
    self.updateVis();
}

/**
 * Renders the vis and called whenever there's an update
 */
PiChart.prototype.updateVis = function() {
    let self = this;

    // Update color domain to match new selection
    self.colors.domain([
        0,
        d3.max(self.displayData, function(d) { return d.count; })
    ]);

    self.arcs = self.svg.selectAll("arc")
        .data(self.pie(self.displayData))
        .enter()
        .append("g")
            .attr("class", "arc");

    self.arcs.append("path")
        .attr("fill", function(d) {
            return self.colors(d.value);
        })
        .attr("d", self.arc)
        .attr("stroke", "black");
}

/**
 * Updates the data given current brushed selection
 * @param {Date} start Start date for current selection
 * @param {Date} end End date for current selection
 */
PiChart.prototype.onSelectionChange = function(start, end) {
    let self = this;
    self.getData(start, end);
    self.wrangleData();
}
