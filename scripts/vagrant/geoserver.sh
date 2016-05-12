#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

#db
apt-get install default-jdk default-jre maven git

#apt-get install -qqy flex autoconf libfcgi-dev libapache2-mod-fastcgi 
#libapache2-mod-auth-pgsql 
# use one or the other but not both.
#apt-get install -qqy libapache2-mod-python
#apt-get install -qqy libapache2-mod-wsgi

#db
# apt-get install -qqy libfreetype6-dev libxml2-dev libxslt1-dev libtiff-dev libtiff5-dev libpng12-dev libpng-dev libjpeg8-dev
#install postgresql postgis and gdal
# apt-get install -qqy libgdal-dev gdal-bin python-gdal postgresql-9.4 postgresql-contrib postgresql-9.4-pgrouting postgresql-9.4-postgis-2.1 postgis binutils libproj-dev libpq-dev

git clone https://github.com/geoserver/geoserver.git
cd geoserver
mvn clean install
 

PG_VERSION=9.4
PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
PG_DIR="/var/lib/postgresql/$PG_VERSION/main"

# Edit postgresql.conf to change listen address to '*':
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
sed -i  's/md5/trust/' "$PG_HBA"
sed -i  's/peer/trust/' "$PG_HBA"

service postgresql restart

cd /vagrant
if [[ ! -d third_party ]]; then
  mkdir third_party
fi
cd third_party
if [[ ! -d tinyows ]]; then
  git clone https://github.com/WillieMaddox/tinyows.git
fi
cd tinyows
autoconf
./configure
make
make install
#make install-demo
cp tinyows /usr/lib/cgi-bin/
# ln -s /usr/lib/cgi-bin/tinyows /usr/lib/cgi-bin/tinyows.fcgi
cd
# Now the instructions from http://mapserver.org/tinyows/openlayershowto.html
# Setup the database
createdb -U postgres tinyows
psql -U postgres -d tinyows < `pg_config --sharedir`/contrib/postgis-2.1/postgis.sql
psql -U postgres -d tinyows < `pg_config --sharedir`/contrib/postgis-2.1/spatial_ref_sys.sql
psql -U postgres -d tinyows < `pg_config --sharedir`/contrib/postgis-2.1/topology.sql
psql -U postgres -d tinyows < `pg_config --sharedir`/contrib/postgis-2.1/rtpostgis.sql

# Download some sample data and populate the database with it.
if [[ ! -d /vagrant/default_data ]]; then
  mkdir /vagrant/default_data
fi
cd /vagrant/default_data
if [[ ! -f frida-1.0.1-shp.tar.gz ]]; then
  wget ftp://ftp.intevation.de/freegis/frida/frida-1.0.1-shp.tar.gz
fi
tar xvzf frida-1.0.1-shp.tar.gz
cd frida-1.0.1-shp
shp2pgsql -g geom -s 31467 -W LATIN1 -I gruenflaechen.shp frida | psql -U postgres -d tinyows
service postgresql restart

cp /vagrant/tinyows.xml /etc/tinyows.xml

echo "ServerName aspe.local.db0" > /etc/apache2/conf-available/local-servername.conf
a2enconf local-servername
a2enmod cgi
service apache2 restart

/usr/lib/cgi-bin/tinyows --check

# wget "http://localhost/cgi-bin/tinyows" --post-data=/etc/tinyows.xml --header="Content-Type: application/xml; charset=UTF-8" -O /tmp/ttt.txt 


