---
layout: post
title:  Visualization of E, V, B fields
excerpt: Most physics textbooks illustrate electric and magnetic fields with field lines which are sets of parametrized curves with tangents defined by field vectors. Field lines are great for emphasizing the directional nature of E and B fields, however they fail to convey the magnitude of forces acting on charges by such fields. One way to overcome this issue is to add level curves indicating vector magnitude. 
tags: [visualisation]
---

## Visualization of E, V, B fields

Most physics textbooks illustrate electric and magnetic fields with field lines which are sets of parametrized curves with tangents defined by field vectors. Field lines are great for emphasizing the directional nature of E and B fields, however they fail to convey the magnitude of forces acting on charges by such fields. One way to overcome this issue is to add level curves indicating vector magnitude. This approach is similar to how electric potential (V) fields are illustrated except unlike potential, Euclidean norm is always positive. 

I've decided to plot a number of fields produced by various combinations of point charges and electric currents in infinite parallel wires. While R may seem an unorthodox tool for a physics simulation, the quality of ggplot2 visuals is what made me pick it. The script can be downloaded from my [GitHub repository](https://github.com/ex-punctis/E-V-B-fields). E and V fields are visualized in a plane to which both charges belong, whereas B fields are shown in a plane perpendicular to the wires. To avoid parametrization of vector field lines I chose to plot normalized vectors (scaled to the desired length) at random locations. This approach is similar to visualizing magnetic fields with iron shavings.


### A simple case of equal charges and equal electric currents

Two equal point charges produce E fields that are cancelled exactly in the middle of the line connecting the charges. A test charge placed at that point with zero momentum would remain stationary despite the non-zero potential. In practice, even the tiniest deviation from that position would cause the test charge to accelerate rapidly.

{% include two-small-images.html left-img = '/images/2018-06-10/E_1_1.png' right-img = '/images/2018-06-10/V_1_1.png' %}

Magnetic fields created by equal electric currents produce field strength level curves similar to those seen in E-fields of equal charges.

{% include one-small-image.html center-img = '/images/2018-06-10/B_1_1.png'  %}

### E-fields of unequal charges

Unequal charges of the same sign produce an \|E\|-field that appears asymmetrical at close distances. The point of zero field strength is shifted towards the smaller charge. Charges of opposite sign produce a field without a zero E point since there is no point in space where the field components cancel each other.

{% include two-small-images.html left-img = '/images/2018-06-10/E_03_1.png' right-img = '/images/2018-06-10/E_-03_1.png' %}

### V-fields of unequal charges

The V-field of unequal charges of the same sign is nothing special. The potential field of opposite charges on the other hand is a curious case since there is a well-defined curve of zero potential. This curve, however, does not represent the lowest potential since the negative charge produces a negative V-field around itself.


{% include two-small-images.html left-img = '/images/2018-06-10/V_03_1.png' right-img = '/images/2018-06-10/V_-03_1.png' %}

### B-fields of unequal currents

The \|B\|-field produced by co-directed electric currents is similar to that produced by charges of the same sign despite the difference in vector orientation. The superposition of B-fields created by currents flowing in opposite directions creates a point of zero field strength located to the left of the wire with the smaller current.

{% include two-small-images.html left-img = '/images/2018-06-10/B_03_1.png' right-img = '/images/2018-06-10/B_-03_1.png' %}













