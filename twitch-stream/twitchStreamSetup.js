// twitchSreamSetup.js
//
// Created by Faye Li on Dec 30, 2016
//
// Run this script to get your High Fidelity Interface prepared for streaming on Twitch!
// 

(function() { // BEGIN LOCAL_SCOPE
    var TWITCH_CAM_JSON_URL = "https://hifi-content.s3.amazonaws.com/faye/twitch-stream/twitch_cam.json";
    var importedEntityIDs = [];
    var twitchCamEntityID = null;
    var twitchCamLensEntityID = null;
    var freeMovementMode = false;

    importCameraModel();
    processImportedEntities();
    shrinkAvatar();
    setupSpaceBarControl();
    setCameraView();
    Script.update.connect(update);

    function importCameraModel() {
        var success = Clipboard.importEntities(TWITCH_CAM_JSON_URL);
        var frontFactor = 3;
        var frontUnitVec = Vec3.normalize(Quat.getFront(MyAvatar.orientation));
        var frontOffset = Vec3.multiply(frontUnitVec,frontFactor);
        var rightFactor = 3;
        var rightUnitVec = Vec3.normalize(Quat.getRight(MyAvatar.orientation));
        var spawnLocation = Vec3.sum(Vec3.sum(MyAvatar.position,frontOffset),rightFactor);
        if (success) {
            importedEntityIDs = Clipboard.pasteEntities(spawnLocation);    
        }
    }

    function processImportedEntities() {
        importedEntityIDs.forEach(function(id){
            var props = Entities.getEntityProperties(id);
            if (props.name === "Twitch Cam") {
                twitchCamEntityID = id;
            } else if (props.name === "Twitch Cam Lens") {
                twitchCamLensEntityID = id;
            }
        });
    }

    function shrinkAvatar() {
        for (var i = 0; i < 20; i++){
            MyAvatar.decreaseSize();
        }
    }

    function setupSpaceBarControl() {
        var mappingName = "Twitch-Cam-Space-Bar";
        var myMapping = Controller.newMapping(mappingName);
        myMapping.from(Controller.Hardware.Keyboard.Space).to(function(value){
            if ( value === 0 ) {
                return;
            }
            if (freeMovementMode) {
                freeMovementMode = false;
                Camera.mode = "entity";
            } else {
                freeMovementMode = true;
                Camera.mode = "first person";
            }
        });
        Controller.enableMapping(mappingName);
    }

    function setCameraView() {
        Camera.cameraEntity = twitchCamLensEntityID;
        Camera.mode = "entity";
    }

    function update(deltaTime) {
        if (freeMovementMode) {
            var upUnitVec = Vec3.normalize(Quat.getUp(MyAvatar.orientation));
            var newPos = Vec3.sum(MyAvatar.position, Vec3.multiply(upUnitVec, 0.6));
            var yAxis = {x:0, y:1, z:0};
            var Qflipy = Quat.angleAxis(180, yAxis);
            var newRot = Quat.multiply(MyAvatar.orientation,Qflipy);
            Entities.editEntity(twitchCamEntityID, {position: newPos, rotation: newRot});
        } else {
            var props = Entities.getEntityProperties(twitchCamLensEntityID);
            var upUnitVec = Vec3.normalize(Quat.getUp(props.rotation));
            var frontUnitVec = Vec3.normalize(Quat.getFront(props.rotation));
            var newPos = Vec3.sum(props.position, Vec3.multiply(upUnitVec, -0.3));
            newPos = Vec3.sum(newPos, Vec3.multiply(frontUnitVec, -0.15));
            MyAvatar.position = newPos;
            MyAvatar.orientation = props.rotation;
        }
    }

    // Removes all entities we imported and reset settings we've changed
    function cleanup() {
        importedEntityIDs.forEach(function(id) {
            Entities.deleteEntity(id);
        });
        MyAvatar.resetSize();
        Camera.mode = "first person";
        Controller.disableMapping("Twitch-Cam-Space-Bar");
    }
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE