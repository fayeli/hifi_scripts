(function(){
	print("running rug entity script");
	var handleHandMessages = function(channel, message, sender) {
		print(message);
		print('recieved location: ' + JSON.stringify(message));
	}
	this.enterEntity = function(entityID) {
		print("enter rug");
		Messages.subscribe('Group-Teleport-'+entityID);
		print('subsribe to Group-Teleport-'+entityID);
		Messages.messageReceived.connect(handleMessages);
	};
	this.leaveEntity = function(entityID) {
		print("leave rug");
		Messages.unsubscribe('Group-Teleport-'+entityID);
		print('unsubsribe from Group-Teleport-'+entityID);
		Messages.messageReceived.disconnect(handleMessages);
	}
});