import torch

# # Load the PyTorch model
# model = torch.load('/home/atpl-4/.llama/checkpoints/Llama3.3-70B-Instruct/consolidated.00.pth', map_location='cpu',weights_only=True)

# # Save model weights as a binary file
# with open('/home/atpl-4/llama.cpp/scripts/consolidated.00.bin', 'wb') as f:
#     for param in model.parameters():
#         param.data.numpy().tofile(f)




from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

# Load the model
def load_model():
    print("Loading model...")
    tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-offensive")
    model = AutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-offensive")
    print("Model loaded successfully!")
    return tokenizer, model

# Predict offensive language
def predict_offensive_language(tokenizer, model, text, threshold=0.3):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)
    probabilities = F.softmax(outputs.logits, dim=1).detach().cpu().numpy()[0]

    print(f"Probabilities: {probabilities}")
    offensive_score = probabilities[1]  # Assuming index 1 corresponds to "offensive"
    
    return "This sentence is offensive" if offensive_score > threshold else "This sentence is not offensive"

# Example usage
if __name__ == "__main__":
    try:
        tokenizer, model = load_model()

        test_text1 = "Horrible experience"
        result1 = predict_offensive_language(tokenizer, model, test_text1)
        print(result1)

        test_text2 =" Terrible things are happening   upload requests with Content-Type: multipart"
        result2 = predict_offensive_language(tokenizer, model, test_text2)
        print(result2)
    except Exception as e:
        print("Error:", str(e))
