(function(){
	var myRugChannel;
	print("running rug entity script");
	var handleMessages = function(channel, message, sender) {
		if (channel === myRugChannel) {
			// Don't teleport again if message is sent from yourself (group leader)
			if (sender !== MyAvatar.sessionUUID) {
				var vec = JSON.parse(message);
				print('recieved message, leader position: ' + JSON.stringify(vec));
				var offset = Quat.getFront(MyAvatar.orientation);
	    		offset = Vec3.multiply(offset,0.05);
				var newLocation = Vec3.sum(vec, offset);
				print('Teleport avatar to new location: ' + JSON.stringify(newLocation));
				MyAvatar.goToLocation(newLocation, false);
			}
			print('After teleport, unsubsribe from ' + myRugChannel);
			Messages.unsubscribe(myRugChannel);
			Messages.messageReceived.disconnect(handleMessages);
		}
	};
	this.enterEntity = function(entityID) {
		print("enter rug");
		myRugChannel = 'Group-Teleport-'+ entityID;
		print('subsribe to ' + myRugChannel);
		Messages.subscribe(myRugChannel);
		Messages.messageReceived.connect(handleMessages);
	};
	this.leaveEntity = function(entityID) {
		print("leave rug");
		print('unsubsribe from ' + myRugChannel);
		Messages.unsubscribe(myRugChannel);
		Messages.messageReceived.disconnect(handleMessages);
	};
});