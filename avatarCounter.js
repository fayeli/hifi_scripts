//
//  avatarCounter.js
//	
// 	Usage: Attach this script as an entity server script to a Text Entity. The Text Entity will display
//  the current avatar counts in the domain. 
//
//  Created by Faye Li on 3 Feb 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() { 
	var INTERVAL_MS = 1000; // in ms, how often do we recount avatars
	var intervalID = null;
	this.preload = function(entityID) {
		intervalID = Script.setInterval(function() {
			var avatarCount = AvatarList.getAvatarIdentifiers().length;
			Entities.editEntity(entityID, {text: avatarCount});
		}, INTERVAL_MS);
	};
	this.unload = function() {
		Script.clearInterval(intervalID);
	};
}); 