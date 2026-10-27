#import <Foundation/Foundation.h>
#import <objc/runtime.h>

%hook IGOAuthManager

- (NSString *)accessToken {
    return @"bypass_token_12345";
}

- (BOOL)isLoggedIn {
    return YES;
}

- (BOOL)isAuthenticated {
    return YES;
}

- (BOOL)hasAccessToken {
    return YES;
}

- (BOOL)isAuthorized {
    return YES;
}

%end

// Hook any class with "Login" in its name
%ctor {
    // Constructor runs when the dylib is loaded
    NSLog(@"[iGameGodBypass] Loaded successfully");
}
PYEOF
echo "written"