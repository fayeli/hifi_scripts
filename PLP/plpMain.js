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
var POINT_DIMENSIONS = {x: 0.05, y: 0.05, z: 0.05};
function MyController(hand) {
    this.hand = hand;
    var _this = this;
    this.triggerClicked = false;

    this.triggerClick = function(value) {
        _this.triggerClicked = value;
        if (value === 1) {
            // on trigger click, create a sphere at tip of hand controllers
            var palm_pos = (_this.hand === RIGHT_HAND ? MyAvatar.getRightPalmPosition() : MyAvatar.getLeftPalmPosition());
            var rotation = (_this.hand === RIGHT_HAND ? MyAvatar.getRightPalmRotation() : MyAvatar.getLeftPalmRotation());
            var right = Vec3.normalize(Quat.getRight(rotation));
            var up = Vec3.normalize(Quat.getUp(rotation));
            var l = 0.08;
            var right_offset = (_this.hand === RIGHT_HAND ? Vec3.multiply(l, right) : Vec3.multiply(-l, right));
            var up_offset = Vec3.multiply(l, up);
            var total_offset = Vec3.sum(up_offset, right_offset);
            var spawn_pos = Vec3.sum(palm_pos, total_offset);
            var properties = {
                type: "Sphere",
                name: "plp_point",
                dimensions: POINT_DIMENSIONS,
                position: spawn_pos
            };
            print("PLP DEBUG adding sphere at " + JSON.stringify(spawn_pos));
            Entities.addEntity(properties);
        }
    };
    this.update = function(deltaTime, timestamp) {
    };
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