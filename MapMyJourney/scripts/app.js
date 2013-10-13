var app=app|| {};
(function(){
    var showAlert = function(message, title, callback) {
		navigator.notification.alert(message, callback || function () {
		}, title, 'OK');
	};
	var showError = function(message) {
        console.log(message);
		showAlert(message, 'Error occured');
	};
	window.addEventListener('error', function (e) {
		e.preventDefault();
		var message = e.message + "' from " + e.filename + ":" + e.lineno;
        console.log(message);
		showAlert(message, 'Error occured');
		return true;
	});
    
    document.addEventListener("deviceready", function(){
        var kendoApp= new kendo.mobile.Application(document.body);
        app.mobileApp= kendoApp;
    });
    
   app.showError=showError;
  
})();