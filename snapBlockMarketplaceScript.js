// 
//  snapBlockMarketplaceScript.js
//
//  Created by Si Fi Faye Li on 25 Oct, 2016
//
//

(function(){ // BEGIN LOCAL_SCOPE
    var IMPORT_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/faye/house.json";
    var PASTE_ENTITIES_LOCATION = MyAvatar.position;

    var promptSnapGridSetup = function () {
        var confirmed = Window.confirm("Thanks for downloading Zimberlab Building Block Kit!\nWould you like to enable Snap To Grid? (Recommended for easy alignment of building blocks)");
        if (confirmed) {
            var channel = "Snap-Block-Channel";
            var object = {
                majorGrid: 1,
                minorGrid: 0.05
            };
            var message = JSON.stringify(object);
            Messages.sendMessage(channel, message);
            // The observer (gridTool.js) does the rest of setting up correct snap grid size
            Window.alert("Snap To Grid enabled.\nYou may turn on EDIT mode to start building, enjoy!");
        }
    };

    var createBlocks = function () {
        var importSuccess = Clipboard.importEntities(IMPORT_URL);
        if (importSuccess === true) {
            var created = Clipboard.pasteEntities(PASTE_ENTITIES_LOCATION);
            print('created ' + created);
        }
    };

    var cleanup = function () {
        print("snap block script cleanup");
    };

    createBlocks();
    promptSnapGridSetup();

    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE