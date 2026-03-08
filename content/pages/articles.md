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
<div class="articles-archive">
  {% assign current_year = "" %}
  {% for article in article_pages %}
    {% assign article_year = article.date | date: "%Y" %}
    {% assign article_image = article.thumbnail | default: '/resources/images/common/unfurl_articles.webp' %}
    {% assign article_summary = article.summary | default: article["short-description"] | default: article.description %}
    {% assign article_excerpt = article.excerpt | strip_html | strip %}

    {% if article_year != current_year %}
      <h2 class="articles-year">{{ article_year }}</h2>
      {% assign current_year = article_year %}
    {% endif %}

    <a class="articles-row" href="{{ article.url }}">
      <img class="articles-thumb" src="{{ article_image | relative_url }}" alt="{{ article.title | escape }}" loading="lazy" />

      <div class="articles-body">
        <h3 class="articles-title">{{ article.title }}</h3>
        {% if article_summary %}
          <p class="articles-summary">{{ article_summary }}</p>
        {% endif %}
        {% if article_excerpt != "" %}
          <p class="articles-excerpt">{{ article_excerpt | truncate: 190 }}</p>
        {% endif %}
      </div>

      {% if article.date %}
        <span class="articles-date">{{ article.date | date: "%b %-d" }}</span>
      {% endif %}
    </a>
  {% endfor %}
</div>
{% else %}
<p>No articles yet. Create one inside <code>/content/articles</code> using the template and refresh.</p>
{% endif %}
