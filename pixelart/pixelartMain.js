// pixelartMain.js
//
// Created by Faye Li on Nov 6, 2016
//

(function(){ // BEGIN LOCAL_SCOPE
    var CANVAS_SIZE = 4;
    var PIXEL_SIZE = 0.05;
    var SPACING = 0.05;
    var pixels = [];
    var drawPixel = function(r,g,b) {
        var d = 10;
        var vecLookAt = Quat.getFront(MyAvatar.orientation);
        vecLookAt = Vec3.multiply(vecLookAt,d);
        var pos = Vec3.sum(vecLookAt, MyAvatar.position);
        var props = {
            type: "Sphere",
            dimensions: {x: PIXEL_SIZE, y: PIXEL_SIZE, z: PIXEL_SIZE},
            color: {red: r, green: g, blue: b},
            position: pos
        };
        pixels.push(Entities.addEntity(props));
    };

    //testing - drawing a red pixel
    drawPixel(255,0,0);

    function cleanup() {
        print("cleaning up pixel art");
        pixels.forEach(function(pixel){
            Entities.deleteEntity(pixel);
        });
    };
    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE