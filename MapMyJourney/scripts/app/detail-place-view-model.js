var app = app || {};

(function(app) {
    var PlaceModel = kendo.data.Model.define({
        id: "id",
        fields: {
            "name": {
                type: "string",
                defaultValue:'some'
            },
            "latitude":{
                type:"number",
                defaultValue: 0.0
            },
            "longitude":{
                type:"number",
                defaultValue: 0.0
            },
            "picture": {
                type: "string",
                defaultValue:''
            },
            "comment": {
                type: "string",
                defaultValue:''
            },
        }
    });
  
    var shareToFacebook = function() {
        var msgToPost = viewModel.currentPlace.name+"\n"+ viewModel.currentPlace.comment;
        var pictureToPost = viewModel.currentPlace.picture;
        makefbPost(msgToPost, pictureToPost);
    }
    
    function makefbPost(FBmessage, FBpicture) {
        $.oajax({
            type: "POST",
            url: "https://graph.facebook.com/me/feed",
            jso_provider: "facebook",
            jso_scopes: ["read_stream", "publish_stream"],
            jso_allowia: true,
            dataType: 'json',
            data: {
                message: FBmessage,
            },
            success: function (responseData) {
                navigator.notification.alert("Status Posted", function () {
                }, "DebugMode", "Done");
            },
            error: function (errorData) {
                navigator.notification.alert("Error encountered. Details:" + errorData.message, function () {
                }, "Error", "Done");
            }
        });
    }
   
    var viewModel = kendo.observable({
        currentPlace:new PlaceModel({}),
        shareToFacebook: shareToFacebook,
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        var place = e.view.params.place;
        var nameIndex = place.indexOf("name");
        var latitudeIndex = place.indexOf("latitude");
        var longitudeIndex = place.indexOf("longitude");
        var pictureIndex = place.indexOf("picture");
        var commentIndex = place.indexOf("comment");
        
        var name = place.substring(nameIndex + 4, latitudeIndex);
        var latitude = place.substring(latitudeIndex + 8, longitudeIndex);
        var longitude = place.substring(longitudeIndex + 9, pictureIndex);
        var picture = place.substring(pictureIndex + 7, commentIndex);
        var comment = place.substring(commentIndex + 7);
        
        viewModel.set("currentPlace.name", name);
        viewModel.set("currentPlace.latitude", parseFloat(latitude));
        viewModel.set("currentPlace.longitude", parseFloat(longitude));
        viewModel.set("currentPlace.picture", picture);
        viewModel.set("currentPlace.comment", comment);
        
        var inAppBrowserRef;
        var debug = true;
        
        jso_registerRedirectHandler(function(url) {
            inAppBrowserRef = window.open(url, "_blank");
            inAppBrowserRef.addEventListener('loadstop', function(e) {
                LocationChange(e.url)
            }, false);
        });
        
        function LocationChange(url) {
            url = decodeURIComponent(url);

            jso_checkfortoken('facebook', url, function() {
                inAppBrowserRef.close();
            });
        };

        /*
        * Configure the OAuth providers to use.
        */
        jso_configure({
            "facebook": {
                client_id: "742107939139715",
                redirect_uri: "http://www.facebook.com/connect/login_success.html",
                authorization: "https://www.facebook.com/dialog/oauth",
                presenttoken: "qs"
            }
        }, {"debug": debug});
    
        // jso_dump displays a list of cached tokens using outputlog if debugging is enabled.
        jso_dump();
    }  
    
    app.detailPlace = {
        init:init
    }
}
)(app);