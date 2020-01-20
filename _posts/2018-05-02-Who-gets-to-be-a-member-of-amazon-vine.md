---
layout: post
title:  Who gets to be a member of Amazon Vine?
excerpt: Amazon Vine is a program that matches companies/sellers with select reviewers among Amazon customers. Membership is given by invitation only. According to Amazon, reviewers are selected based on the helpfulness of their reviews, but the exact criteria are not revealed to the public. I decided to investigate what it takes to get an invitation to Amazon Vine by analyzing the publicly available data for the top 10,000 reviewers...
image: /images/2018-05-02/number-reviews.svg
tags: [exploratory analysis]
---

## Who gets to be a member of Amazon Vine?

Amazon Vine is a program that matches companies/sellers with select reviewers among Amazon customers. Membership is given by invitation only. According to Amazon, reviewers are selected based on the helpfulness of their reviews, but the exact criteria are not revealed to the public. I decided to investigate what it takes to get an invitation to Amazon Vine by analyzing the publicly available data for the top 10,000 reviewers, of which about 16% are Vine Voice members. With the help of the "Requests" and "BeautifulSoup" libraries in Python, I was able to collect the data, which I then imported into R and plotted with the help of ggplot2.

So, what is the likelihood of getting an invitation to the program? The first histogram shows that being a high-rank reviewer helps but only to a degree. Even if you're not in the top 5000, you still stand a chance. I'm not sure what to make of the spikes (especially among the top 1,000 reviewers). With the numbers involved, random selection should not produce so much deviation.

{% include one-small-image.html center-img = '/images/2018-05-02/ranks-vine.svg'  %}

Now, let's take a look at the individual criteria that determine a reviewer's rank.

{% include one-small-image.html center-img = '/images/2018-05-02/number-reviews.svg'  %}

The number of reviews is one of the parameters that affects a reviewer's rank. We can see there are almost no Amazon Vine members with fewer than 200 reviews. Of course we must be cautious not to put the horse before the cart here — it is possible that Vine Voices have a greater number of reviews merely because it is their duty to review the merchandise that is sent to them for free.

{% include one-small-image.html center-img = '/images/2018-05-02/number-helpful-votes.svg'  %}

Amazon customers are able to rate other customers' reviews as helpful or not helpful. The number of helpful votes is one publicly available user statistic. This plot shows Amazon Vine members receive more helpful votes than regular reviewers. It is possible they have more helpful votes simply because they write more reviews.

{% include one-small-image.html center-img = '/images/2018-05-02/percentage-helpful-votes.svg'  %}

The plot above speaks about the quality of the Vine Voices' work. It appears that Amazon Vine members are voted noticeably less helpful. Of course some of it may be due to bias against Vine members (their reviews are labeled "Vine Voice" even for those items that were purchased and not received for free).