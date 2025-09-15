# BanRakshak Backend Setup and Running Instructions

## Prerequisites
1. Python 3.8 or higher
2. Node.js 18 or higher (for frontend)
3. Tesseract OCR installed on your system

## Backend Setup

### 1. Navigate to the backend directory
```bash
cd /Users/champakjyotikonwar/My_Projects/BanRakshak/backend
```

### 2. Create and activate a Python virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Install spaCy English model
```bash
python -m spacy download en_core_web_sm
```

### 5. Install Tesseract OCR (if not already installed)

#### On macOS:
```bash
brew install tesseract
```

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install tesseract-ocr
```

#### On Windows:
Download and install from: https://github.com/UB-Mannheim/tesseract/wiki

### 6. Update Tesseract path in the code (if needed)
Edit `main.py` line ~95 to point to your Tesseract installation:
```python
# For macOS/Linux (usually default)
parser = StructuredDocumentParser()

# For Windows (update path as needed)
parser = StructuredDocumentParser(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
```

## Running the Backend

### 1. Start the FastAPI server
```bash
cd /Users/champakjyotikonwar/My_Projects/BanRakshak/backend
python main.py
```

Or alternatively:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Verify the backend is running
Open your browser and go to:
- http://localhost:8000 - Basic health check
- http://localhost:8000/docs - FastAPI automatic documentation
- http://localhost:8000/api/health - Detailed health check

## Frontend Setup

### 1. Navigate to the frontend directory
```bash
cd /Users/champakjyotikonwar/My_Projects/BanRakshak/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Access the application
Open your browser and go to: http://localhost:3000

## API Endpoints

### OCR/NER Endpoints
- `POST /api/ocr/upload` - Upload document for processing
- `GET /api/ocr/status/{task_id}` - Get processing status
- `GET /api/ocr/result/{task_id}` - Get processing results
- `GET /api/ocr/tasks` - List all tasks
- `DELETE /api/ocr/task/{task_id}` - Delete a task

### Health Check Endpoints
- `GET /` - Basic health check
- `GET /api/health` - Detailed health check
- `GET /api/assets/health` - Asset mapping health check

## Testing the Integration

1. Start both backend (port 8000) and frontend (port 3000)
2. Go to the OCR Processor page in the frontend
3. Upload a document (PDF, PNG, JPG)
4. Watch the processing status update in real-time
5. View extracted text and entities once processing is complete

## Troubleshooting

### Common Issues:

1. **Tesseract not found error**
   - Make sure Tesseract is installed and in your PATH
   - Update the tesseract path in the code if needed

2. **spaCy model not found**
   - Run: `python -m spacy download en_core_web_sm`

3. **CORS errors in browser**
   - Make sure backend is running on port 8000
   - Check that frontend is running on port 3000

4. **Import errors**
   - Make sure all Python dependencies are installed
   - Verify you're in the correct virtual environment

5. **File upload errors**
   - Check that the uploads directory is created and writable
   - Verify file size limits and supported formats

### Environment Variables

You can set the following environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)
- `TESSERACT_PATH` - Path to Tesseract executable

## File Structure After Setup

```
BanRakshak/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   ├── uploads/            # Uploaded files directory
│   ├── OCR-NER/           # OCR processing modules
│   └── asset-map/         # GIS processing modules
└── frontend/
    ├── src/
    │   └── app/
    │       ├── config/
    │       │   └── api.ts   # API configuration
    │       └── pages/
    │           └── OCRProcessor.tsx  # Updated with API calls
    └── package.json
```
