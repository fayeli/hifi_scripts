// teleportToLookAt.js
// Created by Faye Li on 20 Oct 2016
//
// This script teleports your avatar to towards where you are looking at
//
(function(){ // BEGIN LOCAL_SCOPE
    var d = 50;
    var vecLookAt = Quat.getFront(MyAvatar.orientation);
    vecLookAt = Vec3.multiply(vecLookAt,d);
    var newLocation = Vec3.sum(vecLookAt, MyAvatar.position);
    MyAvatar.goToLocation(newLocation, false);
}()); // END LOCAL_SCOPE