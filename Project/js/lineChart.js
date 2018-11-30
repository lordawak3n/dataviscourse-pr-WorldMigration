class LineChart
{
    constructor(data, countryId, activeYear)
    {
        //console.log("Inside LineChart");
        this.countryData=data;
        this.countryId=countryId;
        this.selectedYear=activeYear;
        //this.selectedCountry;
        //console.log(this.selectedCountry);
        
     //   console.log(this.selectedCountryData[0].data);
    }
    
    getData()
    {
        let that=this;
        this.selectedCountryData = this.countryData.filter(obj => {
        return obj.id === that.countryId;
        });
        
        let yearData=[];
        let yearInfo=[];
        let map=this.selectedCountryData[0].data;
       //console.log(map);
        Object.keys(map).forEach(function(key) {
        
            if(key!="Id" && key!="Country")
                {
                    yearData.push(parseInt(map[key]));
                    yearInfo.push({"year": key,"data":parseInt(map[key])});                
                }
    
        });
        
        return [yearData, yearInfo];
    }
    
    
    drawLineChart()
    {
        
        let margin = {top: 10, right: 20, bottom: 30, left: 40};
        
        //console.log("Not update");
        let returnedData=this.getData()
        let yearData=returnedData[0];
        let yearInfo=returnedData[1];
        console.log("yearInfo", yearInfo)
        
        let min=d3.min(yearData);
        let max=d3.max(yearData);
        
        console.log("min:",min," max:",max);
        console.log(yearData);
        
        let xScale = d3.scaleLinear()
            .domain(d3.extent(yearInfo, function(d){
                return d.year;
            }))
            .range([0, 350])
            .nice();
        
        let xAxis = d3.axisBottom()
                      .tickFormat(d3.format("d"));
                      //.ticks(20);
        xAxis.scale(xScale);
        
        let yScale = d3.scaleLinear()
            .domain(d3.extent(yearInfo, function(d){
                return d.data;
            }))
            .range([350,0])
            .nice();
        
        let yAxis = d3.axisLeft()
                      //.ticks(20);
        yAxis.scale(yScale);
        
        let svg = d3.select(".LineChart")
                    .data(yearInfo)
                    .append("svg")
                    .append("g")
                    .attr("transform", "translate("+margin.left+","+margin.top+")")
        let line=svg.append("path");
        
        
        let aLineGenerator = d3.line()
        .x(function(d){return xScale(d.year)+margin.left;})
        .y(function(d){return margin.top+yScale(d.data);});
        
        let padding=50;
          
        
        let lineEnter=line.enter().append("line")
            .transition()
            .duration(5000)
            .attr("opacity",0)
            .style("stroke-width", "3px")
            .attr("d", aLineGenerator(yearInfo))
            .style("stroke","#339999")
            .style("fill", "none");
        
            line.exit()
            .transition()
            .duration(5000)
            .attr("opacity",1)
            .remove();
        
        line=line.merge(line);

            line.transition()
                    .duration(5000)
                    .style("stroke","#339999")
                    .style("stroke-width", "3px")
                    .attr("d", aLineGenerator(yearInfo))
                    .attr("opacity",1)
                    .style("fill", "none");
        
        
//        line
//            .attr("d", aLineGenerator(yearInfo))
//            .classed("lines",true);
//        
//        svg.on("mouseover",function(d){
//                        console.log("hover"+d.year);
//                        let pointPosition=d3.mouse(this);
//                        d3.select(this)
//                          .append("title")
//        .text("x:"+pointPosition[0]+"y:"+pointPosition[1]+"\n Year: \n x:"+(d.year)+",y:"+d.data);
//    });

        
        svg.append("g")
            .classed("axis", true)
            .attr("transform", "translate(" + (margin.left) + "," + (350 + margin.top) + ")")
            .call(xAxis);
        
        svg.append("g")
            .classed("axis", true)
            .attr("transform", "translate(" + (margin.left)+ "," + (margin.top) + ")")
           .call(yAxis);
        
        
        svg.append("text")             
                 .attr("transform",
                 "translate(" + ((370+margin.left)/2) + " ," + 
                           (350 + 45) + ")")
                 .style("text-anchor", "middle")
                 .style("font-weight", "bolder")
                 .text("Year");

        svg.append("text")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 0 - 35)
                   .attr("x",0 - (350 / 2))
                   .attr("dy", "1em")
                   .style("text-anchor", "middle")
                   .style("font-weight", "bolder")    
                   .text("No. of People Migrating");  
        
        svg.append("text")             
                 .attr("transform",
                 "translate(" + ((250+margin.left)) + " ," + 
                           (20) + ")")
                 .style("text-anchor", "middle")
                 .style("font-weight", "bolder")
                .style("font-size", "20px")
                .style("fill", "red")
                .text(this.selectedCountryData[0].data.Country);
        
        console.log("vertical line",yearInfo[16], this.selectedYear%100);
        
        let that=this;
        let vpath=[{year: ""+this.selectedYear+"", data:yScale.domain()[0]}, {year: ""+this.selectedYear+"", data:yearInfo[that.selectedYear%100].data}];
        
        let hpath=[{year: ""+xScale.domain()[0]+"", data:yearInfo[that.selectedYear%100].data}, {year: ""+this.selectedYear+"", data:yearInfo[that.selectedYear%100].data}];
        
       svg
            .append("path")
            .attr("d", aLineGenerator(vpath))
            .classed("lines",true)
            .style("stroke-dasharray", ("3, 3"))
            .attr("opacity",0.5)
            .style("stroke-width", 2)
            .style("stroke", "red")
            .style("fill", "none");
        
        svg
            .append("path")
            .attr("d", aLineGenerator(hpath))
            .classed("lines",true)
            .style("stroke-dasharray", ("3, 3"))
            .attr("opacity",0.5)
            .style("stroke-width", 2)
            .style("stroke", "red")
            .style("fill", "none");

    }
    
            
    
    drawLineChartUpdate(countryId, activeYear)
    {
        console.log("now is update", activeYear);
        this.countryId=countryId;
        this.selectedYear=activeYear;
        console.log("after", this.selectedYear);
        this.drawLineChart();

    }
}