const fibonacci = (function() {
	const svgwidth = $("#tree").parent().width();
	const svgheight = 0.7 * window.innerHeight;
	const svg = d3.select('#fibonacci')
			.attr("height", svgheight)
			.attr("width", svgwidth)
			.attr("viewBox", "0 0 "+ svgwidth +" " + svgheight);
			
	let fibonacci_sequence, xOrigin, yOrigin, scale;
	
	function fibonacci(number) {
		if (fibonacci_sequence.length - 1 >= number)
		{
			return fibonacci_sequence[number];
		}
		else
		{
			fibonacci_sequence.push(fibonacci(number - 1) + fibonacci(number - 2));
			if (number == 2)
				draw(number-1, fibonacci_sequence[number-1]);
			draw(number, fibonacci_sequence[number]);
			return fibonacci_sequence[number];
		}
	}
	
	function initVariables() {
		fibonacci_sequence = [0, 1];
		xOrigin = svgwidth * 0.5;
		yOrigin = svgheight * 0.5;
		scale = d3.scaleLinear()
			  .domain([0, 20])
			  .range([0, Math.min(svgwidth, svgheight)])
	}
	
	function rescale(sequenceIndex, transitionDuration) {
		const newDomainMax = (fibonacci_sequence[sequenceIndex-1] + fibonacci_sequence[sequenceIndex - 1]) ;
		const scalar = sequenceIndex/fibonacci_sequence[sequenceIndex];
		
        svg.selectAll(".fibArc")
			.transition()
			.ease(d3.easeLinear)
			.delay((sequenceIndex-1) * transitionDuration)
			.duration(transitionDuration)
			.attr("transform", "translate(" + (1 - scalar)*(svgwidth * 0.5) +", "+ (1 - scalar)*( svgheight * 0.5) + ") scale(" + scalar + ")");
			
		svg.selectAll(".fibArc path")
			.transition()
			.ease(d3.easeLinear)
			.delay((sequenceIndex+1) * transitionDuration)
			.style("stroke-width", fibonacci_sequence[sequenceIndex-3]/2 + "px")
    }
	
	function draw(sequenceIndex, fibonacciNumber) {
		const transitionDuration = 1000;
		const radius = scale(fibonacciNumber);
  		const dx = sequenceIndex % 4 < 2 ? radius : -radius;
  		const dy = (sequenceIndex + 1) % 4 < 2 ? radius : -radius;
		
		g = svg.append("g")
				.attr("class", "fibArc")
		
		//background rectangle
		g.append("rect")
			.attr("x", xOrigin)
			.attr("y", yOrigin)
			.attr("width", 0)
			.attr("height", 0)
			.style("stroke", "black")
			.style("stroke-width", "1px")
			.style("fill", d3.schemeSet3[(sequenceIndex-1) % d3.schemeSet3.length])
			.style("opacity", 0.5)
			.transition()
			.ease(d3.easeLinear)
			.delay(sequenceIndex * transitionDuration)
			.duration(transitionDuration)
			.attr("x", dx < 0 ? (xOrigin + dx) : xOrigin)
			.attr("y", dy < 0 ? (yOrigin + dy) : yOrigin)
			.attr("width", Math.abs(dx))
			.attr("height", Math.abs(dy))
			
		g.append("text")
			.attr("x", xOrigin + dx/2)
			.attr("y", yOrigin + dy/2)	
			.attr("text-anchor", "middle")
			.style("font-size", Math.max(10, Math.exp(sequenceIndex/2)))
			.transition()
			.ease(d3.easeLinear)
			.delay((sequenceIndex+1) * transitionDuration)
			.text(fibonacciNumber + " x " + fibonacciNumber)
			
		//arc
		var path = g.append("path")
			.attr("d", "M " + xOrigin + " " + yOrigin //move to origin
				+ " A " +radius+" "+radius+" 0 0 0 " + (xOrigin + dx) + " " + (yOrigin + dy) //draw arc: rx ry x-axis-rotation large-arc-flag sweep-flag x y
			)
			.style("fill", "none")
			.style("stroke", "black")
			.style("stroke-width", Math.max(2, fibonacci_sequence[sequenceIndex-2]/2) + "px");

		var length = path.node().getTotalLength();
		path.attr("stroke-dasharray", length + " " + length)
			.attr("stroke-dashoffset", length)
			.transition()
			.ease(d3.easeLinear)
			.delay(sequenceIndex * transitionDuration)
			.duration(transitionDuration)
			.attr("stroke-dashoffset", 0);
		
		xOrigin += dx;
		yOrigin += dy;
		
		if (sequenceIndex >=9)
			rescale(sequenceIndex, transitionDuration);
	}
	
	function drawSpiral() {
		svg.selectAll("*").remove();
		initVariables();
		fibonacci(Number($("#fib_iteration").text()));
	}
	
	return {drawSpiral: drawSpiral};
})();
