// Initialize and add the map
let map;


function initMap() {
  // Basic options for a simple Google Map
  // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  var mapOptions = {
    // How zoomed in you want the map to start at (always required)
    zoom: 16,

    // The latitude and longitude to center the map (always required)
    center: new google.maps.LatLng(1.3890426982460167, 103.89169817761369), // Singapore

    // How you would like to style the map. 
    // This is where you would paste any style found on Snazzy Maps.
    styles: [{ "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#202c3e" }] }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "gamma": 0.01 }, { "lightness": 20 }, { "weight": "1.39" }, { "color": "#ffffff" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "weight": "0.96" }, { "saturation": "9" }, { "visibility": "on" }, { "color": "#000000" }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "lightness": 30 }, { "saturation": "9" }, { "color": "#29446b" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "saturation": 20 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "lightness": 20 }, { "saturation": -20 }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 10 }, { "saturation": -30 }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#193a55" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "saturation": 25 }, { "lightness": 25 }, { "weight": "0.01" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "lightness": -20 }] }]
  };

  // Get the HTML DOM element that will contain your map 
  // We are using a div with id="map" seen below in the <body>
  var mapElement = document.getElementById('map');

  // Create the Google Map using our element and options defined above
  var map = new google.maps.Map(mapElement, mapOptions);

  // Example data
  data = {
    "groups": [
      {
        "name": "Sengkang CC",
        "location1": 1.3934976451875911,
        "location2": 103.8960472211468
      },
      {
        "name": "Punggol CC",
        "location1": 1.3746701586825003,
        "location2": 103.8931266978808
      },
      {
        "name": "Macpherson CC",
        "location1": 1.3242983621851472,
        "location2": 103.88468658465645
      }
    ]
  }

  // List of markers
  var markers = [];

  // Set markers for each group
  for (var i = 0; i < data.groups.length; i++) {
    let groupName = data.groups[i].name;

    newLength = markers.push(new google.maps.Marker({
      position: new google.maps.LatLng(data.groups[i].location1, data.groups[i].location2),
      map: map,
      title: groupName
    }));

    // Set onClick to toggle collapsible
    markers[newLength-1].addListener("click", () => {
      toggleCollapsible(groupName.replace(/\s/g, ''));
    });
  }
}

$(document).ready(function () {initMap()})

function plotGroups() {
  // Example data
  data = {
    "groups": [
      {
        "name": "Sengkang CC",
        "location1": 1.3934976451875911,
        "location2": 103.8960472211468
      },
      {
        "name": "Punggol CC",
        "location1": 1.3746701586825003,
        "location2": 103.8931266978808
      },
      {
        "name": "Macpherson CC",
        "location1": 1.3242983621851472,
        "location2": 103.88468658465645
      }
    ]
  }

  // List of markers
  var markers = [];
  var listview = document.getElementById("listview");

  for (var i = 0; i < data.groups.length; i++) {
    // Set markers for each group
    var groupName = data.groups[i].name;
    markers.push(new google.maps.Marker({
      position: new google.maps.LatLng(data.groups[i].location1, data.groups[i].location2),
      map: map,
      title: groupName
    }));

    // Add to list
    listview.innerHTML += '<button type="button" id="' + groupName.replace(/\s/g, '') + '" class="collapsible">' +
    '<span class="tab">' + groupName +
      '<span class="badge badge-pill badge-primary">♿</span>' +
    '</span>' +
  '</button>' +
  '<div class="content">' +
    '<div class="thumbnail">' +
      '<img class="thumbnail"' +
        'src="https://lh5.googleusercontent.com/p/AF1QipOX83lE1UtNwXvb-QEW8WUbNkiJNUhzgTYGKY3f=w143-h143-n-k-no">' +
    '</div>' +
    '<div class="info">' +
      '<h4>' + groupName + '</h4>' +
      '<p>' + data.groups[i].location1 + '</p>' +
    '</div>' +
  '</div>';
  }
}

// function listGroups() {
//   // Create expandable tiles for each group
//   var listview = document.getElementById("listview");
//   data.groups.forEach(function (group) {
//     // Create tile element
//     var tile = document.createElement("div");
//     tile.classList.add("tile");
//     tile.textContent = group.name;

//     // Create content element
//     var content = document.createElement("div");
//     content.classList.add("tile-content");
//     content.textContent = group.location1;

//     // Set onClick to show/hide content
//     tile.addEventListener("click", function () {
//       content.classList.toggle("open");
//     });

//     // Create marker for the group
//     var marker = new google.maps.Marker({
//       position: new google.maps.LatLng(group.location1, group.location2),
//       map: map,
//       title: group.name
//     });

//     // Set onClick to show group name
//     marker.addListener("click", function () {
//       window.alert(group.name);
//     });

//     // Append content and tile to listview
//     tile.appendChild(content);
//     listview.appendChild(tile);
//   });
// }

function enableCollapsibles() {
  var coll = document.getElementsByClassName("collapsible");
  var i;
  
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
}

function toggleCollapsible(target) {
  // Close all first
  tabs = document.getElementsByClassName("collapsible active");
  var i;

  for (i=0; i<tabs.length; i++) {
    var content = tabs[i].nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
    tabs[i].classList.toggle("active");
  }


  // Open collapsible
  target = document.getElementById(target);
  target.focus();
  target.classList.toggle("active");
  var content = target.nextElementSibling;
  if (content.style.maxHeight){
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}