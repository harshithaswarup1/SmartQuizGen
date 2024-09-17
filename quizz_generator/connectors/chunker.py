''' File having to function to call openAI'''
import json
import textwrap
import openai
from azure.storage.blob import BlobServiceClient, BlobClient

class AzureFileReader:
    ' Class having functions to read data and send data to call openAI'
    def __init__(self, connection_string, container_name, blob_directory):
        self.connection_string = connection_string
        self.container_name = container_name
        self.blob_directory = blob_directory
        self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        self.container_client = self.blob_service_client.get_container_client(self.container_name)

    def list_blobs(self):
        """List all blobs in the specified blob directory."""
        blob_list = []
        try:
            blobs = self.container_client.list_blobs(name_starts_with=self.blob_directory)
            for blob in blobs:
                blob_list.append(blob.name)
        except Exception as e:
            print(f"Error listing blobs: {str(e)}")
        return blob_list

    def download_blob(self, blob_name, download_path):
        """Download a specific blob to a local file."""
        try:
            blob_client = BlobClient.from_connection_string\
            (self.connection_string, self.container_name, blob_name)
            with open(download_path, "wb") as download_file:
                download_file.write(blob_client.download_blob().readall())
        except Exception as e:
            print(f"Error downloading blob {blob_name}: {str(e)}")

    def read_blob_content(self, blob_name):
        """Read the content of a specific blob and return it as a string."""
        try:
            blob_client = BlobClient.from_connection_string\
            (self.connection_string, self.container_name, blob_name)
            blob_data = blob_client.download_blob().readall()
            blob_content = blob_data.decode('utf-8')
            return blob_content
        except Exception as e:
            return None

    def process_large_content(self, blob_name):
        """Process and split the blob content into chunks for further processing."""
        content = self.read_blob_content(blob_name)
        if content:
            # Split content into chunks of 2048 characters each
            chunk_size = 2048
            chunks = textwrap.wrap(content, chunk_size)
            return chunks
        return None
