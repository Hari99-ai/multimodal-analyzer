# Multimodal Analyzer

## Overview

This is a multimodal content analysis application that processes both text and images to provide sentiment analysis, toxicity detection, and image classification. The system consists of a React frontend built with Vite and a FastAPI backend that handles file uploads and analysis processing. The application can analyze uploaded images using computer vision models, extract text through OCR, and combine this with user-provided text for comprehensive content analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool and development server
- **Build System**: Vite configuration optimized for React development with hot module replacement
- **Development Server**: Configured to run on port 5000 with host binding for external access
- **Proxy Configuration**: API requests to `/analyze` are proxied to the backend running on port 8000

### Backend Architecture
- **Framework**: FastAPI for REST API development with automatic OpenAPI documentation
- **CORS Middleware**: Configured to allow cross-origin requests from any domain for development flexibility
- **File Upload Handling**: Multipart form data processing for image uploads alongside text input
- **Image Processing Pipeline**: 
  - PIL (Pillow) for image manipulation and format handling
  - PyTesseract for Optical Character Recognition (OCR) text extraction
  - PyTorch integration for machine learning model inference
- **Content Analysis Components**:
  - Image classification using ImageNet label mapping
  - Text toxicity detection using keyword-based filtering
  - Sentiment analysis capabilities (extensible architecture)

### Data Processing Architecture
- **Image Classification**: Utilizes PyTorch tensors for model predictions with top-k classification results
- **OCR Integration**: Extracts text content from uploaded images for additional analysis
- **Toxicity Detection**: Rule-based system using predefined toxic word lists with scoring mechanism
- **Label Mapping**: ImageNet class index mapping for human-readable classification results

### API Design
- **RESTful Endpoints**: Single main analysis endpoint accepting both text and file uploads
- **Multimodal Input**: Supports combined text and image analysis in a single request
- **JSON Response Format**: Structured output containing classification scores, labels, and analysis results

## External Dependencies

### Backend Dependencies
- **FastAPI**: Web framework for building the REST API with automatic documentation
- **Uvicorn**: ASGI server for running the FastAPI application
- **Pillow (PIL)**: Image processing library for handling various image formats
- **PyTesseract**: Python wrapper for Google's Tesseract OCR engine
- **Python-multipart**: Form data parsing for file upload handling
- **PyTorch**: Machine learning framework for deep learning model inference
- **Torchvision**: Computer vision library providing pre-trained models and utilities

### Frontend Dependencies
- **React**: User interface library for building interactive components
- **React-DOM**: DOM-specific methods for React applications
- **Vite**: Fast build tool and development server with React plugin support
- **@vitejs/plugin-react**: Official Vite plugin for React support with Fast Refresh

### System Requirements
- **Tesseract OCR**: External OCR engine that must be installed on the system
- **ImageNet Classification Data**: Optional JSON file for enhanced label mapping
- **PyTorch Models**: Pre-trained models for image classification (loaded dynamically)

### Development Tools
- **CORS Configuration**: Enables cross-origin requests for frontend-backend communication
- **Proxy Setup**: Vite dev server proxy for seamless API integration during development
- **Hot Module Replacement**: Instant code updates during development without full page reloads