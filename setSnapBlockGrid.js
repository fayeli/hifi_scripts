// 
//  setSnapBlockGrid.js
//
//  Created by Si Fi Faye Li on 20 Oct, 2016
//
//  This script sets the correct grid size for Zimberlab's building
//  blocks, allowing easier building via edit mode.
//

(function(){ // BEGIN LOCAL_SCOPE
    var confirmed = Window.confirm("Thanks for downloading Zimberlab Building Block Kit!\nWould you like to enable Snap To Grid? (Recommended for easy alignment of building blocks)");
    if (confirmed) {
        var channel = "Snap-Block-Channel";
        var message = "OH SNAP";
        Messages.sendMessage(channel, message);
        Window.alert("Snap To Grid enabled.\nYou may turn on EDIT mode to start building, enjoy!");
    }
}()); // END LOCAL_SCOPE