(function(){ 
    print("running change color on click down js");
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) { 
        if (clicked){
            print("clicky");
            Entities.editEntity(entityID, { color: { red: 0, green: 255, blue: 255} });
            clicked = false;
        }else{
            print("clicky");
            Entities.editEntity(entityID, { color: { red: 255, green: 255, blue: 0} });
            clicked = true; 
        }
    };
});