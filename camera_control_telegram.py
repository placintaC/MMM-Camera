from picamera2 import Picamera2
from time import sleep
from PIL import Image
import io
import telegram
from telegram import Bot

# Set up your Telegram Bot token and chat ID
BOT_TOKEN = "<YOUR_TELEGRAM_BOT_TOKEN>"
CHAT_ID = "<YOUR_CHAT_ID>"

# Initialize the Telegram Bot
bot = Bot(token=BOT_TOKEN)

# Initialize the camera
picam2 = Picamera2()
picam2.start_preview()

def capture_and_send_photo():
    picam2.start()
    print("Starting countdown...")
    
    for i in range(5, 0, -1):
        print(f"Taking picture in {i} seconds")
        sleep(1)
    
    # Capture image
    image = picam2.capture_image("rgb")
    img = Image.fromarray(image)

    # Save the image in memory (to avoid writing to disk)
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    # Stop the camera preview
    picam2.stop_preview()

    # Send the image to Telegram
    print("Sending image to Telegram...")
    bot.send_photo(chat_id=CHAT_ID, photo=img_byte_arr)
    print("Image sent!")

if __name__ == "__main__":
    capture_and_send_photo()