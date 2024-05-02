import ast  # For parsing the provided code safely
from PIL import Image
import cv2
import numpy as np

libraries = {
    "Image": Image,
    "cv2": cv2
}

def evaluate_filter(code, data, variables):
    try:
        # Parse the provided code safely
        parsed_code = ast.parse(code)
        
        # Create a namespace for the code to run in
        namespace = {
            "cv2": cv2,
            "Image": Image,
            "np": np,
        }
        
        # Evaluate the parsed code in the created namespace
        exec(compile(parsed_code, filename="<string>", mode="exec"), namespace)
        
        # Extract the function from the evaluated code
        custom_function = namespace.get("filter")
        
        if custom_function:
            # Call the function with the provided data
            result = custom_function(data, variables)
            return result
        else:
            return "Error: Function 'custom_function' not found in the provided code."
    except Exception as e:
        return f"Error: {str(e)}"
