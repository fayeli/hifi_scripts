// teleportToLookAt.js
// Created by Faye Li on 20 Oct 2016
//
// This script teleports your avatar to towards where you are looking at
//
(function(){ // BEGIN LOCAL_SCOPE
    var d = 5;
    var vecLookAt = Quat.getFront(MyAvatar.orientation);
    vecLookAt = Vec3.multiply(vec,d);
    var newLocation = Vec3.sum(vecLookAt, MyAvatar.position);
    MyAvatar.goToLocation(newLocation);
}()); // END LOCAL_SCOPE