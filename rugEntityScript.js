(function(){
	print("running rug entity script");
	var handleMessages = function(channel, message, sender) {
		print('recieved message, location: ' + JSON.stringify(message));
		var offset = Quat.getFront(MyAvatar.orientation);
        offset = Vec3.multiply(offset,3);
		var newLocation = Vec3.sum(message, offset);
		print('Teleport avatar to: ' + newLocation);
		MyAvatar.goToLocation(newLocation);
	};
	this.enterEntity = function(entityID) {
		print("enter rug");
		print('subsribe to Group-Teleport-'+entityID);
		Messages.subscribe('Group-Teleport-'+entityID);
		Messages.messageReceived.connect(handleMessages);
	};
	this.leaveEntity = function(entityID) {
		print("leave rug");
		print('unsubsribe from Group-Teleport-'+entityID);
		Messages.unsubscribe('Group-Teleport-'+entityID);
		Messages.messageReceived.disconnect(handleMessages);
	};
});