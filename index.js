var https = require("https");
var querystring = require("querystring");

var ROBOHOME_WEB_HOSTNAME = "robohome.xyz";
var ROBOHOME_WEB_PORT = "443";

const PAYLOAD_VERSION = "3";

exports.handler = function(request, context) {
    if (request.directive.header.namespace === "Alexa.Discovery" && request.directive.header.name === "Discover") {
        handleDiscovery(request, context, "");
    } else if (request.directive.header.namespace === "Alexa.PowerController") {
        handlePowerControl(request, context);
    } else {
        log("Error", "Unsupported Namespace Request",  request.directive.header.namespace);
        context.fail(generateControlError(request.directive.header.name, "UNSUPPORTED_OPERATION", "Unrecognized operation"));
    }
};

function handleDiscovery(request, context) {
    log("Info", "Discover Request", JSON.stringify(request));

    var messageId = request.directive.header.messageId;
    var authorizationToken = request.directive.payload.scope.token;

    createApiEndpointRequest("/api/devices", "GET", "", messageId, authorizationToken, context);
}

function handlePowerControl(request, context) {
    log("Info", "PowerController Request", JSON.stringify(request));

    var requestName = request.directive.header.name;
    var messageId = request.directive.header.messageId;
    var authorizationToken = request.directive.endpoint.scope.token;
    var endpointId = request.directive.endpoint.endpointId

    var postData = querystring.stringify({
        "publicDeviceId": endpointId
    });

    if (requestName === "TurnOn") {
        createApiEndpointRequest("/api/devices/control/turnon", "POST", postData, messageId, authorizationToken, context);
    } else if (requestName === "TurnOff") {
        createApiEndpointRequest("/api/devices/control/turnoff", "POST", postData, messageId, authorizationToken, context);
    } else {
        log("Error", "Unsupported PowerController Directive", request.directive.header.name);
    }
}

function createApiEndpointRequest(endpoint, verb, postData, messageId, authorizationToken, context) {
    var options = {
        hostname: ROBOHOME_WEB_HOSTNAME,
        port: ROBOHOME_WEB_PORT,
        path: endpoint,
        method: verb,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + authorizationToken,
            "Message-Id": messageId
        }
    };

    var callback = function(response) {
        var responseString = "";

        response.on("data", function(chunk) {
            responseString += chunk.toString("utf-8");
        });

        response.on("end", function() {
            context.succeed(JSON.parse(responseString));
        });

        response.on("error", serverError);
    };

    var request = https.request(options, callback);
            
    request.on("error", serverError);
    request.write(postData);
    request.end();
}

function log(type, title, message) {
    console.log(type + " (" + title + "): \"" + message + "\"");
}

var serverError = function (e) {
    log("Error", "Server Error", e.message);
    context.fail(generateControlError(requestName, "DEPENDENT_SERVICE_UNAVAILABLE", "Unable to connect to server"));
};

function generateControlError(name, code, description) {
    var headers = {
        namespace: "Alexa.PowerController",
        name: name,
        payloadVersion: PAYLOAD_VERSION
    };

    var payload = {
        exception: {
            code: code,
            description: description
        }
    };

    var result = {
        header: headers,
        payload: payload
    };

    return result;
}