//
// selfieMain.js
//
// Created by Si Fi Faye Li on Nov 16, 2016
//

(function(){ // BEGIN LOCAL SCOPE
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
        print("selfie snap");
        Camera.setModeString("independent");
        var palm_pos = MyAvatar.getRightPalmPosition();
        var palm_rot = MyAvatar.getRightPalmRotation();

        var yAxis = {x:0, y:1, z:0};
        var zAxis = {x:0, y:0, z:1};
        var Qflipy = Quat.angleAxis(270, yAxis);
        var Qflipz = Quat.angleAxis(-45, zAxis);
        var Qflip = Quat.multiply(Qflipz, Qflipy);
        var myOrientation = Quat.multiply(palm_rot, Qflip);
        //myOrientation = Quat.multiply(myOrientation,Qflipz);
        Camera.setPosition(palm_pos);
        Camera.setOrientation(myOrientation);
        //var message = {
        //    testing: 1
        //};
        //message = JSON.stringify(message);
        //Messages.sendMessage(snapshotChannel, message);
    };

    var MAPPING_NAME = "Selfie-Dev";
    var mapping = Controller.newMapping(MAPPING_NAME);
    mapping.from([Controller.Standard.RTClick]).peek().to(takeSelfieSnap);
    Controller.enableMapping(MAPPING_NAME);

    var handleMessages = function(channel, message, sender) {
        if (channel === cameraChannel) {
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