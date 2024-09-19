'app.py file for flask application'
import os
from dotenv import load_dotenv
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from connectors.azure_blob_access import AzureBlobStorage
from utils.extract_raw_content import BlobFileExtractor
from connectors.chunker import AzureFileReader
from conversation.llm import MultiChoiceQA, Flashcards
import json
import random
from utils.utils import random_selection

load_dotenv()

# Print all environment variables
for key, value in os.environ.items():
    print(f"{key}: {value}")

api_key = os.getenv('API_KEY')
print(f"API Key from environment: {api_key}")

# Load configuration from config.json
with open('config.json') as config_file:
    config = json.load(config_file)

app = Flask(__name__)
CORS(app)

CONNECTION_STRING = os.getenv('CONNECTION_STRING')
API_KEY = os.getenv('API_KEY')
print(f"API Key: {API_KEY}")

BLOB_DIRECTORY = config['BLOB_DIRECTORY']
OUTPUT_BLOB_PREFIX = config['OUTPUT_BLOB_PREFIX']
DATADUMP_FOLDER = config['DATADUMP_FOLDER']



@app.route('/')
def home():
    return "Welcome to the Flask App!"

@app.route('/generate-quiz', methods=['GET'])
def generate_quiz():
    'Main function call'
    subject_name = request.args.get('subject').lower()
    if not subject_name:
        return jsonify({"status": "error", "message": "Subject name is required."}), 400
    azure_file_path = f"{DATADUMP_FOLDER}/{subject_name}.json"
    # Initialize Azure Blob Storage
    azure_storage = AzureBlobStorage(CONNECTION_STRING, subject_name,\
                                      BLOB_DIRECTORY,azure_file_path)
    if azure_storage.file_exists():
        json_data = azure_storage.download_blob(azure_file_path)
        data = json.loads(json_data)
        flattened_dict = random_selection(data)
        return jsonify({"status": "success", "mcqs": flattened_dict["mcqs"],\
                         "flashcards": flattened_dict["flashcards"]})
    else:
        blobs = azure_storage.list_blobs()
        selected_blobs = blobs[2:3]
        extractor = BlobFileExtractor(CONNECTION_STRING, subject_name)
        for blob_name in selected_blobs:
            extractor.extract_blob_content(blob_name, OUTPUT_BLOB_PREFIX)
        azure_file_reader = AzureFileReader(CONNECTION_STRING, subject_name, OUTPUT_BLOB_PREFIX)
        final_mcq_list = []
        final_flashcard_list = []
        for blob_name in selected_blobs:
            extracted_blob_name = f"{OUTPUT_BLOB_PREFIX}/{blob_name.replace('/', '_')}.txt"
            chunks = azure_file_reader.process_large_content(extracted_blob_name)
            if chunks:
                print (API_KEY)
                multi_choice_qa = MultiChoiceQA(API_KEY)
                flashcards = Flashcards(API_KEY)
                for chunk in chunks:
                    response_mcqa = multi_choice_qa.call_llm(chunk)
                    if response_mcqa:
                        final_mcq_list.append(response_mcqa)
                    response_flashcards = flashcards.call_llm(chunk)
                    if response_flashcards:
                        final_flashcard_list.append(response_flashcards)
        final_mcq_list = [item for item in final_mcq_list if item is not\
                           None and item != []]
        final_flashcard_list = [item for item in final_flashcard_list if\
                                 item is not None and item != []]

        data = {
            "mcqs": final_mcq_list,
            "flashcards": final_flashcard_list
        }
        azure_storage.upload_blob(azure_file_path, json.dumps(data).encode('utf-8'))
        flattened_dict = random_selection(data)
        return jsonify({"status": "success", "mcqs": flattened_dict["mcqs"],\
                         "flashcards": flattened_dict["flashcards"]})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
