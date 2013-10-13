var Journeys = Journeys || {};

Journeys.Data = (function () {
    var DataPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;

            this.user = new UsersPersister(serviceRootUrl + "users/");
            this.journeys = new JourneysPersister(serviceRootUrl + "journeys/");
            this.places = new PlacesPersister(serviceRootUrl + "places/");
        },

        isUserLoggedIn: function () {
            return this.user.isUserLoggedIn();
        }
    });

    var UsersPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;
        },

        _getAuthToken: function () {
            return localStorage.getItem("authToken");
        },

        _getDisplayname: function () {
            return localStorage.getItem("displayname");
        },

        _getUsername: function() {
            return localStorage.getItem("username");
        },

        _setAuthToken: function (value) {
            localStorage.setItem("authToken", value);
        },

        _setDisplayname: function (value) {
            this.nickname = value;
            localStorage.setItem("displayname", value);
        },

        _setUsername: function(value) {
            this.username = value;
            localStorage.setItem("username", value);
        },

        _clearAuthToken: function () {
            localStorage.removeItem("authToken");
        },

        _clearDisplayname: function () {
            localStorage.removeItem("displayname");
        },

        _clearUsername: function() {
            localStorage.removeItem("username");
        },

        register: function (username, nickname, password) {
            var self = this;

            return HttpRequester.postJson(this.serviceRootUrl + "register", "", {
                Username: username,
                Displayname: nickname,
                AuthCode: CryptoJS.SHA1(password).toString(),
            }).then(function (result) {
                self._setAuthToken(result.AuthToken);
                self._setDisplayname(result.Displayname);
                self._setUsername(username);
            }, function(err) {
                console.log(err.message)
            });
        },

        login: function (username, password) {
            var self = this;

            return HttpRequester.postJson(this.serviceRootUrl + "login", "", {
                Username: username,
                AuthCode: CryptoJS.SHA1(password).toString(),
            }).then(function (result) {
                self._setAuthToken(result.AuthToken);
                self._setDisplayname(result.Displayname);
                self._setUsername(username);
            }, function(err) {
                console.log(err.message)
            });
        },

        logout: function () {
            var self = this;

            return HttpRequester.putJson(this.serviceRootUrl + "logout/", this._getAuthToken())
            .then(function () {
                self._clearAuthToken();
                self._clearDisplayname();
                self._clearUsername();
            });
        },

        isUserLoggedIn: function () {
            return (this._getDisplayname() !== null);
        },

        getCurrentUserData: function () {
            return {
                username: this._getUsername(),
                nickname: this._getDisplayname(),
                sessionKey: this._getAuthToken()
            }
        }
    });

    var JourneysPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;
        },

        getAll: function () {
            var authToken = localStorage.getItem("authToken");
            return HttpRequester.getJson(this.serviceRootUrl + "all", authToken);
        },

        addNew: function (newJourney) {
            var authToken = localStorage.getItem("authToken");
            return HttpRequester.postJson(this.serviceRootUrl + "new", authToken, newJourney)
        }
    });

    var PlacesPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;
        },

        getAll: function (journeyId) {
            var authToken = localStorage.getItem("authToken");
            return HttpRequester.getJson(this.serviceRootUrl + "all?journeyId=" + journeyId, authToken);
        },
        
        addNew:function(journeyId, newPlace){
            var authToken= localStorage.getItem("authToken");
            return HttpRequester.postJson(this.serviceRootUrl+ "new?journeyId="+ journeyId, authToken, newPlace);
            
        }
    });
    
    return {
        getDataPersister: function (serviceRootUrl) {
            return new DataPersister(serviceRootUrl);
        }
    }
}())