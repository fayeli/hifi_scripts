// frontFlipByKeyboard.js
//
// Created by Faye Li on Dec 14, 2016
//
// This script allows your avatar to do a fron flip 
// when you click the "R" key on your keyboard.
//

(function(){ // BEGIN LOCAL_SCOPE
    print("running fron flip by keyboard");
    var ANIM_URL = "https://hifi-content.s3.amazonaws.com/faye/frontflip/frontFlip.fbx";
    
    var mappingName = "Front-Flip-Mapping";
    var frontFlipMapping = Controller.newMapping(mappingName);
    frontFlipMapping.from(Controller.Hardware.Keyboard.R).to(function(value) {
        if (value) {
            MyAvatar.overrideAnimation(ANIM_URL, 30, true, 0, 60);
            // after flipping for ~2 seconds, put your avatar to normal state
            Script.setTimeout(function() {
                MyAvatar.restoreAnimation();
            }, 1700);
        }
    });
    Controller.enableMapping(mappingName);

    function cleanup() {
        print("cleaning up front flip by keyboard");
        MyAvatar.restoreAnimation();
        Controller.disableMapping(mappingName);
    }
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE