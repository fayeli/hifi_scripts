//
// group_teleport_settings.js
//
// Created by Si Fi Faye Li on 4 Oct, 2016
//

(function() { // BEGIN LOCAL_SCOPE

function setupMenu() {
    print("Group Teleport set up Menu");

    Menu.addMenuItem({
        menuName: "Avatar",
        menuItemName: "Group Teleport Settings"
    });
}

setupMenu();

function cleanupMenu() {
    Menu.removeMenuItem("Avatar", "Group Teleport Settings");
}

Script.scriptEnding.connect(function () {
    cleanupMenu();
});

}()); // END LOCAL_SCOPE