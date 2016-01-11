var map, wfs;
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
var DeleteFeature = OpenLayers.Class(OpenLayers.Control, {
  initialize: function(layer, options) {
      OpenLayers.Control.prototype.initialize.apply(this, [options]);
      this.layer = layer;
      this.handler = new OpenLayers.Handler.Feature(
          this, layer, {click: this.clickFeature}
      );
  },
  clickFeature: function(feature) {
      // if feature doesn't have a fid, destroy it
      if(feature.fid == undefined) {
          this.layer.destroyFeatures([feature]);
      } else {
          feature.state = OpenLayers.State.DELETE;
          this.layer.events.triggerEvent("afterfeaturemodified",
                                         {feature: feature});
          feature.renderIntent = "select";
          this.layer.drawFeature(feature);
      }
  },
  setMap: function(map) {
      this.handler.setMap(map);
      OpenLayers.Control.prototype.setMap.apply(this, arguments);
  },
  CLASS_NAME: "OpenLayers.Control.DeleteFeature"
});
function showMsg(szMessage) {
  document.getElementById("message").innerHTML = szMessage;
  setTimeout(
      "document.getElementById('message').innerHTML = ''",2000);
}
function showSuccessMsg(){
  showMsg("Transaction successfully completed");
};
function showFailureMsg(){
  showMsg("An error occured while operating the transaction");
};
function init() {
  map = new OpenLayers.Map('map', {
      projection: new OpenLayers.Projection("EPSG:31467"),
      units: "m",
      maxResolution: "auto",
      maxExtent: new OpenLayers.Bounds(3427000,5788000,3444000,5800000),
      controls: [
          new OpenLayers.Control.PanZoom()
      ]
  });
  var osm = new OpenLayers.Layer.WMS(
      "OSM by Omniscale WMS",
      "http://osm.omniscale.net/proxy/service",
      {layers: 'osm', format: 'image/jpeg'},
      {projection:"EPSG:31467",  units: "m", maxResolution: "auto", maxExtent: new OpenLayers.Bounds(3427000,5788000,3444000,5800000)}
  );
  var saveStrategy = new OpenLayers.Strategy.Save();
  saveStrategy.events.register("success", '', showSuccessMsg);
  saveStrategy.events.register("fail", '', showFailureMsg);
  wfs = new OpenLayers.Layer.Vector("Editable Features", {
      strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
      projection: new OpenLayers.Projection("EPSG:31467"),
      protocol: new OpenLayers.Protocol.WFS({
          version: "1.1.0",
          srsName: "EPSG:31467",
          url: "http://db01/cgi-bin/tinyows",
          featureNS :  "http://www.tinyows.org/",
          featureType: "frida",
          geometryName: "geom",
          schema: "http://db01/cgi-bin/tinyows?service=wfs&request=DescribeFeatureType&version=1.1.0&typename=tows:frida"
      })
  });
  map.addLayers([osm, wfs]);
  var panel = new OpenLayers.Control.Panel(
      {'displayClass': 'customEditingToolbar'}
  );
  var navigate = new OpenLayers.Control.Navigation({
      title: "Pan Map"
  });
  var draw = new OpenLayers.Control.DrawFeature(
      wfs, OpenLayers.Handler.Polygon,
      {
          title: "Draw Feature",
          displayClass: "olControlDrawFeaturePolygon",
          multi: true
      }
  );
  var edit = new OpenLayers.Control.ModifyFeature(wfs, {
      title: "Modify Feature",
      displayClass: "olControlModifyFeature"
  });
  var del = new DeleteFeature(wfs, {title: "Delete Feature"});
  var save = new OpenLayers.Control.Button({
      title: "Save Changes",
      trigger: function() {
          if(edit.feature) {
              edit.selectControl.unselectAll();
          }
          saveStrategy.save();
      },
      displayClass: "olControlSaveFeatures"
  });
  panel.addControls([navigate, save, del, edit, draw]);
  panel.defaultControl = navigate;
  map.addControl(panel);
  map.zoomToMaxExtent();
}
