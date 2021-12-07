var timeline;
var pichart;
var linechart;
var bubblechart;

var selectionEventHandler = {};

var parseDate = d3.timeParse("%Y");

// Start app after loading data
loadData();

$(document).ready(function () {
    var sildeNum = $('.page').length,
        wrapperWidth = 100 * sildeNum,
        slideWidth = 100/sildeNum;
    $('.wrapper').width(wrapperWidth + '%');
    $('.page').width(slideWidth + '%');

    $('a.scrollitem').click(function(){
        $('a.scrollitem').removeClass('selected');
        $(this).addClass('selected');

        var slideNumber = $($(this).attr('href')).index('.page'),
            margin = slideNumber * -100 + '%';

        $('.wrapper').animate({marginLeft: margin},1000);
        return false;
    });
});

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
        bubblechart = new BubbleChart("bubblechart", data);

        $(selectionEventHandler).bind("selectionChanged", (_, rangeStart, rangeEnd) => {
            linechart.onSelectionChange(rangeStart, rangeEnd);
            pichart.onSelectionChange(rangeStart, rangeEnd);
        });
    });
}
