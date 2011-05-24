# SEO modul

Alfa verzia "seo validatoru a analyzatoru" priamo v administracii refinery.

## TODO

- Dokumentacia
- Dokoncit testy
- Lepsi vypis sprav
- Analyza textu
- Analyza odkazov
- Analyza keywords v texte

## Use

1. run `bundle exec rake refinery:override view=pages/../admin/pages/_form.html`

2. put into `app/admin/pages/_form.htm.erb` code:

	<% content_for :javascripts do %>
	  <%= javascript_include_tag 'refinerycms' %>
	  <%= javascript_include_tag 'seo' %>
	  <%= javascript_include_tag 'seo-init' %>
	<% end %>
	<% content_for :stylesheets, stylesheet_link_tag('seo') %>

3. download these files and put to right place 