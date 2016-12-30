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

    importCameraModel();
    processImportedEntities();
    print("Twitch Cam: " + twitchCamEntityID + " Lens :" + twitchCamLensEntityID);

    placeAvatarOnCamera();
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

    function placeAvatarOnCamera() {
        var props = Entities.getEntityProperties(twitchCamEntityID);
        MyAvatar.position = props.position;
        for (var i = 0; i < 20; i++){
            MyAvatar.decreaseSize();
        }
    }

    function setCameraView() {
        Camera.cameraEntity = twitchCamLensEntityID;
        Camera.mode = "entity";
    }

    function update(deltaTime) {
        var props = Entities.getEntityProperties(twitchCamEntityID);
        MyAvatar.position = props.position;
    }

    // Removes all entities we imported and reset settings we've changed
    function cleanup() {
        importedEntityIDs.forEach(function(id) {
            Entities.deleteEntity(id);
        });
        MyAvatar.resetSize();
        Camera.mode = "first person";
    }
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE