# NYCAnarchistEvents

You can [see me live here](https://anarchism.nyc).

# Developing locally

To get your own copy of NYCAnarchistEvents running locally, do this:

1. Clone the repository, either after [making your own fork](https://github.com/MACCNYC/NYCAnarchistEvents/fork) or directly from ours:
    ```sh
    git clone https://github.com/AnarchoTechNYC/NYCAnarchistEvents.git
    cd NYCAnarchistEvents
    ```
1. Use [Bundler](https://bundler.io/) to install [Jekyll](https://jekyllrb.com/):
    ```sh
    bundle config set path vendor/bundle
    bundle install
    ```
1. For [event sources](https://fullcalendar.io/docs/event-source) that do not correctly set their [`Access-Control-Allow-Origin` CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), you will also need [a CORS proxy](https://corsproxy.github.io/), and you need to set [the `corsbase` variable in `static/js/calendar.js`](https://github.com/AnarchoTechNYC/NYCAnarchistEvents/blob/0c530479f4b47fa5faa80aca2e01c8c3bc057cc0/static/js/calendar.js#L8) to that URL.
1. [Run the Jekyll development server](https://jekyllrb.com/docs/usage/):
    ```sh
    bundle exec jekyll server
    ```
1. Set your own event sources in [the `static/js/event-source-data.js` file](static/js/event-source-data.js).
