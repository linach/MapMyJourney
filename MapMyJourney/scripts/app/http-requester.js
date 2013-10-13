window.HttpRequester = (function () {
    var promiseAjaxRequest = function (url, type, authToken, data) {
        var promise = new RSVP.Promise(function(resolve, reject){
            if (data) {
                data = JSON.stringify(data);
            }

            $.ajax({
                url: url,
                type: type,
                data: data,
                contentType: "application/json",
                headers:{ 'X-authToken' : authToken },
                success: function (responseData) {
                   resolve(responseData);
                },
                error: function (errorData) {
                    reject(errorData);
                }
            });
        });


        return promise;
    }

    var promiseAjaxRequestGet = function (url, authToken) {
        return promiseAjaxRequest(url, "get", authToken);
    }

    var promiseAjaxRequestPost = function (url, authToken, data) {
        return promiseAjaxRequest(url, "post", authToken, data);
    }

    var promiseAjaxRequestPut = function(url, authToken, data) {
        return promiseAjaxRequest(url, "put", authToken, data);
    }
    return {
        getJson: promiseAjaxRequestGet,

        postJson: promiseAjaxRequestPost,
        
        putJson:promiseAjaxRequestPut
    }
}())