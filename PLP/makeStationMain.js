//
// makeStationMain.js
//
// Created by Si Fi Faye Li on Nov 8, 2016
//

(function(){ // BEGIN LOCAL SCOPE

    var BUTTERFLY_ANIMATION_URL = "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx";
    var BUTTERFLY_MODEL_URL = "http://hifi-production.s3.amazonaws.com/tutorials/butterflies/butterfly.fbx";
    var NATURAL_SIZE_OF_BUTTERFLY = { x:0.0732, y:0.0073, z: 0.0816 };
    
    var FLAME_URL = "https://hifi-content.s3.amazonaws.com/faye/plp/flame.json";

    var YELLOW_EGGIE_SHELF_POS = { x:-5.7165, y:-200.0182, z:-15.0367 };
    var RED_EGGIE_SHELF_POS = { x:-5.7165, y:-200.2671, z:-15.1067 };
    var SHELF_SPACING = 0.07;

    var butterflies = [];
    var flames = [];
    var yellowEggies = [];
    var redEggies = [];

    // spawns a flame (light+particle effect) at given position, saves the entityItemIDs to the flames array
    var spawnFlame = function(position) {
        print("spawn flame");
        var imported = Clipboard.importEntities(FLAME_URL);
        if (imported === true) {
            var flame = Clipboard.pasteEntities(position);
            flames.push(flame);
        }
    }

    // spawns a butterfly at given position, saves the entityItemID to the butterflies array
    var spawnButterfly = function(position) {
        print("spawn butterfly");
        var newFrameRate = 29 + Math.random() * 30;
        var properties = {
            type: "Model",
            name: "Yellow Butterfly",
            dimensions: NATURAL_SIZE_OF_BUTTERFLY,
            position: position,
            animation: {
                url: BUTTERFLY_ANIMATION_URL,
                fps: newFrameRate,
                loop: true,
                running: true,
                startAutomatically: false
            },
            modelURL: BUTTERFLY_MODEL_URL
        }
        butterflies.push(Entities.addEntity(properties));
    };

    var deleteEntities = function() {
        print("deleting entities");
        butterflies.forEach(function(id){
            Entities.deleteEntity(id);
        });
        butterflies = [];
        flames.forEach(function(flame){
            flame.forEach(function(id){
                Entities.deleteEntity(id);
            });
        });
        flames = [];
    };

    var putEggiesOnShelf = function() {
        print("put eggies on shelf");
        var i, offset, shelfPos, props;
        for ( i = 0; i < yellowEggies.length; i++ ) {
            offset = { x:0, y:0, z:-SHELF_SPACING*i };
            shelfPos = Vec3.sum(YELLOW_EGGIE_SHELF_POS, offset);
            props = { position: shelfPos };
            Entities.editEntity(yellowEggies[i], props);
        }
        for ( i = 0; i < redEggies.length; i++ ) {
            offset = { x:0, y:0, z:-SHELF_SPACING*i };
            shelfPos = Vec3.sum(RED_EGGIE_SHELF_POS, offset);
            props = { position: shelfPos };
            Entities.editEntity(redEggies[i], props);
        }
    };

    // returns an object with positions of red and yellow eggies within search sphere
    // whose center position = centerPos and search radius = r
    var searchForEggies = function(centerPos, r) {
        var results = Entities.findEntities(centerPos, r);
        var yellowPosArr = [];
        var redPosArr = [];
        yellowEggies = [];
        redEggies = [];
        results.forEach(function(itemID) {
            var itemProps = Entities.getEntityProperties(itemID);
            var descriptions = itemProps.description.split(".");
            if (descriptions[0] === "eggie" && descriptions[1] === "yellow"){
                print("found an yellow eggie at " + JSON.stringify(itemProps.position));
                yellowPosArr.push(itemProps.position);
                yellowEggies.push(itemID);
            } else if (descriptions[0] === "eggie" && descriptions[1] === "red"){
                print("found a red eggie at " + JSON.stringify(itemProps.position));
                redPosArr.push(itemProps.position);
                redEggies.push(itemID);
            };
        });
        var eggiesPos = { "yellow": yellowPosArr, "red": redPosArr };
        return eggiesPos;
    };

    var myChannel = "MakeStation-Channel";
    var handleMessages = function(channel, message, sender) {
        if (channel === myChannel) {
            print("recieved message: " + JSON.stringify(message));
            message = JSON.parse(message);
            if (!message.hasOwnProperty("demoID") || !message.hasOwnProperty("demoPosition") ) {
                return;
            }
            if (message.demoID === 1) {
                // demo 1a: turn all yellow eggies into butterflies
                var eggiesPos = searchForEggies(message.demoPosition, 2);
                eggiesPos["yellow"].forEach(function(pos){
                    spawnButterfly(pos);
                });
                // demo 1b: turn all red eggies into flame
                eggiesPos["red"].forEach(function(pos){
                    spawnFlame(pos);
                });
                putEggiesOnShelf();
            }
        }
    };

    Messages.subscribe(myChannel);
    Messages.messageReceived.connect(handleMessages);

    var mappingName = 'Faye-Dev-' + Math.random();
    var myMapping;

    myMapping = Controller.newMapping(mappingName);
    myMapping.from(Controller.Hardware.Keyboard.Space).to(function(value){
        if ( value === 0 ) {
            return;
        }
        print("space bar clicked, deleting entities");
        deleteEntities();
    });

    Controller.enableMapping(mappingName);
    print("makeStationMain running");

    function cleanup () {
        print('clean up');
        Controller.disableMapping(mappingName);
        deleteEntities();
        Messages.unsubscribe(myChannel);
        Messages.messageReceived.disconnect(handleMessages);
    }

    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE