var app = app || {};

(function(app) {
    var NewPlaceModel = kendo.data.Model.define({
        id: "id",
        fields: {
            "Name": {
                type: "string",
                defaultValue:''
            },
            "Latitude":{
                type:"number",
                defaultValue: 0.0
            },
            "Longitude":{
                type:"number",
                defaultValue: 0.0
            },
            "Picture": {
                type: "string",
                defaultValue:''
            },
            "Comment": {
                type: "string",
                defaultValue:''
            },
        }
    });
    
    var serviceBaseUrl = "http://mapmyjourneywebapi.apphb.com/api/";
    
    var addNewPlace = function() {
        
        window.cordovaExt.getLocation().
        then(function(location) {
            var latitude = location.coords.latitude;
            var longitude = location.coords.longitude;
            var name = $("#placeNameInput").val();
            var picture = $("#new-place-pic").attr("src");
            var comment = $("#placeCommentInput").val()
            var newPlaceModel = new NewPlaceModel({
                Name:name,
                Latitude:latitude,
                Longitude:longitude,
                Picture:picture,
                Comment:comment
            });
            var persister = Journeys.Data.getDataPersister(serviceBaseUrl);
            persister.places.addNew(viewModel.currentJourneyId, newPlaceModel).then(function (result) {
                 app.mobileApp.navigate('views/places-view.html?id='+ viewModel.currentJourneyId);
            }, function(err) {
                console.log(err.message);
                showError(err.message);
            });
        });
    }
    
    var takePicture = function() {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50
        });

        function onSuccess(imageURI) {
            $("#new-place-pic").attr("src", imageURI);
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    }
    
    var viewModel = kendo.observable({
        places:[],
        addNewPlace: addNewPlace,
        takePicture:takePicture,
        currentJourneyId:0
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        viewModel.currentJourneyId = e.view.params.id;
    }  
    
    app.addPlaces = {
        init:init
    }
}
)(app);