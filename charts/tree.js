const tree = (function() {
	
	const tree_height = 8;
	const svgwidth = $("#tree").parent().width();
    const svgheight = 0.7 * window.innerHeight;
	const svg = d3.select('#tree')
				.attr("height", svgheight)
				.attr("width", svgwidth);
	
	function TreeNode (x0, y0, height) {
		this.x0 = x0;
		this.y0 = y0;
		this.height = height;
		this.level = tree_height - height + 1;
		this.left = null;
		this.right = null;
	}
	
	function drawbranch(start_node, end_node, delay)
	{
		const level = (start_node.level < end_node.level) ? start_node.level: end_node.level;
		const height = (start_node.height > end_node.height) ? start_node.height: end_node.height;
		const delayMilliseconds = Number($("input[name='opt_speed']:checked").val());
		const lineData = [
				{ "x": start_node.x0, "y": start_node.y0},
				{ "x": end_node.x0, "y": end_node.y0}];
			const path = d3.line()
					.x(function(d) { return d.x; })
					.y(function(d) { return d.y; });
			
			//add green leaves
			for (let i = 0; i < Math.floor(Math.random() * Math.floor(4)); i++)
			{
				svg.append('path')
					.attr("class", "leaf")
					.attr("d", "M3,5 A4,4 5 0,0 7,5 a4,4 5 0,0 -8,-2 z")
					.attr('transform', "translate(" + end_node.x0 + " " + end_node.y0 + ") rotate(" + d3.randomUniform(0,360)() + ") scale(" + 0.6* height + ")")
					.attr('fill', 'green')
					.attr('fill-opacity', 0)
					.transition()
					.delay(delay * delayMilliseconds)
					.duration(delayMilliseconds)
					.attr('fill-opacity', 1);
			}
			
			let branch = svg
				.datum(lineData)
				.append('path') 
				.attr('d', path)
				.attr('stroke', level > tree_height / 4 * 3  ? "#855E42" : (
				level > tree_height / 3 ? "#6A4B35" : "#553C2A"))
				.attr('stroke-width', height * 2)
				.attr('stroke-linecap', "round")
				.attr('fill', 'none');
			
			var totalLength = branch.node().getTotalLength();
				branch.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition()
				.delay(delay * delayMilliseconds)
				.duration(delayMilliseconds)
				.ease(d3.easeLinear)
				.attr("stroke-dashoffset", 0);
			
			//add blossoms
			if (level === tree_height)
			{
				svg.append('circle') 
					.attr('cx', start_node.level < end_node.level ? end_node.x0: start_node.x0)
					.attr('cy', start_node.level < end_node.level ? end_node.y0: start_node.y0)
					.attr('r', 0)
					.attr('fill', 'pink')
					.transition()
					.delay(delay * delayMilliseconds)
					.duration(delayMilliseconds)
					.attr('r', d3.randomUniform(2,6));
			}
	}
	

	function bfs(tree)
	{
		let queue = [];
		queue.push(tree);
		let counter = 1;
        while (queue.length > 0) 
		{
			let currentNode = queue[0];
			if (currentNode.left !== null)
			{
				drawbranch(currentNode, currentNode.left, counter);
				queue.push(currentNode.left);
				counter++;
			}
			if (currentNode.right !== null)
			{
				drawbranch(currentNode, currentNode.right, counter);
				queue.push(currentNode.right);
				counter++;
			}
			queue.shift();
		}
	}
	
	function dfs(tree, order)
	{
		dfs_helper(tree, null, order, 0);
	}
	
	function dfs_helper(node, previous_node, order, counter)
	{
		if (node !== null)
		{
			if (order === "dfs_pre")
			{
				if (previous_node !== null)
					drawbranch(previous_node, node, counter);
				counter++;
			}
			counter = dfs_helper(node.left, node, order, counter);
			if (order === "dfs_in")
			{
				if (previous_node !== null)
					drawbranch(node, previous_node, counter);
				counter++;
			}
			counter = dfs_helper(node.right, node, order, counter);
			if (order === "dfs_post")
			{
				if (previous_node !== null)
					drawbranch(node, previous_node, counter);
				counter++;
			}
		}
		return counter;
	}

	
	function createTree()
	{
		svg.selectAll("*").remove();
		//trunk
		svg.append("line")
			.attr("class", "trunk")
			.attr("x1", svgwidth * 0.5)
			.attr("x2", svgwidth * 0.5)
			.attr("y1", svgheight * 0.75)
			.attr("y2", svgheight)
			.attr('stroke', "#443022")
			.attr('stroke-linecap', "round")
			.attr('stroke-width', tree_height + 8);
		var tree = new TreeNode(svgwidth * 0.5, svgheight * 0.75, tree_height);
		fillTree(tree);
		if ($("input[name='opt_traversal']:checked").val() === "bfs")
			bfs(tree);
		else
			dfs(tree, $("input[name='opt_traversal']:checked").val());
	}
	
	function getRandomBranch(height, previous_angle)
	{
		let result = { left: {}, right: {}};
		//let angle = d3.randomNormal(45, 11.5 * Math.log(height))();
		let angle_right = d3.randomNormal(45, 5)();
		if (previous_angle)
		{
			angle_right = previous_angle + d3.randomNormal(20, 8)();
			angle_right = angle_right > 360 ? 360 - angle_right: angle_right;
		}
		let angle_left = angle_right - d3.randomNormal(60, 15)()
		const branch_radius = Math.min(svgwidth * 0.6, svgheight * 0.7) / (tree_height  * (tree_height + 1) / 2);
		result.left.angle = angle_left;
		result.left.width = Math.sin(angle_left * Math.PI / 180) * branch_radius;
		result.left.height = Math.cos(angle_left * Math.PI / 180) * branch_radius;
		result.right.angle = angle_right;
		result.right.width = Math.sin(angle_right * Math.PI / 180) * branch_radius;
		result.right.height = Math.cos(angle_right * Math.PI / 180) * branch_radius;
		return result;
	}
	
    function fillTree(tree, previous_angle) {
		if (tree.height >= 1)
		{
			 const randombranch = getRandomBranch(tree.level, previous_angle);
			 const leftx = tree.x0 + (tree.height * randombranch.left.width);
			 const lefty = tree.y0 - (tree.height * randombranch.left.height);
		     const rightx = tree.x0 + (tree.height * randombranch.right.width);
		     const righty = tree.y0 - (tree.height * randombranch.right.height);
			 const next_level = tree.height - 1;
		     tree.left = new TreeNode(leftx, lefty, next_level);
		     tree.right = new TreeNode(rightx, righty, next_level);
		     fillTree(tree.left, randombranch.left.angle);
		     fillTree(tree.right, randombranch.right.angle);
		} else
			return;
     }
	 
	 return {createTree: createTree};
})();

