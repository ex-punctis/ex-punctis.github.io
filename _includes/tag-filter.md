{% assign backgnd_col = '#e0f0ff' %}

{% assign uniqueTags = '' | split: '' %}
{% for post in site.posts %}
	{% for tag in post.tags %}
		{% unless uniqueTags contains tag %}
			{% assign uniqueTags = uniqueTags | push: tag %}
		{% endunless %}	
	{% endfor %}
{% endfor %}
{% assign uniqueTags = uniqueTags | sort %}

<div class="post-list" style="margin-top: 1rem;">
	<span class="post-meta" style="color:#888888; font-size:0.7rem; padding-top:1rem; padding-bottom:0.5rem; line-height:0.75;">
	tag filter: 	| {% if page.tags == "all" %}
							<b><a 	href="{{ site.url }}" style="background-color:{{ backgnd_col }}">all</a></b> |
						{% else %} 
							<a 	href="{{ site.url }}">all</a>&nbsp;|
						{% endif %}
		{% for tag in uniqueTags %}
			{% if tag == page.tags %}
				<b><a 	href="{{ site.url }}/tags/{{ tag | replace: " ", "-" }}.html" 
					style="background-color:{{ backgnd_col }}">{{ tag }}</a></b> | 
			{% else %}
				<a 	href="{{ site.url }}/tags/{{ tag | replace: " ", "-" }}.html">{{ tag }}</a> | 
			{% endif %}
		{% endfor %} </span><br>
</div>