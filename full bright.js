function button_utility_script(inputArr, bindingClass, actionBindMode) {
    actionBindMode ||= 0;
    var button = ModAPI.reflect.getClassById("net.minecraft.client.gui.GuiButton").constructors.find(x => x.length === 6);
    var originalActionPerformed = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(actionBindMode === 2 ? "net.minecraft.client.gui.GuiScreen" : bindingClass, "actionPerformed")];
    var originalInit = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(bindingClass, "initGui")];
    var out = inputArr.flatMap(x => {
        var btn = button(x.uid, x.x, x.y, x.w, x.h, ModAPI.util.str(x.text));
        return btn;
    });
    if (actionBindMode !== 1) {
        ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(actionBindMode === 2 ? "net.minecraft.client.gui.GuiScreen" : bindingClass, "actionPerformed")] = function (...args) {
            var id = ModAPI.util.wrap(args[1]).getCorrective().id;
            var jsAction = inputArr.find(x => x.uid === id);
            if (jsAction) {
                jsAction.click(ModAPI.util.wrap(args[0]));
            }
            return originalActionPerformed.apply(this, args);
        }
    }
    ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(bindingClass, "initGui")] = function (...args) {
        originalInit.apply(this, args);
        var gui = ModAPI.util.wrap(args[0]).getCorrective();
        out.forEach(guiButton => {
            gui.buttonList.add(guiButton);
        });
    }
}

(() => {
    ModAPI.meta.title("Full Bright Toggle");
    ModAPI.meta.description("Adds a button to enable or disable Full Bright mode.");
    ModAPI.meta.credits("Modified by Lemon");

    let fullBright = false;
    
    var fullBrightButton = [{
        text: "Toggle Full Bright",
        click: () => {
            fullBright = !fullBright;
            ModAPI.mc.gameSettings.gammaSetting = fullBright ? 1000 : 1;
            alert(fullBright ? "Full Bright Enabled" : "Full Bright Disabled");
        },
        x: 2, // Top-left corner
        y: 2,
        w: 100,
        h: 20,
        uid: 152715250
    }];

    button_utility_script(fullBrightButton, "net.minecraft.client.gui.GuiOptions", 0);
})();
