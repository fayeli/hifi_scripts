// deletePixelArt.js
//
// Created by Faye Li on Nov 9, 2016
//
// To delete pixel art causing performance issue, run this script while standing close to the pixel art.
// The script should delete any remaining pixel (box or sphere) nearby you.

(function(){
    var results = Entities.findEntities(MyAvatar.position, 10);
    results.forEach(function(id){
        var props = Entities.getEntityProperties(id);
        if (props.name === "pixel"){
            Entities.deleteEntity(id);
        }
    });
}());