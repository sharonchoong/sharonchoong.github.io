const sort = (function() {
	const svgwidth = $("#tree").parent().width();
	const svgheight = 0.7 * window.innerHeight;
	const svg = d3.select('#sort')
			.attr("height", svgheight)
			.attr("width", svgwidth);
			
	let array_size = null;
	let delayMilliseconds = null;
	let radius = null;
	let positions = [];
	let stepCountTimers= [];
	setArraySize(Number($("#array_size").text()));
	
	function setArraySize(new_size) {
		$("#array_size").text(new_size);
		array_size = new_size;
		delayMilliseconds = 10000 / array_size;
		radius = svgwidth / (array_size * 2);
		positions = d3.range(array_size).map(function(i) {
			return {x: radius * 2 * (i + 1)- radius, y: svgheight / 2 }
		});
	}
			
	function sortItems() {
		for (let timer = 0; timer < stepCountTimers.length; timer++) {
			clearTimeout(stepCountTimers[timer]);
		}
		
		svg.selectAll("*").remove();
		$("#nsteps").text("0");
		const circles = d3.range(array_size).map(function(i) {
			return {id: i,
				value: Number(Math.floor(Math.random() * 100) / 100)}
		});
		 svg.selectAll("circle")
		.data(circles)
		.enter()
		.append("circle")
		.attr("data-id", function(d) { return d.id })
		.attr("cx", function(d) { return positions[d.id].x })
		.attr("cy", function(d) { return positions[d.id].y })
		.attr("r", radius)
		.attr("data-value", function(d) { return  d.value })
		.attr("fill", function(d) { return  d3.interpolateViridis(d.value) });
		
		if ($("input[name='opt_sort']:checked").val() == "selection")
			selectionSort(circles);
		else if ($("input[name='opt_sort']:checked").val() == "bubble")
			bubbleSort(circles);
		else if ($("input[name='opt_sort']:checked").val() == "insertion")
			insertionSort(circles);
		else if ($("input[name='opt_sort']:checked").val() == "quicksort")
			quickSort(circles);
		else if ($("input[name='opt_sort']:checked").val() == "heapsort")
			heapSort(circles);
		else if ($("input[name='opt_sort']:checked").val() == "mergesort")
			mergeSort(circles);
	}
	
	function moveAnimation(id1, x1, y1, x2, y2, iteration, duration, down) 
	{
		svg.select("[data-id='" + id1 + "']")
			.transition()
			.delay(iteration * delayMilliseconds)
			.duration(delayMilliseconds / 2)
			.attr("cx", (x1 + x2) / 2)
			.attr("cy", svgheight / 3 * (down == 1 ? 2: 1))
			.transition()
			.duration(delayMilliseconds * duration)
			.attr("cx", x2)
			.attr("cy", y2);
	}
	function swapAnimation(id1, x1, y1, id2, x2, y2, iteration) 
	{
		moveAnimation(id1, x1, y1, x2, y2, iteration, 0.5, 0);
		moveAnimation(id2, x2, y2, x1, y1, iteration, 0.5, 1); 
	}
	
	function selectionSort(array) {
		let indexLastSorted = 0;
		
		//get minimum and put at start
		for (let j = 0; j < array.length - 1; j++)
		{
			let indexMinimum = indexLastSorted;
			for (let i = indexLastSorted; i < array.length; i++) {
				incrementTimer(j * delayMilliseconds + i * delayMilliseconds / array.length);
				
				if (array[i].value < array[indexMinimum].value)
					indexMinimum = i;
			}
			let newMin = array[indexMinimum];
			swapAnimation(newMin.id, positions[indexMinimum].x, positions[indexMinimum].y, array[indexLastSorted].id, positions[indexLastSorted].x, positions[indexLastSorted].y, j);
				
			array[indexMinimum] = array[indexLastSorted];
			array[indexLastSorted] = newMin;
			indexLastSorted++;
		}
	}
	
	function bubbleSort(array) {
		delayMilliseconds = 2000 / array_size;
		let steps = 0;
		let n = array.length - 1;
		//compare closest two
		while (n > 0) {
			let last_swap = 0
			for (let j = 0; j < n; j++) {
				steps++;
				incrementTimer(steps * delayMilliseconds);
				
				if (array[j + 1].value < array[j].value)
				{
					last_swap = j + 1;
                    const to_be_swapped = array[j];
					swapAnimation(to_be_swapped.id, positions[j].x, positions[j].y, array[j+1].id, positions[j+1].x, positions[j+1].y, steps);
					array[j] = array[j + 1];
					array[j + 1] = to_be_swapped;
				} 
			}
			n = last_swap;
		}
	}
	
	function insertionSort(array) {
		let steps = 0;
		let indexLastSorted = 0;
		//get first and put in appropriate place in sorted elements
		for (let i = indexLastSorted + 1; i < array.length; i++) {
			const to_be_swapped = array[i];
			let j = indexLastSorted;
			for (j; j >= 0; j--) {
				steps++;
				incrementTimer(steps * delayMilliseconds);
				
				if (array[j].value <= to_be_swapped.value)
					break;
	
				moveAnimation(array[j].id, positions[j].x, positions[j].y, positions[j+1].x, positions[j+1].y, steps, 0.5, 0);
				array[j + 1] = array[j];
			}
			j++;
			moveAnimation(to_be_swapped.id, positions[i].x, positions[i].y, positions[j].x, positions[j].y, steps, 0.5, 0);
			array[j] = to_be_swapped;
			indexLastSorted++;
		}
		//alert(array.map(d=>d.value))
	}
	
	function quickSort(array) {
		let indexLastSorted = 0;
		//cut into two, designate pivot then compare and swap
		
	}
	
	function heapSort(array) {
		let indexLastSorted = 0;
		//get first and put in appropriate place in sorted elements
	}
	
	function mergeSort(array) {
		let indexLastSorted = 0;
		//get first and put in appropriate place in sorted elements
	}
	
	function incrementTimer(delay) {
		const changeStepCount = setTimeout(function() {
			$("#nsteps").text(Number($("#nsteps").text()) + 1);
		}, delay);
		stepCountTimers.push(changeStepCount);
	}
	
	return { sortItems: sortItems, setArraySize: setArraySize }
})();