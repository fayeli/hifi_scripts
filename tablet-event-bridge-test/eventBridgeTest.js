"use strict";

//
//  tabletEventBridgeTest2.js
//
//  Created by Faye Li on 23 Jan 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() { // BEGIN LOCAL_SCOPE
    var TEST_URL = "https://hifi-content.s3.amazonaws.com/faye/tablet-dev/eventBridgeTest.html";
    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
    var button = tablet.addButton({
        text: "Test"
    });

    function onClicked() {
        tablet.gotoWebScreen(TEST_URL);
    }

    var counter = 0;
    function onWebEventReceived(event) {
        print("Script received a web event, its type is: " + typeof event);
        if (typeof event === "object") {
            print("The object is: " + event);
        }
        if (typeof event === "string") {
            print("The string is: " + event);
        }
        counter = counter + 1;
        if (counter === 2) {
            print("Script emitting events...");
            // Emit two events, one as string, another as object
            var eventObject = {"data": "testEventObject"};
            tablet.emitScriptEvent(eventObject);
            var eventString = "testEventString";
            tablet.emitScriptEvent(eventString);
        }
    }

    button.clicked.connect(onClicked);
    tablet.webEventReceived.connect(onWebEventReceived);

    function cleanup() {
        button.clicked.disconnect(onClicked);
        tablet.removeButton(button);
    }

    Script.scriptEnding.connect(cleanup);
}()); // END LOCAL_SCOPE
