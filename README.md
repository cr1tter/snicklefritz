# DGWAnarchoEvents

You can [see me live here](https://anarchism.nyc).

# Developing locally

The easiest way to develop this project is to use [the provided Vagrant environment](Vagrantfile). You'll need to install [Vagrant](https://vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/). Then clone the repository and invoke `vagrant up` in the project's root directory:

```shell
git clone https://github.com/AnarchoTechDFW/DGWAnarchoEvents.git
cd DFWAnarchoEvents
vagrant up
```

The Vagrant configuration automates the following steps:

1. Use [Bundler](https://bundler.io/) to install [Jekyll](https://jekyllrb.com/):
    ```sh
    bundle config set path vendor/bundle
    bundle install
    ```

2. For [event sources](https://fullcalendar.io/docs/event-source) that do not correctly set their [`Access-Control-Allow-Origin` CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), you will also need [a CORS proxy](https://corsproxy.github.io/), and you need to set [the `corsbase` variable in `_config.yaml`](https://github.com/AnarchoTechDFW/DFWAnarchoEvents/blob/main/_config.yaml) to that URL.

3. Optionally, set your own event sources in [the `static/js/event-source-data` folder](static/js/event-source-data/README.md).

4. [Run the Jekyll development server](https://jekyllrb.com/docs/usage/):
    ```sh
    bundle exec jekyll server
    ```
