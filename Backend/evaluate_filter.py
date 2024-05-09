import ast  # For parsing the provided code safely
from PIL import Image
import cv2
import numpy as np
import traceback

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
