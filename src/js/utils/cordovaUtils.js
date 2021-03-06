import { browserHistory, hashHistory } from "react-router";
import { oAuthLog } from "./logging";

export function isWebApp () {
  return window.cordova === undefined;
}

export function isCordova () {
  return window.cordova !== undefined;
}

// see https://github.com/ReactTraining/react-router/blob/v3/docs/guides/Histories.md
export function historyPush (route) {
  // console.log("historyPush, route:", route);
  if (isCordova()) {
    hashHistory.push(route);
  } else {
    browserHistory.push(route);
  }
}

export function cordovaDot (path) {
  if (isCordova()) {
    return "." + path;
  } else {
    return path;
  }
}

function cordovaOpenSafariViewSub (requestURL, onExit) {

  // console.log("cordovaOpenSafariView -1- requestURL: " + requestURL);
  SafariViewController.isAvailable(function () {            // eslint-disable-line no-undef
    oAuthLog("cordovaOpenSafariView requestURL: " + requestURL);
    SafariViewController.show({                                       // eslint-disable-line no-undef
        url: requestURL,
      },

      function (result) {
        if (result.event === "opened") {
          oAuthLog("cordovaOpenSafariView opened url: " + requestURL);
        } else if (result.event === "loaded") {
          oAuthLog("cordovaOpenSafariView loaded url: " + JSON.stringify(result));
        } else if (result.event === "closed") {
          oAuthLog("cordovaOpenSafariView closed: " + JSON.stringify(result));
          if (onExit) {
            onExit();
          }
        }
      },

      function (msg) {
        oAuthLog("cordovaOpenSafariView KO: " + JSON.stringify(msg));
      }
    );
  });
}

/**
 * https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller (is installed in the WeVoteCordova project)
 * https://medium.com/@jlchereau/stop-using-inappbrowser-for-your-cordova-phonegap-oauth-flow-a806b61a2dc5
 * Sample: https://github.com/primashah/RHMAP-Keycloak-Crodova-Client/blob/03f31a2a0a23fb243b3d5095cd6ca6145b69df7b/www/js/keycloak.js
 * @param requestURL, the URL to open
 * @param timeout, a hack delay before invoking, but it fails without the timeout
 */
export function cordovaOpenSafariView (requestURL, onExit, timeout) {
  setTimeout(cordovaOpenSafariViewSub, timeout, requestURL, onExit);
}

/*
  bottom, Set or retrieves the bottom coordinate of the rectangle surrounding the object content. (relative to top of screen)
  height, Gets the height of the rectangle that surrounds the object content.
  left, Sets or retrieves the left coordinate of the rectangle surrounding the object content. (relative to left of screen)
  length, Sets or retrieves the number of objects in a collection.
  right, Sets or retrieves the right coordinate of the rectangle surrounding the object content. (relative to left of screen)
  top, Sets or retrieves the top coordinate of the rectangle surrounding the object content. (relative to top of screen)
  width, Gets the width of the rectangle that surrounds the object content.
  ----
  Needed in div you want to get the rectangle info from:
       <div className={profilePopUpOpen} ref={ (el) => (this.instance = el) }>
  Then ...
    componentDidMount () {
      enclosingRectangle("HeaderBarProfilePopUp, ", this.instance);
    }
*/
export function enclosingRectangle (objectNameString, instance) {
  let rect = instance.getBoundingClientRect();

  // Please don't remove this console.log line
  console.log(objectNameString +
    " BoundingClientRect: left " + rect.left +
    ", top " + rect.top +
    ", right " + rect.right +
    ", bottom " + rect.bottom +
    ", x " + rect.x +
    ", y " + rect.y +
    ", width " + rect.width +
    ", height " + rect.height);
}

// webapp, webapp:iOS, webapp:Android
export function deviceTypeString () {
  let deviceString = isWebApp() ? "webapp" : "cordova";
  if (isCordova() && window.device) {
    /*global device*/
    /*eslint no-undef: ["error", { "typeof": true }] */
    deviceString += ":" + device.platform;
  }

  return deviceString;
}

export function isIOS () {
  return isCordova() && window.device && device.platform === "iOS";
}

export function isIPhoneXorXS () {
  // Get the device pixel ratio
  let ratio = window.devicePixelRatio || 1;

  // Define the users device screen dimensions
  let screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };

  // iPhone X and XS are 1125 x 2436
  return isIOS() && (screen.width === 1125 && screen.height === 2436);
}

export function isIPhone678Plus () {
  let ratio = window.devicePixelRatio || 1;
  let screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  return isIOS() && screen.width === 1242 && screen.height === 2208;
}

export function isIPhone678 () {
  let ratio = window.devicePixelRatio || 1;
  let screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  return isIOS() && screen.width === 750 && screen.height === 1334;
}

export function isIPhoneXR () {
  let ratio = window.devicePixelRatio || 1;
  let screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  return isIOS() && screen.width === 828 && screen.height === 1792;
}

export function isIPhoneXSMax () {
  let ratio = window.devicePixelRatio || 1;
  let screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };
  return isIOS() && screen.width === 1242 && screen.height === 2688;
}

export function hasIPhoneNotch () {
  return isIPhoneXorXS() || isIPhoneXR() || isIPhoneXSMax();
}

export function isAndroid () {
  return isCordova() && window.device && device.platform === "Android";
}

export function getAndroidSize () {
  let ratio = window.devicePixelRatio || 1;
  let screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio,
  };

  let size = screen.width * screen.height;
  let sizeString = "default";

  /* sm = 480*800 = 384,000      Nexus One
     md = 1080*1920 = 2,073,600  PixelXL, Nexus5X, Moto G5
     lg = 1440*2560 = 3,686,400  Nexus6P
     xl = 2560*1600 = 4,096,000  Nexus10 Tablet   */

  if (size > 3.7E6) {
    sizeString = "-cordova-android-xl";
  } else if (size > 3E6) {
    sizeString = "-cordova-android-lg";
  } else if (size > 1E6) {
    sizeString = "-cordova-android-md";
  } else {
    sizeString = "-cordova-android-sm";
  }
  return sizeString;
}

export function getHeadingSize () {
  let sizeString = "";
  if (isCordova()) {
    if (isIPhoneXSMax()) {
      sizeString = "-cordova-ios-xs-max";
    } else if (isIPhoneXorXS()) {
      sizeString = "-cordova-ios-x";
    } else if (isIPhoneXR()) {
      sizeString = "-cordova-ios-xr";
    } else if (isIPhone678Plus()) {
      sizeString = "-cordova-ios-678-plus";
    } else if (isIPhone678()) {
      sizeString = "-cordova-ios-678";
    } else if (isAndroid()) {
      sizeString = getAndroidSize();
    } else {
      sizeString = "-cordova-default";
    }
  }
  return sizeString;
}


