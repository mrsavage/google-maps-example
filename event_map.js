function initialize_event_map() {
    var fn_latlng = new google.maps.LatLng(47.616347,9.432907);
    var myOptions = {
      zoom: 8,
      center: fn_latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("event_map"), myOptions);

    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        update_sidebar(map);
    });

    //Event 1 (Club Vaudeville)
    var point = new google.maps.LatLng(47.55718,9.70659);
    var marker = createMarker(map, point,"Depeche Mode Party","Club Vaudeville proudly presents: enjoy the mode")

    //Event 2 (Club Douala)
    var point = new google.maps.LatLng(47.78162,9.60651);
    var marker = createMarker(map, point,"Party mit den Residents","Im Club Doala <br> Check it out")

    // put the assembled side_bar_html contents into the side_bar div
   document.getElementById("event_sidebar").innerHTML = side_bar_html;
  }

var infowindow = new google.maps.InfoWindow(
  {
    size: new google.maps.Size(250,280)
  });


// This function picks up the click and opens the event detail page
function myclick(i) {
  google.maps.event.trigger(gmarkers[i], "click");
}

// This function picks up the mouseover and opens the corresponding info window
function mymouseover(i) {
  google.maps.event.trigger(gmarkers[i], "mouseover");
}

// A function to create the marker and set up the event window function 
function createMarker(map, latlng, name, html) {
    var contentString = "<h3>" + name + "</h3>" + "<p>" + html + "</p>";
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: name,
        //zIndex: Math.round(latlng.lat()*-100000)<<5
        });

    //show popu with title / description on mouseover
    google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(contentString); 
        infowindow.open(map,marker);
        });
    // save the info we need to use later for the side_bar
    gmarkers.push(marker);
    // add a line to the side_bar html
    side_bar_html += '<a onmouseover="javascript:mymouseover(' + (gmarkers.length-1) + ')" href="javascript:myclick(' + (gmarkers.length-1) + ')">' + name + '<\/a><br>';
}

function update_sidebar(map){ 
        side_bar_html = "";
        var bounds = map.getBounds(); 
        var SW = bounds.getSouthWest(); 
        var NE = bounds.getNorthEast(); 
        var NElat = NE.lat(); 
        var NElng = NE.lng(); 
        var SWlat = SW.lat(); 
        var SWlng = SW.lng(); 
        //fix for international date line 
        if (SWlng > 100) SWlng = -180; 
        for (var j = 0; j < gmarkers.length; j++){ 
                var point = gmarkers[j].getPosition(); 
                if ((point.lat() < NElat) && (point.lat() > SWlat)){ 
                        if ((point.lng() < NElng) && (point.lng() > SWlng)){ 
                                side_bar_html += '<a onmouseover="javascript:mymouseover(' + j + ')" href="javascript:myclick(' + j + ')">' + gmarkers[j].getTitle() + '<\/a><br>';
                        } 
                } 
        } 
        document.getElementById("event_sidebar").innerHTML = side_bar_html; 
}
