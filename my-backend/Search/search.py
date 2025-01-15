from transformers import AutoTokenizer, AutoModel
import torch
from .zhipu_api import process_with_ai
import pandas as pd
from datasets import load_dataset
import os

os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
ds = load_dataset("yuanqianhao/arxiv")['train']
embeddings = [torch.tensor(row['embedding']) for row in ds]
ds = ds.remove_columns("embedding")
embeddings = torch.stack(embeddings).to(device)

tokenizer = AutoTokenizer.from_pretrained('BAAI/bge-small-en-v1.5', use_fast=True)
model = AutoModel.from_pretrained('BAAI/bge-small-en-v1.5').to(device)
model.eval()

def search_pdf(pdf_text, n=10):
    ai_result = process_with_ai(pdf_text)
    encoded_input = tokenizer(ai_result, padding=True, truncation=True, return_tensors='pt')

    with torch.no_grad():
        model_output = model(**encoded_input.to(device))
        text_embedding = model_output[0][:, 0]
        text_embedding = torch.nn.functional.normalize(text_embedding, p=2, dim=1).to(device)
        similarities = torch.mm(embeddings, text_embedding.T).squeeze()
        top_n_indices = torch.topk(similarities, n).indices
        selected_data = [ds[i] for i in top_n_indices.tolist()]
    
    return selected_data
