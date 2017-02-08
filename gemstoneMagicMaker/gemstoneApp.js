"use strict";

//
//  gemstoneMagicMaker.js
//  tablet-sample-app
//
//  Created by Faye Li on Feb 6 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
	// Every great app starts with a great name (keep it short so that it can fit in the tablet button)
	var APP_NAME = "GEMSTONE";
	// Link to your app's HTML file
	var APP_URL = "https://hifi-content.s3.amazonaws.com/faye/gemstoneMagicMaker/gemstoneMagicMaker.html";
    // Path to the icon art for your app
    var APP_ICON = "https://hifi-content.s3.amazonaws.com/faye/gemstoneMagicMaker/gemstoneAppIcon.svg";
	
    // Get a reference to the tablet 
	var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

	// "Install" your cool new app to the tablet
	// The following lines create a button on the tablet's menu screen
	var button = tablet.addButton({
        icon: APP_ICON,
        text: APP_NAME
    });

	// When user click the app button, we'll display our app on the tablet screen
	function onClicked() {
		tablet.gotoWebScreen(APP_URL);
	}
    button.clicked.connect(onClicked);

    // Helper function that gives us a position right in front of the user 
    function getPositionToCreateEntity() {
    	var direction = Quat.getFront(MyAvatar.orientation);
    	var distance = 0.5;
    	var position = Vec3.sum(MyAvatar.position, Vec3.multiply(direction, distance));
    	position.y += 0.5;
    	return position;
    }

    // Handle the events we're recieving from the web UI
    function onWebEventReceived(event) {
    	print("gemstoneApp.js received a web event:" + event);

        // Converts the event to a JavasScript Object
    	if (typeof event === "string") {
            event = JSON.parse(event);
        }

        if (event.type === "click") {
        	// Define the entity properties of for each of the gemstone, then add it to the scene
        	var properties = {
        		"type": "Shape",
        		"position": getPositionToCreateEntity(),
        		"userData": "{\"grabbableKey\":{\"grabbable\":true}}"
        	};
        	if (event.data  === "Emerald") {
                properties.name = "Emerald";
        		properties.shape = "Dodecahedron";
        		properties.color = {
                    "blue": 122,
                    "green": 179,
                    "red": 16
                };
                properties.dimensions = {
                    "x": 0.20000000298023224,
                    "y": 0.26258927583694458,
                    "z": 0.20000000298023224
                };
                Entities.addEntity(properties);
        	} else if (event.data  === "Ruby") {
                properties.name = "Ruby";
        		properties.shape = "Octagon";
        		properties.color = {
                    "blue": 160,
                    "green": 52,
                    "red": 237
                };
                properties.dimensions = {
                    "x": 0.20000000298023224,
                    "y": 0.24431547522544861,
                    "z": 0.12547987699508667
                };
                Entities.addEntity(properties);
        	} else if (event.data  === "Sapphire") {
                properties.name = "Sapphire";
        		properties.shape = "Icosahedron";
        		properties.color = {
                    "blue": 255,
                    "green": 115,
                    "red": 102
                };
                properties.dimensions = {
                    "x": 0.160745769739151,
                    "y": 0.20000000298023224,
                    "z": 0.23340839147567749
                };
                Entities.addEntity(properties);
        	} else if (event.data  === "Quartz") {
                properties.name = "Quartz";
        		properties.shape = "Octahedron";
        		properties.color = {
                    "blue": 245,
                    "green": 142,
                    "red": 216
                };
                properties.dimensions = {
                    "x": 0.20000000298023224,
                    "y": 0.339866042137146,
                    "z": 0.20000000298023224
                };
                Entities.addEntity(properties);
        	}
    }
    tablet.webEventReceived.connect(onWebEventReceived);

	// Provide a way to "uninstall" the app
	// Here, we write a function called "cleanup" which gets executed when
	// this script stops running. It'll remove the app button from the tablet.
	function cleanup() {
        tablet.removeButton(button);
	}
    Script.scriptEnding.connect(cleanup);
}()); 
