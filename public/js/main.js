var timeline;
var pichart;
var linechart;

var selectionEventHandler = {};

var parseDate = d3.timeParse("%Y");

// Start app after loading data
loadData();

function loadData() {


    d3.csv("data/crashes.csv").then(function(data) {

        let years = [];
        let planes = [];
        let planesIndex = []; // Keeps track of index for given plane
        

        // Iterate through data counting fatalities per year for timeline
        // and line chart
        for (let i = 1908; i <= 2009; i++) {
            let crashes = 0;
            const yearData = data.filter(e => e.Date.split("/")[2] == i);

            var fatalities = 0;
            var date = parseDate(i.toString());
            yearData.forEach((element) => {
                if(element.Fatalities) {
                    fatalities += parseInt(element.Fatalities);
                }
                crashes += 1;
            });
            
            var tempDate = {
                "date": date,
                "crashes": crashes,
                "fatalities": fatalities
            };
            years.push(tempDate);
        }

        // Fix dates
        data.map((d) => {
            d.Date = new Date(d.Date);
        });
        
        timeline = new Timeline("timeline", years, selectionEventHandler);
        pichart = new PiChart("pichart", data);
        linechart = new LineChart("linechart", years);

        $(selectionEventHandler).bind("selectionChanged", (_, rangeStart, rangeEnd) => {
            linechart.onSelectionChange(rangeStart, rangeEnd);
            pichart.onSelectionChange(rangeStart, rangeEnd);
        });
    });
}