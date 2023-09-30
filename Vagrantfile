# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.network "forwarded_port", host: 4000, guest: 4000
  config.vm.network "forwarded_port", host: 8080, guest: 80
  config.vm.provision "shell", inline: <<~EOF
    # Install some prereqs.
    apt-get update
    apt-get install --yes bundler ca-certificates curl gnupg lsb-release
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install --yes docker-ce docker-ce-cli containerd.io docker-compose-plugin

    usermod -a -G docker vagrant # Add the `vagrant` user to the `docker` group.

    # Get and set up a local development CORS proxy.
    cd /vagrant
    git clone https://github.com/AnarchoTechNYC/cors-anywhere.git

    # For now, the quick 'n' dirty way is to just remove the requirements.
    cd cors-anywhere
    sed -e '/requireHeader/d' server.js > server-dev.js
    sed -i'' -e '/CMD/ s/server-cloudflare.js/server-dev.js/' Dockerfile

    echo "CORSANYWHERE_WHITELIST=" > .env

    docker compose up --detach

    # Install the site source code.
    gem install bundler:$(tail -n 1 /vagrant/Gemfile.lock | tr -d ' ')
    cd /vagrant && sudo -u vagrant bundle install

    # Point the site to the development CORS proxy.
    sed -i'' -e '/export const corsbase/ s/https:/http:/' -e '/export const corsbase/ s/cors.anarchism.nyc/localhost:8080/' static/js/calendar.js

    bundle exec jekyll server --host 0.0.0.0 --detach
  EOF

  config.trigger.before :destroy do |t|
    t.run_remote = {
      inline: <<~EOF
        rm -rf /vagrant/cors-anywhere
        sed -i'' -e '/export const corsbase/ s/http:/https:/' -e '/export const corsbase/ s/localhost:8080/cors.anarchism.nyc/' /vagrant/static/js/calendar.js
      EOF
    }
  end
end
