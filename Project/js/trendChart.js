class TrendChart
{
    constructor(data, activeYear)
    {
        console.log("constructor of trendchart");
        this.countryData = data;
        this.selectedYear=activeYear;
       // console.log("TrendChart", data);       
    }
    
    getData()
    {   
        let that=this;
        
        //let selectedYear = activeYear;
        let concernedCountries = this.countryData.filter(data=>data.data != undefined).slice(0,195);
        //console.log("trend", concernedCountries);
              
        concernedCountries.sort(function (a,b) {
           console.log(a);
            if(a.data == null || b.data == null)
                return 0;
            else
                return d3.descending(parseInt(a.data[that.selectedYear]) ,parseInt(b.data[that.selectedYear]));
        })
        
        return concernedCountries.slice(0,5);

    }
    
    drawBarChart()
    {
        let topFiveCountries=this.getData();
        let margin = {top: 25, right: 30, bottom: 30, left: 40};
        
        let max = d3.max(topFiveCountries, d => parseInt(d.data[activeYear]));
        console.log("Max in trend",max);
        
        
        let xScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([0, 350])
                        .nice();
        
        let yScale = d3.scaleBand()
                    .domain([1,2,3,4,5])
                    .range([0, 350]);
        
        let xAxis = d3.axisBottom();
                    xAxis.scale(xScale);
        console.log(topFiveCountries);
        
        let svg = d3.select(".BarChart")
                    .append("svg")
                    .append("g")
                    .attr("transform", "translate("+margin.left+","+margin.top+")");
        
        let bars= svg.selectAll("rect")
                    .data(topFiveCountries)
                    
        let barsEnter=bars.enter()
                          .append("rect")
                          .attr("x", margin.left)
                          .attr("y", function(d,i){
                            return i*70;
                            })
                          .attr("width", 0)
                          .attr("height", yScale.bandwidth())
                          .attr("stroke","yellow")
                          .attr("stroke-width", "2px");
        
                    bars.exit()
                        .attr("opacity",1)
                        .transition()
                      .duration(3000)
                      .attr("opacity",0)
                      .remove();
            
            let updatedBars=barsEnter.merge(bars);
                    
                    updatedBars.transition()
                        .duration(3000)
                        .attr("x", margin.left)
                          .attr("y", function(d,i){
                            return i*70;
                            })
                          .attr("width", function(d){
                            console.log(d.id);
                            return xScale(d.data[activeYear]);
                            })
                        .attr("height", yScale.bandwidth())
                        .attr("stroke","yellow")
                        .attr("stroke-width", "2px")
                        .attr("opacity", 1);
                    
                    svg.selectAll("text")
                    .data(topFiveCountries)
                    .enter()
                    .append("text")
                    .text(d=> d.id)
                    .attr("x", 0)
                    .attr("y", function(d,i){
                    return i*70+35;
                    })
                    .attr("alignment-baseline", "middle")
                    .style("font-weight", "bolder");
        
                svg.append("g")
                    .classed("axis", true)
                    .attr("transform", "translate(" + (margin.left) + "," + (350 ) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", function(d) {
                        return "rotate(-10)" 
                    });
                svg.append("text")             
                 .attr("transform",
                 "translate(" + ((370+margin.left)/2) + " ," + 
                           (350 + 45) + ")")
                 .style("text-anchor", "middle")
                 .style("font-weight", "bolder")
                 .text("No of People Migrating");
        
                svg.append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 0 - 25)
                   .attr("x",0 - (350 / 2))
                   .attr("dy", "1em")
                   .style("text-anchor", "middle")
                   .style("font-weight", "bolder")    
                   .text("Top Five Countries");  
        
   }
    
    barChartUpdate(activeYear)
    {  
            let that=this;
            this.selectedYear=activeYear;
            this.drawBarChart(that.selectedYear);     
   }
}