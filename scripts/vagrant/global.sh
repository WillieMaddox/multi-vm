#!/usr/bin/env bash

export DEBIAN_FRONTEND=noninteractive

# setup installs
apt-get update
apt-get upgrade -qqy

# both
apt-get install -qqy build-essential unzip git cmake python-dev python-setuptools 
apt-get install -qqy apache2 apache2-utils apache2-dev apache2-dbg libblas-dev liblapack-dev gfortran libffi-dev libssl-dev

#pip installs
apt-get install -qqy python-pip
pip install pip --upgrade
pip install urllib3[secure]
pip install numpy -q --upgrade

