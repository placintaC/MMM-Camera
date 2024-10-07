from picamera2 import Picamera2
from time import sleep
import io
from PIL import Image

picam2 = Picamera2()
picam2.start_preview()

def capture_image():
    picam2.start()
    print("Starting countdown...")
    for i in range(5, 0, -1):
        print(f"Taking picture in {i} seconds")
        sleep(1)
    image = picam2.capture_image("rgb")
    img = Image.fromarray(image)
    img.save("photo.jpg")
    print("Picture taken and saved as photo.jpg")
    picam2.stop_preview()