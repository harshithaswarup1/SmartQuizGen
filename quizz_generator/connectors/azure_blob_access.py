''' File having function to connect azure'''
from azure.storage.blob import BlobServiceClient
from utils.extract_raw_content import BlobFileExtractor

class AzureBlobStorage:
    "class having functions to access azure"
    def __init__(self, connection_string, container_name, blob_directory,azure_file_name):
        self.connection_string = connection_string
        self.container_name = container_name
        self.blob_directory = blob_directory
        self.file_name = azure_file_name
        self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        self.container_client = self.blob_service_client.get_container_client(self.container_name)
        self.blob_extractor = BlobFileExtractor(connection_string, container_name)

    def list_blobs(self):
        """List all blobs in the specified directory within the container."""
        blobs = [blob.name for blob in\
                  self.container_client.list_blobs(name_starts_with=self.blob_directory)]
        print(f"Blobs in directory '{self.blob_directory}': {blobs}")
        return blobs

    def extract_blobs(self, max_files=2):
        """Extract content from a limited number of blobs."""
        blobs = self.list_blobs_in_folder(self.blob_directory)
        output_blob_prefix = "extracted_content"
        for blob_name in blobs[:max_files]:
            self.blob_extractor.extract_blob_content(blob_name, output_blob_prefix)

    def upload_blob(self, blob_name, data):
        """Upload data to a specified blob in the container."""
        blob_client = self.container_client.get_blob_client(blob_name)
        blob_client.upload_blob(data, overwrite=True)

    def download_blob(self, blob_name):
        """Download data from a specified blob."""
        blob_client = self.container_client.get_blob_client(blob_name)
        download_stream = blob_client.download_blob()
        return download_stream.readall()

    def file_exists(self):
        """Check if a specific file exists in the 'datadump' folder within the container."""
        try:
            blob_client = self.container_client.get_blob_client(self.file_name)
            blob_properties = blob_client.get_blob_properties()
            print(f"Blob '{self.file_name}' exists.")
            return True
        except Exception as e:
            print(f"Blob '{self.file_name}' does not exist. Error: {e}")
            return False
        