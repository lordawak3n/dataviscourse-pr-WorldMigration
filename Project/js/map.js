class Map
{
    constructor(data)
    {
        this.projection = d3.geoMercator().scale(170).translate([530, 420]);
        this.countryData = data;
        this.selectedYear = 2016;

        data.sort(function (a,b) {
            if(a.data == null || b.data == null)
                return 0;
            else
                return a.data[2016] - b.data[2016];
        })

        //console.log(this.countryData);
        // we are accessing indexes directly because array contain null entries too, we can use filters instead
        this.maxOutFlow = data[250].data[this.selectedYear];
        this.minOutFlow = data[1].data[this.selectedYear];
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
        //let geojson = topojson.feature(world, world.objects.countries);

        // to refer this objects from event delegate
        let that = this;

        let geoPath = d3.geoPath().projection(this.projection);

        //console.log(geojson.features);

        //Domain definition for global color scale
        let domain = [this.minOutFlow, this.maxOutFlow];

        //Color range for global color scale
        let range = ["#6baed6", "#3182bd", "#08519c", "#063e78"];

        //ColorScale be used consistently by all the charts
        let colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        let svg = d3.select(".worldMap")
            .append("svg");

        let countries = svg.selectAll("path")
            .data(this.countryData)
            .enter()
            .append("path")
            .attr("d", geoPath)
            .attr('fill', (d,i)=>{
                //console.log(this.countryData[i]);
                if(this.countryData[i].data == null)
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

        function CountryName(d)
        {
            if(d.data == null)
                return "data unavailable";
            else
                return d.data.Country;
        }

        function CountryData(d)
        {
            if(d.data == null)
                return "data unavailable";
            else
                return d.data[that.selectedYear];
        }
        countries.append("svg:title").text(d=>{
                return "Country: "+CountryName(d)+", "+"Immigration to USA on year 2016: "+ CountryData(d)
        });
    }
}

