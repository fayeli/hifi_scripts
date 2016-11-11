//
// makeStationMain.js
//
// Created by Si Fi Faye Li on Nov 8, 2016
//

(function(){ // BEGIN LOCAL SCOPE
    // DEMO 4
    var miniParts = ["{33b2601c-8813-4ece-9f41-27fc3b663a73}","{57d33a7c-482a-4254-9b7c-29e42b163dd4}","{fe42fe01-304f-40b3-89d5-6c5283e633ff}","{409c0825-0030-4193-b9f8-570ce1912361}","{c93fc2a8-3365-459e-b7f2-a101409a84d8}","{dd0a0ab0-db0e-42fe-b774-4bf65c29f823}","{a7649a66-35d9-41c9-9c80-0e22a6ca5465}"];
    var regularParts = ["{3d16c826-078b-4309-bec7-28b2399e4fd1}","{c773071e-fb8f-4661-b9c5-05a5a9660d90}","{4468fa63-a5a9-47c9-9b2a-dc52988ff1fc}", "{bf0a67a3-688b-4863-8fb2-554cbe163b80}","{b8d84947-0bed-4a2b-89d8-8488aba213be}","{01278071-280e-41c7-91f4-e4813114d418}","{827fd52b-5080-4b15-a423-b92a130efec0}"];


    var resetDemo4 = function() {

    };

    // DEMO 3
    var MINILAMPS_DEFAULT_POS = [
        {"x":-25.66,"y":-200.26,"z":-14.91},
        {"x":-25.66,"y":-200.26,"z":-15.10}
    ];
    var MINILAMPS_DEFAULT_ROT = [
        {"x":0.37603601813316345,"y":-0.4135432541370392,"z":-0.16529564559459686,"w":0.8124957084655762},
        {"x":0.37603601813316345,"y":-0.4135432541370392,"z":-0.16529564559459686,"w":0.8124957084655762}
    ];
    // arrays of entitiyIDs of the lamps, minilamps[i] will bind to largelamps[i]
    var minilamps = ["{ee31498c-b311-40e8-8e0b-34eb19ad8b66}","{6c38f80e-e219-4571-bdd4-de44a33e7f84}"];
    var largelamps = ["{73797992-a8fe-4e78-b371-de2de9518cfe}","{2cb4e0d9-3cb9-4c13-b669-1ecfade669f2}"];

    var scaleTransformation = function(miniobj, largeobj, k) {
        var miniProps = Entities.getEntityProperties(miniobj);
        var newPos = Vec3.multiply(miniProps.localPosition, k);
        var largeProps = {
            localPosition: newPos, 
            rotation: miniProps.rotation,
            visible: true
        };
        Entities.editEntity(largeobj, largeProps);
    };

    var resetDemo3 = function() {
        setVisiblity(largelamps[0], false);
        setVisiblity(largelamps[1], false);
        setPosRot(minilamps[0], MINILAMPS_DEFAULT_POS[0], MINILAMPS_DEFAULT_ROT[0]);
        setPosRot(minilamps[1], MINILAMPS_DEFAULT_POS[1], MINILAMPS_DEFAULT_ROT[1]);
    };

    var setPosRot = function(entityID, pos, rot) {
        var props = {position: pos, rotation: rot};
        Entities.editEntity(entityID,props);
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
            } else if (message.demoID === 3) {
                scaleTransformation(minilamps[0],largelamps[0],4);
                scaleTransformation(minilamps[1],largelamps[1],4);
            } else if (message.demoID === 4) {
                var i;
                for (i=0; i<miniParts.length; i++) {
                    scaleTransformation(miniParts[i], regularParts[i],16);
                }
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
        resetDemo3();
    });

    Controller.enableMapping(mappingName);
    print("makeStationMain running");

    function cleanup () {
        print('clean up');
        Controller.disableMapping(mappingName);
        deleteEntities();
        Messages.unsubscribe(myChannel);
        Messages.messageReceived.disconnect(handleMessages);
        //Script.update.disconnect(update);
    }

    //Script.update.connect(update);
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE