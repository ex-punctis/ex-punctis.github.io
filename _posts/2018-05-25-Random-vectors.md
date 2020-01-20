---
layout: post
title:  Relationship between random n-vectors at various n
excerpt: Covariance and Pearson's correlation coefficient are two cornerstone measures of linear dependence in statistics. Both have geometrical interpretations. Sample covariance of variables is the dot product of two n-vectors whose components are formed from centred observations for each variable, scaled by the reciprocal of n-1. Correlation coefficient is the cosine of the angle between the two vectors. Their distributions depend on n. Here we will take a look at distributions of sample covariance, correlation coefficient as well as dot product, angle cosine, and angle between independent vectors with n ∈ {2, 3, 5, 10, 30} components ~N(0,1).
tags: [math notes]
image: /images/2018-05-25/covar.svg
mathjax_flag: true
---

## Relationship between random n-vectors at various n

Covariance and Pearson's correlation coefficient are two cornerstone measures of linear dependence in statistics. Both have geometrical interpretations. Sample covariance of variables is the dot product of two n-vectors whose components are formed from centred observations for each variable, scaled by the reciprocal of n-1. Correlation coefficient is the cosine of the angle between the two n-vectors. Independent random variables are expected to have zero covariance and correlation coefficient. While sample covariance tends to be close to zero when working with a large number of observations, it is not the case when dealing with only a few observations. Let's take a look at distributions of sample covariance, correlation coefficient as well as dot product, angle cosine, and angle between independent vectors with n ∈ {2, 3, 5, 10, 30} components ~N(0,1).

### Definitions

Dot product of **x** and **y**: 

$$\textbf{x}\textbf{y} = \sum_{i=1}^{n}x_iy_i$$

Covariance of **x** and **y**: 

$$s_{xy} = \frac{1}{n-1}\sum_{i=1}^{n}(x_i-\overline{x})(y_i-\overline{y})$$

Cosine of the angle between vectors **x** and **y**: 

$$\cos{\theta_{\mathbf{x}\mathbf{y}}} = \frac{\mathbf{x}\mathbf{y}}{\left \| \mathbf{x} \right \|\left \| \mathbf{y} \right \|}$$

Pearson's correlation coefficient for **x** and **y**: 

$$r = \frac {\sum_{i=1}^{n}(x_i-\overline{x})(y_i-\overline{y})}{\sqrt{(\sum_{i=1}^{n}(x_i-\overline{x})^2)(\sum_{i=1}^{n}(y_i-\overline{y})^2)}}$$


### Code

The following R snippet was written to generate random vectors and calculate the measures of interest. Surprisingly, despite anecdotes of R's inefficiency with for loops, it worked noticeably faster than analogous code written in Python/NumPy. 

```R
reps <- 1e6                          # number of replicates
dims <- c(2, 3, 5, 10, 30, 100)      # vector dimensions
means <- c(0, 1, 3, 10)              # vector component distribution means
# initialize matricies of results (rows are repetitions, columns are dimensions)
vecs <-   array(dim=c(reps, length(dims), max(dims), 2))    # collection of n-vector pairs
dot <-    array(dim=c(reps, length(dims), length(means)))   # n-vector dot product
cos <-    array(dim=c(reps, length(dims), length(means)))   # n-vector angle cosine
covar <-  matrix(nrow = reps, ncol = length(dims))   # covariance of two sets ("vectors") of n observations
corr <-   matrix(nrow = reps, ncol = length(dims))   # Pearson's r of two sets ("vectors") of n observations

vecs <- array(rnorm(reps*max(dims)*2, 0, 1), dim=c(reps, max(dims), 2))	# collection of n-vector pairs, n = max(dims)

for (d in seq_along(dims)) {
  print(dims[d])                      # display progress (current number of dimensions)
  v1 <- vecs[, 1:dims[d], 1]
  v2 <- vecs[, 1:dims[d], 2]
  for (m in seq_along(means)) {
    dot[, d, m] <- rowSums((v1+means[m])*(v2+means[m]))    # dot product of vectors
    cos[, d, m] <- dot[, d, m]/sqrt(rowSums((v1+means[m])^2)*rowSums((v2+means[m])^2)) # cosine
  }
  c1 <- v1 - rowSums(v1)/dims[d]         # center vector components
  c2 <- v2 - rowSums(v2)/dims[d]                                            
  covar[, d] <- rowSums(c1*c2, dims = 1)/(dims[d]-1)                      # faster impolementation of cov()
  corr[, d] <- covar[, d]*(dims[d]-1)/sqrt(rowSums(c1*c1)*rowSums(c2*c2)) # faster implementation of cor()
}

```

### Results

Since the distribution of the dot product of random vectors tends to be wider in higher dimensions, it was necessary to standardize it before plotting. This adjustment makes it apparent that distributions obtained from vectors in spaces with few dimensions are narrower than the corresponding normal distributions. Dot product distributions obtained with vectors ~N(µ≠0, 1) are noticeably skewed when µ≈1 but the degree of skewness decreases at larger µ. At the same time, increasing µ causes the distribution to become normal even in lower dimensions.

{% include one-med-image.html center-img = '/images/2018-05-25/dot-norm.svg' %}

Covariance, the statistical analog of the dot product, avoids the issue of skewness and distribution widening at larger n by mean-centering vector components and dividing their dot product by n-1. Consequently, the covariance of random samples is more concentrated around zero when there is a large number of observations.

{% include one-small-image.html center-img = '/images/2018-05-25/covar.svg'  %}


Cosine of the angle between random vectors displays a variety of distinct distributions that depend on vector space dimensionality and vector component distribution mean. In two dimensions, vectors with components ~N(0,1) create a valley-like dot product distribution with peaks around ±1 which corresponds to a uniform distribution of the angle. Increasing the number of dimensions causes the distribution of cos θ to become increasingly concentrated around zero thus demonstrating that random n-vectors tend to be nearly orthogonal at large n when their components are centered around 0.

{% include one-med-image.html center-img = '/images/2018-05-25/cosine.svg'  %}

Pearson's correlation coefficient (r) is calculated like the cosine of the angle between two vectors except the vector components are mean-centered. For a large number of random samples, r is distributed similarly to cos θ. However, when n = 2, the distribution of r becomes discrete because mean-centering vector components changes their orientation to -π/4 or 3π/4 thus making all vectors collinear.

{% include one-small-image.html center-img = '/images/2018-05-25/corr.svg'  %}









