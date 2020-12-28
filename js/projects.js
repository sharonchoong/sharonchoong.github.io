(function() {
	$.get("https://api.github.com/users/sharonchoong/repos").done(function(data){
		//filter out forked projects
		data = data.filter(function(d) { return !d.fork; });

		$("#progress_projectsload").hide();

		const svg = d3.select('#bubble');
		svg.style('background-color', '#eee');

		data = data.sort(function(a, b) { return d3.descending(a.size, b.size); }).slice(0, 10);

		const centerX = 300;
		const centerY =  200;
		const radius = 400 * 0.15;
		
		const scaleColor = d3.scaleOrdinal()
			.domain(data.map(function(d) { return  d.id }))
			.range(d3.schemeSet3);
			
		// use the force
		let simulation = d3.forceSimulation()
			.force("forceX", d3.forceX().strength(0.5).x(centerX))
			.force("forceY", d3.forceY().strength(0.5).y(centerY))
			.force('charge', d3.forceManyBody().strength(-15));
			
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
		simulation.nodes(nodes)
			.force("collide", d3.forceCollide().strength(.5).radius(radius))
			.on('tick', function() {
				node.attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; })
					.select('circle')
					.attr('r', function(d) { return d.r });
			});
		let node = svg.selectAll('.node')
			.data(nodes)
			.enter().append('g')
			.attr('class', 'node')
			.call(d3.drag()
				.on('start', function(event, d) {  
					if (!event.active) simulation.alphaTarget(0.2).restart();
					d.fx = d.x;
					d.fy = d.y;
					return d;
				})
				.on('drag', function(event, d) { 
					d.fx = d3.pointers(event, svg.node())[0][0];
					d.fy = d3.pointers(event, svg.node())[0][1];
					return d;
				})
				.on('end', function(event, d) {  
					if (!event.active) simulation.alphaTarget(0);
					d.fx = null;
					d.fy = null;
					return d;
				}));
		node.append('circle')
			.style("cursor", "grab")
			.attr('id', function(d) { return d.id })
			.attr('r', 0)
			.style('fill', function(d) { return scaleColor(d.id) })
			.transition().duration(2000).ease(d3.easeElasticOut)
				.tween('circleIn', function(d) { 
					let i = d3.interpolateNumber(0, radius);
					return function(t) { 
						d.r = i(t);
						simulation.force('collide');
					}
				})
		
		// display text
		const circle_text = node.append('text')
			.attr("class", 'node-icon')
			.style("cursor", "grab")
			.attr("text-anchor", "middle")
			.attr("width", "10px");
			
		circle_text.append('a')
			.attr("class", "project-title")
			.attr('href', function(d) { return d.url })
				.append('tspan')
				.attr('x', 0)
				.attr('y', -radius * 0.5)
				.text(function(d) { return d.name })
				.attr("font-weight", "bold");
			
		circle_text.append('tspan')
			.attr("class", "project-lang")
			.attr('x', 0)
			.attr('y', -radius * 0.25)
			.text(function(d) { return d.language })
			
		circle_text.append('tspan')
			.attr("class", "project-desc")
			.attr('x', 0)
			.attr('y', 0)
			.attr('dy', 0)
			.text(function(d) { return d.description })
			.call(wrap, radius * 1.7);
		
		function wrap(text, width) {
		  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy")) || 0,
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