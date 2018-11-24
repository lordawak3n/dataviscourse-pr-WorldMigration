
loadData();

// no country selected by default
this.activeCountry = null;
this.activeYear = '2002';

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

function loadData() {

    let countryDataArray = [];
    let worldMap;

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

            worldMap = new Map(countryDataArray);
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

const timeLine = new TimeLine(this.data, updateCountry, updateYear, this.activeYear);

function updateYear(year) {
    timeLine.activeYear = year;
}