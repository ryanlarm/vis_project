var timeline;
var pichart;
var linechart;

var parseDate = d3.timeParse("%Y");
var brushSelection;

// Start app after loading data
loadData();

function loadData() {


    d3.csv("data/crashes.csv").then(function(data) {

        var years = [];
        var planes = [];
        var planesIndex = []; // Keeps track of index for given plane

        // Iterate through data counting fatalities per year for timeline
        // and line chart
        for (let i = 1908; i <= 2009; i++) {
            const yearData = data.filter(e => e.Date.split("/")[2] == i);

            var fatalities = 0;
            var date = parseDate(i.toString());
            yearData.forEach((element) => {
                if(element.Fatalities) {
                    fatalities += parseInt(element.Fatalities);
                }
            });
            
            var tempDate = {
                "date": date,
                "year": date.getFullYear(),
                "fatalities": fatalities
            };
            years.push(tempDate);
        }

        // Get Plane type from data for pichart
        data.forEach((e, i) => {

            if(e.Type && e.Type !== "") {

                let index = planesIndex.indexOf(e.Type);
                if(index != -1) {
                    planes[index].count += 1;
                } else {

                    let tempData = {
                        "count": 1,
                        "aircraft": e.Type,
                        "year": e.Year
                    }
                    planes.push(tempData);
                    planesIndex.push(e.Type);
                }
            }
        });
        
        timeline = new Timeline("timeline", years);
        pichart = new PiChart("pichart", planes);
        linechart = new LineChart("linechart", years);
    });
}

function brushed({selection}) {
    brushSelection = selection;

    // linechart.x.domain(
    //     !selection ? timeline.x.domain() : selection.map(timeline.x.invert)
    // );
    // linechart.wrangleData();

    // pichart.x.domain(
    //     !selection ? timeline.x.domain() : selection.map(timeline.x.invert)
    // );
    // pichart.wrangleData();

    
}