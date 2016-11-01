// plpMain.js
//
// Created by Faye Li Si Fi on November 1, 2016
//

(function() { // BEGIN LOCAL SCOPE
print("plpMain running");
HMD.requestShowHandControllers();

// some constants
var RIGHT_HAND = 1;
var LEFT_HAND = 0;
var POINT_RADIUS = 0.04;
function MyController(hand) {
    this.hand = hand;
    var _this = this;
    this.triggerClicked = false;

    this.triggerClick = function(value) {
        _this.triggerClicked = value;
        if (value === 1) {
            // on trigger click, create a sphere at hand position
            // TODO: set right/left hand pos
            var hand_position = MyAvatar.getJointPosition("RightHand");
            var properties = {
                type: "Sphere",
                name: "plp_point",
                dimensions: POINT_RADIUS,
                position: hand_position
            }
            print("PLP DEBUG adding sphere at " + JSON.stringify(hand_position));
            Entities.addEntity(properties);

        }
    }
    this.update = function(deltaTime, timestamp) {
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

function update(deltaTime) {
    var timestamp = Date.now();
    leftController.update(deltaTime, timestamp);
    rightController.update(deltaTime, timestamp);
}

function cleanup() {
    print("plp cleaning up");
    Controller.disableMapping(MAPPING_NAME);
    HMD.requestHideHandControllers();
}

Script.scriptEnding.connect(cleanup);
Script.update.connect(update);
}()); // END LOCAL SCOPE