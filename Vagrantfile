# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  if Vagrant.has_plugin?("vagrant-timezone")
    config.timezone.value = "US/Central"
  end
  
  #config.ssh.forward_agent = true

  config.vm.define "web" do |web|
  # if using gui box, may need to 'vagrant halt web' followed by 'vagrant up' to set the ip.
#    web.vm.box = "rudolfochrist/ubuntu-desktop"
  # Using vivid because pgrouting extension is available with apt-get.
    web.vm.box = "ubuntu/vivid64"
#    web.vm.box = "puppetlabs/ubuntu-14.04-64-nocm"
    web.vm.hostname = "web01"
    web.vm.network "private_network", ip:"172.16.5.80"
#    web.vm.network "forwarded_port", guest: 80, host: 8080
    web.vm.provider "virtualbox" do |vbox|
#      vbox.gui = true
      vbox.memory = 4096
      vbox.cpus = 4
    end
#    web.vm.provision "shell", inline: "echo '127.0.0.1 localhost web01\n172.16.5.54 db01' > /etc/hosts"
    web.vm.provision "shell", path: "scripts/vagrant/web01.sh"

  end
  
  config.vm.define "database" do |db|
    db.vm.box = "ubuntu/vivid64"
#    db.vm.box = "puppetlabs/ubuntu-14.04-64-nocm"
    db.vm.hostname = "db01"
    db.vm.network "private_network", ip: "172.16.5.54"
    db.vm.provision "shell", path: "scripts/vagrant/db01.sh"
    #db.vm.synced_folder "/media/maddoxw/Borg_LS/terrain/TCA_LiDAR", "/texas_data"

  end
  
  config.vm.provision "shell", path: "scripts/vagrant/global.sh"

end
