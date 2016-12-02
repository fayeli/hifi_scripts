//
// lastEditedByUI.js
//
// Created by Si Fi Faye Li on 2 December, 2016
//

(function () {
    var LINE_COLOR = { red: 0, green: 255, blue: 255};
    var SEARCH_RADIUS = 20;    
    var line3dIDs = [];

    function update(deltaTime) {
        line3dIDs.forEach(function(line3dID){
            Overlays.deleteOverlay(line3dID);
        });
        
        var targetEntityIDs = Entities.findEntities(MyAvatar.position,SEARCH_RADIUS);
    
        line3dIDs = [];
        targetEntityIDs.forEach(function(targetEntityID){
            var targetEntityProps = Entities.getEntityProperties(targetEntityID);

            var targetAvatarUUID = targetEntityProps.lastEditedBy;
            var targetAvatar = AvatarList.getAvatar(targetAvatarUUID);
            // skip adding overlay if the avatar can't be found
            if (targetAvatar === null){
                return;
            }
            var props = {
                start: targetEntityProps.position,
                end: targetAvatar.position,
                color: LINE_COLOR,
                alpha: 1,
                lineWidth: 5
            };
            var line3dID = Overlays.addOverlay("line3d", props);
            line3dIDs.push(line3dID);
        });     
    }
    Script.update.connect(update);

    function cleanup() {
        line3dIDs.forEach(function(line3dID){
            Overlays.deleteOverlay(line3dID);
        });
    }
    Script.scriptEnding.connect(cleanup);
})();