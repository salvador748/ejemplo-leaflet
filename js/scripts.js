// Funciones

function updateOpacity() {
	document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
	layer_image_temperatura.setOpacity(document.getElementById("sld-opacity").value);
}


// ** Configuración inicial del mapa **

// Creación de un mapa de Leaflet
var map = L.map("mapid");

// Centro del mapa y nivel inicial de acercamiento
var catedralSJ = L.latLng([9.9326673, -84.0787633]);
var zoomLevel = 7;

// Vista del mapa
map.setView(catedralSJ, zoomLevel);


// ** Capas **

// Capas de teselas
layer_tile_esri = L.tileLayer.provider("Esri.WorldImagery").addTo(map);
layer_tile_osm = L.tileLayer.provider("OpenStreetMap.Mapnik").addTo(map);

// Capa WMS de provincias
var layer_wms_provincias = L.tileLayer.wms('http://geos.snitcr.go.cr/be/IGN_5/wms?', {
	layers: 'limiteprovincial_5k',
  format: 'image/png',
	transparent: true
}).addTo(map);

// Capa raster de temperatura
var layer_image_temperatura = L.imageOverlay("datos/bio1_cr.png", 
	[[11.2197734290000000, -85.9790724540000042], 
	[8.0364413690000003, -82.5540738239999996]], 
	{opacity:0.5}
).addTo(map);


// ** Marcadores **

// Marcador para el Volcán Rincón de la Vieja
// Ubicación
var marker_volcan_rinconVieja = L.marker([10.8164249, -85.3593949]).addTo(map);
// Popup																
marker_volcan_rinconVieja.bindPopup('<a href="https://es.wikipedia.org/wiki/Volc%C3%A1n_Rinc%C3%B3n_de_la_Vieja">Volcán Rincón de la Vieja</a><br>Altitud: 1916 msnm.');
// Tooltip
marker_volcan_rinconVieja.bindTooltip("Volcán Rincón de la Vieja");

// Marcador para el Volcán Arenal
// Ubicación
var marker_volcan_arenal = L.marker([10.4626255, -84.720689]).addTo(map);
// Popup																
marker_volcan_arenal.bindPopup('<a href="https://es.wikipedia.org/wiki/Volc%C3%A1n_Arenal">Volcán Arenal</a><br>Altitud: 1670 msnm.');
// Tooltip
marker_volcan_arenal.bindTooltip("Volcán Arenal");

// Marcador para el Volcán Poás
// Ubicación
var marker_volcan_poas = L.marker([10.1977771, -84.2480652]).addTo(map);
// Popup																
marker_volcan_poas.bindPopup('<a href="https://es.wikipedia.org/wiki/Parque_nacional_Volc%C3%A1n_Po%C3%A1s">Volcán Poás</a><br>Altitud: 2708 msnm.');
// Tooltip
marker_volcan_poas.bindTooltip("Volcán Poás");

// Marcador para el Volcán Turrialba
// Ubicación
var marker_volcan_turrialba = L.marker([10.0162931, -83.7823888]).addTo(map);
// Popup																
marker_volcan_turrialba.bindPopup('<a href="https://es.wikipedia.org/wiki/Volc%C3%A1n_Turrialba">Volcán Turrialba</a><br>Altitud: 3340 msnm.');
// Tooltip
marker_volcan_poas.bindTooltip("Volcán Turrialba");

// Marcador para el Volcán Irazú
// Ubicación
var marker_volcan_irazu = L.marker([9.979981, -83.8578309]).addTo(map);
// Popup																
marker_volcan_irazu.bindPopup('<a href="https://es.wikipedia.org/wiki/Volc%C3%A1n_Iraz%C3%BA">Volcán Irazú</a><br>Altitud: 3432 msnm.');
// Tooltip
marker_volcan_poas.bindTooltip("Volcán Irazú");


// ** Controles **

// Control de capas
// Conjunto de capas base
var maps_base = {
	"ESRI World Imagery": layer_tile_esri,
	"OpenStreetMap": layer_tile_osm
};
// Conjunto de capas overlay
var maps_overlay = {
	"Temperatura": layer_image_temperatura,	
  "Provincias": layer_wms_provincias
};
control_layers = L.control.layers(maps_base, 
								 maps_overlay, 
								 {position:'topright', 
								  collapsed:true}).addTo(map);	

// Control de escala
L.control.scale({imperial:false}).addTo(map);	


// ** Capas GeoJSON

// Capa de ASP
$.getJSON("datos/asp.geojson", function(geodata) {
  var layer_geojson_asp = L.geoJson(geodata, {
    style: function(feature) {
      return {
        'color': "#00ff00",
        'weight': 2,
        'fillOpacity': 0.0
      }
		},
		onEachFeature: function(feature, layer) {
			var popupText = "Área protegida: " + feature.properties.nombre_asp + "<br>" +
											"Categoría: " + feature.properties.cat_manejo;
			layer.bindPopup(popupText);
		}			
  }).addTo(map);
	control_layers.addOverlay(layer_geojson_asp, 'Áreas protegidas');
});