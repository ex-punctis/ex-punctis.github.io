---
layout: post
title:  Covariance matrix and principal component analysis — an intuitive linear algebra approach
excerpt: Let's take a close look at the covariance matrix using basic (unrigorous) linear algebra and investigate the connection between its eigen-vectors and a particular rotation tranformation. We can then have fun with an interactive visualisation of principal component analysis.
image: /images/2019-02-19/pca.gif
suggested: Loss-functions
indexflag: true
mathjax_flag: true
tag: [math notes, visualisation]
---

## Covariance matrix and principal component analysis — an intuitive linear algebra approach

[\>\>\> Click here if you want to skip to the interactive visualization of PCA](#vector_canvas_7)

Covariance is one subject that gets exhaustive formal treatment in statistical textbooks yet is often left vague on the intuitive level. In my previous [post]({{ site.url }}/2018/05/25/Random-vectors.html), I compared sample covariance and the dot product of zero-centered observations of random variables. Now I would like to discuss a powerful generalization of covariance — the covariance matrix. The entries of this matrix consist of covariances between each combination of random variables $$ X_i $$ and $$ X_j $$:

$$ \mathbf\Sigma_{ij} = E[(X_i-E(X_i))(X_j-E(X_j))] $$ 

The diagonal entries ($$ i = j $$) are, of course, just variances of $$ X_i $$.

For illustrative purposes, we will consider a simplistic case of $$ n $$ observations of $$ m $$ zero-centered random variables such that each covariance matrix entry $$ \mathbf S_{ij} $$ simplifies to

$$ \mathbf S_{ij} = {1 \over n-1} \mathbf x_i\cdot\mathbf x_j,  \qquad 0 \le i,j \le m $$ 

where $$ \mathbf x_i $$ and $$ \mathbf x_j $$ are vectors of $$ n $$ observations of random variables $$ X_i $$ and $$ X_j $$ respectively. We are going to assume that $$ n $$ is sufficiently large so that sample means are close enough to zero.

One more thing we need to agree on is how to represent our sample data. Let $$ \mathbf x_i $$ and $$ \mathbf x_j $$ be rows in the following data matrix:

$$ \mathbf D = \begin{bmatrix} — \mathbf x_1 — \\ — \mathbf x_2 — \\ — ... — \\ — \mathbf x_m — \end{bmatrix} $$

Then each column of this matrix will represent one set of simultaneous observations of all $$ m $$ random variables. The neat thing about this matrix representation is that we can take this matrix and multiply it by its transpose times $$ \frac{1}{n-1} $$, and that gives us the covariance matrix:

$$ {1 \over n-1} \mathbf {DD^T} = {1 \over n-1} \begin{bmatrix} — \mathbf x_1 — \\ — \mathbf x_2 — \\ — ... — \\ — \mathbf x_m — \end{bmatrix} \begin{bmatrix} | & | & | & | \\ \mathbf x_1 & \mathbf x_2 & ... & \mathbf x_m \\ | & | & | & | \end{bmatrix} = \mathrm{Cov} (\mathbf D) = \mathbf S  $$

Of course, there is nothing mysterious about this result — it's just the way matrix multiplication works ("rows dot columns"). However, this representation of the data and its covariance matrix will make it much easier to demonstrate the following point:

\*\*\* *The eigenvectors of a covariance matrix represent the basis in which the data is uncorrelated.* \*\*\*


Let's start by asking the following question: if there is a linear transformation (specifically, a rotation $$ \mathbf {R} $$) that transforms our data matrix $$ \mathbf {D} $$ in a way that the resulting matrix $$ \mathbf {RD} $$ has no correlation between it's rows, how can we find this tranformation $$ \mathbf {R} $$? Let's recollect that in a covariance matrix, all non-zero non-diagonal components indicate correlation. Therefore, if there is no correlation after we apply the transformation to our data, the new covariance matrix  $$ \mathbf S' $$ has to be diagonal:

$$ \mathbf S' = {1 \over n-1}(\mathbf {RD})(\mathbf {RD})^T = \begin{bmatrix} l_1 & 0 & 0 & 0 \\ 0 & l_2 & 0 & 0 \\ 0 & 0 & ... & 0 \\ 0 & 0 & 0 & l_m \end{bmatrix} $$

One property of rotation matrices is that their transpose is the same as the inverse matrix. Hence

$$ \mathbf S' = {1 \over n-1} \mathbf {RD} (\mathbf {RD})^T = {1 \over n-1} \mathbf {RD} \mathbf {D}^T \mathbf {R}^T = {1 \over n-1} \mathbf {RD} \mathbf D^T \mathbf R^{-1} $$

Note that $$ {1 \over n-1} \mathbf {DD^T} $$ is the covariance matrix $$ \mathbf S $$ of the original data $$ \mathbf D $$

Since $$ \mathbf S $$ is a symmetric matrix, it can be eigen-decomposed as  $$ \mathbf E \mathbf \Lambda \mathbf E^{-1} $$, where  $$ \mathbf E $$ is the matrix whose columns are eigenvectors of  $$ \mathbf S $$, and  $$ \mathbf \Lambda $$ is the diagonal matrix whose entries are eigenvalues of  $$ \mathbf S $$.

Let's substitute $$ {1 \over n-1} \mathbf {DD^T} $$ for $$ \mathbf E \mathbf \Lambda \mathbf E^{-1} $$,

$$ \mathbf S' =  \mathbf {R} \mathbf E \mathbf \Lambda \mathbf E^{-1} \mathbf R^{-1} = \mathbf {R} \mathbf E \mathbf \Lambda (\mathbf {RE})^{-1} $$

Since both $$ \mathbf S' $$ and $$ \mathbf \Lambda $$ are diagonal, we must conclude that $$ \mathbf R $$ and $$ \mathbf E $$ are inverses of each other. Therefore representing the data matrix in the basis of $$ \mathbf E $$ is equivalent to applying a transformation (rotation) that removes correlation between variables.

Removing correlation is the goal of principal component analysis (PCA), therefore covariance matrix eigenvectors can be called principal components. The following interactive demonstration (powered by [vtvt](https://github.com/ex-punctis/vtvt)) shows how principal components are affected by the distribution of data points. Try arranging the points into a parabola shape and note what happens — this is because covariance/correlation are measures of collinearity, and non-linear relationships between random variables are cannot be captured by them properly.

<div class="canvas-wrapper">
    <canvas id='vector_canvas_7' class="canvas-wrapped"></canvas>
</div> 

<script>
{% include vtvt.js %}
</script>

<script>
    // *************************************************************************************************	     
    // initialize the scene
    var scene_7 = new vtvt({canvas_id: "vector_canvas_7", grid_res: 16, circle_rad: 0.5, show_matrix: true, show_eig: true});

    // add two invisible vectors whose coordinates will represent the covariance matrix (the mapping function will be added later)
    scene_7.addVector({coords: [0,0], c: "0,0,0", draggable: false, visible: false});   
    scene_7.addVector({coords: [0,0], c: "0,0,0", draggable: false, visible: false});   

    var numPoints = 18
    // add points
    for (let k = 0; k < numPoints; k++) {            
        // setup colours
        let cos = Math.cos(Math.random() * 2 * Math.PI);
        let sin = Math.sin(Math.random() * 2 * Math.PI);
        let r = 150 + 100*cos; //(phase shift 0º)
        let g = 150 + 100*(-0.5*cos - 0.866*sin); //(phase shift 120º)
        let b = 150 + 100*(-0.5*cos + 0.866*sin); //(phase shift 240º)
        // random coords with some correlation
        let x = Math.random()*14 - 7; 
        let y = 0.5*x + Math.random()*6 - 3;
        // add point
        scene_7.addVector({
            coords: [x,y],
            c: `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`, 
            draggable: true, 
            kind: 'point'}); 
    }
    // define mapping of vector 0 (invisible) to construct a covariance matrix 
    scene_7.vectors[0].map_coords = function() {  
        let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
        for (let k = 2; k < numPoints+2; k++) {  
            sumX    += scene_7.vectors[k].coord_x;
            sumY    += scene_7.vectors[k].coord_y;
            sumX2   += scene_7.vectors[k].coord_x * scene_7.vectors[k].coord_x;
            sumXY   += scene_7.vectors[k].coord_x * scene_7.vectors[k].coord_y;
        }
        return {mapX: (sumX2-sumX*sumX/numPoints)/numPoints, mapY: (sumXY-sumX*sumY/numPoints)/numPoints};    
    }
    // define mapping of vector 1 (invisible) to construct a covariance matrix 
    scene_7.vectors[1].map_coords = function() {  
        let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumXY = 0;
        for (let k = 2; k < numPoints+2; k++) {        
            sumX    += scene_7.vectors[k].coord_x;
            sumY    += scene_7.vectors[k].coord_y;
            sumY2   += scene_7.vectors[k].coord_y * scene_7.vectors[k].coord_y;
            sumXY   += scene_7.vectors[k].coord_x * scene_7.vectors[k].coord_y;
        }
        return {mapX: (sumXY-sumX*sumY/numPoints)/numPoints, mapY: (sumY2-sumY*sumY/numPoints)/numPoints};    
    }

    // render
    scene_7.render();
    scene_7.render(); // have to render again to update the matrix. not sure why...

</script>

### P.S.

PCA is not a type of regression. It doesn't model anything. It merely presents your data in a different basis which can help you identify and discard the least important principal components. If you perform OLS regression and plot the line, you'll find that it won't be parallel to any of the eigenvectors, and that's just how it's supposed to be.