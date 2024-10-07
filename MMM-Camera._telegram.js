const { exec } = require('child_process');

Module.register("MMM-Camera", {
    defaults: {
        countdown: 5
    },

    start: function() {
        this.cameraPreview = null;
        this.countdownValue = this.config.countdown;
    },

    getDom: function() {
        const wrapper = document.createElement("div");

        const video = document.createElement("video");
        video.id = "cameraFeed";
        video.width = 320;
        video.height = 240;
        wrapper.appendChild(video);

        this.countdownDisplay = document.createElement("div");
        this.countdownDisplay.id = "countdown";
        wrapper.appendChild(this.countdownDisplay);

        return wrapper;
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "TAKE_PICTURE") {
            this.startCameraFeed();
        }
    },

    startCameraFeed: function() {
        const video = document.getElementById("cameraFeed");
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            });

        // Start countdown
        this.countdownValue = this.config.countdown;
        this.updateCountdown();
    },

    updateCountdown: function() {
        if (this.countdownValue > 0) {
            this.countdownDisplay.innerHTML = this.countdownValue;
            this.countdownValue--;
            setTimeout(() => this.updateCountdown(), 1000);
        } else {
            this.takePicture();
        }
    },

    takePicture: function() {
        const video = document.getElementById("cameraFeed");

        // Stop the video stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        // Call the Python script to capture and send the image
        exec('python3 /path/to/your/camera_control.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error output: ${stderr}`);
                return;
            }
        