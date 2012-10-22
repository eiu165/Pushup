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

        //navigator.notification.alert("Your device: " + device.platform);

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
            var wId = navigator.accelerometer.watchAcceleration(acceleratorSuccess, acceleratorError, { frequency: 1000 });
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

        if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 || useragent.indexOf('Windows Phone') != -1 || useragent.indexOf('iPad') != -1) {
            mapdivMap.style.width = '100%';
            mapdivMap.style.height = (window.innerHeight) + "px";  //height = 100% didnt work in emulator

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
        $('#aX').html('X-axis' + a.x);
        $('#aY').html('Y-axis' + a.y);
        $('#aZ').html('Z-axis' + a.z);
        $('#aTime').html('Timestamp' + a.timestamp);
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
        $('.message').html(device.name + ' : Device Name <br/>' + device.cordova + ' : Cordova Version <br/>' + device.platform + ' : Device Platform<br/>' + device.uuid + ' : Device UUID<br/>' + device.version + ' : Device Version');



        console.log('Received Event: ' + id);
    }
};
