---
layout: post
title:  Covariance — an intuitive linear algebra approach
excerpt: No excerpt just yet 
indexflag: false
tag: [math notes]
---

## Covariance — an intuitive linear algebra approach

I find that mathematical concepts well learned through formal definitions and proofs just don't stick around in my memory unless they are backed up by intuition. Covariance is one subject that gets exhaustive formal treatment in statistical textbook yet is often left too vague on the intuitive level. In my previous [post]({{ site.url }}/2018/05/25/Random-vectors.html), I compared sample covariance and the dot product of zero-centered observations of random variables. Now I would like to discuss a more powerful generalization of this statistical characteristic — the covariance matrix. The entries of this matrix consist of covariances (indicators of collinearity) between each combination of random variables $$ X_i $$ and $$ X_j $$:

$$ \mathbf\Sigma_{ij} = E[(X_i-E(X_i))(X_j-E(X_j))] $$ 

The diagonal entries are, of course, just variances of $$ X_i $$.

For illustrative purposes, we will consider a simplistic case of n observations of zero-centered random variables such that each covariance matrix entry simplifies to

$$ \mathbf S_{ij} = {1 \over n-1} \mathbf x_i\cdot\mathbf x_j $$ 

where $$ \mathbf x_i $$ and $$ \mathbf x_j $$ are vectors of n observations of random variables $$ X_i $$ and $$ X_j $$ respectively. We will keep n sufficiently large that sample means are close enough to zero.

One last thing we need to agree on is how to represent our sample data. Let $$ \mathbf x_i $$ and $$ \mathbf x_j $$ be rows in the data matrix:

$$ \mathbf D = \begin{bmatrix} — \mathbf x_1 — \\ — \mathbf x_2 — \\ — ... — \\ — \mathbf x_n — \end{bmatrix} $$

Then each column of this matrix will represent one set of simultaneous observations of all random variables. The neat thing about this representation is that we can take this matrix and multiply it by its transpose times $$ \frac{1}{n-1} $$, and that gives us the covariance matrix:

$$ {1 \over n-1} \mathbf {DD^T} = {1 \over n-1} \begin{bmatrix} — \mathbf x_1 — \\ — \mathbf x_2 — \\ — ... — \\ — \mathbf x_n — \end{bmatrix} \begin{bmatrix} | & | & | & | \\ \mathbf x_1 & \mathbf x_2 & ... & \mathbf x_n \\ | & | & | & | \end{bmatrix} = \mathrm{Cov} (\mathbf D) = \mathbf S  $$

This is where the magic of linear algebra begins. Of course, there is nothing mysterious about this result — it's just the way matrix multiplication works ("rows times columns"). However, this representation of the data and its covariance matrix will make it much easier to demonstrate the following point:

1. *The eigenvectors of a covariance matrix represent a basis in which your data is uncorrelated.*


Let's start by asking the following question: if there is a linear transformation (specifically, a rotation $$ \mathbf {R} $$) that transforms our data matrix $$ \mathbf {D} $$ in a way that the resulting matrix $$ \mathbf {RD} $$ has no correlation between it's components, how can we find this tranformation $$ \mathbf {R} $$? Let's recollect that in a covariance matrix, all non-zero non-diagonal components indicate correlation. Therefore, if there is no correlation after we apply the transformation to our data, the new covariance matrix  $$ \mathbf S' $$ has to be diagonal:

$$ \mathbf S' = {1 \over n-1}(\mathbf {RD})(\mathbf {RD})^T = \begin{bmatrix} l_1 & 0 & 0 & 0 \\ 0 & l_2 & 0 & 0 \\ 0 & 0 & ... & 0 \\ 0 & 0 & 0 & l_n \end{bmatrix} $$

One property of rotation matrices is that their transpose is the same as the inverse matrix. Hence

$$ \mathbf S' = {1 \over n-1} \mathbf {RD} (\mathbf {RD})^T = {1 \over n-1} \mathbf {RD} \mathbf {D}^T \mathbf {R}^T = {1 \over n-1} \mathbf {RD} \mathbf D^T \mathbf R^{-1} $$

Note that $$ {1 \over n-1} \mathbf {DD^T} $$ is the covariance matrix $$ \mathbf S $$ of the original data $$ \mathbf D $$

Since $$ \mathbf S $$ is a symmetric matrix, it can be eigen-decomposed as  $$ \mathbf E \mathbf \Lambda \mathbf E^{-1} $$, where  $$ \mathbf E $$ is the matrix whose columns are eigenvectors of  $$ \mathbf S $$, and  $$ \mathbf \Lambda $$ is the diagonal matrix whose entries are eigenvalues of  $$ \mathbf S $$.

Let's substitute $$ {1 \over n-1} \mathbf {DD^T} $$ for $$ \mathbf E \mathbf \Lambda \mathbf E^{-1} $$,

$$ \mathbf S' =  \mathbf {R} \mathbf E \mathbf \Lambda \mathbf E^{-1} \mathbf R^{-1} = \mathbf {R} \mathbf E \mathbf \Lambda (\mathbf {RE})^{-1} $$

Since both $$ \mathbf S' $$ and $$ \mathbf \Lambda $$ are diagonal, we must conclude that $$ \mathbf R $$ and $$ \mathbf E $$ are inverses of each other. Therefore representing the data matrix in the basis of $$ \mathbf E $$ is equivalent to applying a transformation (rotation) that removes correlation between variables.




```python


```

							
{% include one-med-image.html center-img = '/images/2018-11-17/rgb-ac-spectrum.svg' %}
