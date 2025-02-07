import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawBars(){

    // accessing data
    const data = await d3.csv("data/friends_info.csv ")
    const yAccessor = d => +d.us_views_millions
    const xAccessor = d => `S${d.season} E${d.episode}`

    
    // //chart dimensions 
    let dimensions = { 
        width: window.innerWidth , 
        height: 600, 
        margin: {
            top: 120, 
            right: 130, 
            bottom: 20, 
            left: 80 
        }
    }

    dimensions.boundedWidth = dimensions.width 
    - dimensions.margin.left
    - dimensions.margin.right 

    dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    -dimensions.margin.bottom


    //canvas 
    const wrapper = d3.select("body")
        .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")  
            .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)  
            .classed("responsive-svg", true);

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`)

    //scales
    const xScale = d3.scaleBand()
        .domain(data.map(xAccessor))
        .range([0,dimensions.boundedWidth])
        .padding(.1)

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yAccessor)])
        .range([dimensions.boundedHeight,0])


    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.season))
        .range(d3.schemeCategory10)

    
    //tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")

    //bars
    const bars = bounds.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(xAccessor(d)))
        .attr("y", dimensions.boundedHeight)
        // .attr("y", d => yScale(yAccessor(d)))
        .attr("width", xScale.bandwidth()) 
        .attr("height", 0)
        // .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr("fill", d => colorScale(d.season))
        .on("mouseover", function(event,d){
            d3.select(this)
                .attr("stroke","purple")
                .attr("stroke-width", 1)
            tooltip.style("visibility", "visible")
                .text(`Season: ${d.season}\nEpisode: ${d.episode}- ${d.title}\nViews: ${d.us_views_millions}M`)
            
        })
        .on("mousemove", function(event,d) {
            tooltip
                .style("top", event.pageY - 90 + "px")
                .style("left", event.pageX + 20 + "px")
        })
        .on("mouseout", function(){
            d3.select(this).attr("stroke", "none")
            tooltip.style("visibility", "hidden")
        })

    //bar animation 
    
    function animateBars(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bars.transition()
                    .duration(800)  
                    .attr("y", d => yScale(yAccessor(d)))  
                    .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
                observer.unobserve(entry.target)
            }
        });
    }

    const observerOptions = {
        root: null,  
        threshold: 0.8
    };

    const observer = new IntersectionObserver(animateBars, observerOptions)
    observer.observe(wrapper.node())

    //axes
    
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .ticks(4)

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    

    //yAxis Label
    const yAxisLabel = yAxis.append("text")
        .attr("x", -dimensions.boundedHeight/2)
        .attr("y", -dimensions.margin.left + 40 )
        .style("fill","black")
        .text("Views per Episode (millions)")
        .style("transform", "rotate(-90deg)")
        .style("text-anchor", "middle")
        .style("font-size", "1.6em")
        .style("font-family", "Inter")


    //legend 
    const keys = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6", "Season 7", "Season 8", "Season 9", "Season 10"]

    const size = 15 
    bounds.selectAll("myDots")
        .data(keys)
        .enter()
        .append("rect")
        .attr("x", dimensions.boundedWidth + 20)
        .attr("y", function(d,i){ return 80 + i*(size+5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return colorScale(d)})

    bounds.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", dimensions.boundedWidth + 40)
          .attr("y", function(d,i){ return 83 + i*(size+5) + (size/2)})
          .style("fill", function(d){ return colorScale(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .style("font-family", "Inter")
          .style("font-size", "1em")
         
     
}


drawBars()

