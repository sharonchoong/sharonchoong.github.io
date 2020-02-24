(function() {
	$.get("https://api.github.com/users/sharonchoong/repos").done(function(data){
		const width = $("[role='main']").width(); // get width in pixels
		const height = 0.9 * window.innerHeight;
		const svg = d3.select('#bubble')
				.attr("height", height)
				.attr("width", width);
				
		const centerX = width * 0.5;
		const centerY = height * 0.5;
		const radius = Math.min(width, height) * 0.18;
		const strength = 0.5;
		const format = d3.format(',d');
		const scaleColor = d3.scaleOrdinal()
			.domain(data.map(function(d) { return  d.id }))
			.range(d3.schemeSet3);
			
		// use pack to calculate radius of the circle
		let pack = d3.pack()
			.size([width , height ])
			.padding(1.5);
		let forceCollide = d3.forceCollide(function(d) { return d.r + 1 });
		// use the force
		let simulation = d3.forceSimulation()
			.force('charge', d3.forceManyBody())
			.force('collide', forceCollide)
			//.force('center', d3.forceCenter(centerX, centerY))
			.force('x', d3.forceX(centerX ).strength(strength))
			.force('y', d3.forceY(centerY ).strength(strength));
			
		let nodes = data.map(function(node) { 
			return {
				x: centerX, 
				y: centerY,
				r: 0, // for tweening
				size: node.size,
				id: node.id,
				name: node.name,
				url: node.html_url,
				description: node.description,
				language: node.language
			}
		});
		simulation.nodes(nodes).on('tick', ticked);
		svg.style('background-color', '#eee');
		let node = svg.selectAll('.node')
			.data(nodes)
			.enter().append('g')
			.attr('class', 'node')
			.call(d3.drag()
				.on('start', function(d) {  
					if (!d3.event.active) simulation.alphaTarget(0.2).restart();
					d.fx = d.x;
					d.fy = d.y;
					return d;
				})
				.on('drag', function(d) { 
					d.fx = d3.event.x;
					d.fy = d3.event.y;
					return d;
				})
				.on('end', function(d) {  
					if (!d3.event.active) simulation.alphaTarget(0);
					d.fx = null;
					d.fy = null;
					return d;
				}));
		node.append('circle')
			.attr('id', function(d) { return d.id })
			.attr('r', 0)
			.style('fill', function(d) { return scaleColor(d.id) })
			.transition().duration(2000).ease(d3.easeElasticOut)
				.tween('circleIn', function(d) { 
					let i = d3.interpolateNumber(0, radius);
					return function(t) { 
						d.r = i(t);
						simulation.force('collide', forceCollide);
					}
				})
		
		// display text
		const circle_text = node.append('text')
			.attr("class", 'node-icon')
			.attr("text-anchor", "middle")
			
		circle_text.append('a')
			.attr("class", "project-title")
			.attr('href', function(d) { return d.url })
				.append('tspan')
				.attr('x', 0)
				.attr('y', -radius * 0.5)
				.text(function(d) { return d.name })
				.attr("font-weight", "bold")
				.attr("font-size", "20px");
			
		circle_text.append('tspan')
			.attr("class", "project-lang")
			.attr('x', 0)
			.attr('y', -radius * 0.25)
			.text(function(d) { return d.language })
			.attr("font-size", "18px");
			
		circle_text.append('tspan')
			.attr("class", "project-desc")
			.attr('x', 0)
			.attr('y', 0)
			.attr('dy', 0)
			.text(function(d) { return d.description })
			.attr("font-size", "2.3vmin")
			.call(wrap, radius * 1.7);
				
		function ticked() {
			node.attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; })
				.select('circle')
					.attr('r', function(d) { return d.r });
		}
		function wrap(text, width) {
		  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
		  });
		}
	});
})();