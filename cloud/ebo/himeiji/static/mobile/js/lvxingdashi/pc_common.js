
function set_head_menu_active(index){
	$('#head_menu .active').removeClass('active');
	$('#menu_'+index).addClass('active');
}

function popIframe(url,width,height){
	if(!width){
		if($(window).width()>1220){
			width = 1218;
		}else{
			width = $(window).width();
		}
	}
	if(!height){
		if($(window).height()>880){
			height = 880;
		}else{
			height = $(window).height()-50;
		}
		
	}
	if(layer){
	    layer.open({
	      type: 2,
	      title: '',
	      shadeClose: false,
	      shade: 0.8,
	      maxmin: false, //开启最大化最小化按钮
	      area: [width+'px', height+'px'],
	      content: url
	    });
	}
}

function showPage(url,isPop){
	if(isPop){
		url += '&pop=1';
		popIframe(url);
	}else{
		window.location.href=url;
	}
	
}

//地图相关功能

var italyPoi = {
		'p1':{position:{lat:41.89021009484799,lng:12.492227554321289},lable:'1',name:'罗马斗兽场'},	// 罗马斗兽场
		'p2':{position:{lat:41.89827827087711,lng:12.470292448997498},lable:'2',name:'Pizzeria da Baffetto'},    // Pizzeria da Baffetto
		'p3':{position:{lat:41.90307556715024,lng:12.466263771057129},lable:'3',name:'圣天使城堡'},    // 圣天使城堡
		'p4':{position:{lat:41.89861167765202,lng:12.476869225502014},lable:'4',name:'万神殿'},    // 万神殿
		'p5':{position:{lat:41.9010592693023,lng:12.4772447347641},lable:'5',name:'Giolitti'},    // Giolitti
		'p6':{position:{lat:41.90541519138034,lng:12.483440637588501},lable:'6',name:'Ristorante alla Rampa'},    // Ristorante alla Rampa
		'p7':{position:{lat:41.900815712183096,lng:12.498233020305634},lable:'7',name:'Welcome Piram Hotel'}    // Welcome Piram Hotel
};

var isInitMap = false;
var map = null;
var markers = [];
var flightPath; // 画线
var directionsService;
var directionsDisplay;

function addMarker(location,lable) {
	if(!map){return;}
	var marker = new google.maps.Marker({
	    position: location,
	    map: map
	});
	if(lable){
		marker.setLabel(lable);
	}
	markers.push(marker);
	//alert('添加新的marker:'+location);
}

// 切换地图中心点
function setCenter(center,zoom){
	if(!map){return;}
	map.setCenter(center);
	if(zoom){
		map.setZoom(zoom);
	}else{
		map.setZoom(12);
	}
	}

function MarkersFlightPath(){
	if(!map){return;}
	var flightPathCoordinates = []; 
	for(var i = 0;i<markers.length;i++){
		flightPathCoordinates.push(markers[i].position);
	}
	if(!flightPath){
		flightPath = new google.maps.Polyline({
		    path: flightPathCoordinates,
		    strokeColor: '#000000',
		    strokeOpacity: 1.0,
		    strokeWeight: 2
		});
		flightPath.setMap(map);
	}
}

function MarkersDirections(displayPanelId){
	if(!map){return;}
	
	var waypoints = []; // 途径点
	if(markers.length>2){
		for(var i = 1;i<markers.length-1;i++){
			waypoints.push({
		        location: markers[i].position,
		        stopover: true
		    });
		}
	}
	
	if(!directionsService){
		directionsService = new google.maps.DirectionsService;
	}
	
	directionsService.route({
	    origin: markers[0].position,
	    destination: markers[markers.length-1].position,
	    waypoints:waypoints,
	    travelMode: google.maps.TravelMode.DRIVING
	  }, function(response, status) {
	    if (status === google.maps.DirectionsStatus.OK) {
	    	deleteMarkers();	
	      	directionsDisplay = new google.maps.DirectionsRenderer;
	      	if(displayPanelId){
	      		directionsDisplay.setPanel(document.getElementById(displayPanelId));
	      	}
	      	
	  	    directionsDisplay.setMap(map);
	      	directionsDisplay.setDirections(response);
	    } else {
	      	window.alert('Directions request failed due to ' + status);
	    }
	  });
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
      setMapOnAll(null);
}

function deleteMarkers() {
	if(!map){return;}
	clearMarkers();
  markers = [];
}

function deleteMarkersFlightPath(){
	if(!map){return;}
	if(flightPath){
		flightPath.setMap(null);
		flightPath=null;
	}
}

function initMap(){
	if(isInitMap){
		return;
	}
	map = new google.maps.Map(document.getElementById('map'), {
	    //center: {lat: -34.397, lng: 150.644},
	    center: {lat: 39.9133136, lng: 116.4115819},
	    zoom: 12
	});
}

function getMapImageUrl(p,width,height,zoom){
	if(!width){ width = 270;}
	if(!height){ height = 180;}
	if(!zoom){ zoom = 180;}
	
	return 'http://maps.google.cn/maps/api/staticmap?zoom='+zoom+'&size='+width+'x'+height+'&markers='+italyPoi['p'+p].position.lat+','+italyPoi['p'+p].position.lng+'&sensor=true';
}

// 获取地理位置
function getLocation(callbackFunction){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			callbackFunction(1,{'lat':position.coords.latitude,'lng':position.coords.longitude});
		},function (error)
		  {
			callbackFunction(-error.code);
		});
	}else{
		callbackFunction(0);
	}
}
