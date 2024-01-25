function initMap() {

  //this init map code has a base using code from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox however this code required significant modification to work as intended 
    "code piece 1"
    // code piece 1, this is part mine part from the above link, parts that are mine will be outlined in the comments

    //creates the map const and sets the center and zoom amounts, this was customised by me
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -27.4972951, lng: 153.0155606},  
      zoom: 18
    });
    
    //this code is from the exmaple link, it creates the search box and puts it on the map
    var input = document.getElementById('searchInput');

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    //this binds some automatic functions to a listener in the search box
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    //this code adds the market on the map and sets the anchor point
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    //activates the search box when the user interacts with it, adding the expanding tha pac-card
    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        //this code gets a defined location from the autocomplete google api, 
        
        var place = autocomplete.getPlace();
        
        //this code manufacues the api request to informaiton about the location
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        // set the map market location to the middle the map and adds the icon to it
        marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        
        //this code is similar to the reference, it take sthe parts from the address street, city, country and puts them together
        var address = '';
        
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        //this code 
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
        
        //this code is mine, it set the values used in the get request to googple api and then calls the callback function with the information from the request  
        var request = {
            location: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
            radius: '500',
            type: ['restaurant']
          };
          
          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, callback);
    });


    function callback(results, status) {

      //this code was created by me, it is used to create the list of restaurants
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          document.getElementById('restaurant-list').innerHTML = "";
          for (var i = 0; i < results.length; i++) {  
            create_li_restaurants(results[i].name, results[i].geometry.location.lat(), results[i].geometry.location.lng(), results[i].vicinity)
          }
        }}
    }

    
    
    function create_li_restaurants(name, lat, lng, address) {
      "code piece 2"
      //this code was created by me, it is used to create the list of restaurants to add the li_retaurants to the ul_restaurants
      //creates the elements 
      var li = document.createElement('li');
      var a = document.createElement('a');
      var div_container = document.createElement('div');
      var h1_name = document.createElement('h1'); 
      var p_lat = document.createElement('p');
      var p_lon = document.createElement('p');

      //sets the attributes for the elements
      //this a attribute stores the name, lat, lng and address in the url for the review page for later usage in the review page
      a.setAttribute('href', 'review.html' + '?name=' + name + '&lat=' + lat + '&lng=' + lng + '&address=' + address);
      li.setAttribute('class', 'restaurant');
      h1_name.setAttribute('class', 'list-name');
      p_lat.setAttribute('class', 'list-lat');
      p_lon.setAttribute('class', 'list-lon');
      
      //sets the inner html for the elemeents
      h1_name.innerHTML = name + " - " + address;
      p_lat.innerHTML = "Latitude: " + lat;
      p_lon.innerHTML = "Longitude: " + lng;


      //places akk the elements in parent div
      div_container.appendChild(h1_name);
      div_container.appendChild(p_lat);
      div_container.appendChild(p_lon);


      //does the rest of the manufcaturing of the element and adds it to the li 
      a.appendChild(div_container);
      li.appendChild(a);
      document.getElementById('restaurant-list').appendChild(li);
       
        
    }

"code piece 3" //for the sake of simplicity get_user, check_login, register_account, logout should be in the same code piece  as they are all related to the same thing

//gets the current user from local storage, if there is no user it sets the user to guest
//starts on every page, on the load of the account image
function get_user() {
    document.getElementById("account_name").innerHTML = localStorage.getItem('CurrentUser');
    if (localStorage.getItem('CurrentUser') == null) {
        document.getElementById("account_name").innerHTML = "Guest";
      
    }
    //this function is also user for retreiving the current user in the review page
    return localStorage.getItem('CurrentUser') ;
}

//this function is user to check login details 
function check_login() {
  username = document.getElementById('username_entry').value;
  password = document.getElementById('password_entry').value;
  //chckes the entires against the local storage, alerts the user if the details are incorrect
  if (localStorage.getItem(username) == null || localStorage.getItem(username) != password) {
      alert("username or password incorrect");
      username.value = "";
      password.value = "";
      return 
  } 
  
  //updates teh current user and redirects the user to the index page
  localStorage.setItem('CurrentUser', username);
  console.log(localStorage.getItem('CurrentUser'));
  location.href = "index.html";
  
} 

//this creates the responsive password and username requirements on the register page 
function register_init() {
  username = document.getElementById('username_entry') 
  password = document.getElementById('password_entry')
  console.log(username)
  //both of these dom listerns add to a li below their respective inut boxes
  username.addEventListener('input', function() {
    username = document.getElementById('username_entry').value;
    errors = document.getElementsByClassName('errors_username')[0];
    
    errors.innerHTML = "";
    if (username.length < 7) {
      var li = document.createElement('li');
    li.innerHTML = "username must be at least 7 characters";
    errors.appendChild(li);}
      

    if (username.length > 12) {
      var li = document.createElement('li');
      li.innerHTML = "username must be less than 12 characters";
      errors.appendChild(li);
    }
    console.log(errors)
  });

  password.addEventListener('input', function() {
    document.getElementById('password_entry')
    errors = document.getElementsByClassName('errors_password')[0];
    errors.innerHTML = "";

    if(password.value.length < 7) {
      li = document.createElement('li');
      li.innerHTML = "password must be at least 7 characters";
      errors.appendChild(li);
    }

    if (! (/[A-Z]/.test(password.value))) {
      li = document.createElement('li');
      li.innerHTML = "password must contain at least one uppercase letter";
      console.log(li, "capital")
      errors.appendChild(li);
    }

    if  (! ((/[0-9]/.test(password.value)))) {
      li = document.createElement('li');
      li.innerHTML = "password must contain at least one number";
      errors.appendChild(li);
    }


  })

}

function register_account() {
  username = document.getElementById('username_entry').value;
  password = document.getElementById('password_entry').value;

  //checks that the account length is atleast 7 characters
  // less then 15 characters
  // has a capital letter
  // has a number
  //these are here becuase the responsive checks are a warning 


  if (localStorage.getItem(username) != null) {
    alert("username already exists");
    return
  }

  if (username.length > 12) {
    alert("username must be less than 15 characters");
    return
  }

  if (username.length < 7 ) {
    alert("username must be at least 7 characters");
    return
  }


  if(password.value.length < 7) {
    alert("password must be a least 7 characters")
    return }
    

  if (! /[A-Z]/.test(password)) {
    alert("password must contain at least one uppercase letter");
    return
  }

  if (! ( /[0-9]/.test(password))) {
    alert("password must contain at least one number");
    return
  }

  localStorage.setItem(username, password);
  localStorage.setItem('CurrentUser', username);
  location.href = "index.html";}


  

  
//logs the user out and sets the current user to guest
function logout() {
      localStorage.setItem('CurrentUser', 'Guest');
      console.log(localStorage.getItem('CurrentUser'));
      get_user();
}

//write a review javascipt 
//this code was made using he exmaple from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox as such it is not my code, however while there was some small changes
//the code was mostly left as is, the code is used to create the search box and the markers on the map
//please count this as a plugin
function initAutocomplete() {
    //this code is creating the map, however this map is not shown, it is virtual for the search box
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
      mapTypeId: "roadmap",
    });


    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
  
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport. and sets the bounds for the map 
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
    // for setting markers in the automcomplete output
    let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }

      // these lines of code put the lat and lon values on the page
     document.getElementById("latitude").textContent = "Latitude: " + places[0].geometry.location.lat();
     document.getElementById("latitude").value = places[0].geometry.location.lat();
     document.getElementById("longitude").textContent = "Longitude: " + places[0].geometry.location.lng();
     document.getElementById("longitude").value = places[0].geometry.location.lng();
  
      // Clears old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
      
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        // Creates a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
      
    });
  }


// this code is from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox however this code required significant modification to work as intended especially with the lat and lon values, 
"code piece 4"
function get_written_review() {
  // these lines of variables get all the values from the write a review page for usage in the add review function
    var location = document.getElementById('pac-input').value;
    var stars = document.getElementById('stars').value;
    var review_description = document.getElementById('restaurant-review').value;
    var review_food = document.getElementById('review-food').value;
    var lat = document.getElementById('latitude').value;
    var lon = document.getElementById('longitude').value;

    addReview(lat, lon, location, get_user(), stars, review_description, review_food);
}
  

//create the review and adds it to the system 
function addReview(lat, lon, locationName, user, stars, review, review_food) {
    // Create a review array

    
    let newReview = [locationName, stars, user, review, review_food];

    // Create a key for the review
    let key = lat + ',' + lon;
    

    // Check if 'reviews' exists in local storage
    
    if(localStorage.getItem('reviews') === null) {
        // If not, create an object and add the new review
        let reviews = {};
        reviews[key] = [newReview];
        localStorage.setItem('reviews', JSON.stringify(reviews));
    } else {
        // If it exists, retrieve the existing reviews
        let reviews = JSON.parse(localStorage.getItem('reviews'));
        // Check if the location already has reviews
        if(reviews[key]) {
            // If it does, just push the new review
            reviews[key].push(newReview);
        } else {
            // If it doesn't, create a new array for this location
            reviews[key] = [newReview];
        }
        localStorage.setItem('reviews', JSON.stringify(reviews));
        location.href = "index.html";
    }
}


"code piece 5"

// get the review subject from the url bar using split 
function get_review_subject() {
    var parmameters = [];
    var PageURL = window.location.search.substring(1);
    //splits the url into the values location=, lat=, lng=, address=
    var URL_split = PageURL.split('&');

    // splits the values into the values location, lat, lng, address
    for (var i = 0; i < URL_split.length; i++) 
    {
        var sParameterName = URL_split[i].split('=');
        parmameters.push(sParameterName[1]);
    }
    return parmameters; 
}


//handles the manufcaturing of reviews 
function display_reviews() {
    review_subject = get_review_subject();


    // this code gets the reviews from local storage
    var reviews = JSON.parse(localStorage.getItem('reviews'));
    key = review_subject[1] + ',' + review_subject[2];

    // this code checks if there are reviews for the location, if there are no reviews it returns
    var reviews = reviews[key];
    if (reviews == undefined) {
        return
    }


    //manufacturing of the entire review section
    list = document.getElementById('reviewsContainer');
    // this section manufactures the reviews using html in javascript
    for(var i = 0; i < reviews.length; i++) {

      // these variables are the containers
      var div = document.createElement('div');
      var li = document.createElement('li');
      var information = document.createElement('div');

      //outside information elements 
      var user_heading = document.createElement('h3');
      var stars = document.createElement('p');

      // inside information elements
      var review_heading_b = document.createElement('h4');
      var review = document.createElement('p');
      var review_heading_f = document.createElement('h4');
      var review_food = document.createElement('p');
        
      //sets the values for the review
      review_heading_b.innerHTML = "how was the restaurant?"; 
      review.innerHTML = review_subject[3];
      review_heading_f.innerHTML = "how was the food?";
      console.log(review_subject[3])
      
      // sets the attributes for the css
      user_heading.setAttribute('class', 'user');
      review_heading_b.setAttribute('class', 'review-heading');
      review.setAttribute('class', 'information');
      review_heading_f.setAttribute('class', 'review-heading');
      review_food.setAttribute('class', 'information');
      stars.setAttribute('class', 'stars');

      information.appendChild(review_heading_b);
      information.appendChild(review);
      information.appendChild(review_heading_f);
      information.appendChild(review_food);

      information.setAttribute('class', 'information-container');

      // set personalised information 
      if (reviews[i][2] == null) {
          reviews[i][2] = 'Guest';
      }

      // sets the dynamic values for the review
      user_heading.innerHTML = reviews[i][2];

      review.innerHTML = reviews[i][3];

      review_food.innerHTML = reviews[i][4];

      stars.innerHTML = reviews[i][1] + ' stars';
      
      //puts all the values together to form the review 
      div.setAttribute('class', 'review');
      div.appendChild(user_heading);
      div.appendChild(information);
      div.appendChild(stars);
      li.appendChild(div);
      list.appendChild(li);
      }
};















