
loadData();

// no country selected by default
let activeCountry = null;
var activeYear;
var worldMap;;
var timeLine;

class CountryData{

    constructor(type, id, properties, geometry, region, name, data) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
        this.data = data;
    }
}

function SetupMenuBar() {
    let menuBar = d3.select(".menuBar");

    menuBar.append("button")
        .text("Progress Book")
        .classed("button", true)
        .on('click', function(){
            let url = "https://lordawak3n.github.io/dataviscourse-pr-WorldMigration/Project Documentation/CS 6630 - Process Book.pdf";
            window.open(url)
        });
    menuBar.append("button")
        .text("Screencast")
        .classed("button", true)
        .on('click', function(){
            let url = "https://youtu.be/Yy4Whzhtf_A";
            window.open(url)
        });
}

function loadData() {

    SetupMenuBar();

    let countryDataArray = [];
    activeYear = 2016;

    d3.json('data/world.json').then(mapData => {
        //worldMap.drawMap(mapData);

        let geojson = topojson.feature(mapData, mapData.objects.countries);
            countryDataArray = geojson.features.map(d => {
            let regiondata = 'tbi';
            return new CountryData(d.type, d.id, d.properties, d.geometry, regiondata, null);
        });

        d3.csv('data/outputWithoutYear.csv').then(data =>{
            data.forEach(function(element){
                countryDataArray.forEach(function(country){
                    if(country.id === element.Id)
                        country.data = element;});
            });

            worldMap = new Map(countryDataArray, activeYear);
            timeLine = new TimeLine(this.data, updateCountry, updateYear, activeYear);
            //barChart=new TrendChart(countryDataArray);
            worldMap.drawMap(mapData);
        });
        //console.log(countryDataArray);
    });
}

function updateCountry(countryID) {

        that.activeCountry = countryID;

        //TODO - Please use this to update the country data
        //timeLine.updatePlot();
    }

function updateYear(year) {
    // updating active Year in Map class to redraw animations
    timeLine.activeYear = year;
    worldMap.updateYear(year);
}