#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

apt-get install -qqy python-dev python-setuptools libfreetype6-dev libxml2-dev libxslt1-dev libtiff-dev libtiff5-dev libpng12-dev libpng-dev libjpeg8-dev libblas-dev liblapack-dev gfortran libffi-dev libssl-dev

#pip installs
apt-get install -qqy python-pip
pip install pip --upgrade
pip install urllib3[secure]
pip install numpy -q --upgrade


python-psycopg2 

#workon pygeoan_cb
pip install pyproj -q
#pip install shapely
#pip install matplotlib
#pip install descartes
#pip install pyshp
pip install geojson
#pip install pandas
#pip install scipy
#pip install networkx
#pip install pysal
pip install ipython
#pip install django==1.8
pip install owslib
#pip install folium
#pip install jinja2
#pip install djangorestframework==3.1.3


