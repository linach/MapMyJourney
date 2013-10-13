var app = app || {};

(function(app) {
    var map;
    
    var PlaceModel = kendo.data.Model.define({
        id: "id",
        fields: {
            "name": {
                type: "string",
                defaultValue:''
            },
            "picture": {
                type:"string",
                defaultValue:''
            },
            "latitude":{
                type:"number",
                defaultValue:0.0
            },
            "longitude":{
                type:"number",
                defaultValue:0.0
            },
            "comment":{
                type:"string",
                defaultValue:""
            }
        }
    });
    var serviceBaseUrl = "http://mapmyjourneywebapi.apphb.com/api/";
    var getPlaces = function(journeyId) {
        var persister = Journeys.Data.getDataPersister(serviceBaseUrl);
        persister.places.getAll(journeyId).then(function (result) {
            var placesArr = [];
            
            for (var i = 0; i < result.length;i++) {
                var currentPlace = new PlaceModel({
                    id:result[i].Id,
                    name: result[i].Name,
                    picture:result[i].Picture,
                    latitude:result[i].Latitude,
                    longitude:result[i].Longitude,
                    comment:result[i].Comment
                });
                placesArr.push(currentPlace);
            }
            
            viewModel.set("places", placesArr); 
            console.log(placesArr);
        }, function(err) {
            console.log(err.message);
            showError(err.message);
        });
    }
   
    function onPlaceTaped(e) {             
        viewModel.selectedPlace = e.data;
        var info = "id" + e.data.id + "name" + e.data.name + "latitude" + e.data.latitude + "longitude" + e.data.longitude 
                   + "picture" + e.data.picture + "comment" + e.data.comment
        app.mobileApp.navigate('views/detail-place-view.html#detail-place-view?place=' + info);
    } 
    
    var navigateToAddPlace = function(e) {
        app.mobileApp.navigate('views/add-place-view.html#add-place-view?id=' + viewModel.currentJourneyId);
    }
    
    var viewModel = kendo.observable({
        places:[],
        getPlaces: getPlaces,
        selectedPlace:null,
        currentJourneyId:0,
        tap:onPlaceTaped,
        navigateToAddPlace:navigateToAddPlace
    });
    
    var initalize = function() {
        var connectionType = navigator.connection.type;
        if (connectionType == Connection.WIFI || connectionType == Connection.CELL_4G || connectionType == Connection.CELL_3G) {
            var latlng = new google.maps.LatLng(43.3, 23);
    
            var mapOptions = {
                sensor: true,
                center: latlng,
                panControl: false,
                zoomControl: true,
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                mapTypeControl: false,
            };
    
            map = new google.maps.Map(
                document.getElementById('map-canvas'),
                mapOptions
                );
        }
        else {
            document.getElementById('map-canvas').innerText = "Bad connection!"
        }
    }
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        viewModel.currentJourneyId = e.view.params.id;
        getPlaces(viewModel.currentJourneyId);
    }  
    
    function viewRoute() {
        var connectionType = navigator.connection.type;
        if (connectionType == Connection.WIFI || connectionType == Connection.CELL_4G || connectionType == Connection.CELL_3G) {
            google.maps.event.trigger(map, "resize");
            map.setCenter(new google.maps.LatLng(viewModel.places[0].latitude, viewModel.places[0].longitude));
        
            for (var j = 0; j < viewModel.places.length; j++) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(viewModel.places[j].latitude, viewModel.places[j].longitude),
                    map: map
                });
            }
        }
        else {
            document.getElementById('map-canvas').innerText = "Bad connection!"
        }
    }
    
    app.places = {
        init:init,
        viewRoute:viewRoute,
        initalize:initalize
    }
}
)(app);