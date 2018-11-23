
loadData();
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
    let trendChart;

    d3.json('data/world.json').then(mapData => {
        //worldMap.drawMap(mapData);

        let geojson = topojson.feature(mapData, mapData.objects.countries);
            countryDataArray = geojson.features.map(d => {
            let regiondata = 'tbi';
            return new CountryData(d.type, d.id, d.properties, d.geometry, regiondata, null);
        });


        worldMap = new Map(countryDataArray);
        trendChart=new TrendChart(countryDataArray);
        //console.log(countryDataArray);
        worldMap.drawMap(mapData);
        trendChart.drawBarChart();
    });
    //console.log(countryDataArray);
    });
}
