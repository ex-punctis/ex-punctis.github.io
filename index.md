---
layout: default
---

<div class="post-list" style="margin-top: 1rem;">
  {% for post in site.posts %}
  {% if post.indexflag != false %}
       <span class="post-meta" style="color:#888888; font-size:0.7rem; padding-top:1rem; 
                                   padding-bottom:0.5rem; line-height:0.75;">
                                   {{ post.date | date: "%b %d, %Y" }}: </span><br>
       <span class="post-index"><a href="{{ post.url }}"><b>{{ post.title }}</b></a></span><br>
       <span class="post-index" style="font-weight: lighter; color:#333333;">{{ post.excerpt }}</span><br>
       <br>
  {% endif %}
  {% endfor %}
</div>

