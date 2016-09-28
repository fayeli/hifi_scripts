//
//  flickeringLight.js
//  examples
//
//  Created by Brad Hefta-Gaub on 2015/09/29.
//  Copyright 2015 High Fidelity, Inc.
//
//  Creates an ephemeral flickering light that will randomly flicker as long as the script is running.
//  After the script stops running, the light will eventually disappear (~10 seconds later). This script
//  can run in the interface or in an assignment client and it will work equally well.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


function randFloat(low, high) {
    return low + Math.random() * (high - low);
}

var LIGHT_NAME = "flickering fire";

var LIGHT_POSITION = {
    x: 1101.7900390625,
    y: 460.2709045410156, 
    z: -78.48441314697266
};

var LIGHT_COLOR = {
    red: 194,
    green: 50   ,
    blue: 194
};

var ZERO_VEC = {
    x: 0,
    y: 0,
    z: 0
};

var totalTime = 0;
var lastUpdate = 0;
var UPDATE_INTERVAL = 1 / 30; // 30fps

var MINIMUM_LIGHT_INTENSITY = 1;
var MAXIMUM_LIGHT_INTENSITY = 3;
var LIGHT_FALLOFF_RADIUS = 10;
var LIGHT_INTENSITY_RANDOMNESS = 0.1;
var EPHEMERAL_LIFETIME = 60; // ephemeral entities will live for 60 seconds after script stops running

var LightMaker = {
    light: null,
    spawnLight: function() {
        print('CREATING LIGHT')
        var _this = this;
        _this.light = Entities.addEntity({
            type: "Light",
            name: LIGHT_NAME,
            position: LIGHT_POSITION,
            lifetime: EPHEMERAL_LIFETIME,
            color: LIGHT_COLOR,
            dimensions: { x: 21, y: 21, z: 21 },
            falloffRadius: 10
        });
    }
}

var hasSpawned = false;

function update(deltaTime) {

    if (!Entities.serversExist() || !Entities.canRez()) {
        return;
    }

    if (hasSpawned === false) {
        hasSpawned = true;
        LightMaker.spawnLight();
    } else {
        totalTime += deltaTime;

        // We don't want to edit the entity EVERY update cycle, because that's just a lot
        // of wasted bandwidth and extra effort on the server for very little visual gain
        if (totalTime - lastUpdate > UPDATE_INTERVAL) {
            var intensity = (MINIMUM_LIGHT_INTENSITY + (MAXIMUM_LIGHT_INTENSITY + (Math.sin(totalTime) * MAXIMUM_LIGHT_INTENSITY)));
            intensity += randFloat(-LIGHT_INTENSITY_RANDOMNESS, LIGHT_INTENSITY_RANDOMNESS);
            var properties = Entities.getEntityProperties(LightMaker.light, "age");
            var newLifetime = properties.age + EPHEMERAL_LIFETIME;
            Entities.editEntity(LightMaker.light, { type: "Light", intensity: intensity, lifetime: newLifetime });
            lastUpdate = totalTime;
        }
    }
}

Script.update.connect(update);
