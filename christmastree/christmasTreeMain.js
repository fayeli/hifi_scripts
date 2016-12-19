// christmasTreeMain.js
//
// Created by Faye Li on Dec 14, 2016
//

(function(){ // BEGIN LOCAL_SCOPE
    var myChannel = "Christmas-Tree-Channel";
    var babyChristmasTree = "{9217d17c-dafb-4e7d-b139-ee9f45ad9aaf}";
    var largeChristmasTree = "{b4282f14-c86c-49df-95f9-713186d88825}";
    var largeOrnaments = [];
    // baby ornament entityID : corresponding large ornament entityID map
    var myMap = {};
    // scale factor k - determines how many times larger the large ornmanets are relative to the baby ornaments
    var k = 16;

    function main() {
        print("running Christmas Tree Main");
        Messages.subscribe(myChannel);
        Messages.messageReceived.connect(handleMessage);

        // searchForBabyOrnaments();
        // print(babyOrnaments);
        // createLargeOrnaments();
        // print(largeOrnaments);
    }
    main();

    function handleMessage(channel, message, sender) {
        if (channel === myChannel) {
            print("Christmas Tree Main recieved message: " + message);
            var currentBabyOrnaments = searchForBabyOrnaments();
            print(currentBabyOrnaments);
            
            // removes baby ornaments no longer near the tree
            for (var key in myMap) {
                if (myMap.hasOwnProperty(key)) {
                    if (currentBabyOrnaments.indexOf(key) === -1) {
                        // removes from scene
                        Entities.deleteEntity(myMap[key]);
                        // removes from hashmap
                        delete myMap[key];
                    }
                }
            }

            // stores new baby ornaments that weren't already in the hashmap
            currentBabyOrnaments.forEach(function(babyOrnamentID){
                if (!myMap.hasOwnProperty(babyOrnamentID)) {
                    // creates a large ornament corresonding to the baby ornament
                    myMap[babyOrnamentID] = createLargeOrnament(babyOrnamentID);
                }
            });

            updateLargeOrnaments();

        }
    }

    function searchForBabyOrnaments() {
        var radius = 2;
        var babyChristmasTreeProps = Entities.getEntityProperties(babyChristmasTree);
        var results = Entities.findEntities(babyChristmasTreeProps.position, radius);
        var babyOrnaments = [];
        results.forEach(function(id){
            var props = Entities.getEntityProperties(id);
            if (props.description === "christmas ornament"){
                // saves the baby ornament entitiy ID
                babyOrnaments.push(id);
                // ISSUE: when parenting the ornament to the baby christmas tree, it gets send to far away
                // props.parentID = babyChristmasTree;
                // Entities.editEntity(id, props);
            }
        });
        return babyOrnaments;
    }

    function updateLargeOrnaments() {
        for (var key in myMap) {
            if (myMap.hasOwnProperty(key)) {
                babyOrnament2LargeOrnament(key, myMap[key]);
            }
        }
    }

    function babyOrnament2LargeOrnament(babyOrnament, largeOrnament) {
        var babyOrnamentProps = Entities.getEntityProperties(babyOrnament);
        var largeOrnamentProps = Entities.getEntityProperties(largeOrnament);
        var scaledPos = Vec3.multiply(babyOrnamentProps.localPosition, k);
        largeOrnamentProps.localPosition = scaledPos;
        largeOrnamentProps.rotation = babyOrnamentProps.rotation;
        largeOrnamentProps.visible = true;
        Entities.editEntity(largeOrnament, largeOrnamentProps);
    }

    function createLargeOrnament(babyOrnamentID) {
        var babyOrnamentProps = Entities.getEntityProperties(babyOrnamentID);
        var scaledPos = Vec3.multiply(babyOrnamentProps.localPosition, k);
        var scaledDims = Vec3.multiply(babyOrnamentProps.dimensions, k);
        var largeOrnamentProps = {
            type: "Model",
            description: "large ornament",
            modelURL: babyOrnamentProps.modelURL,
            parentID: largeChristmasTree,
            localPosition: scaledPos,
            rotation: babyOrnamentProps.rotation,
            dimensions: scaledDims,
            visible: false
        };
        var largeOrnamentID = Entities.addEntity(largeOrnamentProps);
        return largeOrnamentID;
    }

    function reset() {
        clearLargeOrnaments();
    }

    function clearLargeOrnaments() {
        var radius = 1000;
        var largeChristmasTreeProps = Entities.getEntityProperties(largeChristmasTree);
        var results = Entities.findEntities(largeChristmasTreeProps.position, radius);
        results.forEach(function(id){
            var props = Entities.getEntityProperties(id);
            if (props.description === "large ornament"){
                Entities.deleteEntity(id);
            }
        });
    }

    function cleanup() {
        print("Christmas Tree Main Clean Up");
        clearLargeOrnaments();
        Messages.unsubscribe(myChannel);
        Messages.messageReceived.disconnect(handleMessage);
    }

    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE