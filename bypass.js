// Frida script to bypass IOSgods login check in iGameGod.framework
// Usage: frida -U -f com.StefMorojna.SpaceflightSimulator -l bypass.js --no-pause
// Or attach: frida -U SpaceflightSimulator -l bypass.js

if (ObjC.available) {
    var IGOAuthManager = ObjC.classes.IGOAuthManager;
    if (IGOAuthManager) {
        // Hook accessToken to return a fake non-nil token
        var accessToken = IGOAuthManager["- accessToken"];
        if (accessToken) {
            Interceptor.attach(accessToken.implementation, {
                onLeave: function (retval) {
                    // Return a fake NSString
                    var fakeToken = ObjC.classes.NSString.stringWithString_("bypass_token_12345");
                    retval.replace(fakeToken);
                }
            });
            console.log("[+] Hooked -[IGOAuthManager accessToken]");
        }

        // Hook any isLoggedIn/isAuthenticated method if present
        var methods = ["isLoggedIn", "isAuthenticated", "hasAccessToken", "isAuthorized"];
        methods.forEach(function (m) {
            var sel = "-" + " " + m;
            if (IGOAuthManager[sel]) {
                Interceptor.attach(IGOAuthManager[sel].implementation, {
                    onLeave: function (retval) {
                        retval.replace(1); // YES/true
                    }
                });
                console.log("[+] Hooked -[IGOAuthManager " + m + "]");
            }
        });
    } else {
        console.log("[-] IGOAuthManager class not found");
    }

    // Also hook any method containing "LoginRequired" or "showLogin"
    // by scanning all classes
    for (var className in ObjC.classes) {
        if (className.indexOf("Login") !== -1 || className.indexOf("Auth") !== -1) {
            var cls = ObjC.classes[className];
            var methods = cls.$ownMethods;
            methods.forEach(function (m) {
                if (m.toLowerCase().indexOf("login") !== -1 && m.indexOf("-") === 0) {
                    // Log but don't auto-hook to avoid crashes
                    // console.log("  Found method:", className, m);
                }
            });
        }
    }
} else {
    console.log("ObjC not available");
}
PYEOF
echo "written"; cat /tmp/opencode/bypass.js | head -5