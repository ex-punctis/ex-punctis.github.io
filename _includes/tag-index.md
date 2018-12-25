## Blog entries

{% include tag-filter.md %}

<div class="post-list" style="margin-top: 1rem;">
	{% for post in site.posts %}
		{% if post.indexflag != false %}
			{% if post.tags contains page.tags %}
				{% include post-index-entry.md %}
			{% endif %}
		{% endif %}
	{% endfor %}
</div>