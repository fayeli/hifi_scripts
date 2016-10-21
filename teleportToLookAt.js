// teleportToLookAt.js
// Created by Faye Li on 20 Oct 2016
//
// This script teleports your avatar to where you are looking at
//
(function(){ // BEGIN LOCAL_SCOPE
    var posLookAt = MyAvatar.getTargetAvatarPosition();
    MyAvatar.goToLocation(posLookAt);
}()); // END LOCAL_SCOPE