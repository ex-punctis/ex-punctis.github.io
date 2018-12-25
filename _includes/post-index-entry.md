<span class="post-meta" style="color:#888888; font-size:0.7rem; padding-top:1rem; padding-bottom:0.5rem; line-height:0.75;">
	{{ post.date | date: "%b %d, %Y" }}: </span><br>
<span class="post-index"><a href="{{ post.url }}"><b>{{ post.title }}</b></a></span><br>
<span class="post-index" style="font-weight: lighter; color:#333333;">{{ post.excerpt }}</span><br>
<span class="post-meta" style="color:#888888; font-size:0.7rem; padding-top:1rem; padding-bottom:0.5rem; line-height:0.75;">
	tags: 	<i> | {% for tag in post.tags %}
					<a 	href="{{ site.url }}/tags/{{ tag | replace: " ", "-"  }}.html">{{ tag }}</a> | {% endfor %}
			 </i></span><br><br>
	