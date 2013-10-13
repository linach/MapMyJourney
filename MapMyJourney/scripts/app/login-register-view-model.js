var app = app || {};

(function(app) {
    var init = function() {
        var authToken = localStorage.getItem("authToken");
        if (authToken) {
            app.mobileApp.navigate('views/journeys-view.html#journeys-view');
        }
        else {
            app.mobileApp.navigate('views/login-view.html#login-view');
        }     
    }
    
    var serviceBaseUrl = "http://mapmyjourneywebapi.apphb.com/api/";
    var login = function () {
        var username = $('#usernameInput').val();
        var password = $('#passwordInput').val();
        
        var persister = Journeys.Data.getDataPersister(serviceBaseUrl);
        persister.user.login(username, password)
        .then(function () {
            $('#usernameInput').val("");
            $('#passwordInput').val("");
            app.mobileApp.navigate('views/journeys-view.html#journeys-view');
             $("#logout-btn").show();
        }, function() {
            console.log(err.message);
            showError(err.message);
        });
    };
    
    var register = function () {
        var username = $('#usernameInputRegister').val();
        var displayname = $('#displaynameInput').val(); 
        var password = $('#passwordInputRegister').val();
        
        var persister = Journeys.Data.getDataPersister(serviceBaseUrl);
        persister.user.register(username, displayname, password).then(function () {
            $('#usernameInputRegister').val("");
            $('#displaynameInput').val(""); 
            $('#passwordInputRegister').val("");
            app.mobileApp.navigate('views/journeys-view.html#journeys-view');
            $("#logout-btn").show();
        }, function() {
            console.log(err.message);
            showError(err.message);
        });
    };
    
    var logout = function() {
        var persister = Journeys.Data.getDataPersister(serviceBaseUrl);
        persister.user.logout().then(function () {
             $("#logout-btn").hide();
            app.mobileApp.navigate('views/login-view.html#login-view');
           
        }, function() {
            console.log(err.message);
            showError(err.message);
        });
    };
    
    app.loginRegister = {
        init:init,
        register:register,
        login:login,
        logout:logout
    }
})(app);