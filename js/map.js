class Map
{
    constructor()
    {

      this.projection = d3.geoMercator().scale(110).translate([400, 350]);
    }

    drawMap(world)
    {
        console.log(world);
        console.log("Entering drawMap");
        let geojson=topojson.feature(world, world.objects.countries);
        let geoPath=d3.geoPath().projection(this.projection);

        let svg=d3.select("#map-chart")
                  .append("svg");


                svg.append('g')
                   .selectAll("path")
                   .data(geojson.features)
                   .enter()
                   .append("path")
                   .attr("d", geoPath)
                   // .attr("class", function(d){
                   //  return d;
                   // })
                   // .classed("countries", true);
let graticule=d3.geoGraticule();
                        svg.append("path")
                        .datum(graticule)
                        .attr("class","graticule")
                        .attr("d",geoPath)
                        .attr("fill","none");

                        svg.append("path")
                            .attr("d", geoPath)
                            .attr("fill", "none")
                            .attr("stroke", "black");


        console.log("end");
    }
}

