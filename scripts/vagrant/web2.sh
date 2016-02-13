#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

# Install and configure Openlayers2
#OLVERSION="3.5.0"
#git clone https://github.com/openlayers/ol3.git
#cd ol3
#git checkout v$OLVERSION
#cd ..
#mkdir /var/www/OpenLayers-$OLVERSION
#cp -r ol3/* /var/www/OpenLayers-$OLVERSION/
#cp ol3/examples/proxy.cgi /usr/lib/cgi-bin/
#ln -s /usr/lib/cgi-bin/proxy.cgi /usr/lib/cgi-bin/proxy.fcgi

#sed -i "s/'www.openlayers.org'/'db01', 'www.openlayers.org'/" /usr/lib/cgi-bin/proxy.cgi

#cp /vagrant/tinyows-ol3.html /var/www/OpenLayers-2.12/examples/tinyows-ol3.html
#cp /vagrant/tinyows-ol3.js /var/www/OpenLayers-2.12/examples/tinyows-ol3.js

echo '127.0.0.1 localhost aspe.local.web2' > /etc/hosts
echo '172.16.5.54 aspe.local.db0' >> /etc/hosts
echo '172.16.5.80 aspe.local.web0' >> /etc/hosts
sed -i "s/\/var\/www\/html/\/vagrant\/web2/" /etc/apache2/sites-available/000-default.conf
sed -i "/^#<Directory/,/^#<\/Directory/ {s/srv/vagrant\/web2/}" /etc/apache2/apache2.conf
sed -i "/^#<Directory/,/^#<\/Directory/ {s/^#//}" /etc/apache2/apache2.conf
echo "ServerName aspe.local.web2" > /etc/apache2/conf-available/local-servername.conf
a2enconf local-servername
#a2enmod cgi
service apache2 restart

#wget "http://localhost/cgi-bin/proxy.cgi" --post-data=/etc/tinyows.xml --header="Content-Type: application/xml; charset=UTF-8" -O /tmp/ttt.txt 

