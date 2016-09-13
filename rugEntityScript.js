(function(){
	print("running rug entity script");
	var handleHandMessages = function(channel, message, sender) {
		print(message);
	}
	this.enterEntity = function(entityID) {
		print("enter rug");
		Messages.subscribe('Group-Teleport-'+entityID);
		Messages.messageReceived.connect(handleMessages);
	};
	this.leaveEntity = function(entityID) {
		print("leave rug");
		Messages.unsubscribe('Group-Teleport-'+entityID);
	}
});