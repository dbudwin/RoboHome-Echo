var https = require("https");
var querystring = require("querystring");

var ROBOHOME_WEB_HOSTNAME = "robohome.xyz";

const DISCOVERY = "Alexa.ConnectedHome.Discovery";
const CONTROL = "Alexa.ConnectedHome.Control";
const PAYLOAD_VERSION = "2";

exports.handler = function(event, context) {
    var namespace = event.header.namespace;

    switch (namespace) {
        case DISCOVERY:
            handleDiscovery(event, context);
            break;
        case CONTROL:
            handleControl(event, context);
            break;
        default:
            context.fail("Unsupported namespace: " + namespace);
            break;
    }
};

function handleDiscovery(event, context) {
    var requestName = event.header.name;
    var messageId = event.header.messageId;
    var accessToken = event.payload.accessToken;

    log("Request Name", requestName);
    log("Message ID", messageId);
    log("Access Token", accessToken);

    createApiEndpointRequest("/api/devices", "GET", "", messageId, accessToken, context);
}

function handleControl(event, context) {
    var requestName = event.header.name;
    var messageId = event.header.messageId;
    var applianceId = event.payload.appliance.applianceId;
    var accessToken = event.payload.accessToken;

    log("Request Name", requestName);
    log("Message ID", messageId);
    log("Appliance ID", applianceId);
    log("Access Token", accessToken);

    var postData = querystring.stringify({
        "id": applianceId
    });

    if (event.header.namespace === CONTROL) {
        if (requestName === "TurnOnRequest") {
            createApiEndpointRequest("/api/devices/turnon", "POST", postData, messageId, accessToken, context);
        }
        else if (requestName === "TurnOffRequest") {
            createApiEndpointRequest("/api/devices/turnoff", "POST", postData, messageId, accessToken, context);
        }
    }
    else {
        context.fail(generateControlError(requestName, "UNSUPPORTED_OPERATION", "Unrecognized operation"));
    }
}

function createApiEndpointRequest(endpoint, verb, postData, messageId, accessToken, context) {
    var options = {
        hostname: ROBOHOME_WEB_HOSTNAME,
        port: 443,
        path: endpoint,
        method: verb,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + accessToken,
            "Message-Id": messageId
        }
    };

    var callback = function(response) {
        var str = "";

        response.on("data", function(chunk) {
            str += chunk.toString("utf-8");
        });

        response.on("end", function() {
            context.succeed(JSON.parse(str));
        });

        response.on("error", serverError);
    };

    var request = https.request(options, callback);
            
    request.on("error", serverError);
    request.write(postData);
    request.end();
}

function log(title, msg) {
    console.log(title + ": " + msg);
}

var serverError = function (e) {
    log("Error", e.message);
    context.fail(generateControlError(requestName, "DEPENDENT_SERVICE_UNAVAILABLE", "Unable to connect to server"));
};

function generateControlError(name, code, description) {
    var headers = {
        namespace: CONTROL,
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