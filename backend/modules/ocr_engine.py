# modules/ocr_engine.py
import cv2
import numpy as np
import pytesseract
from PIL import Image
import os
import json
from pdf2image import convert_from_path
import tempfile
from werkzeug.utils import secure_filename

class OCREngine:
    def __init__(self, config):
        self.config = config
        # Set Tesseract path if provided
        if hasattr(config, 'TESSERACT_CMD'):
            pytesseract.pytesseract.tesseract_cmd = config.TESSERACT_CMD
        
        # Create upload directory if it doesn't exist
        os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)
    
    def preprocess_image(self, image):
        """Preprocess image for better OCR results"""
        # Convert to grayscale if it's a color image
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 11, 2
        )
        
        # Noise removal
        kernel = np.ones((1, 1), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        
        return opening
    
    def load_file(self, filepath):
        """Load image or PDF file and return list of images"""
        if filepath.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff')):
            return [cv2.imread(filepath)]
        elif filepath.lower().endswith('.pdf'):
            # Convert PDF to images
            images = convert_from_path(filepath)
            return [np.array(img) for img in images]
        else:
            raise ValueError("Unsupported file format")
    
    def detect_answer_regions(self, image, template=None):
        """
        Detect answer regions in the image.
        If template is provided, use template matching.
        Otherwise, use general document segmentation.
        """
        if template is not None:
            # Template matching implementation
            pass
        else:
            # Simple document segmentation
            # For this example, we'll divide the page into question regions
            # In a real implementation, this would use more sophisticated techniques
            height, width = image.shape[:2]
            num_regions = 5  # Assuming 5 questions per page
            
            regions = []
            region_height = height // num_regions
            
            for i in range(num_regions):
                y_start = i * region_height
                y_end = (i + 1) * region_height
                region = image[y_start:y_end, 0:width]
                regions.append({
                    'id': f'q{i+1}',
                    'image': region,
                    'coordinates': (0, y_start, width, y_end)
                })
            
            return regions
    
    def extract_text(self, image):
        """Extract text from preprocessed image using OCR"""
        # Configure tesseract for handwritten text
        custom_config = f'--oem 3 --psm 6 -l {self.config.OCR_LANGUAGES}'
        
        # Extract text using OCR
        text = pytesseract.image_to_string(image, config=custom_config)
        
        return text.strip()
    
    def process_answer_sheet(self, file, exam_template=None):
        """
        Process a complete answer sheet and extract text from all regions
        Returns a dictionary mapping question IDs to extracted text
        """
        # Save file if it's a FileStorage object
        if hasattr(file, 'save'):
            filename = secure_filename(file.filename)
            filepath = os.path.join(self.config.UPLOAD_FOLDER, filename)
            file.save(filepath)
        else:
            filepath = file
        
        # Load images from file
        images = self.load_file(filepath)
        
        results = {}
        
        for page_num, image in enumerate(images):
            # Preprocess the image
            preprocessed = self.preprocess_image(image)
            
            # Detect answer regions
            regions = self.detect_answer_regions(preprocessed, exam_template)
            
            # Extract text from each region
            for region in regions:
                region_id = region['id']
                region_image = region['image']
                
                # Further preprocess the region if needed
                region_preprocessed = self.preprocess_image(region_image)
                
                # Extract text
                text = self.extract_text(region_preprocessed)
                
                # Store result
                results[region_id] = text
        
        return results
