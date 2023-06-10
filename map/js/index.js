// Initialize and add the map
let map;

// List of markers
var markers = [];

// Example data
data = {
  "groups": [
    {
      "name": "Sengkang CC",
      "location1": 1.3934976451875911,
      "location2": 103.8960472211468,
      "url": "https://www.google.com.sg/maps/place/Sengkang+Community+Club/@1.3927683,103.8914553,17z/data=!3m1!5s0x31da160d8351afcd:0xbad1d8ce8d1976f6!4m6!3m5!1s0x31da160d761a5745:0x2c0490fe3727b540!8m2!3d1.3927683!4d103.8940302!16zL20vMDkxX3Bx?entry=ttu",
      "tags": ["Disabled", "Elderly", "Children"]
    },
    {
      "name": "Punggol CC",
      "location1": 1.3746701586825003,
      "location2": 103.8931266978808,
      "url": "https://www.google.com.sg/maps/place/Punggol+Community+Club/@1.3741731,103.8894664,17z/data=!3m1!4b1!4m6!3m5!1s0x31da175df62899c5:0x3b699f184e3226c6!8m2!3d1.3741731!4d103.8920413!16s%2Fg%2F11ppzchlhz?entry=ttu",
      "tags": ["Disabled"]
    },
    {
      "name": "Macpherson CC",
      "location1": 1.3242983621851472,
      "location2": 103.88468658465645,
      "url": "https://www.google.com.sg/maps/place/MacPherson+Community+Club/@1.3236119,103.8821546,17z/data=!3m2!4b1!5s0x31da1826da9dae41:0xcb5c21420777fb29!4m6!3m5!1s0x31da1826d074c2cd:0xb7b6d4453931132f!8m2!3d1.3236119!4d103.8847295!16s%2Fg%2F1tf8qm7r?entry=ttu",
      "tags": ["Elderly", "Children"]
    },
    {
      "name": "East Coast Park",
      "location1": 1.303956,
      "location2": 103.926373,
      "url": "https://www.google.com/search?rlz=1C1CHBF_enSG844SG844&tbs=lf:1,lf_ui:1&tbm=lcl&sxsrf=APwXEddL13Y3TAXsP1SzEep-_bS1gdivxw:1686361093736&q=east+coast+park&rflfq=1&num=10&ved=2ahUKEwjQ49HPyLf_AhVLg2MGHYnFCJ0QtgN6BAgWEAI#rlfi=hd:;si:12681473382849091322,l,Cg9lYXN0IGNvYXN0IHBhcmtI1K_yAlonEAAQARACGAAYARgCIg9lYXN0IGNvYXN0IHBhcmsqCAgCEAAQARACkgEEcGFya5oBJENoZERTVWhOTUc5blMwVkpRMEZuU1VSSGVscHVaMmxSUlJBQqoBNxABMh4QASIaMq8bq2FnZ1Ux-qTQPk610QzLrBayii0leXYyExACIg9lYXN0IGNvYXN0IHBhcms,y,pZITJvIGWE8;mv:[[1.3125807232286566,103.92456479922593],[1.2882539903374945,103.876671275056]]",
      "tags": ["Children"]
    },
  ]
}

$(".button_su_inner").mouseenter(function (e) {
  var parentOffset = $(this).offset();

  var relX = e.pageX - parentOffset.left;
  var relY = e.pageY - parentOffset.top;
  $(this).prev(".su_button_circle").css({ "left": relX, "top": relY });
  $(this).prev(".su_button_circle").removeClass("desplode-circle");
  $(this).prev(".su_button_circle").addClass("explode-circle");

});

$(".button_su_inner").mouseleave(function (e) {

  var parentOffset = $(this).offset();

  var relX = e.pageX - parentOffset.left;
  var relY = e.pageY - parentOffset.top;
  $(this).prev(".su_button_circle").css({ "left": relX, "top": relY });
  $(this).prev(".su_button_circle").removeClass("explode-circle");
  $(this).prev(".su_button_circle").addClass("desplode-circle");

});

async function initMap() {
  // Basic options for a simple Google Map
  // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  var mapOptions = {
    // How zoomed in you want the map to start at (always required)
    zoom: 16,

    // The latitude and longitude to center the map (always required)
    center: new google.maps.LatLng(1.3890426982460167, 103.89169817761369), // Singapore

    // Map ID
    mapId: "d7ac3c5d7416e46",
  };

  // Get the HTML DOM element that will contain your map 
  var mapElement = document.getElementById('map');

  // Create the Google Map using our element and options defined above
  map = new google.maps.Map(mapElement, mapOptions);

  // Set markers for each group
  // for (var i = 0; i < data.groups.length; i++) {
  //   let groupName = data.groups[i].name;

  //   newLength = markers.push(new google.maps.Marker({
  //     position: new google.maps.LatLng(data.groups[i].location1, data.groups[i].location2),
  //     map: map,
  //     title: groupName,
  //   }));

  //   // Set onClick to toggle collapsible
  //   markers[newLength - 1].addListener("click", () => {
  //     toggleCollapsible(groupName.replace(/\s/g, ''));
  //   });
  // }
  // Change the background color.
  plotMarkers(data);
}

$(document).ready(function () { initMap(); })

function plotTiles(data) {
  var listview = document.getElementById("listPlaces");
  listview.innerHTML = "";

  for (var i = 0; i < data.groups.length; i++) {
    // Set markers for each group
    var groupName = data.groups[i].name;
    var lat = data.groups[i].location1;
    var lng = data.groups[i].location2;
    var tags = data.groups[i].tags;
    var url = data.groups[i].url;

    // Add to list
    listview.innerHTML += '<button type="button" id="' + groupName.replace(/\s/g, '') + '" class="collapsible">' +
      '<span class="tab" id="' + groupName.replace(/\s/g, '') + "tags" + '">' + groupName;

    // Find above span to append tags to
    tagsList = document.getElementById(groupName.replace(/\s/g, '') + "tags")
    for (var x = 0; x < tags.length; x++) {
      // Append tags list
      tagsList.innerHTML += '<span class="badge badge-pill badge-primary tags">' + tags[x] + '</span>';
    }
    listview.innerHTML +=
      '</span>' +
      '</button>' +
      '<div class="content">' +
      '<div class="thumbnail">' +
      '<a target="_blank" href="' + url + '" > <img class="thumbnail"' +
      'src="https://lh5.googleusercontent.com/p/AF1QipOX83lE1UtNwXvb-QEW8WUbNkiJNUhzgTYGKY3f=w143-h143-n-k-no"></a>' +
      '</div>' +
      '<div class="info">' +
      '<h4>' + groupName + '</h4>' +
      '<p>' + "Lorem ipsum dolor sit amet" + '</p>' +
      '<a class="read-more" data-title="' + groupName + '" data-content="Lorem ipsum dolor sit amet">Read more</a>' +
      '</div>' +
      '</div>';
  }
}

function enableCollapsibles() {
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
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
  Array.from(tabs).forEach((tab) => {
    var content = tab.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
    tab.classList.remove("active");
  });

  for (var i = 0; i < tabs.length; i++) {
  }


  // Open collapsible
  target = document.getElementById(target);
  target.focus();
  target.classList.toggle("active");
  var content = target.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

function test() {
  data = {
    "groups": [
      {
        "name": "Nan Chiau Primary School",
        "location1": 1.392783042678911,
        "location2": 103.89042238234767,
        "url": "https://www.google.com.sg/maps/place/Nan+Chiau+Primary+School/@1.3926591,103.8909306,17.32z/data=!4m6!3m5!1s0x31da1672aa3d03b7:0x61801319b3a881a3!8m2!3d1.3926238!4d103.890428!16s%2Fg%2F11bc5lh1xz?entry=ttu",
        "tags": ["Disabled", "Elderly", "Children"]
      }
    ]
  }

  // Change the background color.
  const bluePinBg = new google.maps.marker.PinElement({
    background: "#0080FF",
    glyphColor: "white",
    borderColor: '#0080FF',
  });

  plotMarkers(data, bluePinBg);
}

async function plotMarkers(markersData, pinElement = null) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // Remove existing markers from the map
  markers.forEach(function (marker) {
    marker.setMap(null);
  });

  // Clear the markers array
  markers = [];

  // Plot new markers
  markersData.groups.forEach(function (data) {
    var marker = new AdvancedMarkerElement({
      position: new google.maps.LatLng(data.location1, data.location2),
      map: map,
      // icon: {
      //   url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      // },
      title: data.name,
      content: pinElement ? pinElement.element : null,
    });

    // if (pinElement != null) {
    //   marker.content = pinElement.element;
    // }

    newLength = markers.push(marker);

    // Set onClick to toggle collapsible
    markers[newLength - 1].addListener("click", () => {
      toggleCollapsible(data.name.replace(/\s/g, ''));
    });
  });

  // Amend list view with new data
  plotTiles(markersData);
  enableCollapsibles();
  initModals();
}


// Filter and search results
function filterSearch() {
  // Get references to the buttons and places
  const buttons = document.querySelectorAll('.button_su_inner');
  const places = document.querySelectorAll('.collapsible');
  const selectedTags = Array.from(buttons)
    .filter((button) => button.classList.contains('active'))
    .map((button) => button.querySelector('.button_text_container').textContent.toLowerCase());

  const searchInput = document.getElementById('searchInput');
  const searchText = searchInput.value.toLowerCase().trim();

  places.forEach((place) => {
    const placeTags = Array.from(place.querySelectorAll('.tags'))
      .map((tag) => tag.textContent.toLowerCase());

    const hasAllTags = selectedTags.every((tag) => placeTags.includes(tag));
    const hasSearchText = place.textContent.toLowerCase().includes(searchText);

    if (hasAllTags && hasSearchText) {
      place.style.display = 'block';
    } else {
      place.style.display = 'none';
    }
  });
  initModals();
}

function initModals() {
  // Get the modal element
  const modal = document.getElementById('myModal');

  // Get the <span> element that closes the modal
  const closeBtn = document.getElementsByClassName('close')[0];

  // Get the elements inside the modal
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  // Get all the "Read more" buttons
  const readMoreButtons = document.getElementsByClassName('read-more');

  // Add click event listeners to each "Read more" button
  Array.from(readMoreButtons).forEach(button => {
    button.addEventListener('click', function () {
      // Get the title and content from the button's data attributes
      const title = this.getAttribute('data-title');
      const content = this.getAttribute('data-content');

      // Set the modal title and content
      modalTitle.textContent = title; 
      modalContent.textContent = content;

      // Display the modal
      modal.style.display = 'block';
    });
  });

  // Add click event listener to the close button
  closeBtn.addEventListener('click', function () {
    // Hide the modal when the close button is clicked
    modal.style.display = 'none';
  });
}