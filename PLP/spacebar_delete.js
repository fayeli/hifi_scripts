(function(){ // BEGIN LOCAL SCOPE
var mappingName = 'Faye-Dev-' + Math.random();
var myMapping;
var channel = "MakeStation-Delete-Channel";

myMapping = Controller.newMapping(mappingName);
myMapping.from(Controller.Hardware.Keyboard.Space).to(function(value){
    if(value===0) {
        return;
    }
    print("space bar hit, send message to delete stuff");
    var message = "delete pls";
    Messages.sendMessage(channel, message);
});

Controller.enableMapping(mappingName);


function cleanup () {
    print('clean up');
    Controller.disableMapping(mappingName);
}

Script.scriptEnding.connect(cleanup);

}()); // END LOCAL_SCOPE