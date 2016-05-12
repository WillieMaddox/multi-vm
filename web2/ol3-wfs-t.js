controlMousePos = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
});

popup = document.getElementById('popup');
$('#popup-closer').on('click', function() {
    overlayPopup.setPosition(undefined);
});
overlayPopup = new ol.Overlay({
    element: popup
});

//var url = 'SERVICE=WFS&REQUEST=GetFeature&TYPENAME=' + typeName + '&VERSION=1.1.0&SRSNAME=' + proj;
//var urlGET = 'http://aspe.local.db0/cgi-bin/proxy.py?url=' + encodeURIComponent(url);
var urlPOST = 'http://aspe.local.db0/cgi-bin/proxy.py?url=';

var formatWFS = new ol.format.WFS();
sourceVector = new ol.source.Vector({
    loader: function(extent) {
        $.ajax(urlPOST, {
            type: 'GET',
            data: {
                service: 'WFS',
                version: '1.1.0',
                request: 'GetFeature',
                typename: 'frida',
                srsname: 'EPSG:31467',
                bbox: extent.join(',') + ',EPSG:31467'
            },
        }).done(function(response) {
            sourceVector.addFeatures(formatWFS.readFeatures(response))
        });
    },
    strategy: ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
        maxZoom: 19
    })),
});

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
    overlays: [overlayPopup],
    controls: [controlMousePos],
    layers: [layerOSM, layerVector],
    view: new ol.View({
        center: ol.proj.transform([8.056062, 52.272375], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12
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
var formatGML = new ol.format.GML({
    featureNS: 'http://www.tinyows.org/',
    featureType: 'frida',
    srsName: 'EPSG:31467'
});
var transactWFS = function(p, f) {
<<<<<<< HEAD
    switch (p) {
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

    if (f === undefined) {
    	console.log(p, f)
    } else {
    	console.log(p, f.getId())
    }

    s = new XMLSerializer();
    str = s.serializeToString(node);
    console.log('**', str);
    function responseCallback(response) {
    	var tr = formatWFS.readTransactionResponse(response);
    	ts = tr.transactionSummary;
        fid = tr.insertIds;
        console.log('****', ts, fid);
        
        switch (p) {
    		case 'insert':
    			if (ts.totalInserted === 1 && fid.length === 1 && fid[0] !== 'none') {
        			f.setId(fid[0])
    			}
				break;
    		case 'update':
    			break;
    		case 'delete':
    			if (ts.totalDeleted === 1 && fid.length === 1 && fid[0] === 'none') {
			    	sourceVector.removeFeature(f);		            
    			}
    			break;
    	}
    }
    $.ajax(urlPOST, {
        type: 'POST',
        dataType: 'xml',
        processData: false,
        contentType: 'text/xml',
        complete: function(xhr, status) {
        	if (status === 'success') {
        		responseCallback(xhr.responseXML)
        	} else {
        		console.log('STATUS ERROR', status)
        	}
        },
	    error: function(e) {
	    	var errorMsg = e? (e.status + ' ' + e.statusText) : "";
	    },
    
        data: str
    }).done();
}

$('.btn-floating').hover(
    function() { $(this).addClass('darken-2'); },
    function() { $(this).removeClass('darken-2'); }
);

$('.btnMenu').on('click', function(event) {
    $('.btnMenu').removeClass('orange');
    $(this).addClass('orange');
    map.removeInteraction(interaction);
    select.getFeatures().clear();
    map.removeInteraction(select);
    switch ($(this).attr('id')) {

        case 'btnSelect':
            interaction = new ol.interaction.Select({
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({ color: '#f50057', width: 2 })
                })
            });
            map.addInteraction(interaction);
            interaction.getFeatures().on('add', function(e) {
                props = e.element.getProperties();
                if (props.status) { $('#popup-status').html(props.status); } else { $('#popup-status').html('n/a'); }
                if (props.tiendas) { $('#popup-tiendas').html(props.tiendas); } else { $('#popup-tiendas').html('n/a'); }
                coord = $('.ol-mouse-position').html().split(',');
                overlayPopup.setPosition(coord);
                console.log(e.element.getId())
            });
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
                if (dirty[f.getId()]) {
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
            // interaction.getFeatures().on('change:length', function(e) {
            interaction.on('select', function(e) {
                if (e.selected.length == 1) {
                	transactWFS('delete', e.selected[0]);
			        interaction.getFeatures().clear();
			        selectPointerMove.getFeatures().clear();
            	}                
            });
            break;

        default:
            break;
    }
=======
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
	function() { $(this).addClass('darken-2'); },
	function() { $(this).removeClass('darken-2'); }
);

$('.btnMenu').on('click', function(event) {
	$('.btnMenu').removeClass('orange');
	$(this).addClass('orange');
	map.removeInteraction(interaction);
	select.getFeatures().clear();
	map.removeInteraction(select);
	switch ($(this).attr('id')) {
	
		case 'btnSelect':
			interaction = new ol.interaction.Select({
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({ color: '#f50057', width: 2 })
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
>>>>>>> 334b5f2e3e2e2970ee12d414e15c2b63bc97a507
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
