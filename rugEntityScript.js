(function(){
	print("running rug entity script");
	this.enterEntity = function(entityID) {
		print("enter rug");
		print('entityID'+entityID);
	};
	this.leaveEntity = function(entityID) {
		print("leave rug");
	}
});