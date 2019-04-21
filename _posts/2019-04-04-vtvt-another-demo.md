---
layout: post
title:  Vector Transformation Visualization Tool (vtvt) — another demo
excerpt: Visualisation of numerical solutions of the pendulum equation by 3blue1brown
indexflag: true
tag: [visualisation, js]
---

### Vector Transformation Visualization Tool (vtvt) — another demo

This demo visualizes numerical solutions of the pendulum equation by [3blue1brown](https://www.youtube.com/watch?v=p_di4Zn4wz4) (14:28). 

Instructions:

Position the starting point in the phase space (angle θ, angular velocity θ′) by dragging it. The starting pendulum position (L sin θ, -L cos θ) will be adjusted automatically based on the position in the phase space. Click "animate" to see the solution (2,000 iterations). Please note the current version of vtvt doesn't disable the animation control button while an animation sequence is being played, so it's best not to press the button again until the current animation sequence is over.

The iteration step is 0.005 by default, and can be adjusted in your browser's console by changing variable `step`. The length of the pendulum and the dampening coefficient can be changed with the sliders underneath the canvas. 

Please note this demo may run a bit "heavy" on older mobile devices.

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
	<input type="range" id="lSlider" min="0.5" max="7.9" value="4" step="0.1" class="slider">
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
	var scene = new vtvt({canvas_id: "vector_canvas", grid_res: 16, circle_rad: 0.8, point_rad: 0.07, show_matrix: false, show_eig: false, frame_duration: 0, anim_trigger_id: "animation_trigger"});

	// add starting point
	scene.addVector({
		coords: [Math.random()*16-8,Math.random()*16-8],
		c: '50,50,200', 
		draggable: true, 
		kind: 'point',
		visible: true,
		label: ['(θ',String.fromCharCode(0+48+8272),', ', 'θ\′', String.fromCharCode(0+48+8272), ')'].join('')
	}); 
	
	// add pendulum
	scene.addVector({
		draggable: false, 
		kind: 'custom',
		draw_arrow: false,
		draw_point: true,
		draw_stem: true,
		draw_line: false,
		visible: true,
		label: ['L(sin θ', String.fromCharCode(0+48+8272), ', ', '-cos θ', String.fromCharCode(0+48+8272), ')'].join(''),
		mapping: function () {
			return {
				mapX: l*Math.sin(scene.vectors[0].coord_x),
				mapY: -l*Math.cos(scene.vectors[0].coord_x)
			};
		}
	}); 
	

	// add axis labels using invisible vectors (a hack)
	scene.addVector({
		coords:[7.5,0.01],
		c:[50,50,50],
		draggable: false, 
		kind: 'custom',
		draw_arrow: false,
		draw_point: false,
		draw_stem: false,
		draw_line: false,
		visible: true,
		label: 'θ'
	});

	scene.addVector({
		coords:[0.01,7.5],
		c:[50,50,50],
		draggable: false, 
		kind: 'custom',
		draw_arrow: false,
		draw_point: false,
		draw_stem: false,
		draw_line: false,
		visible: true,
		label: 'θ\′'
	});

	
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
	scene.addAnimationFrame([
		{
			c: '50,50,200', 
			kind: 'point', 
			mapping:function() {
				return {mapX: scene.vectors[0].coord_x,
						mapY: scene.vectors[0].coord_y };
				} 
		}, {
			c: '50,50,200', 
			draggable: false, 
			kind: 'custom',
			draw_arrow: false,
			draw_point: true,
			draw_stem: true,
			draw_line: false,
			visible: true,
			label: ['L(sin θ', String.fromCharCode(0+48+8272), ', ', '-cos θ', String.fromCharCode(0+48+8272), ')'].join(''),
			mapping: function () {
				return {mapX: l*Math.sin(scene.vectors[0].coord_x),
						mapY: -l*Math.cos(scene.vectors[0].coord_x) };
				}
		}
	]); 


	for (let i = 1; i<2000; i++) {
		scene.addAnimationFrame([
			{
				c: '50,50,200', 
				kind: 'point', 
				mapping: function() {
					let x = scene.vectors_animated[i-1][0].coord_x; // theta coordinate
					let y = scene.vectors_animated[i-1][0].coord_y; // theta dot coordinate
					return {mapX: x + y*step, 
							mapY: y - (mu*y + g/l*Math.sin(x))*step }
				}    
			},{
				c: '50,50,200', 
				draggable: false, 
				kind: 'custom',
				draw_arrow: false,
				draw_point: true,
				draw_stem: true,
				draw_line: false,
				visible: true,
				label: 'L(sin θ, -cos θ)',
				mapping: function () {
					let x = scene.vectors_animated[i-1][0].coord_x;
					let y = scene.vectors_animated[i-1][0].coord_y;
					return {mapX: l*Math.sin(x + y*step),
							mapY: -l*Math.cos(x + y*step) };
				}
			}
		]);
	}

	// render
	scene.render();

</script>
