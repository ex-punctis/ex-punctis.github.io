---
layout: post
title:  Vector Transformation Visualization Tool (vtvt) — another demo
excerpt: Visualisation of numerical solutions of the pendulum equation by [3blue1brown]
indexflag: false
tag: [visualisation]
---

### Vector Transformation Visualization Tool (vtvt) — another demo

This demo visualizes numerical solutions of the pendulum equation by [3blue1brown](https://www.youtube.com/watch?v=p_di4Zn4wz4) (14:28). Position the starting points by dragging them, and click "animate" to see the solutions (2,000 iterations). The iteration step is 0.005 by default, and can be adjusted in your browser's console by changing variable `step`. The length of the pendulum and the dampening coefficient can be changed with the sliders underneath the canvas. The axes are theta and theta-dot (I apologize, it's not possible to label them with vtvt yet). This demo runs a bit "heavy" on older mobile devices.

<script>
{% include vtvt.js %}
</script>

<style>
	button {
		display: block;
		position: relative;
			margin-left:auto;
			margin-right:auto;
			width: 50%;
		background-color: #FCFFFC; 
		color: black; 
		border: 2px solid #449980; 
		border-radius: 5px; 
		padding: 4px 4px;
	}
	button:hover {
		background-color: #F9FFFA; 
	}
	button:focus {
		outline: none;
	}

	.slidercontainer {
		display: block;
		position: relative;
		margin-top: 0rem;
		margin-bottom: 0rem;
		text-align: center;		
	}

	@media screen and (max-width: 42em) {
		.slider {
			width: 80vmin; } }
	@media screen and (min-width: 42em) and (max-width: 64em) {
		.slider {
			width: 60vmin; } }
	@media screen and (min-width: 64em) {
		.slider {
			width: 40vmin; } }

</style>


<button id='animation_trigger'>Press to animate </button>
<div class="canvas-wrapper">
<canvas id='vector_canvas' class="canvas-wrapped"></canvas>
</div> 


<div class="slidercontainer">
	<label for="muSlider">μ: </label>
	<input type="range" id="muSlider" min="0" max="2" value="1" step="0.1" class="slider">
	<label for="muSlider" id="muValue">1.0</label></div>
<div class="slidercontainer">
	<label for="lSlider">L: </label>
	<input type="range" id="lSlider" min="0.5" max="9.9" value="4" step="0.1" class="slider">
	<label for="lSlider" id="lValue">4.0</label>
</div>

<script>

	// *************************************************************************************************
	// Demo canvas 
	// Pendulum equations by 3blue1brown https://www.youtube.com/watch?v=p_di4Zn4wz4 (14:28)

	
	var g = 10;
	var step = 0.005; // numerical step length

	// create sliders and variables for mu and l
	var muSlider = document.getElementById("muSlider");
	var muValue = document.getElementById("muValue");
	var mu = muSlider.value;

	var lSlider = document.getElementById("lSlider");
	var lValue = document.getElementById("lValue");
	var l = lSlider.value;

	// Process slider changes
	muSlider.oninput = function() { 
		mu = this.value;
		muValue.innerHTML=Number.parseFloat(mu).toFixed(1);
		scene.render();
	}
	lSlider.oninput = function() { 
		l = this.value;
		lValue.innerHTML=Number.parseFloat(l).toFixed(1);
		scene.render();
	}


	// initialize the scene
	var scene = new vtvt({canvas_id: "vector_canvas", grid_res: 16, circle_rad: 0.5, show_matrix: false, show_eig: false, frame_duration: 0, anim_trigger_id: "animation_trigger"});

	var numPoints = 4;
	var colours=[];
	// add starting points
	for (let i = 0; i < numPoints; i+=1) {  
		// setup colour
		let cos = Math.cos(Math.random() * 2 * Math.PI);
		let sin = Math.cos(Math.random() * 2 * Math.PI);
		let r = 150 + 100*cos; //(phase shift 0º)
		let g = 150 + 100*(-0.5*cos - 0.866*sin); //(phase shift 120º)
		let b = 150 + 100*(-0.5*cos + 0.866*sin); //(phase shift 240º)
		// save colour into an array
		colours.push(`${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`);
		// add point
		scene.addVector({
			coords: [Math.random()*16-8,Math.random()*16-8],
			c: colours[i], 
			draggable: true, 
			kind: 'point',
			visible: true}); 
	}
		
	// create vector field vectors at [j,k] whose coords and colour update based on mu and l
	for (let j = -8; j < 9; j+=0.5) {  
		for (let k = -8; k < 9; k+=0.5) {     
			// coordinate mapping function
			let vec_map = function() {
				let x = k;
				let y = -mu*k - g/l*Math.sin(j);
				let norm = Math.sqrt(x*x+y*y);
				x = x/norm/2;
				y = y/norm/2;
				return {mapX: x, mapY: y} ;
			}
			scene.addVector({origin: [j,k], c:'220,220,220', kind: 'vector', mapping: vec_map });
		}
	}
	
			// add animation vectors
			let tempArr=[];
			for (let i = 0; i < numPoints; i+=1) { 
				tempArr.push(
					{c: colours[i], 
					kind: 'point', 
					mapping:function() {
								return {mapX: scene.vectors[i].coord_x,
										mapY: scene.vectors[i].coord_y };
							} 
					} )
			}
			scene.addAnimationFrame(tempArr); 
			for (let i = 1; i<2000; i++) {
					let tempArr=[];
					for (let j = 0; j < numPoints; j+=1) {
						tempArr.push(
							{c: colours[j], kind: 'point', mapping: function() {
								let x = scene.vectors_animated[i-1][j].coord_x;
								let y = scene.vectors_animated[i-1][j].coord_y;
								return {mapX: x + y*step, 
										mapY: y - (mu*y + g/l*Math.sin(x))*step }
								}    
							} )
				}
					scene.addAnimationFrame(tempArr);
			}

	// render
	scene.render();

</script>
