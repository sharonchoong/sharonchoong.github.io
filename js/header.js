(function($) {
    var svgHeight = document.querySelector('#header-svg').getBoundingClientRect().height;

    //ripples
    d3.select("#header-svg")
        .insert("rect",":first-child")
        .attr("class", "svgOverlay")
        .attr("x", 0).attr("y", 0)
        .attr("width", 600).attr("height", 800)
        .attr("fill", "#2B2D42");

    var ripples = d3.select("#header-svg").append("g").attr("class", "ripples svgOverlay");
    function makeRipple(x, y, repeat) {
        ripples.append("circle")
        .attr("class", "ripple x" + Math.floor(x) + "y" + Math.floor(y))
        .attr("r", 0)
        .attr("cx", x).attr("cy", y)
        .attr("fill", "#D3A588").attr("opacity", Math.random() * 0.6)
        .attr("stroke", "#D3A588")
        .transition().ease(repeat ? d3.easeExp: d3.easeLinear).duration(2000)
        .attr("r", Math.floor(Math.random() * 20))
        .on("end", function(d) {
            d3.select(".x" + Math.floor(x) + "y" + Math.floor(y)).remove();
        });
        if (repeat) {
            setTimeout(function() { makeRipple(Math.random() * 600, Math.random() * 800, true); }, 100);
        }
    }
    makeRipple(Math.random() * 600, Math.random() * 800, true);
    d3.select(".svgOverlay").on("pointermove mousemove", function(event, d) {
        var thisPosition = d3.pointer(event, this);
        makeRipple(thisPosition[0], thisPosition[1]);
    });

    //teacup
    $("#tea").show();
    if ($(window).width() > 766) {
        $("#tea").attr("transform", "translate(0 100)");
    } else {
        $("#tea").attr("transform", "translate(0 " + (svgHeight * 0.5) + ")");
    }
    function changeCupColor()
    {
        d3.selectAll(".steam")
        .transition().delay(Math.floor(Math.random() * 500)).duration(Math.floor(Math.random() * 1000))
        .style("opacity", function(d) { return Math.random()/2; })
        .on("end", changeCupColor);
    }
    changeCupColor();
    function changeTea()
    {
        d3.selectAll(".tea")
        .transition().delay(Math.floor(Math.random() * 500)).duration(1000)
        .style("opacity", function(d) { return Math.random(); })
        .on("end", changeTea);
    }
    changeTea();
})(jQuery);