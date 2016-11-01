// plpMain.js
//
// Created by Faye Li Si Fi on November 1, 2016
//

(function() { // BEGIN LOCAL SCOPE
print("plpMain running");
// some constants
var RIGHT_HAND = 1;
var LEFT_HAND = 0;

function MyController(hand) {
    this.hand = hand;
    var _this = this;

    this.triggerPress = function(value) {
        _this.rawTriggerValue = value;
    };

    this.triggerClick = function(value) {
        _this.triggerClicked = value;
    }
}

var MAPPING_NAME = "PLP-Dev";
var mapping = Controller.newMapping(MAPPING_NAME);
var rightController = new MyController(RIGHT_HAND);
var leftController = new MyController(LEFT_HAND);

mapping.from([Controller.Standard.RT]).peek().to(rightController.triggerPress);
mapping.from([Controller.Standard.RTClick]).peek().to(rightController.triggerClick);
mapping.from([Controller.Standard.LT]).peek().to(leftController.triggerPress);
mapping.from([Controller.Standard.LTClick]).peek().to(leftController.triggerClick);

Controller.enableMapping(MAPPING_NAME);


function cleanup() {
    print("plp cleaning up");
    Controller.disableMapping(MAPPING_NAME);

}

Script.scriptEnding.connect(cleanup);
}()); // END LOCAL SCOPE