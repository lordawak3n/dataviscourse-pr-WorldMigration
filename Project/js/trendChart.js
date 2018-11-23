class TrendChart
{
    constructor(data)
    {
        console.log("constructor of trendchart");
        this.countryData = data;
        
        data.sort(function (a,b) {
        return a.data[2016] - b.data[2016];
        })
    }
    
    drawBarChart()
    {
        console.log("Entered Bar Chart");
        let topFiveArray=new Array();
        let index=0;
        for(let i=199;i>=194;i--)
        {
            
            topFiveArray[index]=this.countryData[i].data[2016];
            index++;
        }
        console.log(topFiveArray);
        
        let iScale = d3.scaleLinear()
        .domain([0, topFiveArray.length])
        .range([50, 170]);
        
        let bScale = d3.scaleLinear()
        .domain([0, d3.max(topFiveArray, d => d)])
        .range([0, 140]);
        
        let min = d3.min(topFiveArray);
        let max = d3.max(topFiveArray);
        
        let xScale = d3.scaleLinear()
            .domain([min, max])
            .range([0, 140])
            // nice gives us good intervals for axes!
            .nice();
        
        let xAxis = d3.axisBottom();
//        // try manually setting the ticks
//        //.ticks(40);
       xAxis.scale(xScale);

        
        let barChart=d3.select('.BarChart')
                        .append("svg")
                        .selectAll("rect")
                        .data(topFiveArray);
        
        let bars=barChart.enter()
                         .append("rect")
                         .attr('x', 80)
                         .attr('y', function(d,i){
                             return iScale(i);
                         })
                         .attr("width", function(d,i){
                                return bScale(d);
                            })
                            .attr("height",10)
                           .call(xAxis);
    }
}