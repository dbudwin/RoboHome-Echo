var https = require("https");
var querystring = require("querystring");

var REMOTE_CLOUD_HOSTNAME = "budw.in";
var REMOTE_CLOUD_BASE_PATH = "/RoboHome/api/devices";

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

    var serverError = function (e) {
        log("Error", e.message);
        context.fail(generateControlError(requestName, "DEPENDENT_SERVICE_UNAVAILABLE", "Unable to connect to server"));
    };

    var callback = function(response) {
        var str = "";

        response.on("data", function(chunk) {
            str += chunk.toString("utf-8");
        });

        response.on("end", function() {
            var result = generateResult(DISCOVERY, "DiscoverAppliancesResponse", messageId, str);

            context.succeed(result);
        });

        response.on("error", serverError);
    };

    createApiEndpointRequest("devices", "", callback, accessToken, serverError);
}

function handleControl(event, context) {
    var requestName = event.header.name;
    var messageId = event.header.messageId;
    var applianceId = event.payload.appliance.applianceId;
    var accessToken = event.payload.accessToken;

    log("Request Name", requestName);
    log("Message ID", messageId);
    log("Appliance ID", applianceId)
    log("Access Token", accessToken);

    if (event.header.namespace === CONTROL && requestName === "TurnOnRequest") {
        var postData = querystring.stringify({
            "id": applianceId
        });

        var serverError = function (e) {
            log("Error", e.message);
            context.fail(generateControlError(requestName, "DEPENDENT_SERVICE_UNAVAILABLE", "Unable to connect to server"));
        };

        var callback = function(response) {
            var str = "";

            response.on("data", function(chunk) {
                str += chunk.toString("utf-8");
            });

            response.on("end", function() {
                var result = generateResult(CONTROL, requestName.replace("Request", "Confirmation"), messageId, str);

                context.succeed(result);
            });

            response.on("error", serverError);
        };

        createApiEndpointRequest("turnon", postData, callback, accessToken, serverError);
    }
    else {
        context.fail(generateControlError(requestName, "UNSUPPORTED_OPERATION", "Unrecognized operation"));
    }
}

function createApiEndpointRequest(endpoint, postData, callback, accessToken, serverError) {
    var options = {
        hostname: REMOTE_CLOUD_HOSTNAME,
        port: 443,
        path: REMOTE_CLOUD_BASE_PATH + "/" + endpoint,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + accessToken
        }
    };

    var request = https.request(options, callback);
            
    request.on("error", serverError);
    request.write(postData);
    request.end();
}

function generateResult(namespace, responseName, messageId, payload) {
    var headers = {
        messageId: messageId,
        name: responseName,
        namespace: namespace,
        payloadVersion: PAYLOAD_VERSION
    };

    var result = {
        header: headers,
        payload: JSON.parse(payload).payload
    };

    return result;
}

function log(title, msg) {
    console.log("*************** " + title + " *************");
    console.log(msg);
    console.log("*************** " + title + " End *********");
}

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