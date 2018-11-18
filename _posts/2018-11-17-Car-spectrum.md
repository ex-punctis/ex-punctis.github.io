---
layout: post
title:  Popularity of car colours in the Greater Toronto Area
excerpt: According to a survey conducted in 2012 by PPG Industries, white (21%) and black (19%) were the two most popular colours in North America followed closely by silver and grey (16% each). Red and blue accounted for 10 and 8% respectively. I decided to test this data by taking photographs of an intersection in Mississauga, Ontario and analyzing them with the help of YOLOv3, OpenCV and scikit-learn libraries. 
---

## Popularity of car colours in the Greater Toronto Area

### Table of contents
- [Summary](#summary)
- [Data collection](#data-collection)
- [Data Analysis](#data-analysis)
	- [Extraction of car colour information](#car-detection)
	- [Clustering of car colours](#car-detection)
		- [K-means and mean shift in RGB](#k-means-and-mean-shift-in-rgb)
		- [K-means and mean shift in HCV](#k-means-and-mean-shift-in-hcv)
		- [K-means and mean shift in L\*a\*b\*](#k-means-and-mean-shift-in-lab)
		- [Agglomerative clustering in L\*a\*b\*](#agglomerative-clustering-in-lab)
	- [Final result](#final-result)

### Summary

According to a [survey](https://web.archive.org/web/20121013184631/http://www.ppg.com/en/newsroom/news/Pages/20121010A.aspx) conducted in 2012 by PPG Industries, white (21%) and black (19%) were the two most popular colours in North America followed closely by silver and grey (16% each). Red and blue accounted for 10 and 8% respectively. I decided to test this data by taking photographs of an intersection in Mississauga, Ontario and analyzing them with the help of YOLOv3, OpenCV and scikit-learn libraries. The results of analysis (>600 cars) can be summarized by the following figure:

{% include one-med-image.html center-img = '/images/2018-11-17/rgb-ac-spectrum.svg' %}

Please note these colours represent the 

Note black appears grey because of reflections. There may be additional distortions depending on your monitor calibration.


### Data collection

A Canon PowerShot S100 12 MP camera with [CHDK firmware](http://chdk.wikia.com/wiki/CHDK) was mounted on a tripod and zoomed on a portion of an intersection from above. Aperture, exposure and white balance were set manually. Photographs were taken automatically every 20 seconds while the battery laster (approximately 90 min). Photographing was carried out between 2 and 4 pm DST for two days. Unfortunately, seasonal weather changes made it impossible to continue shooting. I manually eliminated the photographs with duplicate objects and was left with 141 unique jpg images at the end. 

### Data analysis

#### Car detection

The photographs were batch-cropped (`mogrify -crop 4000x2050+0+750 *.jpg`) and processed by [YOLOv3](https://pjreddie.com/darknet/yolo/) (with COCO weights). If you want to replicate this project, you can follow the link for detailed YOLOv3 instructions or simply run the following commands:

```
git clone https://github.com/pjreddie/darknet
cd darknet
wget https://pjreddie.com/media/files/yolov3.weights
```

The model will only draw boxes around the detected objects by default as in the photo below:

{% include one-med-image.html center-img = '/images/2018-11-17/example-yolo.jpg' %}


In order to print the file path and the coordinates of the boxes, the following changes have to be made.

1 Edit `void draw_detections(...)` in src/image.c: 

1.1 At the top, after `int i,j;` add    
```c
int max_prob_class;
float max_prob = 0;
```

1.2 Insert 

```c
if (dets[i].prob[j] > max_prob) {
	max_prob = dets[i].prob[j];
	max_prob_class = j; 
}
```

in the following cycle       

```c
for(j = 0; j < classes; ++j){
	if (dets[i].prob[j] > thresh){
		if (class < 0) {
			strcat(labelstr, names[j]);
			class = j;
		} else {
			strcat(labelstr, ", ");
			strcat(labelstr, names[j]);
		}
		// insert << HERE >>>   
	}
}
```

1.3 Add

```c
printf("{\"object\": \"%s\", \"probability\": \"%.2f\", \"x0\": \"%d\", \"y0\": \"%d\", \"x1\": \"%d\", \"y1\": \"%d\"}\n", names[max_prob_class], max_prob, left, top, right, bot); 
```

below

```c
if(left < 0) left = 0;
if(right > im.w-1) right = im.w-1;
if(top < 0) top = 0;
if(bot > im.h-1) bot = im.h-1;
```

2 Edit `void test_detector(...)` in examples/detector.c: replace `printf("%s: Predicted in %f seconds.\n", input, what_time_is_it_now()-time);` with `printf("{\"path\": \"%s\"}\n", input);` 

Run `make` after saving the changes to compile darknet.

In order to run YOLOv3 with multiple images, we need a file containing the images' paths. It can be created like this:

```bash
cd <image directory>
ls -d -1 $PWD/*.* | grep '.JPG' > imagelist.txt
```
Finally, image recognition can be run:

```bash
cd <darknet directory>
./darknet detect cfg/yolov3.cfg yolov3.weights < /~/Desktop/images/imagelist.txt
```

The terminal output needs to be saved into `_detected_objects.txt`



### Extraction of car colour information

The first cell in `cars-get-colours.ipynb` takes `_detected_objects.txt` (should be located in the directory with your images) and reads it line by line converting the data into dictionaries. Car objects are extracted from the original images, their height:width ratio is verified to be within 0.3 and 1 to reject defective objects, and a line of pixels is sampled at 30% of the height from the top of the object. K-means is applied to the line array to find 5 colour clusters, and the cluster with the most points is presumed to be the colour of the car which is appended to an array that is saved once all images have been processed.

The image below illustrates successful colour determination.

{% include one-small-image.html center-img = '/images/2018-11-17/good.png' %}

Oddly shaped objects are skipped because K-means clustering often won't identify the correct colour:

{% include one-small-image.html center-img = '/images/2018-11-17/bad.png' %}

In some cases K-means fails even with good images:

{% include one-small-image.html center-img = '/images/2018-11-17/kmeans-failure.png' %}

The overall colour detection error rate for my dataset was approximately 6%. One limitation of determining colours with K-means clustering is the lack of context. Glare and changing lighting conditions affect the way a colour is encoded by the camera. However, colour perception in humans corrects for such variations by considering the environment. Perhaps I could minimize data variance by identifying the RGB values for the asphalt and then correcting the detected car colours using the same transformation that brings the colour of the asphalt to some standard value. It's something worth trying in the future (when I get the chance to collect more images).

### Clustering of car colours

I decided to attempt a variety of scikit-learn [clustering methods](https://scikit-learn.org/stable/modules/clustering.html) in three different colour spaces (RGB, HCV and L\*a\*b\*). Below is the raw dataset plotted in each of the three coordinate systems.

3D representation in RGB

{% include one-small-image.html center-img = '/images/2018-11-17/rgb-3d.svg' %}

3D representation in HCV and L\*a\*b\*

{% include two-small-images.html left-img = '/images/2018-11-17/hcv-3d.svg' right-img = '/images/2018-11-17/lab-3d.svg' %}

The lack of green shades in the dataset makes it possible to project the data points onto a surface with little information loss. The result of SVD in RGB space is presented below:

2D representation 

{% include one-small-image.html center-img = '/images/2018-11-17/pca-all.svg' %}

The parameters of the clustering methods were chosen semi-arbitrarily. The goal was to preserve the distinction between the white, grey and black cars, maintain over 10 shades of grey and have the cluster centers appear in positions that could be mapped to a line in a harmonious arrangement based on hue and brightness. The following plots show the clusters determined as well as their frequencies.


#### K-means and mean shift in RGB

{% include two-small-images.html left-img = '/images/2018-11-17/rgb-km-freq.svg' right-img = '/images/2018-11-17/rgb-ms-freq.svg' %}

#### K-means and mean shift in HCV

{% include two-small-images.html left-img = '/images/2018-11-17/hcv-km-freq.svg' right-img = '/images/2018-11-17/hcv-ms-freq.svg' %}


#### K-means and mean shift in L\*a\*b\*

{% include two-small-images.html left-img = '/images/2018-11-17/lab-km-freq.svg' right-img = '/images/2018-11-17/lab-ms-freq.svg' %}


K-means (n=30) in RGB produced a nice arrangement of cluster centres. Unfortunately, the algorithm yielded inaccurate cluster frequencies when checked against black and white cars. K-means in other colour spaces suffered the same fate. The performance of mean shift was rather disappointing as well.

#### Agglomerative clustering in RGB

I was able to obtain the most accurate segmentation with agglomerative clustering (Ward's method).

{% include two-small-images.html left-img = '/images/2018-11-17/rgb-ac-all.svg' right-img = '/images/2018-11-17/rgb-ac-freq.svg' %}

#### Agglomerative clustering in HCV

{% include two-small-images.html left-img = '/images/2018-11-17/hcv-ac-all.svg' right-img = '/images/2018-11-17/hcv-ac-freq.svg' %}

#### Agglomerative clustering in L\*a\*b\*

{% include two-small-images.html left-img = '/images/2018-11-17/lab-ac-all.svg' right-img = '/images/2018-11-17/lab-ac-freq.svg' %}

### Final result

The result of clustering in RGB was easiest to parametrize in one dimension. It was done by first converting the cluster centres from RGB to HSV and getting the index of sorting by V (brightness). Then the index was separated into grey, blue, yellow and red segments (based on hue and saturation) which were then recombined into the final sort index which was used to construct the 1-D histogram.

```python
centers_hsv = rgb2hsv(centers)

# sort by V in HSV
v_sort_ind = np.argsort(centers_hsv[:, 2])

# grey
grey_ind = v_sort_ind[centers_hsv[v_sort_ind,1]<0.25]
# blue
blue_ind = v_sort_ind[(centers_hsv[v_sort_ind,1]>0.25) & (centers_hsv[v_sort_ind,0]>180)& (centers_hsv[v_sort_ind,0]<300)]
# yellow
yel_ind = v_sort_ind[(centers_hsv[v_sort_ind,1]>0.25) & (centers_hsv[v_sort_ind,0]>27) &(centers_hsv[v_sort_ind,0]<150)]
# red
red_ind = v_sort_ind[(centers_hsv[v_sort_ind,1]>0.25) &((centers_hsv[v_sort_ind,0]<27) | (centers_hsv[v_sort_ind,0]>300))]

sort_ind = np.concatenate((blue_ind[::-1], grey_ind, yel_ind, red_ind[::-1]))
```

{% include one-med-image.html center-img = '/images/2018-11-17/rgb-ac-spectrum.svg' %}

Please note black cars appear grey in the figure above because of reflections and the lack of [visual context](https://www.illusionsindex.org/ir/checkershadow). There may be additional distortions depending on your display settings.