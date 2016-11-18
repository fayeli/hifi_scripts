// selfieCamEntityScript.js
//
// Created by Si Fi Faye Li on Nov 16, 2016
//

(function(){ // BEGIN LOCAL SCOPE
    print("selfieCam v0.6");
    var _this;
    var myChannel = "Camera-to-Selfie-Channel";
    
    function SelfieCam() {
        _this = this;
        _entityID = null;
    }

    SelfieCam.prototype = {
        preload: function(entityID) {
            _this.entityID = entityID;
        },
        startEquip: function(id, params) {
            var message = {
                selfieCamEntityID: _this.entityID,
                equipped: true
            };
            message = JSON.stringify(message);
            Messages.sendMessage(myChannel, message);
        },
        releaseEquip: function(id, params) {
            Camera.setModeString("first person");
            var message = {
                equipped: false
            };
            message = JSON.stringify(message);
            Messages.sendMessage(myChannel, message);
        }
    };
    return new SelfieCam();
}); // END LOCAL_SCOPE