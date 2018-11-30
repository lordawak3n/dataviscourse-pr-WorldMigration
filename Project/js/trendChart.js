class TrendChart
{
    constructor(data)
    {
        console.log("constructor of trendchart");
        this.countryData = data;
       // console.log("TrendChart", data);       
    }
    
    getData(activeYear)
    {
        let selectedYear = activeYear;
        let concernedCountries = this.countryData.filter(data=>data.data != undefined).slice(0,195);
        //console.log("trend", this.concernedCountries);
              
        concernedCountries.sort(function (a,b) {
           // console.log(a.data );
            if(a.data == null || b.data == null)
                return 0;
            else
                return d3.descending(parseInt(a.data[selectedYear]) ,parseInt(b.data[selectedYear]));
        })
        
        return concernedCountries.slice(0,5);

    }
    
    drawBarChart(activeYear)
    {
        let topFiveCountries=this.getData(activeYear);
        let margin = {top: 20, right: 30, bottom: 30, left: 40};
        
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
        
                svg.selectAll("rect")
                    .data(topFiveCountries)
                    .enter()
                    .append("rect")
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
                    .attr("color", "red");
        
                svg.append("g")
                    .classed("axis", true)
                    .attr("transform", "translate(" + (margin.left) + "," + (350 ) + ")")
                    .call(xAxis);
        
   }
    
    barChartUpdate(activeYear)
    {   
        let margin = {top: 20, right: 30, bottom: 30, left: 40};
        
        let topFiveCountries=this.getData(activeYear);
        
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
        
                svg.selectAll("rect")
                    .data(topFiveCountries)
                    .enter()
                    .append("rect")
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
                    .attr("color", "red");
        
                svg.append("g")
                    .classed("axis", true)
                    .attr("transform", "translate(" + (margin.left) + "," + (350 ) + ")")
                    .call(xAxis);
        
   }
}