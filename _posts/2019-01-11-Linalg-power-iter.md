---
layout: post
title:  Power iteration algorithm — a visualization
excerpt: The power method is a simple iterative algorithm used to find eigenvectors of a matrix. I used vtvt to create a visualization of this algorithm. 
tag: [math notes, visualisation]
mathjax_flag: true
---

## Power iteration algorithm — a visualization

The [power method](https://en.wikipedia.org/wiki/Power_iteration) is a simple iterative algorithm that can be used to find the eigenvector of a matrix ($$ \mathbf T $$) associated with the largest absolute eigenvalue. Given some vector $$ \mathbf v_i $$, the next best approximation of the eigenvector is given by the normalized product of $$ \mathbf T $$ and $$ \mathbf v_i $$

$$ \mathbf v_{i+1} = {\mathbf T \mathbf v_i \over \lVert \mathbf T \mathbf v_i \rVert} $$

Why does it work? Let's consider the simplest case of a diagonizable matrix $$ \mathbf T $$. Using eigendecomposition,

$$ \mathbf T = \mathbf E \mathbf \Lambda \mathbf E^{-1} $$, 

where $$ \mathbf E $$ is the matrix of eigenvectors, and $$ \mathbf \Lambda $$ is the the diagonal matrix of eigenvalues

We can ignore normalization for now since it does not affect the direction of the resulting vector. Then power iteration simplifies to calculating $$ \mathbf T^n \mathbf u $$ where $$ \mathbf u $$ is some starting vector

$$ \mathbf T^n = \mathbf E \mathbf \Lambda \mathbf E^{-1} \mathbf E \mathbf \Lambda \mathbf E^{-1} ... \mathbf E \mathbf \Lambda \mathbf E^{-1} = \mathbf E \mathbf \Lambda^n \mathbf E^{-1} $$

Given some vector $$ \mathbf u $$, $$ \mathbf T^n \mathbf u = \mathbf E \mathbf \Lambda^n \mathbf E^{-1} \mathbf u $$, where $$ \mathbf E^{-1} \mathbf u $$ can be interpreted as presenting vector $$ \mathbf u $$  in the eigenbasis.

Since we don't care about the legnth of the eigenvector at this point, we are free to scale $$ \mathbf \Lambda^n $$ by any number. Let us scale it by $$ \lambda_{max}^{-n} $$ 


$$ {1 \over \lambda_{max}^n} \mathbf \Lambda^n  = {1 \over \lambda_{max}^n} \begin{bmatrix} \lambda_1^n & 0 & 0 & 0 \\ 0 & \lambda_2^n & 0 & 0 \\ 0 & 0 & ... & 0 \\ 0 & 0 & 0 & \lambda_n^n \end{bmatrix} =  \begin{bmatrix} {\lambda_1^n \over \lambda_{max}^n} & 0 & 0 & 0 \\ 0 & {\lambda_2^n \over \lambda_{max}^n} & 0 & 0 \\ 0 & 0 & ... & 0 \\ 0 & 0 & 0 & {\lambda_n^n\over \lambda_{max}^n} \end{bmatrix}$$

At a sufficiently large n, all entries but one become close enough to zero. The entry corresponding to the largest eigenvalue in $$ \Lambda $$ remains 1. This matrix has the property of stripping vector $$  \mathbf u $$ (presented in the eigenbasis!) of all coordinates but the one corresponding to the eigenvector with the largest eigenvalue thus giving us a vector collinear with that eigenvector. Finally, applying matrix $$ \mathbf E $$ to this new vector presents it in our original basis.

What if we picked $$ \mathbf u $$ normal to the eigenvector thought? The power iteration algorithm would fail, since vector $$ \mathbf E^{-1} \mathbf u $$ produces 0 as the coordinate corresponding to the dominant eigenvector. Applying $$ \mathbf \Lambda^n $$ will produce a zero vector. Fortunately, if vector $$ \mathbf u $$ is picked at random, it is unlikely for it to be normal to the dominant eigenvector.

Is it possible to use power iteration to find a non-dominant eigenvector? Yes. Substituting $$ \mathbf T $$ with $$ \mathbf T - \lambda_{max} \mathbf I $$ makes it possible to obtain the eigenvector associated with the smallest eigenvalue. It is not difficult to show that the eigendecomposition of this new matrix is $$ \mathbf E (\mathbf \Lambda - \lambda_{max} \mathbf I) \mathbf E^{-1} $$. Scaling $$(\mathbf \Lambda - \lambda_{max} \mathbf I)^{n} $$ by $$ (\lambda_{min} - \lambda_{max})^{-n} $$ will result in a matrix that nullifies all vector coordinates except the one associated with the least significant eigenvector.

In the canvas below (powered by [vtvt](https://github.com/ex-punctis/vtvt)) you can visualize 20 iterations of the power method. Vectors  $$ \mathbf t_1 $$ and  $$ \mathbf t_2 $$ set the columns of $$ \mathbf T $$, and the eigenvectors are calculated analytially and updated whenever the matrix changes. Vector $$ \mathbf u_0 $$ sets the initial iteration of the power method. Note how much worse convergence becomes whenever the eigenvalues become similar.

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

</style>

<div class="canvas-wrapper">
	<p><button id='animation_trigger_3'>Press to animate power iteration</button></p>
	<canvas id='vector_canvas_3' class="canvas-wrapped"></canvas>
</div> 

<script>
    
// *****************************************************************	

	// initialize the scene_3
	var scene_3 = new vtvt({canvas_id: "vector_canvas_3", grid_res: 16, circle_rad: 0.5, eig_col: "150, 150, 150", frame_duration: 300, anim_trigger_id: "animation_trigger_3"});

	// add columns of matrix T
	scene_3.addVector({coords: [2, -1], c: "50, 50, 170", draggable: true, label: "t1", visible: true});
	scene_3.addVector({coords: [-1, 3], c: "70, 150, 70", draggable: true, label: "t2", visible: true});

	// add input vector for power iteration algorithm
	scene_3.addVector({coords: [-6, 1], c: "200, 100, 200", draggable: true, label: "u0"});
	
	// add the first animated vector (mapped to iter0)
	scene_3.addAnimationFrame([{coords: [-6, 1], c: "200, 100, 200", label: "u0", 
		mapping: function(){ return [scene_3.vectors[2].coord_x, scene_3.vectors[2].coord_y]} }]);

	// add additional animated vectors (each mapped to the previous one)
	for (let k = 0; k < 20; k++) {
		let map_func = function() {
			let x = scene_3.vectors[0].coord_x * scene_3.vectors_animated[k][0].coord_x + 
					scene_3.vectors[1].coord_x * scene_3.vectors_animated[k][0].coord_y;
			let y = scene_3.vectors[0].coord_y * scene_3.vectors_animated[k][0].coord_x + 
					scene_3.vectors[1].coord_y * scene_3.vectors_animated[k][0].coord_y;
			let norm = Math.sqrt(x*x + y*y);
			return [x / norm * 4, y = y / norm * 4];
		}	
		// add vector to the animation sequence
		scene_3.addAnimationFrame([ {coords: [1, 1], c: "200, 100, 200", label: `u${k+1}`, kind: 'custom', draw_line: true, mapping: map_func} ]);
	}

	// render
	scene_3.render();

</script>
