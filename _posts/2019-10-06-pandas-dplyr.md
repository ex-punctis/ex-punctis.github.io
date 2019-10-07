---
layout: post
title:  "Transitioning from dplyr to pandas the easy way. Part 1: mutate()"
excerpt: dplyr for R is a wonderful package for data manipulation... but sometimes you have no choice but to work with pandas instead. Fortunately we can make pandas more dplyr-like by adding custom methods.
indexflag: true
tag: [exploratory analysis, dplyr, pandas]
---

### Transitioning from dplyr to pandas the easy way. Part 1: mutate()

I am sorry it took me so long to resume writing for my personal blog. Back in April I joined [NTWIST](www.ntwist.com), an Edmonton-based start-up company offering AI solutions for industrial optimization and automation. The job has been amazing, but settling in Edmonton and learning to wear a number of hats left me little time to work on personal projects. I've been writing down ideas and trying small things, but I had nothing blog-worthy until recently.

The first data analysis course I took was taught in R. I really liked the simplicity and versatility of that language for data exploration and statistical calculations, but I really disliked its clunky syntax. Try reading your own script written just few months ago — I can guarantee you will hate every moment of this activity. When I finished the course, I came across [dplyr](https://dplyr.tidyverse.org/index.html), and it was everything I could wish for. I thought that was it, a match made in heaven. 

Unfortunately, the euphorea didn't last long. You see, I became interested in machine learning, and Python was the way to go. For a while I tried  switching back and forth between R and Python (the former for data exploration and the latter for general purpose programming and ML). But then I realized I was not advancing my skills in either language. Eventually I decided to replace R+dplyr with Python+pandas. While pandas turned out to be a capable replacement for R, it was nowhere nearly as simple and intuitive as dplyr. For example, if you want to create a new column, you can do something like `df['B'] = df['A']/(df['A']+1)'. Three pares of square brackets for just one column! dplyr allows you to do the same in a much simpler way thanks to its [non-standard evaluation](https://dplyr.tidyverse.org/articles/programming.html) capability. I know some people find non-standard evaluation confusing. I also know it has plenty of drawbacks. But has one very important advantage — it allows you to do things faster.

to be finished