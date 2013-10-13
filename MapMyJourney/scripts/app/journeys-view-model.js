var app = app || {};

(function(app) {
    var JourneyModel = kendo.data.Model.define({
        id: "id",
        fields: {
            "name": {
                type: "string",
                defaultValue:''
            },
            "startDate": {
                type: "date",
                nullable:true
            },
            "endDate": {
                type: "date",
                nullable:true
            }
        }
    });
    var serviceBaseUrl = "http://mapmyjourneywebapi.apphb.com/api/";
    
    var getJourneys = function() {
        var persister = Journeys.Data.getDataPersister(serviceBaseUrl);
        persister.journeys.getAll().then(function (result) {
            var journeysArr = [];
            
            for (var i = 0; i < result.length;i++) {
                var currentJourney = new JourneyModel({
                    id:result[i].Id,
                    name: result[i].Name,
                    startDate: result[i].StartDate,
                    endDate:result[i].EndDate
                });
                journeysArr.push(currentJourney);
            }
            
            viewModel.set("journeys", journeysArr); 
            console.log(journeysArr);
        }, function(err) {
            console.log(err.message);
            showError(err.message);
        });
    }
   
    function onJourneyTaped(e) {  
        console.log(e.data);
        var journeyId = e.data.id;
        app.mobileApp.navigate('views/places-view.html?id='+ journeyId);
    } 
    
    var viewModel = kendo.observable({
        journeys:[],
        getJourneys: getJourneys,
        selectedJourney:null,
        tap:onJourneyTaped
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        getJourneys();
    }  
    
    app.journeys = {
        init:init
    }
}
)(app);