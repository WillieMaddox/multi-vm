//This script does not work yet.

var url="http://db01/cgi-bin/tinyows?&" + 
      "service=wfs&version=1.1.0&request=DescribeFeatureType&typename=tows:frida";
var format = new ol.format.WFS({});
var source = new ol.source.Vector({
    url: '/cgi-bin/proxy.cgi?url='+ encodeURIComponent(url),
    format: format
});

layer wfs = new ol.layer.Vector({
    title: 'states',
    source: source
});

draw = new ol.interaction.Draw({
    source: source,
    type: 'Point'
});
