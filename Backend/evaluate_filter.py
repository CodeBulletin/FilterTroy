import ast  # For parsing the provided code safely
from PIL import Image
import cv2
import numpy as np
import traceback
import skimage as ski
import tensorflow as tf
import tensorflow_hub as hub
import requests
from io import BytesIO

libraries = {
    "Image": Image,
    "cv2": cv2,
    "np": np,
    "ski": ski,
    "tf": tf,
    "hub": hub
}

def load_img(src):
    """
    Load an image from a URL and return it as an OpenCV image.

    Args:
        src (str): URL of the image.

    Returns:
        numpy.ndarray: The image in OpenCV format.
    """
    response = requests.get(src)
    image = np.asarray(bytearray(response.content), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

def load_webp_img(src):
    # Download the image
    response = requests.get(src)
    response.raise_for_status()  # Ensure the request was successful

    # Open the image using PIL
    image = Image.open(BytesIO(response.content))

    # Convert the image to a NumPy array
    image_np = np.array(image)
    return image_np


def hex_to_rgb(hex):
    """
    Convert a hex color to an RGB color.

    Args:
        hex (str): The hex color.

    Returns:
        tuple: The RGB color.
    """
    hex = hex.lstrip("#")
    return tuple(int(hex[i:i+2], 16) for i in (0, 2, 4))

functions = {
    "load_image": load_img,
    "load_webp_image": load_webp_img,
    "hex_to_rgb": hex_to_rgb
}

def evaluate_filter(code, data, variables):
    try:
        # Parse the provided code safely
        parsed_code = ast.parse(code)
        
        # Create a namespace for the code to run in
        namespace = libraries
        namespace.update(functions)
        
        # Evaluate the parsed code in the created namespace
        exec(compile(parsed_code, filename="<string>", mode="exec"), namespace)
        
        # Extract the function from the evaluated code
        filter = namespace.get("filter")
        
        if filter:
            # Call the function with the provided data
            result = filter(data, variables)
            return [result, None]
        else:
            return [None, "Error: Function 'filter' not found in the provided code."]
    except Exception as e:
        stack_trace = traceback.format_exc()
        # replace <string> with the name of the file that the code was executed from
        stack_trace = stack_trace.replace("<string>", "filter.py")

        # replace <unknown> with the name of the file that the code was executed from
        stack_trace = stack_trace.replace("<unknown>", "filter.py")

        # remove second line of stack trace
        stack_trace = stack_trace.split("\n")
        stack_trace = stack_trace[:1] + stack_trace[2:]
        stack_trace = "\n".join(stack_trace)

        return [None, stack_trace]
