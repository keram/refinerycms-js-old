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

* Run `bundle exec rake refinery:override view=pages/../admin/pages/_form.html`

* Put this code into

`app/admin/pages/_form.htm.erb`

    <% content_for :javascripts do %>
      <%= javascript_include_tag 'refinerycms' %>
      <%= javascript_include_tag 'seo' %>
      <%= javascript_include_tag 'seo-init' %>
    <% end %>
    <% content_for :stylesheets, stylesheet_link_tag('seo') %>

* Download these files and put to right place 