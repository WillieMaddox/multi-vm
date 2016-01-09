#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive



# Install and configure Openlayers2
git clone https://github.com/openlayers/ol2.git
cd ol2
git checkout release-2.12
cd ..
mkdir /var/www/OpenLayers-2.12
cp -r ol2/* /var/www/OpenLayers-2.12/
#cp ol2/examples/proxy.cgi /usr/lib/cgi-bin/
#ln -s /usr/lib/cgi-bin/proxy.cgi /usr/lib/cgi-bin/proxy.fcgi

#wget http://openlayers.org/download/OpenLayers-2.12.tar.gz
#tar xvzf OpenLayers-2.12.tar.gz
#mv OpenLayers-2.12 /YOUR/SERVER/HTDOCS/

#sed -i "s/'www.openlayers.org'/'localhost', '0.0.0.0', '127.0.0.1', 'www.openlayers.org'/" /usr/lib/cgi-bin/proxy.cgi

cp /vagrant/tinyows.html /var/www/OpenLayers-2.12/examples/tinyows.html
cp /vagrant/tinyows.js /var/www/OpenLayers-2.12/examples/tinyows.js

#wget "http://localhost/cgi-bin/proxy.cgi" --post-data=/etc/tinyows.xml --header="Content-Type: application/xml; charset=UTF-8" -O /tmp/ttt.txt 

