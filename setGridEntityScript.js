// setGridEntityScript.js
//
// Created by Si Fi Faye Li on 26 Oct, 2016
//
// This script is an entity script for setting the correct grid size for Zimberlab's building
// blocks. It is meant to be attached to a button you can click on.
//

(function(){
    this.clickDownOnEntity = function(entityID, mouseEvent) {
        var channel = "Snap-Block-Channel";
        var object = {
            majorGrid: 1,
            minorGrid: 0.05
        };
        var message = JSON.stringify(object);
        // The observer (gridTool.js) does the rest of setting up correct snap grid size
        Messages.sendMessage(channel, message);
    };
});