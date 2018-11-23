
loadData();
class CountryData{

    /*   constructor(id, name, data)
       {
           this.id = id;
           this.name = name;
           this.data = data;
       }
       */
    constructor(obj)
    {
        this.data = obj;
    }
}

function loadData() {

    let countryDataArray = [];

    let worldMap;
    let trendChart;

    d3.csv('data/outputWithoutYear.csv').then(data =>{
        data.forEach(function(element){
            //countryDataArray.push(new CountryData(element['Id'], element['Country'], 100))
            countryDataArray.push(new CountryData(element));
        });

        worldMap = new Map(countryDataArray);
        trendChart=new TrendChart(countryDataArray);
        //console.log(countryDataArray);
        
        trendChart.drawBarChart();
    });

    d3.json('data/world.json').then(mapData => {
        worldMap.drawMap(mapData);
    });
}
