---
layout: post
title:  The real reason you use the MSE and cross-entropy loss functions
excerpt: If you learned machine learning from MOOCs, there's a good chance you haven't been taught the true significance of the mean squared error and cross-entropy loss functions.
image: /images/2019-01-27/MSE.png
indexflag: true
tag: [math notes]
suggested: Abstract-art
mathjax_flag: true
---

## The real reason you use MSE and cross-entropy loss functions

If your knowledge of machine learning methods comes from an online course, chances are you've been taught highly simplified math. It's not an issue if you are interested primarily in gaining practical skills. However, if you tend to wonder why things are the way they are, not knowing the proper math can be tormenting at times since you end up missing important insights. For example, why do we default to using mean squared error loss in linear regression? Hint: it's not just because it's conveniently convex, and it's not because it represents the sum of Euclidean distances. Similarly, why do we use cross-entropy loss in logistic regression? The answer in both cases has to do with maximum likelihood estimation.

The likelihood function (L) of some model parameter (or a combination of parameters) θ is defined as the probability of obtaining the observed data (O) estimated by the model with parameter(s) θ.

$$ {\mathcal {L}}(\theta \mid O)=P(O \mid \theta) $$

Suppose you know the general form of your statistical model, but you don't know which parameter values to pick. The intuitive solution is to choose the parameter values that best explain the existing observations. This is equivalent to finding the θ that maximizes the likelihood function, and this method is formally known as maximum likelihood estimation (MLE).

In linear regression, the explained variable is modelled as a linear function of the inputs plus an error term:

$$ {y=\beta _{0}+\beta _{1}x_{1}+\cdots +\beta _{m}x_{m}+\varepsilon} $$

In the ideal case, the error term ε is normally distributed around zero with the variance independent of the input variables:

$$ \varepsilon \sim \mathcal{N}(0, \sigma^{2})\ $$

In that case y is normally distributed around $$ \hat y = \beta _{0}+\beta _{1}x_{1}+\cdots +\beta _{m}x_{m} $$:

$$ y \sim \mathcal{N}(\hat y, \sigma^{2})\ $$

The probability density function is described by the following equation:

$$ f(y\mid \hat y,\sigma ^{2}) = {\frac {1}{\sqrt {2\pi \sigma ^{2}}}}e^{-{\frac {(y - \hat {y} )^{2}}{2\sigma ^{2}}}} $$

For continuous distributions, maximum likelihood estimation is performed with probability densities instead of probabilities. We are going to maximize the product of the probability densities of each observation:

$$ {\mathcal {L}} =\prod _{i=1}^n f(y_i \mid \hat y_i,\sigma ^{2}) =(2\pi \sigma^2)^{-n/2} e^{-{\frac { \sum _{i=1}^n (y_i - \hat y_i)^2 }{2\sigma ^{2}}}} $$

In max-min problems any objective function can be replaced with a monotone function that takes the original objective function as its argument. First, let's get rid of $$ (2\pi \sigma^2)^{-n/2} $$, then take the natural logarithm, and finally let's remove $$ {2\sigma ^{2}} $$ from the denominator and flip the sign. Thus maximizing the original likelihood function becomes equivalent to minimizing $$ \sum _{i=1}^n (y_i - \hat y_i)^2 $$. Looks familiar doesn't it? If we divide it by n, we'll get the  expression for the MSE loss function. In other words, minimizing the MSE is equivalent to applying maximum likelihood estimation to our model.

So if the MSE is such a meaningful loss function, why do we need other types of loss (e.g., L1 and lasso/ridge regression)? In part this has to do with the assumptions that went into our idealized linear model: (1) the error term is normally distributed; (2) the variance of the error term is not a function of the input variables. If either of them is violated, the connection between minimizing the MSE and maximizing the likelihood function becomes broken (*womp-womp*). More importantly, in the framework of Bayesian statistics, the method of MLE can be extended by incorporating non-uniform priors, and this results in the alternative loss functions.

Now let's consider the logistic model (a binary classifier). We attempt to describe log-odds using a linear model:

$$ \ln \frac {p}{1-p} = \beta _{0}+\beta _{1}x_{1}+\cdots +\beta _{m}x_{m} $$

The probability of observing outcome y=1 under this model is given by the following function (sigmoid):

$$ p \equiv p (y=1 \mid \mathbf B, \mathbf X) = { 1 \over 1 + e^{-(\beta _{0}+\beta _{1}x_{1}+\cdots +\beta _{m}x_{m})}} $$ 

With 0 and 1 being the only possible outcomes, the probability of observing outcome y=0 is simply $$ 1 - p$$. It is easy to write a universal expression for outcome y = o ("oh", not zero):

$$ p (y=o \mid \mathbf B, \mathbf X) = p^o(1-p)^{1-o}

$$


The likelihood function is given by the product of all individual probabilities:

$$ \mathcal L = \prod_{i=1}^n p (y = y_i \mid \mathbf B_i, {\mathbf X}_i) = \prod_{i=1}^n  p_i^{y_i}(1-p_i)^{1-y_i} $$ 

It's easier to maximize the log-likelihood:

$$ \ln \mathcal L = \sum_{i=1}^n (y_i \ln p_i + (1-y_i) \ln (1-p_i) ) $$

Thus once again maximum liklihood estimation yields a familiar loss function (cross-entropy in this case).

