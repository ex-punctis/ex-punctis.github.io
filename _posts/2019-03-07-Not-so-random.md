---
layout: post
title:  How random can you be?
excerpt: Suppose I asked you to generate a random sequence of ones and zeroes. Every time you add another 1 or 0 to the sequence, I am going to predict your next choice. Do you think you can make your sequence random enough that I fail to guess more than ~50% correct? Read this post to find out. Spoiler — you are not so random.
image: /images/2019-03-07/demo.gif
indexflag: true
suggested: Abstract-art
mathjax_flag: false
tag: [js, visualisation]
---

## How random can you be?

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<style>
	.centreContainer {
		display: block;
		position: relative;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left:auto;
		margin-right:auto;
		text-align:center;
	}

	#log {
		display: inline-block;
		background-color: #f3f6fa;
		border: solid 1px #dce6f0;
		border-radius: 0.3rem;
		margin: 0px 0px 0px 0px;
		padding: 0px 10px 0px 10px;
	}
	
	#iterLogElem,#predLogElem,#guessLogElem {
		margin: 0px 0px 0px 0px;
		padding: 0px 10px 0px 10px;
	}
	
	#plotContainer {
		display:inline-block;
		margin: 0px;
		padding: 0px;
	}
	
	.buttons {
	 	display: block;
		position: relative;
		margin-left:auto;
		margin-right:auto;
	}
	
	button {
		background-color: #FFFFFF; 
		color: black; 
		border: 2px solid #888888; 
		border-radius: 5px; 
		padding: 7px 20px 7px 20px;
	}

	button:focus { outline: none; }	
</style>

Let's play a game. You press ← and → as randomly as you can, and I will try to guess your next input. Use your keyboard or the buttons below (on touchscreen devices).

Every time I guess right, I will take $1 from your virtual account. Every time I guess wrong, you'll get $1.05. If you are as random as you think, you'll be making virtual dough in no time. Don't worry, there is no cheating involved. I simply keep track of the patterns you produce and use them to predict your next move.

Once you've become tired of watching your virtual money evaporate, press the "randomize" button below, and I will add 10 pseudo-random inputs on your behalf. **On average** (i.e. not all the time), this is going to earn you some money. Isn't it ironic that a pseudo-random number generator is more "random" than you are?

*~~Update: I've added five custom events for google analytics to collect statistics on correct guesses after 100, 200, 300, 500 and 1000 inputs. If you'd rather not be counted, please load the html file from my [github repository](https://github.com/ex-punctis/not-so-random) instead. Update 2: I've also started collecting the first 180 left-right inputs (anonymously). The purpose of this is to generate test data for an improved model.~~ Update 3: I have more than 10,000 datapoints, so I've disabled game stats collection.*

<div style="text-align: center;"> 
	<button id="randomize" onClick="randomHelpFunc(event)">randomize!</button>
	<button id="left" ontouchstart="captureBtnLeftFunc(event)">&nbsp;&nbsp;←&nbsp;&nbsp;</button>
	<button id="right" ontouchstart="captureBtnRightFunc(event)">&nbsp;&nbsp;→&nbsp;&nbsp;</button>
</div>

<div class='centreContainer'><div id="log">
	<div id='iteration'>Start pressing ← and → on your keyboard</div>
	<div id='prediction'>(←/→ buttons above on touchscreen devices).</div>
	<div id='guesspct'>Log messages will appear here.</div>
</div></div>

<div class='centreContainer'><div id="plotContainer"></div></div>
    
So how does it work exactly? Your fingers tend to repeat certain patterns even if you don't notice it. The program keeps a database of each possible combination of 5 presses, and two counters are stored under each entry — one is for every zero that follows the combination, and the other one is for all the ones that follow this combination. So every time you press a key, an entry in the database gets updated. To make a prediction, the program needs only to look up the entry corresponding to the last 5 presses and decide by looking at the counters which key press is more likely to follow. The rest is up to Fortuna (velut luna). I've run this script with 200 pseudo-random inputs 100,000 times, and found that the distribution of correct guesses is approximately normal with µ=50% and σ=3.5% (this agrees with the binomial estimation, of course). The probability of the program guessing your inputs >57% (µ+2σ) of the time purely by chance is very slim, which suggests that you really aren't good at making random choices.

*Edit:* Professor Ariel Rubinstein has kindly shared his paper co-authored with prof. Kfir Eliaz in 2011: [Edgar Allan Poe's riddle: framing effects in repeated matching pennies games](http://arielrubinstein.tau.ac.il/papers/84.pdf). I think you will enjoy reading it as much as a I did.

*Edit 2:* I also recommend watching [this video](https://www.youtube.com/watch?v=tP-Ipsat90c) by Numberphile.

*Update:* [Follow-up (Statistics)](https://www.expunctis.com/2019/04/01/Not-so-random-followup.html)

**Credits:** I got the idea from [PBS Infinite Series channel](https://www.youtube.com/channel/UCs4aHmggTfFrpkPcWSaBN9g/videos) on YouTube (a highly recommended channel!). One of the videos linked [this demo](http://people.ischool.berkeley.edu/~nick/aaronson-oracle/) which inspired me to experiment with the idea. I didn't dig deeply, but it seems my implementation (5-grams) ended up the same (or at least very similar). I've also tried 3-grams, 4-grams, and adaptive n-grams (n<6), but it seemed they did no better than the current 5-gram model. Although, to be honest, I didn't have the time to do thorough testing, so I may be wrong. The plot is powered by [plotly.js](https://plot.ly/javascript/).


**Source:** [github repository](https://github.com/ex-punctis/not-so-random)

    
<script>
	var iteration = 1;
	
	var accountComputer = 1000; // starting balance $1000
	var accountPlayer = 1000;   // starting balance $1000
	var betWon = 1; // you lose $1 when your input is guessed correctly
	var betLost = 1.05; // you wom $1.05 when your input is guessed wrong
	
	var gramBuffer = [0,1,0,1,0]; // 5-gram buffer
	var gramHistory = {}; // statistics for all 32 5-grams
	var correct = 0; // total number of correct guesses
	var wrong = 0; // total number of wrong guesses
	var prediction = 0; // current prediction (encoded as 0 or 1)
	var lastKey = 0; // last typed key (encoded as 0 or 1)
	// database index based on the current gram buffer (binary to decimal)
	var historyIndex = gramBuffer[0]*16 + gramBuffer[1]*8 + gramBuffer[2]*4 + gramBuffer[3]*2 + gramBuffer[4]; 
	
	// initialize gram database
	for (let i = 0; i<32; i++) { gramHistory[i] = {counter0: 0, counter1: 0}; } 

	// array of 180 user inputs (left/right only!) to be sent to google analytics
	var inputArr =[];
	
	// references to DOM elements
	var iterLogElem = document.getElementById('iteration');
	var predLogElem = document.getElementById('prediction');
	var guessLogElem = document.getElementById('guesspct');
	var plotDiv = document.getElementById('plotContainer');

	// create plot using Plotly
	Plotly.newPlot(
		plotDiv, 
		[{ name: 'player', y: [1000], type: 'scatter' }], 
		{ automargin: true,
		  margin: {l: 50, r: 50, b: 50, t: 10, pad: 4 },
		  showlegend: false,
		  autosize: false, width: 350, height: 180,
		  xaxis: { title: { text: 'Iteration' } },
		  yaxis: { title: { text: 'Balance $' } } },
		{ displayModeBar: false });

	// prevent page springing and double-tap zoom
	//document.ontouchmove = function(event){ event.preventDefault(); }

	// capture keyboard key
	captureKeyFunc = function(evt) {
		evt = evt || window.event;
		evt.preventDefault();
		if (evt.code == 'ArrowLeft') {
			lastKey = 0;
			inputArr.push(lastKey);
			testPrediction();
			updateAll();
			predictNext(); 
		}
		if (evt.code == 'ArrowRight') {
			lastKey = 1;
			inputArr.push(lastKey);
			testPrediction();
			updateAll();
			predictNext(); 
		}
		
	};
	document.onkeydown = captureKeyFunc;
	
	// capture left button click
	captureBtnLeftFunc = function(evt) {
		//evt = evt || window.event;
		evt.preventDefault();
		lastKey = 0; 
		inputArr.push(lastKey);
		testPrediction();
		updateAll();
		predictNext()
	};
	
	// capture right button click
	captureBtnRightFunc = function(evt) {
		//evt = evt || window.event;
		evt.preventDefault();
		lastKey = 1; 
		inputArr.push(lastKey);
		testPrediction();
		updateAll();
		predictNext()
	};
	
	// when you press the randomize button...
	randomHelpFunc = function(evt) {
		evt.preventDefault();
		//document.onkeydown = null;
		for (let i = 0; i<10; i++) {
			lastKey = Math.round(Math.random());
			testPrediction();
			updateAll();
			predictNext()				
		}
		//document.onkeydown = captureKeyFunc;
	};
		
		
	// test the prediction and adjust account balances and the correct/wrong counters
	function testPrediction() {
		if (prediction == lastKey) {
			correct++;
			accountComputer += betWon;
			accountPlayer -= betWon; }
		else {
			wrong++;
			accountComputer -= betLost;
			accountPlayer += betLost; }		
	}
	
	// uupdate the web page and gram database
	function updateAll() {
		
		let correctPct =  Math.round(correct/(correct+wrong+0.0001)*100);
		

		// send percentage statistics via google analytics at 100, 200, 300, 500, 1000 iterations
		// also send 180 user inputs (left/right) encoded as a string (6 inputs per character)
		// var inputStr = '';
		// if (iteration==100) {
		// 	let reportPct = Math.round(correct/(correct+wrong+0.0001)*1000)/10;
		// 	ga('send', 'event', 'n=100-2', reportPct, reportPct);
 		// }
		// if (iteration==180) {
		// 	for(i=0;i<inputArr.length;i=i+6){
		// 		inputStr += String.fromCharCode(48+inputArr[i]*32+inputArr[i+1]*16+inputArr[i+2]*8+inputArr[i+3]*4+inputArr[i+4]*2+inputArr[i+5]); 
		// 	}
		// 	ga('send', 'event', 'inputs', inputStr, '');
		// }

		// if (iteration==200) {
		// 	let reportPct = Math.round(correct/(correct+wrong+0.0001)*1000)/10;
		// 	ga('send', 'event', 'n=200-2', reportPct, reportPct);
		// }
		// if (iteration==300) {
		// 	let reportPct = Math.round(correct/(correct+wrong+0.0001)*1000)/10;
		// 	ga('send', 'event', 'n=300-2', reportPct, correctPct);
		// }
		// if (iteration==500) {
		// 	let reportPct = Math.round(correct/(correct+wrong+0.0001)*1000)/10;
		// 	ga('send', 'event', 'n=500-2', reportPct, reportPct);
		// }
		// if (iteration==1000) {
		// 	let reportPct = Math.round(correct/(correct+wrong+0.0001)*1000)/10;
		// 	ga('send', 'event', 'n=1000-2', reportPct, reportPct);
		// }

		
		// if you want a 100% IFRS compliant financial document, uncomment the code below, 
		// and you will be able to access your transaction history in the browser console. 
		// The format (space separated) is <iteration> <predicted key: 0 or 1> <actual key: 0 or 1>
		// <percentage of right guesses> <computer account balance> <player account balance>
		
		//console.log([iteration, prediction, lastKey, correctPct, Math.round(accountComputer*100)/100, Math.round(accountPlayer*100)/100].join(' '));
		
		// update DOM elements
		iterLogElem.textContent = 'Iteration '+iteration;
		
		predLogElem.textContent = `I guessed ${ prediction ? 'right' : 'left' }
		${ prediction==lastKey ? '(correct). ' : '(wrong). ' }
		You pressed
		${ lastKey ? 'right.' : 'left.' } `;

		guessLogElem.textContent = 'My guesses are correct '+correctPct+'% of the time (overall)';
		
		// extend plot
		Plotly.extendTraces(plotDiv, {y: [[Math.round(accountPlayer*100)/100]]}, [0])	
	
		iteration++; // increment iteration counter

		// update the 5-gram history
		gramHistory[historyIndex].counter0 += (1-lastKey);
		gramHistory[historyIndex].counter1  += lastKey;
	
		// update the 5-gram buffer
		gramBuffer.push(lastKey);
		gramBuffer.shift();	
	}
	
	// take a look at the 5-gram buffer and make the next prediction
	function predictNext() {
		// convert gram buffer to database index (binary to decimal)
		historyIndex = gramBuffer[0]*16 + gramBuffer[1]*8 + gramBuffer[2]*4 + gramBuffer[3]*2 + gramBuffer[4]; 
		// make a prediction
		if (gramHistory[historyIndex].counter1 > gramHistory[historyIndex].counter0) { prediction = 1; }
		else { prediction = 0;  }
	}
</script>


