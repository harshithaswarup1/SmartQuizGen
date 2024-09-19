''' File to check for file existence, extraction of raw data'''
import fitz  # PyMuPDF
from azure.storage.blob import BlobClient, ContainerClient

class BlobFileExtractor:
    'Class having functions to extract data from file , check file existence'
    def __init__(self, connection_string, container_name):
        self.connection_string = connection_string
        self.container_name = container_name
        self.container_client = ContainerClient.from_connection_string\
            (self.connection_string, self.container_name)

    def create_folder(self, folder_name):
        'Folder creation in Azure Storage Container'
        dummy_blob = BlobClient.from_connection_string\
            (self.connection_string, self.container_name, f"{folder_name}/.keep")
        dummy_blob.upload_blob(b"", overwrite=True)

    def extract_blob_content(self, blob_name, output_blob_prefix):
        'Extract blob content'
        blob_exists = self.check_blob_exists(blob_name)
        if not blob_exists:
            # If blob does not exist, upload it to the container
            self.upload_blob(blob_name)
        # Proceed to extract text from PDF and upload the extracted content
        blob_client = BlobClient.from_connection_string\
            (self.connection_string, self.container_name, blob_name)
        blob_data = blob_client.download_blob().readall()  # Reading the file
        pdf_text = self.extract_text_from_pdf(blob_data)    # Extract text from PDF
        output_blob_name = f"{output_blob_prefix}/{blob_name.replace('/', '_')}.txt"
        self.upload_text_to_blob(output_blob_name, pdf_text)

    def check_blob_exists(self, blob_name):
        'Check if blob exists'
        blob_list = self.container_client.list_blobs(name_starts_with=blob_name)
        return any(blob.name == blob_name for blob in blob_list)

    def upload_blob(self, blob_name):
        'Uploading the PDF blob to the container if it does not exist'
        with open(blob_name, "rb") as data:  # Assuming you have the file locally to upload
            blob_client = BlobClient.from_connection_string\
                (self.connection_string, self.container_name, blob_name)
            blob_client.upload_blob(data, overwrite=True)

    def extract_text_from_pdf(self, pdf_data):
        'Extract text from PDF'
        document = fitz.open(stream=pdf_data, filetype="pdf")
        text = ""
        for page_num in range(len(document)):
            page = document.load_page(page_num)
            text += page.get_text()
        return text
        
    def upload_text_to_blob(self, blob_name, text_content):
        'Connecting to Azure to save/upload the extracted files to Azure'
        blob_client = BlobClient.from_connection_string\
            (self.connection_string, self.container_name, blob_name)
        blob_client.upload_blob(text_content, overwrite=True, encoding='utf-8')
