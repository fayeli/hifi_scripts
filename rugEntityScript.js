(function(){
	print("running rug entity script");
	var handleMessages = function(channel, message, sender) {
		var vec = JSON.parse(message);
		print('recieved message, leader position: ' + JSON.stringify(vec));
		var offset = Quat.getFront(MyAvatar.orientation);
        offset = Vec3.multiply(offset,3);
		var newLocation = Vec3.sum(vec, offset);
		print('Teleport avatar to new location: ' + JSON.stringify(newLocation));
		MyAvatar.goToLocation(newLocation, false);
	};
	this.enterEntity = function(entityID) {
		print("enter rug");
		print('subsribe to Group-Teleport-'+entityID);
		Messages.subscribe('Group-Teleport-'+entityID);
		Messages.messageReceived.connect(handleMessages);
	};
	this.leaveEntity = function(entityID) {
		print("leave rug");
		print('unsubsribe from  Group-Teleport-'+entityID);
		Messages.unsubscribe('Group-Teleport-'+entityID);
		Messages.messageReceived.disconnect(handleMessages);
	};
});