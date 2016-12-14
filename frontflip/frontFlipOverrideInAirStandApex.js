// frontFlipOverrideInAirStandApex.js
//
// Created by Faye Li on Dec 14, 2016
//

(function(){ // BEGIN LOCAL_SCOPE
    var ANIM_URL = "https://hifi-content.s3.amazonaws.com/faye/frontflip/frontFlip.fbx";
    var animRole = "inAirStandApex";
    MyAvatar.overrideRoleAnimation(animRole, ANIM_URL, 60, true, 0, 53);
    
    // Unknown issues with speech recognizer ):
    // var FRONT_FLIP_COMMAND = "FRONT FLIP";

    // SpeechRecognizer.addCommand(FRONT_FLIP_COMMAND);
    // SpeechRecognizer.commandRecognized.connect(function(command){
    //     if (command === FRONT_FLIP_COMMAND) {
    //         print("I hear you!");
    //         MyAvatar.overrideAnimation(ANIM_URL,30,false,0,53);
    //     }
    // });

    function cleanup() {
        print("cleaning up front flip override fly");
        MyAvatar.restoreRoleAnimation(animRole);
        //SpeechRecognizer.removeCommand(FRONT_FLIP_COMMAND);
    }
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE