// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'Chat' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'Chat.controllers' is found in controllers.js
angular.module('Chat', ['ionic', 'firebase', 'configs', 'directives', 'controllers', 'services', 'routes', 'angular-md5'])

.run(function($ionicPlatform, Auth, $rootScope, $ionicLoading, $location, UserService, firebase) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        Auth.$onAuthStateChanged(function(authData) {
            if (authData) {
                var ref = firebase.database().ref();
                ref.child("users").child(authData.uid).once('value', function(snapshot) {
                    var user = snapshot.val();
                    $rootScope.currentUser = user;
                    UserService.saveProfile(user);
                    UserService.trackPresence();
                });
            } else {
                $ionicLoading.hide();
                $location.path('/login');
            }
        });

        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
    });
})