/** Class representing the timeline view. */
class TimeLine {

    /**
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        this.margin = {
            top: 20,
            right: 20,
            bottom: 60,
            left: 80
        };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 1500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;

        this.updateCountry = updateCountry;
        this.updateYear = updateYear;

        this.data = data;

        this.drawPlot();
    }

    /**
     * Sets up the timeline slider
     */

    drawPlot() {

        d3.select('#timeLine')
            .append('div').attr('id', 'activeYear-bar');
		
        let activeYear = d3.select('#timeLine').append('text')
            .attr('transform', 'translate(150, 100)')
            .classed('activeYear-background', true)
            .text(this.activeYear);

        this.drawYearBar();

    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {

        let that = this;
		
        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([2000, 2016]).range([30, 730]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 2000)
            .attr('max', 2016)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 35);

        yearSlider.on('click', () => {
            d3.event.stopPropagation();
        })

        yearSlider.on('input', function () {
            let year = yearSlider.property('value');
            d3.select('.activeYear-background').text(year);
            sliderText.text(year)
            that.updateYear(year);
            //.updatePlot()
        });
    }

}
