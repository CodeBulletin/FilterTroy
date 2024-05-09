import random
import re
import cv2
import base64
import io
from PIL import Image
import os
import shutil

def getRandAlphaStr(length):
    return ''.join(random.choice('abcdefghijklmnopqrstuvwxyz') for i in range(length))

def getRandNumStr(length):
    return ''.join(random.choice('0123456789') for i in range(length))

def validate_email(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if re.match(regex, email):
        return True
    return False

def validate_username(username):
    if len(username) < 3 or len(username) > 50:
        return False
    pattern = r'^[A-Za-z][A-Za-z0-9_]*$'
    # Check if the username matches the pattern
    if re.match(pattern, username):
        return True
    else:
        return False
    
def low_res(image_path, resolution):
    img = cv2.imread(image_path)
    img = cv2.resize(img, (resolution[0], resolution[1]), interpolation=cv2.INTER_AREA)
    cv2.imwrite(image_path, img)

def generateID(length):
    return ''.join(random.choice('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ') for i in range(length))

def base64_to_image_png(base64_string, path=None):
    header, data = base64_string.split(',', 1)

    imgdata = base64.b64decode(data)

    image = Image.open(io.BytesIO(imgdata))

    if path:
        image.save(path, "PNG")

    return image

def copy_file_if_exists(old_name, new_name):
    if os.path.isfile(old_name):
        shutil.copyfile(old_name, new_name)
        return True
    else:
        return False
    
def load_as_base64(image_path):
    img = cv2.imread(image_path)
    retval, buffer = cv2.imencode('.jpg', img)
    pic_str = base64.b64encode(buffer).decode()

    return "data:image/jpg;base64," + pic_str