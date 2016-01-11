#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

# Install and configure Openlayers2
git clone https://github.com/openlayers/ol2.git
cd ol2
git checkout release-2.12
cd ..
mkdir /var/www/OpenLayers-2.12
cp -r ol2/* /var/www/OpenLayers-2.12/
cp ol2/examples/proxy.cgi /usr/lib/cgi-bin/
ln -s /usr/lib/cgi-bin/proxy.cgi /usr/lib/cgi-bin/proxy.fcgi

sed -i "s/'www.openlayers.org'/'db01', 'www.openlayers.org'/" /usr/lib/cgi-bin/proxy.cgi

cp /vagrant/tinyows.html /var/www/OpenLayers-2.12/examples/tinyows.html
cp /vagrant/tinyows.js /var/www/OpenLayers-2.12/examples/tinyows.js

echo '127.0.0.1 localhost web01' > /etc/hosts
echo '172.16.5.54 db01' >> /etc/hosts
sed -i "s/\/var\/www\/html/\/var\/www/" /etc/apache2/sites-available/000-default.conf
echo "ServerName localhost" > /etc/apache2/conf-available/local-servername.conf
a2enconf local-servername
a2enmod cgi
service apache2 restart

#wget "http://localhost/cgi-bin/proxy.cgi" --post-data=/etc/tinyows.xml --header="Content-Type: application/xml; charset=UTF-8" -O /tmp/ttt.txt 

