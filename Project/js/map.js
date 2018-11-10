class Map
{
    constructor(data)
    {
        this.projection = d3.geoMercator().scale(170).translate([530, 420]);
        this.countryData = data;

        data.sort(function (a,b) {
        return a.data[2016] - b.data[2016];
        })

        this.maxOutFlow = data[199].data[2016];
        this.minOutFlow = data[0].data[2016];
    }

    drawMap(world)
    {
        //console.log(this.countryData[0].data.Id);
        //console.log(this.countryData[0].data[2000]);
        //console.log(this.countryData);

        //this.countryData.forEach(function (row) {
        //    console.log(row.data.Id);
        //});
        //console.log(world);
        //console.log("Entering drawMap");
        let geojson = topojson.feature(world, world.objects.countries);
        let geoPath = d3.geoPath().projection(this.projection);

        //console.log(geojson);

        //Domain definition for global color scale
        let domain = [this.minOutFlow, this.maxOutFlow];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        let colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        let svg = d3.select(".worldMap")
            .append("svg");

        let countries = svg.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", geoPath)
            .attr('fill', (d,i)=>{
                console.log(this.countryData[i]);
                if(this.countryData[i] == null)
                    return '#737373';
                else
                    return colorScale(this.countryData[i].data[2016]);//'#737373';
            });
            //.classed('countries', true);

         svg.insert("path")
        // map.insert("path", '.test')
            .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
            .attr("class", "boundary")
            .attr("d", geoPath);

        countries.on('click', function(d) {
            event.stopPropagation();
            console.log(d.id);
        });

        function CountryImmi(cid)
        {
            //console.log(cid);
            return cid;
        }
        //"Country: "+this.countryData[0].data[2016]+", "+"Immigration to USA on year 2016: "+CountryImmi(d.id)
        countries.append("svg:title").text(d=>{
                return "Country: "+d.id+", "+"Immigration to USA on year 2016: "+ CountryImmi(d.id)
        });
    }
}

