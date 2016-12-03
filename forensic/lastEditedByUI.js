//
// lastEditedByUI.js
//
// Created by Si Fi Faye Li on 2 December, 2016
//

(function () {
    var LINE_COLOR = { red: 0, green: 255, blue: 255};
    var SEARCH_RADIUS = 40;
    var UPDATE_INTERVAL = 1 / 60; // 60fps 
    var myHashMap = {};  // stores {entityID of target entity : overlayID of the line}

    var timer = 0;
    var lastUpdateTime = 0;
    function update(deltaTime) {
        timer += deltaTime;
        if (timer - lastUpdateTime > UPDATE_INTERVAL) {
            var targetEntityIDs = Entities.findEntities(MyAvatar.position,SEARCH_RADIUS);

            targetEntityIDs.forEach(function(targetEntityID){
                var targetEntityProps = Entities.getEntityProperties(targetEntityID);
                var targetAvatarUUID = targetEntityProps.lastEditedBy;
                // don't draw lines for entities last edited by myself
                if (targetAvatarUUID === MyAvatar.sessionUUID) {
                    if (myHashMap.hasOwnProperty(targetEntityID)) {
                        var overlayID = myHashMap[targetEntityID];
                        Overlays.deleteOverlay(overlayID);
                    }
                    return;
                }
                // don't draw lines for entities with no last edited by
                if (targetAvatarUUID === "{00000000-0000-0000-0000-000000000000}") {
                    if (myHashMap.hasOwnProperty(targetEntityID)) {
                        var overlayID = myHashMap[targetEntityID];
                        Overlays.deleteOverlay(overlayID);
                    }
                    return;
                } 

                var targetAvatar = AvatarList.getAvatar(targetAvatarUUID);
                
                // skip adding overlay if the avatar can't be found
                if (targetAvatar === null) {
                    // delete overlay if the avatar was found before but no long here
                    if (myHashMap.hasOwnProperty(targetEntityID)) {
                        var overlayID = myHashMap[targetEntityID];
                        Overlays.deleteOverlay(overlayID);
                    }
                    return;
                }
                if (targetAvatar.position === {x: 0, y: 0, z: 0}) {
                    print("avatar pos 0,0,0");
                }
                if (targetEntityProps.position === {x: 0, y: 0, z: 0}) {
                    print("entity pos 0,0,0");
                }

                var props = {
                    start: targetEntityProps.position,
                    end: targetAvatar.position,
                    color: LINE_COLOR,
                    alpha: 1,
                    ignoreRayIntersection: true,
                    visible: true,
                    solid: true,
                    drawInFront: true,
                    glow: 1.0
                };

                if (myHashMap.hasOwnProperty(targetEntityID)) {
                    var overlayID = myHashMap[targetEntityID];
                    Overlays.editOverlay(overlayID, props);
                } else {
                    var newOverlayID = Overlays.addOverlay("line3d", props);
                    myHashMap[targetEntityID] = newOverlayID;
                }
                
            });
            lastUpdateTime = timer;
        }     
    }
    Script.update.connect(update);

    function cleanup() {
        for (var key in myHashMap) {
            if (myHashMap.hasOwnProperty(key)) {
                var overlayID = myHashMap[key];
                Overlays.deleteOverlay(overlayID);
            } 
        }
    }
    Script.scriptEnding.connect(cleanup);
})();