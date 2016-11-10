//
// makeStationMain.js
//
// Created by Si Fi Faye Li on Nov 8, 2016
//

(function(){ // BEGIN LOCAL SCOPE
    // DEMO 3
    // arrays of entitiyIDs of the lamps, minilamps[i] will bind to largelamps[i]
    var minilamps = [];
    var largelamps = [];
    var update = function() {
        // Demo 3: binding mini lamp with large lamp
        
    };

    // DEMO 2
    var CONE_SHELF_PROPS = {
        position: {"x":-16.278244018554688,"y":-200.4762725830078,"z":-14.367652893066406},
        rotation: {"x":-0.5123276710510254,"y":0.31369853019714355,"z":0.5408604741096497,"w":0.5887387990951538}
    };
    var RING_SHELF_PROPS = {
        position: {"x":-15.983358383178711,"y":-200.43910217285156,"z":-14.820626258850098},
        rotation: {"x":-0.2808550298213959,"y":-0.793724775314331,"z":0.3891110420227051,"w":0.3738217055797577}
    };
    var NOMARKER_SHELF_PROPS = {
        position: {"x": -16.1338, "y": -200.4626, "z": -13.5830},
        rotation: {"x":0.9081406593322754,"y":-0.06889450550079346,"z":-0.40819406509399414,"w":-0.0625162124633789}
    };
    var headlights = null;
    var noMarkerEntityID = null;

     var TOGGLE_STATE = 0; // 0: state where markers are shown, 1: state where headlights models are shown
    
    // toggle between showing headlights model vs marker elements
    // also toggle button text between play/pause
    var toggleHeadLights = function() {
        print("toggle");
        if (TOGGLE_STATE === 0) {
            headlights.forEach(function(obj) {
                if (obj.hasOwnProperty("marker")) {
                    setVisiblity(obj.marker, false);
                }
                if (obj.hasOwnProperty("lamp")) {
                    setVisiblity(obj.lamp, true);
                }
            });

            TOGGLE_STATE = 1;
        } else {
            headlights.forEach(function(obj) {
                if (obj.hasOwnProperty("marker")) {
                    setVisiblity(obj.marker, true);
                }
                if (obj.hasOwnProperty("lamp")) {
                    setVisiblity(obj.lamp, false);
                }
            });
            TOGGLE_STATE = 0;
        }
    };

    var setVisiblity = function(entityID, visiblity) {
        var props = {visible: visiblity};
        Entities.editEntity(entityID, props);
    };

    // put the headlights markers (cone, ring, and nomarker) back on original position, also hide lamps (except for no marker style)
    var resetMarkers = function() {
        print("reset markers to shelf");
        if (TOGGLE_STATE === 1) {
            toggleHeadLights();
        }
        if (noMarkerEntityID !== null && headlights !== null) {
            Entities.editEntity(noMarkerEntityID, NOMARKER_SHELF_PROPS);
            Entities.editEntity(headlights[0].marker, CONE_SHELF_PROPS);
            Entities.editEntity(headlights[1].marker, RING_SHELF_PROPS);
        }
    };

    // search for headlights models and marker element, save their entityIDs.
    var searchForHeadlights = function(centerPos, r) {
        var results = Entities.findEntities(centerPos, r);
        var coneEntityIDs = {};
        var ringEntityIDs = {};
        results.forEach(function(itemID) {
            var itemProps = Entities.getEntityProperties(itemID);
            var descriptions = itemProps.description.split(".");
            if (descriptions[0] === "cone") {
                coneEntityIDs[descriptions[1]] = itemID;
            } else if (descriptions[0] === "ring") {
                ringEntityIDs[descriptions[1]] = itemID;
            } else if (descriptions[0] === "nomarker") {
                noMarkerEntityID = itemID;
            }
        });
        print("finish searching for headlights");
        print("coneEntityIDs = " + JSON.stringify(coneEntityIDs));
        print("ringEntityIDs = " + JSON.stringify(ringEntityIDs));

        // save the ids in the headlights array
        headlights = [];
        headlights.push(coneEntityIDs);
        headlights.push(ringEntityIDs);
    };

    // DEMO 1 
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
    };

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
        };
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
            } else if (message.demoID === 2) {
                // demo 2: toggle between showing markers/showing headlights
                if (headlights === null) {
                    searchForHeadlights(message.demoPosition, 5);
                }
                toggleHeadLights();
                
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
        print("space bar clicked, resetting + deleting entities");
        resetMarkers();
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
        Script.update.disconnect(update);
    }

    Script.update.connect(update);
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE