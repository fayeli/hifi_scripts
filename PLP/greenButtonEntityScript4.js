//  greenButtonEntityScript.js
//
//  Created by Faye Li on November 3, 2016
//
(function() { 
    var _this;
    var CLICK_SOUND_URL = "http://hifi-content.s3.amazonaws.com/caitlyn/production/gameTable/woodenTapClick.wav";
    var myChannel = "MakeStation-Channel";

    function GreenButton() {
        _this = this;
    }

    GreenButton.prototype = {
        entityID: null,
        sound: null,
        position: null,
        preload: function(entityID) {
            print('preload(' + entityID + ')');
            _this.entityID = entityID;
            _this.sound = SoundCache.getSound(CLICK_SOUND_URL);
            var props = Entities.getEntityProperties(_this.entityID);
            _this.position = props.position;
        },
        startNearTrigger: function(entityID) {
            print('star near trigger');
            _this.click();
        },
        clickDownOnEntity: function(entityID, mouseEvent) {
            print('click down on entity');
            _this.click();
        },
        click: function(){
            // plays click sound as audio feedback
            var props = Entities.getEntityProperties(_this.entityID);
            var options = { position: props.position };
            var injector = Audio.playSound(_this.sound,options);
            // TODO: add visual feedback ie. animate a button click

            var message = {
                demoID: 4,
                demoPosition: _this.position
            };
            message = JSON.stringify(message);
            Messages.sendMessage(myChannel, message);
        }
    };

    return new GreenButton();
});
