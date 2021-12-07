var margin = {
        top: 30,
        right: 5,
        bottom: 80,
        left: 55
    },
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#operatorChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "operatorChartSvg")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var select = d3.select("#operatorChart")
    .insert("div", ":first-child")
    .append("select")
    .attr("class", "form-select");

var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat("%Y"));

var yAxis = d3.axisLeft()
    .scale(y);

var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis");

var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis");

var operatorDetails;

function updateData(data) {

    var yearAboardCount = d3.nest()
        .key(function (d2) {
            var date = new Date(d2.Date);
            return date.getFullYear();
        })
        .rollup(function (d2) {
            return d3.sum(d2, function (g) {
                return g.Aboard;
            });
        }).entries(data);

    var yearFatalityCount = d3.nest()
        .key(function (d2) {
            var date = new Date(d2.Date);
            return date.getFullYear();
        })
        .rollup(function (d2) {
            return d3.sum(d2, function (g) {
                return g.Fatalities;
            });
        }).entries(data);

    yearFatalityCount.forEach(element => {
        // Convert values to date and int
        element.key = new Date(element.key, 0);
        element.key = element.key;
    });

    yearAboardCount.forEach(element => {
        // Convert values to date and int
        element.key = new Date(element.key, 0);
        element.key = element.key;
    });

    x.domain(yearFatalityCount.map(function (d2) {
        return d2.key;
    }));

    y.domain([0, d3.max(yearAboardCount, function (d2) {
        return d2.value;
    }) + 3]).nice();

    // create tooltip element (taken from: https://perials.github.io/responsive-bar-chart-with-d3/)
    const tooltip = d3.select("body")
        .append("div")
        .attr("class","d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "rgba(0,0,0,0.6)")
        .style("border-radius", "9px")
        .style("color", "#fff")
        .text("a simple tooltip")
        .style("font-family", "HK Grotesk");

    // ---- DRAW BARS ----
    var barsAboard = svg.selectAll(".bar")
        .remove()
        .exit()
        .data(yearAboardCount);

    var barsFatalities = svg.selectAll(".bar")
        .remove()
        .exit()
        .data(yearFatalityCount);

    barsAboard.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.key);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("fill", "#d0c4f6")
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("width", x.bandwidth())
        // (taken from: https://perials.github.io/responsive-bar-chart-with-d3/)
        .on("mouseover", function(d) {
            var element = d.srcElement.__data__;
            // console.log(element.key);
            // var year = element.key.getFullYear();
            // console.log(yearAboardCount.get(element.key));
            tooltip.html("YEAR: " + element.key.getFullYear() + "<br>" + "Total # Aboard: " + element.value).style("visibility", "visible").style("font-weight", "bold");
        })
        .on("mousemove", function(){
            tooltip
                .style("top", (window.event.pageY-10)+"px")
                .style("left",(window.event.pageX+10)+"px");
        })
        .on("mouseout", function(d) {
            var element = d.srcElement.__data__;
            tooltip.html("YEAR: " + element.key.getFullYear() + "<br>" + "Total # Aboard: " + element.value).style("visibility", "hidden");
        })
        .on("click", function(d) {
            console.log("clicked");
            var element = d.srcElement.__data__;
            console.log(element);
            var filteredData = data.filter(function (d2) {
                var date = new Date(d2.Date);
                return date.getFullYear() == element.key.getFullYear();
            });
            console.log(filteredData);
            console.log("removing operatorDetailsSvg");
            d3.select("body").selectAll(".operatorDetailsSvg").remove().exit();
            operatorDetails = new OperatorDetails("#operatorDetails", filteredData);

            var operator = d3.select(".form-select").property("value");

            document.getElementById("incidentsTitle").innerHTML =  operator + " Crash Incidents in " + element.key.getFullYear();
        });

    barsFatalities.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.key);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("fill", "rgba(47,0,255,0.51)")
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("width", x.bandwidth())
        // (taken from: https://perials.github.io/responsive-bar-chart-with-d3/)
        .on("mouseover", function(d) {
            var element = d.srcElement.__data__;
            tooltip.html("YEAR: " + element.key.getFullYear() + "<br>" + "Total # Fatalities: " + element.value).style("visibility", "visible");
        })
        .on("mousemove", function(){
            tooltip
                .style("top", (window.event.pageY-10)+"px")
                .style("left",(window.event.pageX+10)+"px");
        })
        .on("mouseout", function(d) {
            var element = d.srcElement.__data__;
            tooltip.html("YEAR: " + element.key.getFullYear() + "<br>" + "Total # Fatalities: " + element.value).style("visibility", "hidden");
        })
        .on("click", function(d) {
            console.log("clicked");
            var element = d.srcElement.__data__;
            console.log(element);
            var filteredData = data.filter(function (d2) {
                var date = new Date(d2.Date);
                return date.getFullYear() == element.key.getFullYear();
            });
            console.log(filteredData);
            console.log("removing operatorDetailsSvg");
            d3.select("body").selectAll(".operatorDetailsSvg").remove().exit();
            operatorDetails = new OperatorDetails("#operatorDetails", filteredData);

            var operator = d3.select(".form-select").property("value");

            document.getElementById("incidentsTitle").innerHTML =  operator + " Crash Incidents in " + element.key.getFullYear();
        });


    // ---- DRAW AXIS	----
    xAxisGroup = svg.select(".x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("color", "rgba(96, 241, 255, 0.66)")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    yAxisGroup = svg.select(".y-axis")
        .call(yAxis);

    svg.select("text.axis-title").remove();

    svg.append("text")
        .attr("class", "axis-title")
        .attr("x", -150)
        .attr("y", -45)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".1em")
        .attr("font-family", "Space Mono")
        .attr("font-size", "12px")
        .attr("fill", "rgb(145,131,255)")
        .style("text-anchor", "end")
        .text("# of CASUALTIES");

    svg.append("text")
        .attr("class", "axis-title")
        .attr("x", 380)
        .attr("y", 447)
        .attr("dy", ".1em")
        .attr("font-family", "Space Mono")
        .attr("font-style", "italic")
        .attr("fill", "rgb(145,131,255)")
        .style("text-anchor", "end")
        .text("YEAR");
}

function getOperatorTotalFatalities(data) {
    // console.log(data);
    return d3.nest()
        .key(function(d) { return d.Operator;})
        .rollup(function(d) {
            return d3.sum(d, function(g) { return g.Fatalities; });
        }).map(data);
}

d3.csv("data/crashes.csv").then(function (data) {

    var operatorTotalFatalities = getOperatorTotalFatalities(data);

    data.sort(function(a, b) {
        return operatorTotalFatalities[b.Operator] - operatorTotalFatalities[a.Operator];
    });

    const uniqueOperators = [...new Set(data.map(element => element.Operator))];//.sort();

    uniqueOperators.sort(function(a, b) {
        return operatorTotalFatalities.get(b) - operatorTotalFatalities.get(a);
    });

    // console.log(uniqueOperators);

    uniqueOperators.unshift("All Operators");

    select.selectAll("option")
        .data(uniqueOperators)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) {
            if (d == "All Operators") {
                // Obtained from: https://stackoverflow.com/questions/61675192/how-to-get-sum-of-all-map-values-in-javascript
                const sum = Object.values(operatorTotalFatalities).reduce((acc, val) => acc + val, 0);
                console.log(sum);
                return d + ": " + sum;
            }
            else {
                return d + ": " + operatorTotalFatalities.get(d);
            }
        })
        .attr("font-family", "HK Grotesk");

    updateData(data);

    select
        .on("change", function (d) {
            var operator = d3.select(this).property("value");
            console.log("selected: " + operator);
            var filteredData;

            if (operator == "All Operators") {
                filteredData = data;
                console.log("removing operatorDetailsSvg");
                d3.select("body").selectAll(".operatorDetailsSvg").remove().exit();
                document.getElementById("incidentsTitle").innerHTML = "";
            }
            else {
                filteredData = data.filter(function (d2) {
                    return d2.Operator == operator;
                });
                console.log("removing operatorDetailsSvg");
                d3.select("body").selectAll(".operatorDetailsSvg").remove().exit();
                operatorDetails = new OperatorDetails("#operatorDetails", filteredData);

                document.getElementById("incidentsTitle").innerHTML =  operator + " Crash Incidents";
            }

            updateData(filteredData);
        });
});
