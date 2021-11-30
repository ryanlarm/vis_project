var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var valueline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.count); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/num_crashes_by_date.csv").then(function(data) {

    data.forEach(element => {
        // Convert values to date and int
        element.year = new Date(element.year, 0);
        element.count = +element.count;
    })

    console.log(data);

    x.domain(d3.extent(data, function(d) { return d.year; })).nice();
    y.domain([0, d3.max(data, function(d) { return d.count; })]).nice();

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(d3.timeYear.every(10))
            .tickFormat(d3.timeFormat("%Y"))
        );

    svg.append("text")
        .attr("transform",
              "translate(" + (width / 2) + " ," + 
                             (height + margin.top + 20) + ")")
        .text("Year");

    // y axis
    svg.append("g")
        .call(d3.axisLeft(y)
        .ticks(10));

    svg.append("text")
        .attr("transform", "translate(-40, 300) rotate(-90)")
        .text("Number of Airplane Crashes");

});
