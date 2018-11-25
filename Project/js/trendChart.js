class TrendChart
{
    constructor(data)
    {
        console.log("constructor of trendchart");
        this.countryData = data;
        this.selectedYear = 2016;
        
        data.sort(function (a,b) {
            if(a.data == null || b.data == null)
                return 0;
            else
                return a.data[2016] - b.data[2016];
        })
        
    }
    
    drawBarChart()
    {
        console.log("Entered Bar Chart");
        let topFiveArray=new Array();
        let index=0;
        let i=250;
        while(index<5)
        {
            //console.log("inside drawbarchart",i);
            //console.log(this.countryData[i].data==undefined);
            if(this.countryData[i].data!==undefined)
            {
             topFiveArray[index]=this.countryData[i].data[2016];
            index++;
            } 
            i--;
        }
        console.log(topFiveArray);
        
        let iScale = d3.scaleLinear()
        .domain([0, topFiveArray.length])
        .range([50, 150]);
        
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
        
        let svg = d3.select("svg");
        
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
                            .classed("axis", true)
                            .call(xAxis);
    }
}