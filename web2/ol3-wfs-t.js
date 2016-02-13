controlMousePos = new ol.control.MousePosition({
	coordinateFormat: ol.coordinate.createStringXY(4),
});

/*
popup = document.getElementById('popup');
$('#popup-closer').on('click', function() {
	overlayPopup.setPosition(undefined);
});
overlayPopup = new ol.Overlay({
	element: popup
});
*/

/*
var u="http://aspe.local.db0/cgi-bin/tinyows?service=wfs&version=1.1.0&request=DescribeFeatureType&typename=tows:frida";
var layerVector = new ol.layer.Vector({
    title: 'frida',
    source: new ol.source.Vector({
        url: '/cgi-bin/proxy.cgi?url='+ encodeURIComponent(u),

        format: new ol.format.WFS({

        })
    })  
});
*/

// Executed when data is loaded by the $.ajax method.
var loadFeaturesBbox = function(response) {
    sourceVector.addFeatures(sourceVector.readFeatures(response));
};

// Source using a bbox strategy
var sourceVector = new ol.source.Vector({
    loader: function(extent, resolution, projection) {
        var url = 'http://aspe.local.db0/cgi-bin/tinyows?' +
            'service=WFS&' +
            'request=GetFeature&' +
            'version=1.1.0&' +
            'typename=tows:frida&' +
            'outputFormat=text/javascript&' +
            'srsname=EPSG:3857&' +
            'bbox=' + extent.join(',');

        $.ajax({
            url: url,
            dataType: 'jsonp'
        }).then(function(response) {
            var format = new ol.format.GeoJSON();
			/*var format = new ol.format.WFS(),*/
//			var features = ;
			sourceVector.addFeatures(format.readFeatures(response,
			    {featureProjection: projection}));
        });
    },
    strategy: ol.loadingstrategy.bbox,
//    projection: 'EPSG:3857'
});

/*
//proxyHost = "/cgi-bin/proxy.cgi?url=";
sourceVector = new ol.source.Vector({
	loader: function(extent) {
		$.ajax(proxyHost+'http://aspe.local.db0/cgi-bin/tinyows', {
			type: 'GET',
			data: {
                service: 'WFS',
				//version: '1.1.0',
				//request: 'GetFeature',
				//featureNS:  "http://www.tinyows.org/",
                typename: 'tows:frida',
				//srsname: 'EPSG:3857',
				//bbox: extent.join(',') + ',EPSG:3857',
                version: "1.1.0",
                srsName: "EPSG:31467",
                //url: "http://aspe.local.db0/cgi-bin/tinyows",
                featureNS :  "http://www.tinyows.org/",
                //featureType: "frida",
                //geometryName: "geom",
                //schema: "http://aspe.local.db0/cgi-bin/tinyows?service=wfs&request=DescribeFeatureType&version=1.1.0&typename=tows:frida"
			},
		}).done(function(response) {
			formatWFS = new ol.format.WFS(),
			sourceVector.addFeatures(formatWFS.readFeatures(response))
		});
	},
	strategy: ol.loadingstrategy.tile(new ol.tilegrid.XYZ({
		maxZoom: 19
	})),
});
*/
var layerVector = new ol.layer.Vector({
	source: sourceVector
});

//hover highlight
selectPointerMove = new ol.interaction.Select({
	condition: ol.events.condition.pointerMove
});

layerOSM = new ol.layer.Tile({
	source: new ol.source.OSM()
});

var map = new ol.Map({
	target: 'map',
	//overlays: [overlayPopup],
	controls: [controlMousePos],
	layers: [layerOSM, layerVector],
	view: new ol.View({
		center: [-9692835, 2347907],
		zoom: 17
	})
});
map.addInteraction(selectPointerMove);

var interaction;
var select = new ol.interaction.Select({
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: '#FF2828'
		})
	})
});

//wfs-t
var dirty = {};
var formatWFS = new ol.format.WFS();
var formatGML = new ol.format.GML({
	//featureNS: 'http://argeomatica.com',
    featureNS:  "http://www.tinyows.org/",
	featureType: 'playa_sample',
	srsName: 'EPSG:3857'
});
var transactWFS = function(p, f) {
	switch(p) {
	case 'insert':
		node = formatWFS.writeTransaction([f], null, null, formatGML);
		break;
	case 'update':
		node = formatWFS.writeTransaction(null, [f], null, formatGML);
		break;
	case 'delete':
		node = formatWFS.writeTransaction(null, null, [f], formatGML);
		break;
	}
	s = new XMLSerializer();
	str = s.serializeToString(node);
	$.ajax('http://aspe.local.db0/cgi-bin/tinyows',{
		type: 'POST',
		dataType: 'xml',
		processData: false,
		contentType: 'text/xml',
		data: str
	}).done();
}

$('.btn-floating').hover(
	function() {$(this).addClass('darken-2');},
	function() {$(this).removeClass('darken-2');}
);

$('.btnMenu').on('click', function(event) {
	$('.btnMenu').removeClass('orange');
	$(this).addClass('orange');
	map.removeInteraction(interaction);
	select.getFeatures().clear();
	map.removeInteraction(select);
	switch($(this).attr('id')) {
	
	case 'btnSelect':
		interaction = new ol.interaction.Select({
			style: new ol.style.Style({
				stroke: new ol.style.Stroke({color: '#f50057', width: 2})
			})
		});
		map.addInteraction(interaction);
		/*interaction.getFeatures().on('add', function(e) {
			props = e.element.getProperties();
			if (props.status){$('#popup-status').html(props.status);}else{$('#popup-status').html('n/a');}
			if (props.tiendas){$('#popup-tiendas').html(props.tiendas);}else{$('#popup-tiendas').html('n/a');}
			coord = $('.ol-mouse-position').html().split(',');
			overlayPopup.setPosition(coord);
		});*/
		break;
		
	case 'btnEdit':
		map.addInteraction(select);
		interaction = new ol.interaction.Modify({
			features: select.getFeatures()
		});
		map.addInteraction(interaction);
		
		snap = new ol.interaction.Snap({
			source: layerVector.getSource()
		});
		map.addInteraction(snap);
		
		dirty = {};
		select.getFeatures().on('add', function(e) {
			e.element.on('change', function(e) {
				dirty[e.target.getId()] = true;
			});
		});
		select.getFeatures().on('remove', function(e) {
			f = e.element;
			if (dirty[f.getId()]){
				delete dirty[f.getId()];
				featureProperties = f.getProperties();
			    delete featureProperties.boundedBy;
			    var clone = new ol.Feature(featureProperties);
			    clone.setId(f.getId());
			    transactWFS('update', clone);
			}
		});
		break;
		
	case 'btnDrawPoint':
		interaction = new ol.interaction.Draw({
		    type: 'Point',
		    source: layerVector.getSource()
		});
		map.addInteraction(interaction);
		interaction.on('drawend', function(e) {
			transactWFS('insert', e.feature);
	    });
		break;
		
	case 'btnDrawLine':
		interaction = new ol.interaction.Draw({
		    type: 'LineString',
		    source: layerVector.getSource()
		});
		map.addInteraction(interaction);
		interaction.on('drawend', function(e) {
			transactWFS('insert', e.feature);
	    });
		break;
		
	case 'btnDrawPoly':
		interaction = new ol.interaction.Draw({
		    type: 'Polygon',
		    source: layerVector.getSource()
		});
		map.addInteraction(interaction);
		interaction.on('drawend', function(e) {
			transactWFS('insert', e.feature);
	    });
		break;
		
	case 'btnDelete':
		interaction = new ol.interaction.Select();
		map.addInteraction(interaction);
		interaction.getFeatures().on('change:length', function(e) {
			transactWFS('delete', e.target.item(0));
	        interaction.getFeatures().clear();
	        selectPointerMove.getFeatures().clear();
	    });
		break;

	default:
		break;
	}
});

$('#btnZoomIn').on('click', function() {
	var view = map.getView();
	var newResolution = view.constrainResolution(view.getResolution(), 1);
	view.setResolution(newResolution);
});

$('#btnZoomOut').on('click', function() {
	var view = map.getView();
	var newResolution = view.constrainResolution(view.getResolution(), -1);
	view.setResolution(newResolution);
});
