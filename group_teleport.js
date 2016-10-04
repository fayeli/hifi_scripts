//
// group_teleport.js
//
// Created by Si Fi Faye Li on 4 Oct, 2016
//

(function(){ // BEGIN LOCAL_SCOPE
    print('running group teleport script');

    var MODEL_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/faye/rug.fbx";
    var inGroupTeleportMode = false;

    function setupMenu() {
        print("Group Teleport set up Menu");
        Menu.addMenuItem({
            menuName: "Settings",
            menuItemName: "Customize Group Teleport"
        });
    }

    function handleMenuEvent(menuItem) {
        if (menuItem === "Customize Group Teleport") {
            print("Customize Group Teleport Clicked");
            var prompt = Window.prompt("Group Teleport Model URL", "https://s3-us-west-1.amazonaws.com/hifi-content/faye/rug.fbx");
            if (prompt) {
                Window.alert("Your Group Teleport Model is changed to: " + prompt);
                MODEL_URL = prompt;
            }
        }
    }

    setupMenu();
    Menu.menuItemEvent.connect(handleMenuEvent);

    function ThumbPad(hand) {
        this.hand = hand;
        var _thisPad = this;
        this.buttonPress = function(value) {
            _thisPad.buttonValue = value;
        };
        this.down = function() {
            var down = _thisPad.buttonValue === 1 ? 1.0 : 0.0;
            return down;
        };
    }

    function Trigger(hand) {
        this.hand = hand;
        var _this = this;
        this.buttonPress = function(value) {
            _this.buttonValue = value;
        };
        this.down = function() {
            var down = _this.buttonValue === 1 ? 1.0 : 0.0;
            return down;
        };
    }

    function GroupTeleporter() {
        var _this = this;
        this.updateConnected = false;
        var sphereID;
        var modelID;

        this.createRug = function() {
            // Rug Model
            var position = MyAvatar.position;
            position.y = MyAvatar.getJointPosition("RightToeBase").y;
            var properties = {
                type: "Model",
                name: "Group Teleportation Rug",
                position: position,
                dimensions: {
                    x: 2.0,
                    y: 0.0067,
                    z: 2.0
                },
                modelURL: MODEL_URL
            };
            modelID = Entities.addEntity(properties);
            print("Teleport Model added, entityItemID: " + modelID);

            // Teleport Cube
            // var vecBehind = Quat.getFront(MyAvatar.orientation);
            // vecBehind = Vec3.multiply(vecBehind,2);
            // var position = Vec3.sum(MyAvatar.position, vecBehind);
            // var properties = {
            //     type: "Box",
            //     position: position,
            //     dimensions: {
            //         x: 2,
            //         y: 2,
            //         z: 2.5
            // },
            // ignoreForCollisions: true,
            // script: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/rugEntityScript.js"
            // };

            // Teleport Sphere
            var position = MyAvatar.position;
            var properties = {
                name: "Invisible Teleport Sphere",
                type: "Sphere",
                position: position,
                dimensions: {
                    x: 2,
                    y: 0.25,
                    z: 2
                },
                ignoreForCollisions: true,
                script: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/rugEntityScript.js",
                visible: false
            };
            sphereID = Entities.addEntity(properties);
            print("Invisible Spherical Rug Entity added, entityItemID: " + sphereID);
        };

        this.enterGroupTeleportMode = function() {
            print('enter group teleport mode');
            inGroupTeleportMode = true;
            this.createRug();
            Script.update.connect(this.update);
            this.updateConnected = true;
        };

        this.exitGroupTeleportMode = function() {
            print('exit group teleport mode');
            inGroupTeleportMode = false;
            prevLocation = null;
            currLocation = null;
            if (this.updateConnected) {
                Script.update.disconnect(this.update);
            }
            this.updateConnected = false;
            Entities.deleteEntity(sphereID);
            Entities.deleteEntity(modelID);
        };

        var prevLocation = null;
        var currLocation = null;

        this.update = function() {
            var teleported = false;

            // check leader avatar's position, when it teleports, send a message to the rug channel.
            currLocation = MyAvatar.position;
            if (prevLocation === null) {
                prevLocation = currLocation;
            }
            var d = Vec3.distance(currLocation, prevLocation);
            if (d >= 2) {
                teleported = true;
                print('Teleported');
            }
            if (teleported){
                // send new location to other avatars on rug
                var newLocation = JSON.stringify(MyAvatar.position);
                var channel = 'Group-Teleport-'+ sphereID;
                Messages.sendMessage(channel, newLocation);
                print('Sending new location: ' + newLocation +' To Channel: ' + channel);
                _this.exitGroupTeleportMode();
            }
            // TODO: Uncomment following line to test with actual teleport
            prevLocation = currLocation;
        };
    }

    var leftPad = new ThumbPad('left');
    var rightPad = new ThumbPad('right');
    var leftTrigger = new Trigger('left');
    var rightTrigger = new Trigger('right');

    var mappingName, teleportMapping;

    function registerMappings(){
        mappingName = 'Hifi-Group-Teleporter-Dev-' + Math.random();
        teleportMapping = Controller.newMapping(mappingName);

        //Maapping to keyboard space bar for testing
        teleportMapping.from(Controller.Hardware.Keyboard.Space).to(function(value){
            if(value===0) {
                return;
            }
            print('Group Teleport Debug: Clicked space bar');
            if (inGroupTeleportMode){
                teleporter.exitGroupTeleportMode();
            } else {
                teleporter.enterGroupTeleportMode();
            }
        });

        teleportMapping.from(Controller.Standard.RT).peek().to(rightTrigger.buttonPress);
        teleportMapping.from(Controller.Standard.LT).peek().to(leftTrigger.buttonPress);
        teleportMapping.from(Controller.Standard.RightPrimaryThumb).peek().to(rightPad.buttonPress);
        teleportMapping.from(Controller.Standard.LeftPrimaryThumb).peek().to(leftPad.buttonPress);
        teleportMapping.from(rightPad.down).when(leftPad.down)
            .to(function(value) {
                if(value===0){
                    return;
                }
                if (rightTrigger.down()) {
                    return;
                }
                if (leftTrigger.down()) {
                    return;
                }
                if (inGroupTeleportMode){
                    teleporter.exitGroupTeleportMode();
                } else {
                    teleporter.enterGroupTeleportMode();
                }
            });
    }

    var teleporter = new GroupTeleporter();
    registerMappings();
    Controller.enableMapping(mappingName);

    function cleanupMenu() {
        Menu.removeMenuItem("Settings", "Customize Group Teleport");
    }

    function cleanup() {
        print('group teleport script cleanup');
        Controller.disableMapping(mappingName);
        if(teleporter.updateConnected){
            Script.update.disconnect(teleporter.update);
            teleporter.updateConnected = false;
        }
        cleanupMenu();
    }

    Script.scriptEnding.connect(cleanup);

}()); // END LOCAL_SCOPE