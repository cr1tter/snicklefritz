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
1. [Run the Jekyll development server](https://jekyllrb.com/docs/usage/):
    ```sh
    bundle exec jekyll server
    ```
