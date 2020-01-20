---
layout: post
title:  Real time abstract art generation using a neural net
excerpt: A simple artificial neural net can be leveraged to produce a variety of visually appealing abstract patterns. For a static image, all that's needed is a random mapping from pixel coordinates to RGB values. Add a cyclical temporal input, and you'll have evolving patterns. For interactivity, just add mouse coordinates as inputs.
image: /images/2020-01-19/gif.gif
suggested: Car-spectrum
indexflag: true
tag: [art, visualisation, js]
---

### Real time abstract art generation using a neural net (CPPN)

I came across [https://www.deeplearning.ai/ai-notes/optimization/](https://www.deeplearning.ai/ai-notes/optimization/) some time ago and was very intrigued by the banner visualisation at the top of the page. I initially thought it was some clever CSS trick, but poking around  revealed it was the result of a "compositional pattern-producing network" (CPPN) running in real time. I started looking for more information and found a few very interesting resources on the subject (see References at the bottom). One of the most helpful ones was [https://tehnokv.com/posts/visualizing-audio-with-cppns/](https://tehnokv.com/posts/visualizing-audio-with-cppns/). That's where I learned it was just a simple feed forward neural net that took pixel positions as inputs and produced RGB values for each pixel using random weights. With some trigonometry thrown in as activation functions, captivating patterns could be produced. Of course, to make the patterns dynamic, there also needs to be a temporal input. 

It wasn't difficult to reproduce the method in Python with Keras/TF. However, it wasn't very spectacular in a jupyter notebook, so I decided to make my own implementation in JavaScript. Experiments with vanilla js showed it was achievable but CPU-costly. Fortunately, thanks to [Tensorflow.js](https://js.tensorflow.org/api/latest/), I had the option of getting GPU acceleration through WebGL. Even without a GPU, it should be more efficient than vanilla js thanks to incorporation of WebAssembly code. To add interactivity, I used mouse/touch coordinates as extra inputs to the neural net (scroll down for the architecture diagram).

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.5.1/dist/tf.min.js"></script>
<script>
{% include abstract-art-cppn.js %}
</script>

<style>
	button {
		display: inline-block;
		margin-top: 1rem;
		background-color: #FCFFFC; 
		color: black; 
		border: 2px solid #449980; 
		border-radius: 5px; 
		padding-top: 2px;
		padding-bottom: 2px;
		padding-left: 4px;
		padding-right: 4px;
	}
	button:hover {
		background-color: #F9FFFA; 
	}
	button:focus {
		outline: none;
	}
	

	@media screen and (max-width: 42em) {
		.inner-wrapper {
			display:block;
			position: relative;
			margin-left:auto;
			margin-right:auto;
			width:90vmin;
		} 
		.slider { width: 50vmin; }
	}		
	@media screen and (min-width: 42em) and (max-width: 64em) {
		.inner-wrapper {
			display:block;
			position: relative;
			margin-left:auto;
			margin-right:auto;width:75vmin;
		}
		.slider { width: 40vmin; }
	}
	@media screen and (min-width: 64em) {
		.inner-wrapper {
			display:block;
			position: relative;
			margin-left:auto;
			margin-right:auto;width:65vmin;
		}
		.slider { width: 30vmin; }
	}


</style>


<div class="canvas-wrapper">
	<canvas id='canvas' class="canvas-wrapped"></canvas>
	<div class = "inner-wrapper">
		<button id='resetButton'>New weights</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		<button id='saveImgButton'>Generate wallpaper</button>
		<p><label for="activation1">Layer 1: </label>
			<select id='activation1'>
				<option value="sin">sin()</option>
				<option value="cos" selected>cos()</option>
				<option value="tanh">tanh()</option>
				<option value="lin">linear()</option>
			</select>
			<input type="range" id="magnitude1" min="1" max="2.5" value="1" step="0.01" class="slider">
		</p><p>
			<label for="activation2">Layer 2: </label>
			<select id='activation2'>
				<option value="sin" selected>sin()</option>
				<option value="cos">cos()</option>
				<option value="tanh">tanh()</option>
				<option value="lin">linear()</option>
			</select>
			<input type="range" id="magnitude2" min="1" max="2.5" value="1" step="0.01" class="slider">
		</p><p>
			<label for="activation3">Layer 3: </label>
			<select id='activation3'>
				<option value="sin">sin()</option>
				<option value="cos">cos()</option>
				<option value="tanh" selected>tanh()</option>
				<option value="lin">linear()</option>
			</select>
			<input type="range" id="magnitude3" min="1" max="2.5" value="1" step="0.01" class="slider">
		</p><p>
			<label for="activation4">Layer 4: </label>
			<select id='activation4'>
				<option value="sin" selected>sin()</option>
				<option value="cos">cos()</option>
				<option value="tanh">tanh()</option>
			</select>
		</p>
	</div>
</div> 

<script>
cppn = new abstractANN ({
    canvasID: 'canvas', saveButtonID:'saveImgButton', resetButtonID:'resetButton',
    activationIDs: ['activation1', 'activation2', 'activation3', 'activation4'], 
    magnitudeIDs:['magnitude1', 'magnitude2', 'magnitude3']
});

cppn.start();
</script>

The architecture of this neural net is very simple (*diagram generated by [http://alexlenail.me/NN-SVG/index.html](http://alexlenail.me/NN-SVG/index.html)*):

{% include one-med-image.html center-img = '/images/2020-01-19/architecture.png'  %}

The sliders control the magnitude of all activations in a layer. You can select various combinations of activation functions. For example, lin-lin-cos-sin, lin-sin-lin-sin make some interesting patterns given the right weights/magnitudes. Try moving the mouse/finger on the canvas to change patterns quickly for extra "wow".

<div id="thumbnails"><p>Click "Generate wallpaper" or press "spacebar" to generate a 1920x1080 wallpaper (may take a while!). The image will appear below. It will look like a thumbnail, but it's actually full-res and can be saved. If you would like to make patters with a different set of random weights, click "New weights".</p></div>

Of course, actual CPPNs are used for much more than generation of random abstract patterns. I recommend the resources linked below for additional information.



#### References

- [Using CPPNs to generate abstract visualizations from audio data (tehnokv.com)](https://tehnokv.com/posts/visualizing-audio-with-cppns/)
- [Generative Art with Compositional Pattern Producing Networks and GANs by Kevin Jiang (personal blog)](https://kwj2104.github.io/2018/cppngan/)
- [CPPN mini-project by Troels A. Rasmussen (medium.com)](https://medium.com/@troelsarasmussen/cppn-mini-project-617ac24018e1)
- [Neurogram by Studio Otoro (otoro.net)](http://blog.otoro.net/2015/07/31/neurogram/)
- [Generating Large Images from Latent Vectors by Studio Otoro (otoro.net)](http://blog.otoro.net/2016/04/01/generating-large-images-from-latent-vectors/)
- [cppn-tensorflow repository on github by hardmaru (Studio Otoro)](https://github.com/hardmaru/cppn-tensorflow)
- [An implementation of realtime CCPPNs using WebGL by pngupngu (pngupngu.com)](https://pngupngu.com/#/sketch/realtime-cppn)
- [Understanding Compositional Pattern Producing Networks (Part One) by Cameron Wolfe (towardsdatascience.com)](https://towardsdatascience.com/understanding-compositional-pattern-producing-networks-810f6bef1b88)
- [Making deep neural networks paint to understand how they work by Paras Chopra (towardsdatascience.com)](https://towardsdatascience.com/making-deep-neural-networks-paint-to-understand-how-they-work-4be0901582ee)

#### Source 

- [Source of this implementation in tf.js on github](https://github.com/ex-punctis/abstract-art-cppn)
