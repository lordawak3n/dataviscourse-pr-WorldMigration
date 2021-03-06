class Map
{
    constructor(data, activeYear)
    {
        let prj = d3.geoEquirectangular().scale(170).translate([530, 330]);
        this.projection = prj;
        this.countryData = data;
        this.selectedYear = activeYear; // start with 2016, can be set to another year from timeLine
        
        this.id="MEX";
        this.lineChart=new LineChart(data,"MEX", activeYear);
        this.barChart=new TrendChart(data, activeYear);

        // concernedCountries is an array of CountryData for which we have immigration data + USA as its first entry.
        this.concernedCountries = this.countryData.filter(data=>data.data != null);
        let usaEntry = this.countryData.filter(data=>data.id === "USA");
        this.concernedCountries.splice(0,0,usaEntry[0]);

        // we need to store country centroids in an array, first element is USA for easy access
        this.countryCentroids = this.concernedCountries.map(function (feature){
            return {centroid: d3.geoPath().projection(prj).centroid(feature),data: feature.data};
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

        // recycle old particles
        this.recyclableParticles = [];

        // Intialize tool-tip
        this.tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })

    }

    updateYear(activeYear)
    {
        this.selectedYear = activeYear;
        let svg= d3.select('.BarChart')
                        .selectAll("svg")
                        .attr("class","oldsvg");
        
            d3.selectAll(".oldsvg").remove();

        this.barChart.barChartUpdate(activeYear);
        
        let svgYear= d3.select('.LineChart')
                        .selectAll("svg")
                        .attr("class","oldsvg");
        
            d3.selectAll(".oldsvg").remove();
            
            let that=this;
            //console.log("Error Entering", that.selectedYear, that.id);
            this.lineChart.drawLineChartUpdate(that.id, that.selectedYear);
        
        this.updateMap();
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 style=\"color:"+ tooltip_data.countrycolor +";\">"+ tooltip_data.countryname + "</h2>";
        text += "<ul>"
        text += "<li style=\"color:"+ tooltip_data.countrycolor +";\">" + "Number of migrants that moved to USA in the year "+ tooltip_data.currentyear+": " + tooltip_data.noofmigrants + "</li>"
        text += "</ul>";

        return text;
    }

    drawMap(world)
    {
        //console.log(this.countryData[0].data.Id);
        
        this.lineChart.drawLineChart();
        this.barChart.drawBarChart(activeYear);
        
        let that = this;

        let geoPath = d3.geoPath().projection(this.projection);

        //Domain definition for global color scale
        let domain = [this.minOutFlow, this.maxOutFlow];

        //Color range for global color scale
        let range = ["#6baed6", "#3182bd", "#08519c", "#063e78"];

        let colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        let svg = d3.select(".worldMap")
            .append("svg");

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        this.tip.html((d)=>{
            /* populated the data in the following format
             * tooltip_data = {
             * "countryname": CountryName(d),
             * "noofmigrants": CountryData(d)
             * "currentyear": that.selectedYear
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
            let tooltip_data = {
                "countryname": CountryName(d),
                "noofmigrants": CountryData(d),
                "currentyear": that.selectedYear,
                "countrycolor": "#444655"
            };
            return this.tooltip_render(tooltip_data);
        });

        let legend = svg.append("rect")
            .attr("height", 40)
            .attr("width", 350)
            .attr("x", 100)
            .attr("y", 10)
            .attr("rx", 15)
            .attr("ry", 15)
            .attr("fill", "#bec2c3");

        svg.append("circle")
            .attr("cx", 130)
            .attr("cy", 30)
            .attr("r", 5)
            .attr("class", "particle")
            .attr("fill", "#e10014")
            .attr("opacity", 0.8);

        let legendText = svg.append("text")
            .text("Unit of measure used: Thousand")
            .attr("x", 160)
            .attr("y", 35)
            .attr("fill", "#444655")
            .attr("class", "legendText");

        let countries = svg.append("g")
            .selectAll("path")
            .data(this.countryData)
            .enter()
            .append("path")
            .attr("d", geoPath)
            .attr('fill', (d,i)=>{
                if(this.countryData[i].data == null)
                    return '#737373';
                else
                    return colorScale(this.countryData[i].data[2016]);//'#737373';
            })
            .on("mouseover", this.tip.show)
            .on("mouseout", this.tip.hide)
            .classed('countries', true);

        // select Mex by default
        d3.selectAll(".countries").filter(data=>data.id === "MEX").classed('selected-country', true);

        // map boundries
        svg.insert("g").insert("path")
            .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
            .attr("class", "boundary")
            .attr("d", geoPath);

        // map centroid
        let g = svg.append("g");
        g.selectAll(".centroid").data(this.countryCentroids)
            .enter().append("circle")
            .attr("class", "centroid")
            .attr("fill", "#e10014")
            .attr("opacity", 0.3)
            .attr("r", 4)
            // .attr("r", function (d) {
            // return (6 * d3.geoPath().projection(this.projection).area(d));
            // })
            .attr("cx", function (d){ return d.centroid[0]; })
            .attr("cy", function (d){ return d.centroid[1]; })
            //.data(this.countryData)
            .on("mouseover", this.tip.show)
            .on("mouseout", this.tip.hide);

        // setup for animation particles
        svg.append("g").attr("class", 'animGroup')
            .selectAll(".animLine")
            .data(this.countryCentroids).enter()
            .append("g").attr("class", 'animLine');

        countries.on('click', function(d) {
            event.stopPropagation();
            //console.log(that.selectedYear);
            
            if(d.data!=undefined)
            {
                d3.selectAll(".countries").classed('selected-country', false);;
                d3.selectAll(".countries").filter(data=>data.id === d.id).classed('selected-country', true);
                let svg= d3.select('.LineChart')
                        .selectAll("svg")
                        .attr("class","oldsvg");
        
                d3.selectAll(".oldsvg").remove();
                
                that.id=d.id;
            
                that.lineChart.drawLineChartUpdate(d.id, that.selectedYear);
            }
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

        countries.call(this.tip);

        this.AnimationVis();
    }

    updateMap()
    {
        this.AnimationTransition();
    }

    AnimationVis()
    {
        let that = this;
        let animDuration = 8000;
        let particleRep = 400; // how many people does one particle represents
        let dotsPerUnit = 500; // for performance keep this to 1000 and particleRep to 1000

        let animLine = d3.select(".animGroup").selectAll(".animLine");

        let particles = animLine.selectAll(".particle")
            .data(function (d,i) {
                if(i == 0)
                    return [];

                let sqrLenX = Math.abs(that.countryCentroids[0].centroid[0] - d.centroid[0]);
                let sqrLenY = Math.abs(that.countryCentroids[0].centroid[1] - d.centroid[1]);
                let sqrLen = Math.sqrt(sqrLenX*sqrLenX+sqrLenY*sqrLenY);
                let division = (that.concernedCountries[i].data[that.selectedYear]/particleRep)*(sqrLen/(dotsPerUnit))+1;

                // for debug purposes
                //if(that.concernedCountries[i].data.Id==="RUS")
                //{
                //    console.log(that.selectedYear);
                //    console.log(division);
                //}

                let particlesArr = [division];
                for (let p = 0;p<division;p++)
                    particlesArr[p] = {data: d.centroid, len: division};
                return particlesArr;
            });

        let newParticles = particles
            .enter().append("circle")
            .attr("class", "particle")
            .attr("fill", "#e10014")
            .attr("opacity", 0.8)
            //.attr("stroke", "rgba(0, 0, 0, 0.5)")
            .attr("stroke-width", 0.1)
            .attr("r", 1.5)
            .attr("cx", function (d){ return d.data[0]; })
            .attr("cy", function (d){ return d.data[1]; });


        particles.exit()
            .transition()
            .duration(animDuration/20)
            .style("opacity", 0)
            .remove();

        particles = newParticles.merge(particles);
        let oldParticles = [];

        particles.transition()
            .duration(animDuration)
            .delay(function (d,i) {
            if(i==0)
                return animDuration*i/(d.len) + Math.floor(Math.random() * Math.floor(animDuration/2));
            else
                return animDuration*i/(d.len);
        })
            .ease(d3.easeLinear)
            .on("start", function repeat() {
                let p = d3.select(this);
                if(p.classed("expired"))
                {
                    p.style("opacity", 0);
                    //                   that.recyclableParticles.push(this);
                    p.remove();
                    p.on('start',null);
                    return;
                }
                d3.active(this)
                    .attr("cx", that.countryCentroids[0].centroid[0])
                    .attr("cy", that.countryCentroids[0].centroid[1])
                    .transition()
                    .duration(0)
                    .attr("cx", function (d){ return d.data[0]; })
                    .attr("cy", function (d){ return d.data[1]; })
                    .transition()
                    .duration(animDuration)
                    .ease(d3.easeLinear)
                    .on("start", repeat);
            });
    }


    AnimationTransition()
    {
        let that = this;
        let particles = d3.select(".animGroup").selectAll(".animLine").selectAll(".particle");

        particles
            .attr("class", "expired");
        this.AnimationVis();
    }
}