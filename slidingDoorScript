(function() {
    var doorLeftID = "{e543b88a-ac02-427e-975c-02a1002f1d28}";
    var doorRightID = "{c3d4623f-dd98-4051-9880-0b3e5f5c0b72}";
    this.enterEntity = function(entityID) {
        print("YAY I WALKED INTO THE CUBE");
        // Door to slide open
        var props = {
            position: {x: 963.7177, y: 1009.5670, z: 914.4404}
        };
        Entities.editEntity(doorLeftID, props);
        
        props = {
            position: {x: 963.7177, y: 1009.5670, z: 914.4404}
        };
        Entities.editEntity(doorRightID, props);
    };
    
    this.leaveEntity  = function(entityID) {
        print("YAY I LEFT THE CUBE");
        // Door to slide close
        var props = {
            position: {x:964.1778,y: 1009.5670,z: 914.0358}
        };
        Entities.editEntity(doorLeftID, props);
        
        props = {
            position: {x:964.3857,y: 1009.5708,z: 913.8613}
        };
        Entities.editEntity(doorRightID, props);
    };
});
