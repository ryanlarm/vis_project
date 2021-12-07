function OperatorDetails(_parentElement, _data) {
    var self = this;
    self.parent = _parentElement;
    self.displayData = _data;
    self.init();
    self.update();
}

OperatorDetails.prototype.init = function() {
    var self = this;

    var margin = {
        top: 30,
        right: 5,
        bottom: 80,
        left: 5
    }
    width = 410 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    divOperatorDetails = d3.select(self.parent).classed("operatorDetails", true);

    //creates svg elements within the div
    self.operatorDetailsSvg = divOperatorDetails.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "operatorDetailsSvg")
        .attr("transform", "translate(" + margin.left + ",0)")
}

OperatorDetails.prototype.update = function() {
    var self = this;

    // create tooltip element (taken from: https://perials.github.io/responsive-bar-chart-with-d3/)
    const tooltip = d3.select("body")
        .append("div")
        .attr("class","d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "rgba(6,6,30,0.58)")
        .style("border-radius", "5px")
        .style("color", "#fff")
        .style("margin-right", "50px");


    // document.getElementById("incidentsTitle").innerHTML = "Unique Incidents";
    // self.operatorDetailsSvg.selectAll(".operatorDetailsSvg")
    //     .append("text")
    //     .style("font-size", "16px")
    //     .text("Unique Incidents");
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .text("hello");


    self.operatorDetailsSvg.selectAll(".operatorDetailsSvg")
        .data(self.displayData)
        .enter()
        // .append("text")
        // .attr("x", (width / 2))
        // .attr("y", 0 - (margin.top / 2))
        // .attr("text-anchor", "middle")
        // .style("font-size", "16px")
        // .text("Unique Incidents")
        .append("svg:image")
        .attr("class", "plane")
        .attr("xlink:href", "images/airplane.png")
        // .attr("transform", "translate(1000, 0)")
        .attr("x", function(d, i) {
            while (i >= 20) {
                i = i - 20;
            }
            return (i * 20) + 20;
        })
        .attr("y", function(d, i) {

            var count = 0;
            while (i >= 20) {
                i = i - 20;
                count++;
            }
            return count * 20;
        })
        .attr("width", "20")
        .attr("height", "20")
        .on("mouseover", function(d) {
            var element = d.srcElement.__data__;
            // console.log(element);
            tooltip.html("Operator: " + element.Operator + "<br>" + "Location: " + element.Location + "<br>" + "Aboard: " + element.Aboard + "<br>" + "Fatalities: " + element.Fatalities + "<br>" + "Date: " + element.Date + "<br>" + "Description: " + element.Summary).style("visibility", "visible").style("font-family", "HK Grotesk");
        })
        .on("mousemove", function(){
            tooltip
                .style("top", (window.event.pageY-10)+"px")
                .style("left",(window.event.pageX+10)+"px");
        })
        .on("mouseout", function(d) {
            // var element = d.srcElement.__data__;
            tooltip.style("visibility", "hidden");
        });
}
