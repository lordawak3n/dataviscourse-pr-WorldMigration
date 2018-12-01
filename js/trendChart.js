class TrendChart
{
    constructor(data, activeYear)
    {
        //console.log("constructor of trendchart");
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
           //console.log(a);
            if(a.data == null || b.data == null)
                return 0;
            else
                return d3.descending(parseInt(a.data[that.selectedYear]) ,parseInt(b.data[that.selectedYear]));
        })
        
        return concernedCountries.slice(0,5);

    }
    
    drawBarChart()
    {
        
        let that=this;
        let topFiveCountries=this.getData();
        let margin = {top: 25, right: 30, bottom: 30, left: 40};
        console.log("Top Five Countries", topFiveCountries);
        let max = d3.max(topFiveCountries, d => parseInt(d.data[that.selectedYear]));
        console.log("Max in trend",max);
        
        
        let xScale = d3.scaleLinear()
                        .domain([0,max])
                        .range([0, 320])
                        .nice();
        
        let yScale = d3.scaleBand()
                    .domain([1,2,3,4,5])
                    .range([0, 320]);
        
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
            .attr("fill", "TEAL")
                          .attr("stroke","#bec2c3")
                          .attr("stroke-width", "2px");
        
                    bars.exit()
                        .attr("opacity",1)
                        .transition()
                      .duration(1000)
                      .attr("opacity",0)
                      .remove();
            
        
            let updatedBars=barsEnter.merge(bars);
                    
                    updatedBars.transition()
                        .duration(1000)
                        .attr("x", margin.left)
                          .attr("y", function(d,i){
                            return i*70;
                            })
                          .attr("width", function(d){
                            return xScale(d.data[that.selectedYear]);
                            })
                        .attr("height", yScale.bandwidth())
                        .attr("stroke","#bec2c3")
                        .attr("stroke-width", "2px")
                        .attr("opacity", 1);

        
               
        
                svg.selectAll(".textLeft")
                    .data(topFiveCountries)
                    .enter()
                    .append("text")
                    .text(d=> d.id)
                    .attr("x", 0)
                    .attr("y", function(d,i){
                    return i*70+35;
                    })
                    .attr("alignment-baseline", "middle")
                    .style("fill", "#444655")
                    .style("font-weight", "bolder");
                
                
                svg.selectAll(".textRight")
                    .data(topFiveCountries)
                    .enter()
                    .append("text")             
                 .attr("x", function(d){
                            return xScale(d.data[that.selectedYear])+70;
                            })
                 .attr("y", function(d,i){
                    return i*70+35;
                    })
                 .style("text-anchor", "middle")
                 .style("font-weight", "bolder")
                    .style("fill", "#444655")
                 .text(d=>d.data[that.selectedYear]); 
            
        
                svg.append("g")
                    .classed("axis", true)
                    .attr("transform", "translate(" + (margin.left) + "," + (350 ) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", function(d) {
                        return "rotate(-20)" 
                    });
                
                svg.append("text")             
                 .attr("transform",
                 "translate(" + ((370+margin.left)/2) + " ," + 
                           (350 + 45) + ")")
                 .style("text-anchor", "middle")
                 .style("font-weight", "bolder")
                    .style("fill", "#444655")
                 .text("No. of People Migrating");
        
                svg.append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 0 - 25)
                   .attr("x",0 - (350 / 2))
                   .attr("dy", "1em")
                   .style("text-anchor", "middle")
                   .style("font-weight", "bolder")
                    .style("fill", "#444655")
                   .text("Top Five Countries");  
        
   }
    
    barChartUpdate(activeYear)
    {  
            let that=this;
            this.selectedYear=activeYear;
            this.drawBarChart(that.selectedYear);     
   }
}