// christmasTreeMain.js
//
// Created by Faye Li on Dec 14, 2016
//

(function(){ // BEGIN LOCAL_SCOPE
    var myChannel = "Christmas-Tree-Channel";
    var babyChristmasTree = "{9217d17c-dafb-4e7d-b139-ee9f45ad9aaf}";
    var largeChristmasTree = "{b4282f14-c86c-49df-95f9-713186d88825}";
    var babyOrnaments = [];
    var largeOrnaments = [];
    var k = 16;

    function main() {
        print("running Christmas Tree Main");
        Messages.subscribe(myChannel);
        Messages.messageReceived.connect(handleMessage);

        searchForBabyOrnaments();
        print(babyOrnaments);
        createLargeOrnaments();
        print(largeOrnaments);
    }
    main();

    function handleMessage(channel, message, sender) {
        if (channel === myChannel) {
            print("Christmas Tree Main recieved message: " + message);
            updateLargeOrnaments();
        }
    }

    function searchForBabyOrnaments() {
        var radius = 2;
        var babyChristmasTreeProps = Entities.getEntityProperties(babyChristmasTree);
        var results = Entities.findEntities(babyChristmasTreeProps.position, radius);
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
    }

    function updateLargeOrnaments() {
        for (var i = 0; i < babyOrnaments.length; i++) {
            babyOrnament2LargeOrnament(babyOrnaments[i], largeOrnaments[i]);
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

    function createLargeOrnaments() {
        babyOrnaments.forEach(function(babyOrnament) {
            var babyOrnamentProps = Entities.getEntityProperties(babyOrnament);
            var scaledPos = Vec3.multiply(babyOrnamentProps.localPosition, k);
            //TODO: scale model dimension var scaledDims = 
            var largeOrnamentProps = {
                type: "Model",
                description: "large ornament",
                modelURL: babyOrnamentProps.modelURL,
                parentID: largeChristmasTree,
                localPosition: scaledPos,
                rotation: babyOrnamentProps.rotation,
                visible: false
            };
            largeOrnaments.push(Entities.addEntity(largeOrnamentProps));
        });
    }

    function reset() {
        clearLargeOrnaments();
    }

    function clearLargeOrnaments() {
        largeOrnaments.forEach(function(id){
            Entities.deleteEntity(id);
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