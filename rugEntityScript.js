(function(){
	print("running rug entity script");
	var handleMessages = function(channel, message, sender) {
		print(message);
		print('recieved location: ' + JSON.stringify(message));
		MyAvatar.goToLocation(message);
	}
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
	}
});