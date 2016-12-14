//
// selfieMain.js
//
// Created by Si Fi Faye Li on Nov 16, 2016
//

(function(){ // BEGIN LOCAL SCOPE
    var LENS_ID = "{7055b714-bf83-418e-bfd1-9c6c67b3aecc}";
    var SELFIECAMERA_ID = null;
    var equippedCamera = false;
    var cameraChannel = "Camera-to-Selfie-Channel";
    var snapshotChannel = "Selfie-to-Snapshot-Channel";
    
    var takeSelfieSnap = function(value) {
        if (value === 0) {
            return;
        }
        if (equippedCamera === false) { 
            return;    
        }
        if (SELFIECAMERA_ID === null){
            return;
        }
        print("selfie snap independent mode");
        Camera.setModeString("independent");
        var props = Entities.getEntityProperties(LENS_ID);
        print("position: " + JSON.stringify(props.position) + ", rotation: " + JSON.stringify(props.rotation));
        Camera.setPosition(props.position);
        Camera.setOrientation(props.rotation);
        var message = {
           testing: 1
        };
        message = JSON.stringify(message);
        Messages.sendMessage(snapshotChannel, message);
    };

    var MAPPING_NAME = "Selfie-Dev";
    var mapping = Controller.newMapping(MAPPING_NAME);
    mapping.from([Controller.Standard.RTClick]).peek().to(takeSelfieSnap);
    Controller.enableMapping(MAPPING_NAME);

    var handleMessages = function(channel, message, sender) {
        if (channel === cameraChannel && sender === MyAvatar.sessionUUID) {
            print("recieved camera message: " + JSON.stringify(message));
            message = JSON.parse(message);
            if (message.hasOwnProperty("selfieCamEntityID")) {
                SELFIECAMERA_ID = message.selfieCamEntityID;
            }
            if (message.hasOwnProperty("equipped")) {
                equippedCamera = message.equipped;
            }
        }
        if (channel === snapshotChannel) {
            print("recieved snapshot message: " + JSON.stringify(message));
        }
    };
    Messages.subscribe(cameraChannel);
    Messages.messageReceived.connect(handleMessages);

    var cleanup = function() {
        Controller.disableMapping(MAPPING_NAME);
        Camera.setModeString("first person");
        Messages.unsubscribe(cameraChannel);
        Messages.messageReceived.disconnect(handleMessages);
    };
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE