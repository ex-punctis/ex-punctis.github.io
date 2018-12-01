---
layout: post
title:  car detection - old method
indexflag: false
excerpt:  none
---

<span style="color:red">Note:</span> Originally I used the following method which involves running the YOLOv3 model natively on [darknet](https://pjreddie.com/darknet) and requires some modifications to be made in order to output image paths and object coordinates in a way that can be used by my Python script. You can save yourself a lot of time if you run YOLOv3 directly with OpenCV from Python. To do that please return to the [main blog entry](Car-spectrum.html#car-detection)

### Car detection — old method

The photographs were batch-cropped (`mogrify -crop 4000x2050+0+750 *.jpg`) and processed by [YOLOv3](https://pjreddie.com/darknet/yolo/) (with COCO weights). If you want to replicate this project, you can follow the link for detailed YOLOv3 instructions or simply run the following commands (assuming you keep git repositories in `~/git`):

```
cd ~/git
git clone https://github.com/pjreddie/darknet
cd darknet
wget https://pjreddie.com/media/files/yolov3.weights
```

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
		// <<< insert HERE >>>   
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

The terminal output needs to be saved into `detected_objects.txt` in the directory of choice.

