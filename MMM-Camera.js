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
        
        // Create a video element for previewing the camera feed
        const video = document.createElement("video");
        video.id = "cameraFeed";
        video.width = 320;
        video.height = 240;
        wrapper.appendChild(video);

        // Create a countdown display
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
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop the video stream after the picture is taken
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        // Display the picture or save it
        const dataURL = canvas.toDataURL("image/png");
        this.sendNotification("PICTURE_TAKEN", dataURL);
    }
});