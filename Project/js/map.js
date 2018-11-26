class Map
{
    constructor(data)
    {
        let prj = d3.geoEquirectangular().scale(170).translate([530, 330]);
        this.projection = prj;
        this.countryData = data;
        this.selectedYear = 2016; // start with 2016, can be set to another year from timeLine

        // concernedCountries is an array of CountryData for which we have immigration data + USA as its first entry.
        this.concernedCountries = this.countryData.filter(data=>data.data != null);
        let usaEntry = this.countryData.filter(data=>data.id === "USA");
        this.concernedCountries.splice(0,0,usaEntry[0]);

        // we need to store country centroids in an array, first element is USA for easy access
        this.countryCentroids = this.concernedCountries.map(function (feature){
            return d3.geoPath().projection(prj).centroid(feature);
        });

        data.sort(function (a,b) {
            if(a.data == null || b.data == null)
                return 0;
            else
                return a.data[2016] - b.data[2016];
        })

        //console.log(this.countryData);
        // we are accessing indexes directly because array contain null entries too, we can also use filters instead
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

        // map boundries
         svg.insert("path")
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
                return "NA";
            else
                return d.data.Country;
        }

        function CountryData(d)
        {
            if(d.data == null)
                return "NA";
            else
                return d.data[that.selectedYear];
        }
        countries.append("svg:title").text(d=>{
                return "Country: "+CountryName(d)+", "+"Immigration to USA on year 2016: "+ CountryData(d)
        });


        // map centroid

        let g = svg.append("g");
        g.selectAll(".centroid").data(this.countryCentroids)
            .enter().append("circle")
            .attr("class", "centroid")
            .attr("fill", "rgba(49, 255, 255, 0.2)")
            .attr("stroke", "rgba(0, 0, 0, 0.5)")
            .attr("stroke-width", 0.1)
            .attr("r", 6)
            .attr("cx", function (d){ return d[0]; })
            .attr("cy", function (d){ return d[1]; });

        this.AnimationVis();
    }

    AnimationVis()
    {
        let that = this;
        let animDuration = 10000;
        let particleRep = 500; // this is how many people one particle represents
        let dotsPerUnit = 500;

        let svg = d3.select(".worldMap").select("svg");
        let animGroup = svg.append("g").attr("class", 'animGroup');
        let animLine = animGroup.selectAll(".animLine")
        .data(this.countryCentroids).enter()
            .append("g").attr("class", 'animLine');

        let particles = animLine.selectAll("circle")
            .data(function (d,i) {
                if(i == 0)
                    return [];

                let sqrLenX = Math.abs(that.countryCentroids[0][0] - d[0]);
                let sqrLenY = Math.abs(that.countryCentroids[0][1] - d[1]);
                let sqrLen = Math.sqrt(sqrLenX*sqrLenX+sqrLenY*sqrLenY);
                let division = (that.concernedCountries[i].data[that.selectedYear]/particleRep)*(sqrLen/(dotsPerUnit))+1;
                let particlesArr = [division];
                for (let p = 0;p<division;p++)
                    particlesArr[p] = d;
                return particlesArr;
            })
            .enter().append("circle")
            .attr("fill", "rgba(255, 0, 0, 0.3)")
            .attr("stroke", "rgba(0, 0, 0, 0.5)")
            .attr("stroke-width", 0.1)
            .attr("r", 1.5)
            .attr("cx", function (d){ return d[0]; })
            .attr("cy", function (d){ return d[1]; })
            .transition()
            .duration(animDuration)
 /*           .duration(function (d) {
                let sqrLenX = Math.abs(that.countryCentroids[0][0] - d[0]);
                let sqrLenY = Math.abs(that.countryCentroids[0][1] - d[1]);
                let sqrLen = sqrLenX*sqrLenX+sqrLenY*sqrLenY;
                return Math.sqrt(sqrLen)*animDuration;
            })
*/            .delay(function (d,i,arr) {
                if(i==0)
                    return animDuration*i/(arr.length) + Math.floor(Math.random() * Math.floor(animDuration/2));
                else
                    return animDuration*i/(arr.length);
            })
            .ease(d3.easeLinear)
            .on("start", function repeat() {
                d3.active(this)
                    .attr("cx", that.countryCentroids[0][0])
                    .attr("cy", that.countryCentroids[0][1])
                    .transition()
                    .duration(0)
                    .attr("cx", function (d){ return d[0]; })
                    .attr("cy", function (d){ return d[1]; })
                    .transition()
                    .duration(animDuration)
/*                    .duration(function (d) {
                        let sqrLenX = Math.abs(that.countryCentroids[0][0] - d[0]);
                        let sqrLenY = Math.abs(that.countryCentroids[0][1] - d[1]);
                        let sqrLen = sqrLenX*sqrLenX+sqrLenY*sqrLenY;
                        return Math.sqrt(sqrLen)*animDuration;
                    })
*/                  .ease(d3.easeLinear)
                    .on("start", repeat);
            })
            //.ease(d3.easeLinear)
            //.attr("cx", that.countryCentroids[0][0])
            //.attr("cy", that.countryCentroids[0][1])

/*            .on('end', function repeat(d) {
                d3.select(this)
                    .attr("cx", function (d){ return d[0]; })
                    .attr("cy", function (d){ return d[1]; })
                    .transition()
                    .duration(animDuration)
                    .ease(d3.easeLinear)
                    .attr("cx", that.countryCentroids[0][0])
                    .attr("cy", that.countryCentroids[0][1])
                    .remove();
            });

        function animateParticle(p) {
            d3.select(p)
                .attr("cx", function (d){ return d[0]; })
                .attr("cy", function (d){ return d[1]; })
                .transition()
                .duration(animDuration)
                .ease(d3.easeLinear)
                .attr("cx", that.countryCentroids[0][0])
                .attr("cy", that.countryCentroids[0][1])
                .on('end', animateParticle(p));
        }

 /*       animGroup.call(function(d){
            //let division = (that.concernedCountries[i]);//.data[that.selectedYear]/500)+1;
            console.log(d.datum[0]);
            animGroup.append("circle")
                .attr("fill", "blue")
                .attr("stroke", "rgba(0, 0, 0, 0.5)")
                .attr("stroke-width", 0.1)
                .attr("r", 3)
                .attr("cx", function (d){ return d[0]; })
                .attr("cy", function (d){ return d[1]; })
                .transition()
                .duration(20000)
                .ease(d3.easeLinear)
                .attr("cx", that.countryCentroids[0][0])
                .attr("cy", that.countryCentroids[0][1])
            });*/
    }
}

