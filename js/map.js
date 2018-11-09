class Map
{
    constructor()
    {

      //  this.projection = d3.geoWinkel3().scale([3000/(2*Math.PI)]).translate([3000/2,1250/2]);
      this.projection = d3.geoWinkel3().scale(300).translate([365, 225]);
    }

    drawMap(world)
    {
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
                   .attr("d", geoPath);


        console.log("end");
    }
}

