//
// snap_block.js
//
// Created by Si Fi Faye Li on Oct 10, 2016
//
// This script allows you to spawn Zimberlab building blocks by pressing keyboard (T,Y,U,I,O).

(function(){ // BEGIN LOCAL SCOPE
    print("running snap block script");

    var MODEL_URLS = {
        door: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_door_door.fbx",
        door_frame: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_door_frame.fbx",
        window: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_window.fbx",
        wall_tsplit: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_wall_Tsplit.fbx",
        wall_straight: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_wall_straight.fbx",
        wall_rooftriangle: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_wall_roof_triangle.fbx",
        wall_portal: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_wall_portal.fbx",
        wall_corner: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_wall_corner.fbx",
        wall_aperture: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_wall_aperture.fbx",
        roof: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_roof.fbx",
        floor: "https://s3-us-west-1.amazonaws.com/hifi-content/faye/ZBL_lexx01_floor.fbx"
    };

    function spawnBlock (blockname) {
        var vecFront = Quat.getFront(MyAvatar.orientation);
        vecFront = Vec3.multiply(vecFront,2);
        var position = Vec3.sum(MyAvatar.position, vecFront);
        var properties = {
            type: "Model",
            name: "Snap Block " + blockname,
            position: position,
            modelURL: MODEL_URLS[blockname]
        };
        var modelID = Entities.addEntity(properties);
        print("Snap Block " + blockname + " model added, entityItemID: " + modelID);
    }    

    var mappingName, snapblockMapping;

    function registerMappings() {
        mappingName = 'Hifi-Snap-Block-Dev-' + Math.random();
        snapblockMapping = Controller.newMapping(mappingName);

        // Mapping to keyboard
        snapblockMapping.from(Controller.Hardware.Keyboard.T).to(function(value) {
            if (value) {
                print("Snap block debug: Clicked T");
                spawnBlock("wall_rooftriangle");
            }
        });        
        snapblockMapping.from(Controller.Hardware.Keyboard.Y).to(function(value) {
            if (value) {
                print("Snap block debug: Clicked Y");
                spawnBlock("wall_portal");
            }
        });
        snapblockMapping.from(Controller.Hardware.Keyboard.U).to(function(value) {
            if (value) {
                print("Snap block debug: Clicked U");
                spawnBlock("wall_corner");
            }
        });
        snapblockMapping.from(Controller.Hardware.Keyboard.I).to(function(value) {
            if (value) {
                print("Snap block debug: Clicked I");
                spawnBlock("wall_aperture");
            }
        });
        snapblockMapping.from(Controller.Hardware.Keyboard.O).to(function(value) {
            if (value) {
                print("Snap block debug: Clicked O");
                spawnBlock("roof");
            }
        });
    }

    registerMappings();
    Controller.enableMapping(mappingName);

    function cleanup () {
        print('snap block clean up');
        Controller.disableMapping(mappingName);
    }

    Script.scriptEnding.connect(cleanup);

}()); // END LOCAL_SCOPE