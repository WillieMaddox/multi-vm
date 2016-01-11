# multi-vm

A vagrant development environment for Openlayers and a WFS-T service.
The WFS-T service is handled by Tinyows which is connected to a PostgreSQL/PostGIS database.
Vagrant spins up a web vm for Openlayers and a separate database vm for the tinyows WFS-T service.

## Requirements

[vagrant](https://www.vagrantup.com/downloads.html)

## Installation

Clone this repo. Then from the terminal:
```
$ cd multi-vm
$ vagrant up
```

## Running

After vm's are up, go to your favorite browser and type:

http://172.16.5.80/OpenLayers-2.12/examples/tinyows.html

You should see a map with a default set of features that you can play with.

#### Optional
If you are running vagrant from a Linux box, you can add the following line to your /etc/hosts

172.16.5.80   ol.local.net

http://ol.local.net/OpenLayers-2.12/examples/tinyows.html

## Testing

1. Add a feature.
2. Save
3. Refresh the page.

If the feature you added is still there, then the test was a success. :)

Repeat the above steps for Modify and Delete.

## TODO

- Upgrade from Openlayers2 to Openlayers3
- Figure out how to make Openlayers talk to Tinyows without going through a proxy.
- Add a third vm to act as a processing engine for complex spatial algorithms
