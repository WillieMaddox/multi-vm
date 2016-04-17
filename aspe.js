function exists(x) {
	return (x !== undefined && x !== null);
}

var FID = (function() {
// Feature Id Generator based on 
// Linear Congruential Generator
// Variant of a Lehman Generator
// m is chosen to be large (as it is the max period)
// and for its relationships to a and c
// Make sure...
// 1: a - 1 is divisible by all prime factors of m.
// 2: a - 1 is divisible by 4 if m is divisible by 4.
// 3: m and c are co-prime (i.e. No prime number divides both m and c).
	var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", // candidate char values
		chlength = chars.length, // number of candidate characters.
		idlength = 4, // number of chars to be put in the Id tag.
		idtag = "", // string to hold the id tag.
		t = 0, // dummy variable used in gen function.
		m = 14776336, // chars.length ** idlength --> 62**4
		a = 476657, // 62**3 + 1
		c = 1013904223, // offset. (prime number much larger than m.)
		z = seed = Math.round(Math.random() * m); // default random seed,
  	return {
		setSeed: function(val) {
			z = seed = exists(val) ? val : Math.round(Math.random() * m);
		},
		getSeed: function() {
			return seed;
		},
		gen: function() {
			idtag = "";
			z = (a * z + c) % m;
			for (i = 0; i < idlength; i++) {
				t = Math.floor(z / Math.pow(chlength, i)) % chlength;
				idtag += chars.charAt(t);
			}
			return idtag;
		}
  	}
})();

/*
var tobjectsStyleFunction2 = (function() {
	var fillopacity = 0.1;
	var strokeopacity = 1;
	var styles = {};
	var image = new ol.style.Circle({
		radius: 5,
		fill: null,
		stroke: new ol.style.Stroke({color: 'orange', width: 2})
	});
	styles['AOR'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['AOR'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['AOR'].concat(fillOpacity['AOR'])
		})
	})];
	styles['Building'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['Building'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['Building'].concat(fillopacity)
		})
	})];
	styles['Herbage'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['Herbage'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['Herbage'].concat(fillopacity)
		})
	})];
	styles['Water'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['Water'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['Water'].concat(fillopacity)
		})
	})];
	styles['Wall'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['Wall'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['Wall'].concat(fillOpacity['Wall'])
		})
	})];
	styles['Road'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['Road'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['Road'].concat(fillOpacity['Road'])
		})
	})];
	styles['Ground'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['Ground'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['Herbage'].concat(fillopacity)
		})
	})];
	styles['default'] = [new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: tobjectColors['default'].concat(strokeopacity),
			width: 3
		}),
		fill: new ol.style.Fill({
			color: tobjectColors['default'].concat(fillopacity),
		}),
		image: image
	})];
	return function(feature, resolution) {
		var style = styles[feature.get('type')];
		return styles[feature.get('type')] || styles['default'];
	};
})();
*/
var tobjectColors = {
	'AOR': [0, 0, 0],
	'Building': [128, 128, 128],
	'Herbage': [0, 200, 0],
	'Water': [0, 0, 200],
	'Wall': [64, 64, 64],
	'Road': [192, 51, 52],
	'Ground': [213, 196, 161],
	'default': [255, 0, 0]
};

var fillOpacity = {
	'AOR': 0,
	'Building': 0.1,
	'Herbage': 0.1,
	'Water': 0.1,
	'Wall': 0,
	'Road': 0,
	'Ground': 0.1,
	'default': 0.1
};

var highlight;
var highlightStyleCache = {};

var tobjectsStyleFunction = (function() {
	var strokeopacity = 1;
	var setStyle = function(type) {
		style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: tobjectColors[type].concat(strokeopacity),
				width: 3
			}),
			fill: new ol.style.Fill({
				color: tobjectColors[type].concat(fillOpacity[type])
			})
		});
		return [style]
	};
	return function(feature, resolution) {
		return setStyle(feature.get('type'));
	};
})();

var overlayStyleFunction = (function() {
	var strokeopacity = 1;
	var setStyle = function(type, text) {
		style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: tobjectColors[type].concat(strokeopacity),
				width: 4
			}),
			fill: new ol.style.Fill({
				color: tobjectColors[type].concat(fillOpacity[type])
			}),
			text: new ol.style.Text({
				font: '14px Calibri,sans-serif',
				text: text,
				fill: new ol.style.Fill({
					color: '#000'
				}),
				stroke: new ol.style.Stroke({
					color: '#fff',
					width: 5
				})
			})
		});
		return [style]
	};
	return function(feature, resolution) {
		var text = resolution < 5000 ? feature.get('name') : '';
		if (!highlightStyleCache[text]) {
			highlightStyleCache[text] = setStyle(feature.get('type'), text);
		}
		return highlightStyleCache[text];
	}
})();


var bingkey = 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3';

var countries = new ol.layer.Tile({
	title: 'Countries',
	source: new ol.source.TileWMS({
		url: 'http://demo.opengeo.org/geoserver/wms',
		params: {'LAYERS': 'ne:ne_10m_admin_1_states_provinces_lines_shp'},
		serverType: 'geoserver'
	})
});
var vector_aor = new ol.layer.Vector({
	title: 'AOR',
	source: new ol.source.Vector(),
	style: tobjectsStyleFunction
});
var vector = new ol.layer.Vector({
	title: 'tobjects',
	source: new ol.source.Vector(),
	style: tobjectsStyleFunction
});

var bounds = [-105.54833333333333, 39.76361111111111, -105.52694444444444, 39.778055555555554];

var imagesource = new ol.source.ImageStatic({
	url: 'data/package_patched2.png',
	imageExtent: ol.proj.transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'),
});

var view = new ol.View({
	center: ol.proj.transform([-86.711, 34.636], 'EPSG:4326', 'EPSG:3857'),
//    center: ol.proj.transform([-105.539, 39.771], 'EPSG:4326', 'EPSG:3857'),
	zoom: 15
});

var map = new ol.Map({
	interactions : ol.interaction.defaults({doubleClickZoom : false}),
	target: document.getElementById('map'),
	view: view,
	layers: [
		new ol.layer.Group({
			title: 'Bing Maps',
			layers: [
				new ol.layer.Tile({
					title: 'Aerial',
					type: 'base',
					visible: false,
					source: new ol.source.BingMaps({
						key: bingkey,
						imagerySet: 'Aerial'
					})
				}),
				new ol.layer.Tile({
					title: 'Aerial With Labels',
					type: 'base',
					visible: false,
					source: new ol.source.BingMaps({
						key: bingkey,
						imagerySet: 'AerialWithLabels'
					})
				}),
				new ol.layer.Tile({
					title: 'Road',
					type: 'base',
					visible: false,
					source: new ol.source.BingMaps({
						key: bingkey,
						imagerySet: 'Road'
					})
				})
			]
		}),
		new ol.layer.Group({
			title: 'OSM Maps',
			layers: [
				new ol.layer.Tile({
					title: 'OSM',
					type: 'base',
					visible: false,
					source: new ol.source.OSM()
				})
			]
		}),
		new ol.layer.Group({
			title: 'MapQuest Maps',
			layers: [
				new ol.layer.Tile({
					title: 'OSM',
					type: 'base',
					visible: false,
					source: new ol.source.MapQuest({layer: 'osm'})
				}),
				new ol.layer.Tile({
					title: 'Hybrid',
					type: 'base',
					visible: false,
					source: new ol.source.MapQuest({layer: 'hyb'})
				}),
				new ol.layer.Tile({
					title: 'Satellite',
					type: 'base',
					visible: true,
					source: new ol.source.MapQuest({layer: 'sat'})
				})
			]
		})
	]
});

var projectGroup = new ol.layer.Group({
	title: 'Project',
	layers: [
		vector_aor,
		vector
	]
});
map.addLayer(projectGroup);


var image = new ol.layer.Image({
	title: 'images',
	map: map,
	source: imagesource,
	extent: ol.proj.transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'),
	opacity: 0.2
});

var featureOverlay = new ol.layer.Vector({
	source: new ol.source.Vector(),
	// map: map,
	style: overlayStyleFunction
});
map.addLayer(featureOverlay);


var getFeatureAtPixel = function(pixel) {
	var coord = map.getCoordinateFromPixel(pixel),
		smallestArea = 5.1e14, // approx. surface area of the earth.
	// smallestFeature;
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		var geom = feature.getGeometry()
		if (geom instanceof ol.geom.Point) {
// Need to add functionality for sensors here.
		} else if (geom instanceof ol.geom.LineString) {
			return feature;
		} else if (geom instanceof ol.geom.MultiLineString) {
			return feature;
		} else if (geom instanceof ol.geom.Polygon || geom instanceof ol.geom.MultiPolygon) {
			if (feature.get('type') === 'AOR') {
				var point = geom.getClosestPoint(coord);
				var pixel0 = map.getPixelFromCoordinate(coord);
				var pixel1 = map.getPixelFromCoordinate(point);
				if (Math.abs(pixel0[0]-pixel1[0]) < 4 && Math.abs(pixel0[1]-pixel1[1]) < 4) {
					return feature;
				}
			} else {
				var area = geom.getArea();
				if (area < smallestArea) {
					smallestArea = area;
					smallestFeature = feature;
				}
			}
		}
	});
	return exists(feature) ? feature : smallestFeature;
};

var setMouseCursor = function(feature) {
	if (feature) {
		map.getTarget().style.cursor = 'pointer';
	} else {
		map.getTarget().style.cursor = '';
	};
};

var displayFeatureInfo = function(feature) {
	if (feature !== highlight) {
		if (highlight) {
			featureOverlay.getSource().removeFeature(highlight);
		}
		if (feature) {
			featureOverlay.getSource().addFeature(feature);
		}
		highlight = feature;
	}
};

var hoverDisplay = function(evt) {
	if (evt.dragging) return;
	var pixel = map.getEventPixel(evt.originalEvent);
	var feature = getFeatureAtPixel(pixel);
	setMouseCursor(feature);
	displayFeatureInfo(feature);
};

/*
var selectedFeature = null;
var getSelectedFeatureAtPixel = function(pixel) {
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		if (feature.getId() == selectedFeature.getId()) {
			return feature;
		} else {
			return undefined;
		}
	})
	return feature;
};

var setSelectMousePointer = function(evt) {
	if (evt.dragging) return;
	var pixel = map.getEventPixel(evt.originalEvent);
	var intersectingFeature = getSelectedFeatureAtPixel(pixel);
	setMouseCursor(intersectingFeature)
};
*/

/*******************************/
/******** INTERACTIONS *********/
/*******************************/

/*********** SELECT ************/
var featureadded = false;
var select = new ol.interaction.Select({
	layers: [featureOverlay],
	toggleCondition: ol.events.condition.never,
	condition: function(evt) {
		if (ol.events.condition.singleClick(evt) || ol.events.condition.doubleClick(evt)) {
			if (featureadded) {
				featureadded = false;
				return false;
			};
			return true;
		};
	},
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(255, 255, 255, 1)',
			width: 4
		}),
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.1)'
		})
	})
});

map.addInteraction(select);
select.setActive(true);
map.on('pointermove', hoverDisplay);

select.on('select', function(evt) {
	var info = document.getElementById('info');
	var feature;
  // Handle deselect first so we can update the feature in the python code.
	if (evt.deselected.length == 1) {
		feature = evt.deselected[0]
		info.innerHTML = '&nbsp;';
		modify.setActive(false);
//    translate.setActive(false);
		console.log('deselect:', feature.get('name'), feature.getRevision());
	};
	if (evt.selected.length == 1) {
		feature = evt.selected[0]
		info.innerHTML = feature.get('type') + ': ' + feature.get('name');
		modify.setActive(true);
//    translate.setActive(true);
		console.log('select:  ', feature.get('name'), feature.getRevision())
	};
});

/*********** MODIFY ************/

var modify = new ol.interaction.Modify({
	features: select.getFeatures(),
	deleteCondition: function(evt) {
		return ol.events.condition.shiftKeyOnly(evt) &&
			ol.events.condition.singleClick(evt);
	}
});
map.addInteraction(modify);
modify.setActive(false);

/********* TRANSLATE ***********/
// When the translate interaction is active, it
// causes the mouse cursor to turn into a 
// pointer when hovering over the interior
// of the AOR. Need to find out why.
// Disable until solution is found.
/*
var translate = new ol.interaction.Translate({
	features: select.getFeatures()
});
map.addInteraction(translate);
translate.setActive(false);
*/
/************ DRAW *************/

var draw;
var drawType = document.getElementById('draw-type');
drawType.onclick = function(e) {
	if (draw) {
		map.removeInteraction(draw)
	};
	map.un('pointermove', hoverDisplay);
	var selectedFeature = select.getFeatures();
	selectedFeature.forEach(selectedFeature.remove, selectedFeature);
//  translate.setActive(false);
	modify.setActive(false);
	select.setActive(false);
	var geom_type = e.target.value;
	var tobj_type = e.target.id;
	var source = tobj_type === 'AOR' ? vector_aor.getSource() : vector.getSource();
	draw = new ol.interaction.Draw({
		source: source,
		type: geom_type
	});
	map.addInteraction(draw);
	draw.on('drawend', function(evt) {
		evt.feature.setId(FID.gen());
		evt.feature.set('type', tobj_type);
		evt.feature.set('name', evt.feature.getId());
		selectedFeature.push(evt.feature)
		map.removeInteraction(draw);
		select.setActive(true);
		modify.setActive(true);
//    translate.setActive(true);
		map.on('pointermove', hoverDisplay);
		info.innerHTML = evt.feature.get('type') + ': ' + evt.feature.get('name');
		featureadded = true;
		source.once('addfeature', function (evt) {
			var parser = new ol.format.GeoJSON();
			var features = source.getFeatures();
			var featuresGeoJSON = parser.writeFeatures(features, {
				featureProjection: 'EPSG:3857',
			});
			console.log(featuresGeoJSON)
			$.ajax({
				url: 'data/geojson/features.geojson',
				type: 'POST',
				data: featuresGeoJSON
			}).then(function(response) {
				console.log(response);
			});
		});
	});
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			map.removeInteraction(draw);
			select.setActive(true);
			modify.setActive(true);
//      translate.setActive(true);
	  		map.on('pointermove', hoverDisplay);
		}
	});
};

var loadProject = document.getElementById('loadProject');
loadProject.onclick = function(e) {
	vector_aor = new ol.layer.Vector({
		title: 'AOR',
		source: new ol.source.Vector({
			url: 'data/geojson/aor.geojson',
			format: new ol.format.GeoJSON()
		}),
		style: tobjectsStyleFunction
	});
	vector = new ol.layer.Vector({
		title: 'tobjects',
		source: new ol.source.Vector({
			url: 'data/geojson/tobjects.geojson',
			format: new ol.format.GeoJSON()
		}),
		style: tobjectsStyleFunction
	});
	map.removeLayer(projectGroup);
	projectGroup = new ol.layer.Group({
		title: 'Project',
		layers: [
			vector_aor,
			vector
		]
	});
	map.addLayer(projectGroup);
	vector_aor.getSource().on('change', function(evt) {
		var source = evt.target;
		if (source.getState() === 'ready') {
			view.setCenter(ol.extent.getCenter(source.getExtent()));
		};
	});
}


  
/*******************************/
/*********** EVENTS ************/
/*******************************/

var keyDown = function(evt) {
	if (exists(highlight) && evt.keyCode == 46) { //delete key pressed
		vector.getSource().removeFeature(highlight);
		featureOverlay.getSource().removeFeature(highlight);
		highlight = undefined;
	}
};
document.addEventListener('keydown', keyDown, false);

/*******************************/
/********** CONTROLS ***********/
/*******************************/



/******* LAYER SWITCHER ********/

var layerSwitcher = new ol.control.LayerSwitcher();
map.addControl(layerSwitcher);

/********** SCALELINE **********/

var scaleLineControl = new ol.control.ScaleLine();
map.addControl(scaleLineControl);

var unitsSelect = $('#units');
unitsSelect.on('change', function() {
	scaleLineControl.setUnits(this.value);
});
unitsSelect.val(scaleLineControl.getUnits());

/******** MOUSEPOSITION ********/

var mousePositionControl = new ol.control.MousePosition({
	className: 'ol-mouse-position aspe-mouse-position',
	coordinateFormat: ol.coordinate.createStringXY(4),
	projection: 'EPSG:4326',
	undefinedHTML: '&nbsp;'
});
map.addControl(mousePositionControl);

var projectionSelect = $('#projection');
projectionSelect.on('change', function() {
	mousePositionControl.setProjection(ol.proj.get(this.value));
});
projectionSelect.val(mousePositionControl.getProjection().getCode());

var precisionInput = $('#precision');
precisionInput.on('change', function() {
	var format = ol.coordinate.createStringXY(this.valueAsNumber)
	mousePositionControl.setCoordinateFormat(format);
});

/*******************************/
/******* BEHAVIOR TESTS ********/
/*******************************/


// var overlayType = document.getElementById('overlay-type');
// overlayType.onclick = function(e) {
// 	var bounds = [-105.54833333333333, -105.52694444444444, 39.76361111111111, 39.778055555555554];
// };


