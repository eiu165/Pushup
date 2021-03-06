/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */




var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    //    onLoad: function () {
    //        this.bindEvents();
    //        },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function () {
        app.receivedEvent('deviceready');


        navigator.notification.alert("Your device: " + device.platform);

        $('#savebutton').click(function () {
            window.localStorage.setItem("name", $('#name').val());
            $('#nameHome').show();
        });

        $('#clearbutton').click(function () {
            window.localStorage.removeItem("name");
            $('#name').val('');
            $('#nameHome').hide();
        });

        $('#home').live('pageshow', function () {
            $('#nameHome').hide();
            var personName = window.localStorage.getItem("name");
            console.log(' the person name is :' + personName);
            //$('#nameLabel').text(personName);
            if (personName != null) {
                $('#nameLabel').text(personName);
            } else {
                $('#nameLabel').text('');
            }


            //            if (personName.length > 0) {  this breaks the js, there is no personName after clear
            //                $('#nameLabel').text(personName);
            //            } else {
            //                $('#nameLabel').text('');
            //            }
        });

        $('#devicepage').live('pageshow', function () {
            $("#devicename").html(device.name);
            $("#devicephonegap").html(device.cordova);
            $("#deviceplatform").html(device.platform);
            $("#deviceuuid").html(device.uuid);
            $("#deviceversion").html(device.version);

            navigator.notification.alert("Your device: " + device.platform);
        });

        $('.goMap').live('click', function () {
            console.log('navigator.geolocation: ' + navigator.geolocation);
            if (navigator.geolocation) {
                app.detectBrowser();
                navigator.geolocation.getCurrentPosition(function (position) {
                    app.Newinitialize(position.coords.latitude, position.coords.longitude);
                });
            } else {
                console.log('navigator.geolocation  not there ');
                app.detectBrowser();
                app.Newinitialize(52.636161, -1.133065);
            }
            console.log('about to hide button : ');
            $('.goMap').hide();
        });

        $('#camerapage').live('pageshow', function () {
            $('#takepicture').click(function () {
                navigator.camera.getPicture(app.onSuccess, app.onError, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true });
                //                navigator.device.capture.captureImage(app.captureSuccess, app.captureError, { limit: 1 });
            });
        });

        $('#accelerometer').live('pageshow', function () {
            var wId = navigator.accelerometer.watchAcceleration(app.acceleratorSuccess, app.acceleratorError, { frequency: 1000 });

            /*
            Curious about the code? Great! Welcome to this code ;)
            Feel free to copy and use this code
            If you are going to blog or tweet about it or if you are going to create a better
            code, please mantain the link to www.mobilexweb.com or @firt in Twitter.
            */
            var x = 300; // Position Variables
            var y = 0;
            var vx = 0; // Speed - Velocity
            var vy = 0;
            var ax = 0; // Acceleration
            var ay = 0;

            var delay = 10;
            var vMultiplier = 0.01;

            if (window.DeviceMotionEvent == undefined) {
                document.getElementById("no").style.display = "block";
                document.getElementById("yes").style.display = "none";

            } else {
                window.ondevicemotion = function (event) {
                    ax = event.accelerationIncludingGravity.x;
                    ay = event.accelerationIncludingGravity.y;
                    console.log("Accelerometer data - x: " + event.accelerationIncludingGravity.x + " y: " + event.accelerationIncludingGravity.y + " z: " + event.accelerationIncludingGravity.z);
                }

                setInterval(function () {
                    vy = vy + -(ay);
                    vx = vx + ax;

                    var ball = document.getElementById("ball");
                    y = parseInt(y + vy * vMultiplier);
                    x = parseInt(x + vx * vMultiplier);

                    if (x < 0) { x = 0; vx = 0; }
                    if (y < 0) { y = 0; vy = 0; }
                    if (x > document.documentElement.clientWidth - 100) { x = document.documentElement.clientWidth - 100; vx = 0; }
                    if (y > document.documentElement.clientHeight - 150) { y = document.documentElement.clientHeight - 150; vy = 0; }

                    ball.style.top = y + "px";
                    ball.style.left = x + "px";
                }, delay);
            } //end mobilexweb.com code

        });

        

    }, //onDeviceReady

    Newinitialize: function (lat, lng) {
        var center = new google.maps.LatLng(lat, lng);
        var myOptions = {
            zoom: 18,
            center: center,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        }
        var map = new google.maps.Map(document.getElementById("map"), myOptions);
        var marker = new google.maps.Marker({ position: center, map: map, title: 'You are here?' });
    },

    detectBrowser: function () {
        var useragent = navigator.userAgent;
        var mapdivMap = document.getElementById("map");
        useragent = useragent.toLowerCase();

        if (useragent.indexOf('iphone') != -1 || useragent.indexOf('windows phone') != -1 || useragent.indexOf('ipad') != -1 || useragent.indexOf('android') != -1) {
            //mapdivMap.style.width = '100%';
            mapdivMap.style.width = (window.screen.availWidth) + "px"; // this still doesn't work in android
            mapdivMap.style.height = (window.screen.availHeight) + "px";  //height = 100% didnt work in emulator or devices
            // mapdivMap.style.height = (window.screen.availHeight) + "px";
            //        } else if (useragent.indexOf('android') != -1) {  //having trouble getting map to work on android
            //            mapdivMap.style.height = (screen.height) + "px";
            //            mapdivMap.style.width = (screen.width) + "px";
        } else {
            mapdivMap.style.width = '600px';
            mapdivMap.style.height = '800px';
        }
    },

    onSuccess: function (fileUri) {
        $('#imageuri').html(fileUri);
        $('#imagesrc').attr('src', fileUri);
    },
    onError: function () {
        console.log('error');
    },

    acceleratorSuccess: function (a) {
        $('#aX').html('X-axis : ' + (a.x).toFixed(2));
        $('#aY').html('Y-axis : ' + (a.y).toFixed(2));
        $('#aZ').html('Z-axis : ' + (a.z).toFixed(2));
        $('#aTime').html('Timestamp : ' + (a.timestamp).toFixed(2));
    },

    acceleratorError: function () { },

    //    captureSuccess: function (imageURI) {
    //    },
    //    captureError: function (error) {
    //        console.log('error capture');
    //    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');

        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');



        //var message = parentElement.querySelector('.message');
        //message.setHTML(device.name + ' Device Name ' + device.cordova + ' Cordova Version');
        //$('.message').html(device.name + ' : Device Name <br/>' + device.cordova + ' : Cordova Version <br/>' + device.platform + ' : Device Platform<br/>' + device.uuid + ' : Device UUID<br/>' + device.version + ' : Device Version');
        $('.message').html('Device Name : ' + device.name + '<br/>' + 'Cordova Version: ' + device.cordova + '<br/>' + 'Device Platform: ' + device.platform + '<br/>' + 'Device UUID: ' + device.uuid + '<br/>' + 'Device Version:' + device.version);



        console.log('Received Event: ' + id);
    }
};
