# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  if Vagrant.has_plugin?("vagrant-timezone")
    config.timezone.value = "US/Central"
  end
  
  #config.ssh.forward_agent = true

  config.vm.define "web0" do |web0|
  # if using gui box, may need to 'vagrant halt web' followed by 'vagrant up' to set the ip.
#    web0.vm.box = "rudolfochrist/ubuntu-desktop"
  # Using vivid because pgrouting extension is available with apt-get.
    web0.vm.box = "ubuntu/vivid64"
#    web0.vm.box = "puppetlabs/ubuntu-14.04-64-nocm"
    web0.vm.hostname = "web0"
    web0.vm.network "private_network", ip:"172.16.5.80"
#    web0.vm.network "forwarded_port", guest: 80, host: 8080
    web0.vm.provider "virtualbox" do |vbox|
#      vbox.gui = true
      vbox.memory = 2048
      vbox.cpus = 2
    end
#    web0.vm.provision "shell", inline: "echo '127.0.0.1 localhost web0\n172.16.5.54 db0' > /etc/hosts"
    web0.vm.provision "shell", path: "scripts/vagrant/web0.sh"
  end
  
  config.vm.define "web2" do |web2|
  # if using gui box, may need to 'vagrant halt web' followed by 'vagrant up' to set the ip.
#    web2.vm.box = "rudolfochrist/ubuntu-desktop"
  # Using vivid because pgrouting extension is available with apt-get.
    web2.vm.box = "ubuntu/vivid64"
#    web2.vm.box = "puppetlabs/ubuntu-14.04-64-nocm"
    web2.vm.hostname = "web2"
    web2.vm.network "private_network", ip:"172.16.5.82"
#    web2.vm.network "forwarded_port", guest: 80, host: 8080
    web2.vm.provider "virtualbox" do |vbox|
#      vbox.gui = true
      vbox.memory = 2048
      vbox.cpus = 2
    end
#    web.vm.provision "shell", inline: "echo '127.0.0.1 localhost web2\n172.16.5.54 db0' > /etc/hosts"
    web2.vm.provision "shell", path: "scripts/vagrant/web2.sh"
  end
  
  config.vm.define "db0" do |db0|
    db0.vm.box = "ubuntu/vivid64"
#    db0.vm.box = "puppetlabs/ubuntu-14.04-64-nocm"
    db0.vm.hostname = "db0"
    db0.vm.network "private_network", ip: "172.16.5.54"
    db0.vm.provision "shell", path: "scripts/vagrant/db0.sh"
    #db0.vm.synced_folder "/media/maddoxw/Borg_LS/terrain/TCA_LiDAR", "/texas_data"
  end
  
  config.vm.provision "shell", path: "scripts/vagrant/global.sh"

end
