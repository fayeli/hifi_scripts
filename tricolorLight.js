// tricolorLight.js
// Created by Faye Li Si Fi on 28th September, 2016
//
// Creates a light entity that tweens between three colors in a cycle.
// This script is meant to run in an assignment client.

var LIGHT_NAME = "tricolor light";

var LIGHT_POSITION = {
    x: 1101.7900390625,
    y: 460.2709045410156, 
    z: -78.48441314697266
};

var LIGHT_COLOR_A = {
    red: 194,
    green: 50,
    blue: 194
}

var LIGHT_COLOR_B = {
    red: 194,
    green: 50,
    blue: 194
}

var LIGHT_COLOR_C = {
    red: 194,
    green: 50,
    blue: 194
}

var LightMaker = {
    light: null,
    spawnLight: function() {
        print('Creating tricolor light..');
        var _this = this;
        _this.light = Entities.addEntity({
            type: "Light",
            name: LIGHT_NAME,
            position: LIGHT_POSITION,
            color: LIGHT_COLOR_A,
            dimensions: { x: 21, y:21, z:21},
            falloffRadius: 10
        });
    }
}

var hasSpawned = false;

function update(deltaTime) {

    if (!Entities.serversExist() || !Entities.canRex()) {
        return;
    }

    if (hasSpawned === false) {
        hasSpawned = true;
        LightMaker.spawnLight();
    } else {
        //TODO: Cycle between three colors
    }
}

Script.update.connect(update);