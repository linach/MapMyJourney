var app = app || {};

(function(app) {
    var NewPlaceModel = kendo.data.Model.define({
        id: "id",
        fields: {
            "Name": {
                type: "string",
                defaultValue:''
            },
            "StartDate":{
                type:"date",
                nullable:true
            },
            "EndDate":{
                type:"date",
                nullable: true
            }
        }
    });
    
    var serviceBaseUrl = "http://mapmyjourneywebapi.apphb.com/api/";
    
    var addNewJourney = function() {
        var persister = Journeys.Data.getDataPersister(serviceBaseUrl);
        var name= $("#journeyNameInput").val();
        var date=$('#startDateInput').val();
        var newJourneyModel=new NewPlaceModel({
            Name:name,
            StartDate:date            
        });
        
        persister.journeys.addNew(newJourneyModel).then(function (result) {
            app.mobileApp.navigate('views/journeys-view.html#journeys-view');
        }, function(err) {
            console.log(err.message);
            showError(err.message);
        });
    }
    
    var viewModel = kendo.observable({
        addNewJourney: addNewJourney,
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
    }  
    
    app.newJourney = {
        init:init
    }
}
)(app);