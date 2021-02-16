/**
 * Modified MIT License
 *
 * Copyright 2017 OneSignal
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * 1. The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * 2. All copies of substantial portions of the Software may only be used in connection
 * with services provided by OneSignal.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
var addedObservers = false;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        //START ONESIGNAL CODE
        //Remove this method to stop OneSignal Debugging
        window.plugins.OneSignal.setLogLevel({logLevel: 6, visualLevel: 0});
  
        var notificationOpenedCallback = function(jsonData) {
            var notificationData = JSON.stringify(jsonData)
            console.log('notificationOpenedCallback: ' + notificationData);
            var notificationID = jsonData.notification.payload.notificationID;
            console.log('notificationID: ' + notificationID);
            var notificationData = jsonData.notification.payload.additionalData.foo;
            console.log('notificationData: ' + notificationData);
        };
        // Set your iOS Settings
        var iosSettings = {};
        iosSettings["kOSSettingsKeyAutoPrompt"] = false;
        iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
               
        window.plugins.OneSignal
          .startInit("YOUR_ONESIGNAL_APP_ID")
          .handleNotificationReceived(function(jsonData) {
            alert("Notification received: \n" + JSON.stringify(jsonData));
            console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
          })
          .handleNotificationOpened(notificationOpenedCallback)
          .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
          .iOSSettings(iosSettings)
          .endInit();

        if (addedObservers == false) {
            addedObservers = true;

            window.plugins.OneSignal.addEmailSubscriptionObserver(function(stateChanges) {
                console.log("Email subscription state changed: \n" + JSON.stringify(stateChanges, null, 2));
            });

            window.plugins.OneSignal.addSubscriptionObserver(function(stateChanges) {
                console.log("Push subscription state changed: " + JSON.stringify(stateChanges, null, 2));
            });

            window.plugins.OneSignal.addPermissionObserver(function(stateChanges) {
                console.log("Push permission state changed: " + JSON.stringify(stateChanges, null, 2));
            });
        }
        // The promptForPushNotificationsWithUserResponse function will show the iOS push notification prompt. 
        // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 6)
        window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
            console.log("User accepted notifications: " + accepted);
        });
    }
};

function getIds() {
    window.plugins.OneSignal.getPermissionSubscriptionState(function(status) {
        document.getElementById("OneSignalUserId").innerHTML = "UserId: " + status.subscriptionStatus.userId;
        document.getElementById("OneSignalPushToken").innerHTML = "PushToken: " + status.subscriptionStatus.pushToken;
        console.log('Player ID: ' + status.subscriptionStatus.userId);
        alert('Player ID: ' + status.subscriptionStatus.userId + "\npushToken = " + status.subscriptionStatus.pushToken);
    });
}

app.initialize();