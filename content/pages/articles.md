---
layout: content_page
title: Articles
nav: articles
permalink: /articles/
hero_image: /resources/images/common/unfurl_articles.webp
hero_title: Articles
hero_subtitle: Writing and development notes.
lead: Notes and stuff that I like to write during research.
wrap_content: true
show_contact: false
---

{% assign article_pages = site.pages | where_exp: "p", "p.path contains 'content/articles/'" | where_exp: "p", "p.name != '_articleTemplate.md'" | where_exp: "p", "p.name != '_README.md'" | sort: "date" | reverse %}

{% if article_pages.size > 0 %}
<div class="card-container">
  {% for article in article_pages %}
    {% assign article_image = article.thumbnail | default: '/resources/images/common/unfurl_articles.webp' %}
    <a class="card" href="{{ article.url }}">
      <div class="card-image" style="background-image: url({{ article_image }});"></div>
      <div class="card-content">
        {% if article.date %}
          <p class="date">{{ article.date | date: "%Y-%m-%d" }}</p>
          <hr />
        {% endif %}
        <h3>{{ article.title }}</h3>
        <p>{{ article.summary | default: article.excerpt | strip_html | truncate: 150 }}</p>
      </div>
    </a>
  {% endfor %}
</div>
{% else %}
<p>No articles yet. Create one inside <code>/content/articles</code> using the template and refresh.</p>
{% endif %}
