from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io

# CONFIG
MODEL_PATH = "best_resnet_city_issues.pth"
NUM_CLASSES = 8
CLASS_NAMES = [
    'Broken Road Sign Issues',
    'Damaged Road issues',
    'Illegal Parking Issues',
    'Littering Garbage on Public Places Issues',
    'Mixed Issues',
    'NA',
    'Pothole Issues',
    'Vandalism Issues'
]

ESTIMATED_TIME = {
    'Broken Road Sign Issues': 2,
    'Damaged Road issues': 3,
    'Illegal Parking Issues': 1,
    'Littering Garbage on Public Places Issues': 1,
    'Mixed Issues': 4,
    'NA': 0,
    'Pothole Issues': 5,
    'Vandalism Issues': 3
}

# TRANSFORMS
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# LOAD MODEL
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18(pretrained=False)
model.fc = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(model.fc.in_features, NUM_CLASSES)
)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model = model.to(device)
model.eval()

# CREATE FASTAPI APP
app = FastAPI(title="Civic Infrastructure Issue Detection API")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, pred_class = torch.max(probs, 1)

    predicted_label = CLASS_NAMES[pred_class.item()]
    confidence_score = confidence.item() * 100
    estimated_days = ESTIMATED_TIME.get(predicted_label, 0)

    return JSONResponse({
        "predicted_issue": predicted_label,
        "confidence": f"{confidence_score:.2f}%",
        "estimated_time_days": estimated_days
    })
