(function($) {
    var svgHeight = document.querySelector('#header-svg').getBoundingClientRect().height;

    //ripples
    d3.select("#header-svg")
        .insert("rect",":first-child")
        .attr("class", "svgOverlay")
        .attr("x", 0).attr("y", 0)
        .attr("width", 600).attr("height", 800)
        .attr("fill", "#acb7c9");

    var ripples = d3.select("#header-svg").append("g").attr("class", "ripples");
    function makeRipple(x, y, repeat) {
        ripples.append("circle")
        .attr("class", "ripple x" + Math.floor(x) + "y" + Math.floor(y))
        .attr("r", 0)
        .attr("cx", x).attr("cy", y)
        .attr("fill", "#66a0f1").attr("opacity", 0.2)
        .attr("stroke", "#d3e1f4")
        .transition().ease(repeat ? d3.easeExp: d3.easeLinear).duration(2000)
        .attr("r", Math.floor(Math.random() * 60) + 5)
        .on("end", function(d) {
            d3.select(".x" + Math.floor(x) + "y" + Math.floor(y)).remove();
        });
        if (repeat) {
            setTimeout(function() { makeRipple(Math.random() * 600, Math.random() * 800, true); }, 300);
        }
    }
    makeRipple(Math.random() * 600, Math.random() * 800, true);
    d3.select(".svgOverlay").on("pointermove mousemove", function(event, d) {
        if (new Date().getMilliseconds() % 5 === 0) {
            var thisPosition = d3.pointer(event, this);
            makeRipple(thisPosition[0], thisPosition[1]);
        }
    });

    //teacup
    $("#tea").show();
    if ($(window).width() > 766) {
        $("#tea").attr("transform", "translate(0 100)");
    } else {
        $("#tea").attr("transform", "translate(0 " + (svgHeight * 0.2) + ") scale(2)");
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