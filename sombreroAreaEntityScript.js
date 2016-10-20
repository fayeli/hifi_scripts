//
// sombreroAreaEntityScript.js
//
// This is an entity script to be attached to a collionless cube/sphere. 
// When an avatar enters the sphere/cube, the script will instantly put a sombrero on you!
// Enjoy!
//
// Created by Si Fi Faye Li on 19 Oct, 2016
//


(function(){ // BEGIN LOCAL_SCOPE
    print("running sombrero area entity script");
    var attachment = {
        modelURL: "http://hifi-content.s3.amazonaws.com/Examples Content/production/sombrero/Sombrero1.fbx",
        jointName: "HeadTop_End",
        translation: {"x": 0, "y": 0.020, "z": -0.050},
        rotation: {"x": 0, "y": 0, "z": 0, "w": 1},
        scale: 1,
        isSoft: false
    };
    this.enterEntity = function(entityID) {
        print("enter sombrero area");
        print("attaching sombrero on top of your head!");
        MyAvatar.attach(attachment.modelURL,
            attachment.jointName,
            attachment.translation,
            attachment.rotation,
            attachment.scale,
            attachment.isSoft);
    };
});