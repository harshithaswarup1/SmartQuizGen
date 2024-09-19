import os
from azure_blob_to_openai import AzureFileReader
import openai
import json
import re
from dotenv import load_dotenv

load_dotenv()

# Load configuration from config.json
with open('config.json') as config_file:
    config = json.load(config_file)

class OpenAIBase:
    def __init__(self, api_key):
        self.api_key = api_key
        openai.api_key = self.api_key

    def call_llm(self, content):
        raise NotImplementedError("Subclasses should implement this method.")

class MultiChoiceQA(OpenAIBase):
    def __init__(self, api_key):
        super().__init__(api_key)

    def parse_response(self,text):       
        cleaned_json = text.replace('```json\n', '').replace('\n```', '').replace('\n\t', ' ').replace('\n', ' ').strip()
        response_content = cleaned_json.strip()
        # response_content = re.sub(r'^json\s*', '', text)
        # response_content = re.sub(r'\s*$', '', response_content)
        if response_content:
            questions = json.loads(response_content)
            return questions                
        else:
            print("Empty response content received.")

        

    def call_llm(self, content):
    # Implement the OpenAI API call for MultiChoiceQA
        print ("Calling Open AI for MCQ")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Based on the following text, generate a list of multiple-choice questions in the format specified below. "
                        "You will always respond in python array format." 
                        "Each question should have one correct answer and three incorrect answers. Strictly format the response as a JSON array.\n\n"
                        "questions = [\n"
                        "  {\n"
                        "    question: \"Q1\",\n"
                        "    options: [\n"
                        "      { answer: \"Answer1\", isCorrect: false },\n"
                        "      { answer: \"Answer2\", isCorrect: false },\n"
                        "      { answer: \"Answer3\", isCorrect: true },\n"
                        "      { answer: \"Answer4\", isCorrect: false }\n"
                        "    ]\n"
                        "  }\n"
                        "]"
                        
                    )
                },
                {"role": "user", "content": content}
            ]        
        )
        try:
            response_content = self.parse_response(response.choices[0].message["content"])
            return response_content
        except:
            print("Failed Parsing")
        
        
         
    

class Flashcards(OpenAIBase):
    def __init__(self, api_key):
        super().__init__(api_key)



    def parse_response(self, text):
        
        cleaned_json = text.replace('```json\n', '').replace('\n```', '').replace('\n\t', ' ').replace('\n', ' ').strip()

        response_content = cleaned_json.strip()
        if response_content:
            try:
                flashcarddata = json.loads(response_content)
                return flashcarddata
            except json.JSONDecodeError as e:
                print(f"JSON decoding failed: {e}")
                return None
        else:
            print("Empty response content received.")
            return None



    def call_llm(self, content):
        print ("Calling Open AI for FlashCards")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Based on the following text, generate a list of 10 flashcards in the format specified below. "
                        "Each flashcard should have a key that represents the topic name and a corresponding description. "
                        "Ensure that each key is a topic name and that the descriptions accurately reflect the provided content.\n\n"
                        "Strictly format the response as a JSON array."
                        
                    )
                },
                {
                    "role": "user",
                    "content": content  # Pass the user-provided content
                }
            ]
        )
        
        raw_response_content = response.choices[0].message["content"]
        try:
            response_content = self.parse_response(raw_response_content)
            return response_content
        except Exception as e:
            print(f"Failed Parsing: {e}")
            return None

           
        

if __name__ == "__main__":
    # Load sensitive data from environment variables for security
    connection_string = os.getenv("CONNECTION_STRING")
    api_key = os.getenv("API_KEY")
    if not connection_string or not api_key:
        print("Missing required environment variables. Please set AZURE_STORAGE_CONNECTION_STRING and OPENAI_API_KEY.")
        exit(1)

    container_name = "science"
    blob_directory = "extracted_content"
    azure_storage = AzureFileReader(connection_string, container_name, blob_directory)    
    blob_name = "extracted_content/raw_text_jesc101.pdf.txt"
    chunks = azure_storage.process_large_content(blob_name)
    final_mcq_list = []
    
    if chunks:
        # Instantiate OpenAI classes
        print ("llm",api_key)
        multi_choice_qa = MultiChoiceQA(api_key)
        for chunk in chunks:
            # Process chunk with each OpenAI class
            response_mcqa = multi_choice_qa.call_llm(chunk)
            final_mcq_list.append(response_mcqa)
            with open("example_output.json", "w+") as stream:
                json.dump(final_mcq_list, stream)
        print ("-------------Final List Saved-------------",final_mcq_list)
            
    else:
        print("Failed to retrieve blob content.")