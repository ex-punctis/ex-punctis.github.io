<script type="text/javascript">

function draw_expanded_img() {
	icon = document.getElementById("expanded-image-close-icon");
	//get CSS-defined max height and width in pixels
	maxHeight = window.getComputedStyle(imgExpanded).getPropertyValue('max-height').slice(0, -2);
	maxWidth  = window.getComputedStyle(imgExpanded).getPropertyValue('max-width').slice(0, -2);

	// clear max height and width properties acquired from CSS
	imgExpanded.style.maxHeight = 'none';
	imgExpanded.style.maxWidth = 'none';

	aspectRatio = imgExpanded.width/imgExpanded.height;

	imgExpanded.height = maxHeight; 		// set image height to max
	
	if (imgExpanded.width > maxWidth) { // compare width with max and shrink if necessary
		imgExpanded.width = maxWidth; 
		imgExpanded.height = maxWidth/aspectRatio;
	}

	imgExpanded.style.visibility = 'visible';

    icon.style.left = ($(window).width()-imgExpanded.width)/2+'px';
	icon.style.visibility = 'visible';
}

function expand_img(icon) { 
	imgExpanded = icon.parentElement.previousElementSibling.cloneNode(false);
    imgExpanded.className = "expanded-img";
    imgExpanded.id = "expanded-image";
  	var expandedImgContainer = document.getElementById("expanded-image-container");
    expandedImgContainer.appendChild(imgExpanded);	
	$(imgExpanded).on('load', draw_expanded_img);
	document.getElementById("expanded-image-outer-veil").style.visibility = 'visible'; 
}

function close_expanded_img() {
  	var expandedImgContainer = document.getElementById("expanded-image-container");
    expandedImgContainer.removeChild(document.getElementById("expanded-image")); 
	document.getElementById("expanded-image-outer-veil").style.visibility = 'hidden'; 	
	document.getElementById("expanded-image-close-icon").style.visibility = 'hidden';
}	

function redraw_img_expanded() {
	[maxHeight, maxWidth] = [maxWidth, maxHeight]; //swap because of orientation change
	imgExpanded.height = maxHeight; 			// set image height to max
	imgExpanded.width = maxHeight*aspectRatio; // width won't set automatically because we undid CSS maxWidth and maxHeight

	if (imgExpanded.width > maxWidth) { // compare width with max and shrink if necessary
		imgExpanded.width = maxWidth; 
		imgExpanded.height = maxWidth/aspectRatio;
	}
	icon.style.left = ($(window).width()-imgExpanded.width)/2+'px';
}

// global variables
var imgExpanded;
var icon;
var maxHeight;
var maxWidth;
var aspectRatio;


window.addEventListener('orientationchange', function() {	
	if (imgExpanded) {   redraw_img_expanded(); }
});

</script>

