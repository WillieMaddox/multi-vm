#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

# setup installs
apt-get update
apt-get upgrade -qy
apt-get install -qy build-essential unzip vim git cmake checkinstall python-dev python-setuptools 
apt-get install -qy apache2 apache2-utils apache2-dev apache2-dbg libblas-dev liblapack-dev gfortran libffi-dev libssl-dev

#pip installs
apt-get install -qy python-pip
pip install pip --upgrade
pip install urllib3[secure]
pip install numpy -q --upgrade

