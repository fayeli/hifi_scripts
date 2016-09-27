(function(){
    print('running group teleport script');

    var inGroupTeleportMode = false;

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
        var rugID;

        this.createRug = function() {
            // TODO: Add a rug model
            // model url: https://www.dropbox.com/s/rygnze069ejqebq/rug.fbx
            // script url: https://raw.githubusercontent.com/fayeli/hifi_scripts/master/rugEntityScript.js
            //print(JSON.stringify(MyAvatar.orientation));
          //print(JSON.stringify(Quat.getFront(MyAvatar.orientation)));
//[09/15 13:43:04] [DEBUG] script:print()<< {"x":0,"y":-0.3993147611618042,"z":0,"w":0.9168139100074768}
//[09/15 13:43:04] [DEBUG] script:print()<< {"x":0.7321946620941162,"y":0,"z":-0.6810954809188843}
            var vecBehind = Quat.getFront(MyAvatar.orientation);
          //print(JSON.stringify(vecBehind));
          //vecBehind = Vec3.multiplyVbyV(vecBehind, Vec3.UNIT_NEG_X);
          //vecBehind = Vec3.multiplyVbyV(vecBehind, Vec3.UNIT_NEG_Z);
          //print(JSON.stringify(vecBehind));
            vecBehind = Vec3.multiply(vecBehind,2);
          //print(JSON.stringify(vecBehind));
            var position = Vec3.sum(MyAvatar.position, vecBehind);
     //     var properties = {
     //         type: "Model",
     //         position: position,
     //             //dimensions: {
         //         //  x: 1,
        //      //  y: 1,
        //      //  z: 1
                // //},
     //         modelURL: "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx",
     //         animationURL: "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx",
            //  animationIsPlaying: true,
            //  script: "https://raw.githubusercontent.com/fayeli/hifi_scripts/master/rugEntityScript.js"
     //     };
            var properties = {
                type: "Box",
                position: position,
                dimensions: {
                    x: 2,
                    y: 2,
                    z: 2.5
            },
            ignoreForCollisions: true,
            script: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/rugEntityScript.js"
            };

            rugID = Entities.addEntity(properties);
            print("Rug Entity added, entityItemID: " + rugID);
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
            Entities.deleteEntity(rugID);
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
                var channel = 'Group-Teleport-'+ rugID;
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

    Script.scriptEnding.connect(cleanup);

    function cleanup() {
        print('group teleport script cleanup');
        Controller.disableMapping(mappingName);
        if(teleporter.updateConnected){
            Script.update.disconnect(teleporter.update);
            teleporter.updateConnected = false;
        }
    }
}());