from fastapi import FastAPI, File, UploadFile, Form
import torch
import pytesseract
from utils import map_imagenet_label_to_category, contains_toxic_words
from PIL import Image
import io

app = FastAPI(
    title="Multimodal Analyzer API",
    description="Analyze text and images for sentiment, toxicity, and classification."
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Root endpoint for health check ----
@app.get("/")
def read_root():
    return {"message": "Multimodal Analyzer API is running! Use /analyze to post data."}


# ---- Main analyze endpoint ----
@app.post("/analyze")
async def analyze(text: str = Form(...), file: UploadFile = File(None)):
    # ---- Image Handling ----
    image_class = []
    ocr_text = ""
    if file:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))

        # Dummy probabilities (replace with your real model later)
        probs = torch.tensor([0.7, 0.3])
        top5_prob, top5_catid = torch.topk(probs, 2)

        top_labels = []
        for i in range(top5_catid.size(0)):
            lbl = map_imagenet_label_to_category(int(top5_catid[i].item()))
            top_labels.append({"label": lbl, "score": float(top5_prob[i].item())})
        image_class = top_labels

        # OCR extraction
        try:
            ocr_text = pytesseract.image_to_string(img)
        except Exception as e:
            ocr_text = f"(OCR failed: {str(e)})"

    # ---- NLP Handling ----
    sentiment_result = [{"label": "POSITIVE", "score": 0.95}]  # Dummy values
    summary = text[:50] + "..." if len(text) > 50 else text
    topic_result = "General"

    # ---- Toxicity Scoring ----
    image_toxicity_score = contains_toxic_words(ocr_text)
    text_toxicity_score = contains_toxic_words(text)

    # ---- Fusion Logic ----
    sentiment_label = sentiment_result[0]["label"]
    automated_response = "Thanks for the input. Here's what we found."

    if (sentiment_label.lower().startswith("negative") or text_toxicity_score > 0.5) and image_toxicity_score > 0.5:
        automated_response = "⚠️ Warning: Toxicity detected in both text and image. Please follow community guidelines."
    elif sentiment_label.lower().startswith("negative"):
        automated_response = "🙁 We’re sorry about your negative experience. We’ll investigate and get back to you."
    elif sentiment_label.lower().startswith("positive"):
        automated_response = "😊 Thanks for the positive feedback! We’re glad you liked it."

    response = {
        "text_sentiment": sentiment_result,
        "text_summary": summary,
        "topic_classification": topic_result,
        "image_classification": image_class,
        "ocr_text": ocr_text,
        "image_toxicity_score": image_toxicity_score,
        "text_toxicity_score": text_toxicity_score,
        "automated_response": automated_response,
    }

    return response

# ---- Run using uvicorn ----
if __name__ == "__main__":
    import uvicorn
    # "main:app" must be a string to enable reload=True
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)