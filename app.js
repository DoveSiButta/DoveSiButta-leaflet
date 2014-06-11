//The Map
var map;
var markers = new Array();
//Constants
var TYPE_PLASTIC_1 = 1;
var TYPE_GLASS_2 = 2;
var TYPE_ALUMINUM_3 = 3;
var TYPE_GENERIC_4 = 4;
var TYPE_ORGANIC_5 = 5;
var TYPE_BATTERIES_6 = 6;
var TYPE_DRUGS_7 = 7;
var TYPE_FURNITURE_8 = 8;
var TYPE_PAPER_9 = 9;
var TYPE_TONER_10 = 10;
var TYPE_CLOTHES_11 = 11;

var comuni_doortodoor = [17078, 17002]; //This should come from a database!!

$( document ).ready(function() {

	//This uses MapQuest
	var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
	mb = new L.tileLayer(mbUrl,  {id: 'examples.map-i86knfo3', attribution: mbAttr, maxZoom: 18});

	// L.tileLayer(, {
	//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	//     maxZoom: 18
	// }).addTo(map);
	//end MapQuest

	//To use OpenStreetMap
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});
    // osm.addTo(map);
	// map.setView(new L.LatLng(51.538594, -0.198075), 12).addLayer(osm);
	//End OpenStreetMap

	map = L.map('map', {layers: [mb, osm]}).setView([45.54155, 10.21180], 13);

	//Add a marker
	var marker = L.marker([45.54155, 10.21180]);	
	map.addLayer(marker);
	markers[marker._leaflet_id] = marker;

	//Base map layers (OSM or MapBox)
	var baseMaps = {
		"MapBox": mb,
		"OpenStreetMap": osm
	};

	L.control.layers(baseMaps).addTo(map);

	//Add the Locate control
	L.control.locate().addTo(map);

	function eachLayer(layer) {
    var feature = layer.toGeoJSON();
    if (feature.properties && feature.properties.name) {
    	var popupContent = "<p>"+feature.properties.name+"</p>";
    	if (comuni_doortodoor.indexOf(feature.id) != -1) {
    		popupContent = popupContent + '<p>Effettua raccolta porta a porta</p>';
    	};
        layer.bindPopup(popupContent);
    }
}

	//Comuni Italiani
	var comuni = omnivore.topojson('topojson/com2011_g.topojson');
	comuni.on('ready', function() {
        // map.fitBounds(comuni.getBounds());
        map.addLayer(comuni );
        comuni.eachLayer(eachLayer);
    });
    comuni.addTo(map);


	//Add the callbacks to load data from OSM API (Overpass)
	map.on('load', onMapMove);
	map.on('moveend', onMapMove);

	//Locate the user
	locateUser();

	
});

function locateUser(){
	    map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
        .on('locationfound', function(e){
        		
    		//Remove all markers
    		markers.forEach(function(entry){
				// var marker = map.getLayer(entry);
				map.removeLayer(entry);
			});

            var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your location');
            markers[marker._leaflet_id] = marker;
            var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
                weight: 1,
                color: 'blue',
                fillColor: '#cacaca',
                fillOpacity: 0.2
            });
            map.addLayer(marker);
            map.addLayer(circle);
        })
       .on('locationerror', function(e){
            console.log(e);
            // alert("Location access denied.");
        });
}

function onMapMove(){
	//Called when the map is moved
	var bounds = map.getBounds(); //this is an object of type latLngBounds http://leafletjs.com/reference.html#latlngbounds
	var minLat = bounds.getSouth();
	var minLon = bounds.getWest();
	var maxLat = bounds.getNorth();
	var maxLon = bounds.getEast();
	//Load from OSM API OverPass
	var queryRecycling = 'http://overpass-api.de/api/interpreter?data=';
	queryRecycling = queryRecycling + queryForBinType($('#bin-type-select').val());
	// var queryRecycling = '[out:json];node[amenity=recycling]('+ minLat +','+ minLon +','+ maxLat +','+ maxLon +');out;';
	$.getJSON(queryRecycling, function(data){
		//Debug
		// console.log(data);

		//Remove all markers
		markers.forEach(function(entry){
			// var marker = map.getLayer(entry);
			map.removeLayer(entry);
		});

		for (var i = data.elements.length - 1; i >= 0; i--) {
			e = data.elements[i]; //each "e" is a element returned from the query 
			//The icon
			 var greenIcon = L.AwesomeMarkers.icon({
    			icon: 'recycle',
    			prefix: 'fa', //use ony for font-awesome icon
    			markerColor: 'green',
    			iconColor: 'white'
  			});
			 if (e.type == "node" && e.tags) { //We want only nodes with Tag (otherwise they are probably part of "way" or "relation")
				 //The popup content
				if (e.tags) {var popupContent = '<p>id: '+e.id+'<br>amenity:'+ e.tags.amenity+'</p>';}
				else{var popupContent = '<p>id: '+e.id +'</p>';}
	  			var marker = L.marker([e.lat,e.lon], {icon: greenIcon}).addTo(map);
	  			markers[marker._leaflet_id] = marker;
	  			marker.bindPopup(popupContent);
  			}
  			else if(e.type == "way"){
				var osm_id = e.id; 				
  				$.ajax({
					url: "http://www.openstreetmap.org/api/0.6/way/" + osm_id +"/full",
					//"http://www.openstreetmap.org/api/0.6/node/164979149",
					// or "http://www.openstreetmap.org/api/0.6/way/52477381/full"
					dataType: "xml",
					success: function (xml) {
						var layer = new L.OSM.DataLayer(xml).addTo(map);
						markers[layer._leaflet_id] = layer;

						if (e.tags) {var popupContent = '<p>id: '+e.id+'<br>amenity:'+ e.tags.amenity+'</p>';}
						else{var popupContent = '<p>id: '+e.id +'</p>';}
						layer.bindPopup(popupContent);

						// map.fitBounds(layer.getBounds());
					}
					//
					//$.each(nodes, function(key, value){ console.log(key) })
				});
  			}
  			else if(e.type == "relation"){
				var osm_id = e.id; 				
  				$.ajax({
					url: "http://www.openstreetmap.org/api/0.6/relation/" + osm_id +"/full",
					//"http://www.openstreetmap.org/api/0.6/node/164979149",
					// or "http://www.openstreetmap.org/api/0.6/way/52477381/full"
					dataType: "xml",
					success: function (xml) {
						var layer = new L.OSM.DataLayer(xml).addTo(map);
						markers[layer._leaflet_id] = layer;

						
						if (e.tags) {var popupContent = '<p>id: '+e.id+'<br>amenity:'+ e.tags.amenity+'</p>';}
						else{var popupContent = '<p>id: '+e.id +'</p>';}
						layer.bindPopup(popupContent);
						// map.fitBounds(layer.getBounds());
					}
				});
  			}
			

		};

	});
}

$('#address').keyup(function(event) {
	event.preventDefault();
	//If Enter was pressed make a search
	if (event.keyCode == '13') {
		addr_search();
	}
	return false;
});

$('#button-go').click(function(event) {
	event.preventDefault();
	var elem = $( this );
	var searchString = $("#address").val();
	if (searchString.length > 0) { 
		addr_search();
	};
});

$('#bin-type-select').change(function(){
	// var elem = $(this);
	// alert(queryForBinType(elem.val()) );
	onMapMove();
});

function queryForBinType(binType){

	var bounds = map.getBounds(); //this is an object of type latLngBounds http://leafletjs.com/reference.html#latlngbounds
	var minLat = bounds.getSouth();
	var minLon = bounds.getWest();
	var maxLat = bounds.getNorth();
	var maxLon = bounds.getEast();
	var query = "";
	if (binType == TYPE_PLASTIC_1) {
		query = '[out:json][timeout:25];(node["amenity"="recycling"]["recycling:paper"="yes"]('+ minLat +',' + minLon+ ','+maxLat+',' + maxLon + ');way["amenity"="recycling"]["recycling:paper"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');relation["amenity"="recycling"]["recycling:paper"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + '););out body;>;out;';
	}
	else if (binType == TYPE_GLASS_2) {
		query = '[out:json][timeout:25];(node["amenity"="recycling"]["recycling:glass"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');way["amenity"="recycling"]["recycling:glass"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');relation["amenity"="recycling"]["recycling:glass"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');node["amenity"="recycling"]["recycling:glass_bottles"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');way["amenity"="recycling"]["recycling:glass_bottles"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');relation["amenity"="recycling"]["recycling:glass_bottles"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + '););out body;>;out;';
	}
	else if(binType == TYPE_ALUMINUM_3){
		query = '[out:json][timeout:25];(node["amenity"="recycling"]["recycling:aluminium"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');way["amenity"="recycling"]["recycling:aluminium"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');relation["amenity"="recycling"]["recycling:aluminium"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');node["amenity"="recycling"]["recycling:cans"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');way["amenity"="recycling"]["recycling:cans"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + ');relation["amenity"="recycling"]["recycling:cans"="yes"](' + minLat + ',' + minLon + ',' + maxLat + ',' + maxLon + '););out body;>;out;';
	}
	else if(binType == TYPE_GENERIC_4)
	{

	}
	return query;
}

function addr_search() {

	var searchString = $("#address").val();

	$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + searchString, function(data) {
		var items = [];

		$.each(data, function(key, val) {
		//Debug
		console.log(val.display_name);

		items.push(
			"<li><a href='#' onclick='chooseAddr(" +
				val.lat + ", " + val.lon + ");return false;'>" + val.display_name +
		'</a></li>'
		)});

		$('#results').empty();
		if (items.length != 0) {
			$('<p>', { html: "Search results:" }).appendTo('#results');
			$('<ul/>', {
				'class': 'my-new-list',
				html: items.join('')
			}).appendTo('#results');
		} else {
			$('<p>', { html: "No results found" }).appendTo('#results');
		}
	});
}


function chooseAddr(lat, lng, type) {
	var location = new L.LatLng(lat, lng);
	map.panTo(location);

	markers.forEach(function(entry){
		// var marker = map.getLayer(entry);
		map.removeLayer(entry);
	});

	var marker = L.marker([lat, lng]).addTo(map);
	markers[marker._leaflet_id] = marker;
	
	if (type == 'city' || type == 'administrative') {
		map.setZoom(11);
	} else {
		map.setZoom(13);
	}
}
