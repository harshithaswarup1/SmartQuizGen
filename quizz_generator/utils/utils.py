import random

def random_selection(data):
    'Function to flatten nested data'
    flattened_dict = {}
    for tool, values in data.items():
        flattened_values = [v for val in values for v in val]
        if tool == "mcqs":
            flattened_dict[tool] = random.sample(flattened_values, 20)
        else:
            flattened_dict[tool] = random.sample(flattened_values, 50)
    return flattened_dict