#!/usr/bin/env python3
"""
📊 Script Unificado de Entrenamiento (ResNet50 y MobileNetV2)
Acepta argumentos por CLI o un archivo de configuración JSON.

Uso:
    python train.py --model mobilenet_v2 --epochs 20 --batch-size 32
    python train.py --config config_train.json
"""

import os
import sys
import json
import csv
import time
import argparse
from pathlib import Path
from datetime import datetime

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import transforms, models
from PIL import Image
from sklearn.metrics import classification_report, accuracy_score, f1_score
import matplotlib.pyplot as plt
from tqdm import tqdm

# ==================== CONFIGURACIÓN BÁSICA ====================
BASE_DIR = Path(__file__).parent.parent
DATASET_DIR = BASE_DIR / "dataset" / "processed"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)

CLASSES = {
    'COLISION_FRONTAL': 0,
    'COLISION_LATERAL': 1,
    'COLISION_TRASERA': 2,
    'VOLCADURA': 3,
    'INCENDIO_VEHICULAR': 4,
    'CRISTAL_ROTO': 5,
    'SIN_DANO_VISIBLE': 6,
}
CLASS_NAMES = {v: k for k, v in CLASSES.items()}

# ==================== DATASET ====================
class IncidentDataset(torch.utils.data.Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform
    
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        label = self.labels[idx]
        try:
            image = Image.open(img_path).convert('RGB')
            if self.transform:
                image = self.transform(image)
            return image, label, str(img_path)
        except Exception as e:
            # Fallback a negro
            return torch.zeros(3, 224, 224), label, str(img_path)


def load_dataset():
    print("📂 Cargando dataset...")
    image_paths, labels = [], []
    for class_name, class_idx in CLASSES.items():
        class_dir = DATASET_DIR / class_name
        if not class_dir.exists():
            continue
        image_files = [f for f in class_dir.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
        print(f"  ✅ {class_name}: {len(image_files)} imágenes")
        for img_file in image_files:
            image_paths.append(img_file)
            labels.append(class_idx)
    return image_paths, labels

# ==================== MODELO ====================
def create_model(model_type="resnet50", num_classes=5):
    print(f"\n🧠 Creando modelo {model_type}...")
    if model_type == "resnet50":
        model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
        for param in model.layer1.parameters(): param.requires_grad = False
        for param in model.layer2.parameters(): param.requires_grad = False
        num_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Linear(num_features, 512), nn.BatchNorm1d(512), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(512, 128), nn.BatchNorm1d(128), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(128, num_classes)
        )
    elif model_type == "mobilenet_v2":
        model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V2)
        for param in model.features[:-2].parameters(): param.requires_grad = False
        num_features = model.classifier[1].in_features
        model.classifier = nn.Sequential(
            nn.Dropout(0.2), nn.Linear(num_features, 128), nn.ReLU(), nn.Dropout(0.1),
            nn.Linear(128, num_classes)
        )
    else:
        raise ValueError(f"Modelo no soportado: {model_type}")
    return model

# ==================== ENTRENAMIENTO ====================
def main(config):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"🖥️  Dispositivo: {device}")
    
    # Dataset y loaders
    image_paths, labels = load_dataset()
    if not image_paths:
        print("❌ Dataset vacío o no encontrado.")
        return
        
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)), transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15), transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)), transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    dataset = IncidentDataset(image_paths, labels, transform=train_transform)
    total = len(dataset)
    train_size = int(0.8 * total)
    val_size = int(0.1 * total)
    test_size = total - train_size - val_size
    
    train_data, val_data, test_data = random_split(
        dataset, [train_size, val_size, test_size], generator=torch.Generator().manual_seed(42)
    )
    val_data.dataset.transform = val_transform
    test_data.dataset.transform = val_transform
    
    train_loader = DataLoader(train_data, batch_size=config['batch_size'], shuffle=True)
    val_loader = DataLoader(val_data, batch_size=config['batch_size'])
    test_loader = DataLoader(test_data, batch_size=config['batch_size'])
    
    model = create_model(config['model_type'], len(CLASSES)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=config['lr'], weight_decay=1e-5)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=config['epochs'])
    
    best_val_acc = 0.0
    
    # Generar versión del experimento (timestamp)
    version = datetime.now().strftime("%Y%m%d_%H%M%S")
    experiment_dir = MODELS_DIR / version
    experiment_dir.mkdir(exist_ok=True)
    
    model_save_path = experiment_dir / f"best_{config['model_type']}.pt"
    
    print(f"\n⏱️  Inicio Entrenamiento | Experimento: {version} | Épocas: {config['epochs']}")
    for epoch in range(config['epochs']):
        model.train()
        train_loss, train_acc, correct, total_s = 0, 0, 0, 0
        pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{config['epochs']} [TRAIN]", leave=False)
        for images, targets, _ in pbar:
            images, targets = images.to(device), targets.to(device)
            outputs = model(images)
            loss = criterion(outputs, targets)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
            _, pred = torch.max(outputs, 1)
            correct += (pred == targets).sum().item()
            total_s += targets.size(0)
        
        train_acc = correct / total_s
        train_loss /= len(train_loader)
        
        model.eval()
        val_loss, val_acc, correct, total_s = 0, 0, 0, 0
        with torch.no_grad():
            for images, targets, _ in val_loader:
                images, targets = images.to(device), targets.to(device)
                outputs = model(images)
                loss = criterion(outputs, targets)
                val_loss += loss.item()
                _, pred = torch.max(outputs, 1)
                correct += (pred == targets).sum().item()
                total_s += targets.size(0)
        
        val_acc = correct / total_s
        val_loss /= len(val_loader)
        scheduler.step()
        
        print(f"Epoch {epoch+1}: Train Loss: {train_loss:.4f} Acc: {train_acc:.4f} | Val Loss: {val_loss:.4f} Acc: {val_acc:.4f}")
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), model_save_path)
            print("  💾 Mejor modelo guardado")
            
    print(f"\n✅ Terminado. Mejor Val Acc: {best_val_acc:.4f}. Guardado en {model_save_path}")
    
    # Registrar experimento en CSV
    csv_path = MODELS_DIR / "experiments.csv"
    file_exists = csv_path.exists()
    
    with open(csv_path, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Version', 'Model', 'Epochs', 'Batch Size', 'LR', 'Best Val Acc', 'Model Path'])
        writer.writerow([version, config['model_type'], config['epochs'], config['batch_size'], config['lr'], f"{best_val_acc:.4f}", str(model_save_path)])
    
    print(f"📊 Experimento registrado en {csv_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', type=str, help='Ruta a archivo de configuración JSON')
    parser.add_argument('--model', type=str, default='resnet50', choices=['resnet50', 'mobilenet_v2'])
    parser.add_argument('--epochs', type=int, default=25)
    parser.add_argument('--batch-size', type=int, default=16)
    parser.add_argument('--lr', type=float, default=0.001)
    args = parser.parse_args()
    
    if args.config:
        with open(args.config, 'r') as f:
            config = json.load(f)
    else:
        config = {
            'model_type': args.model,
            'epochs': args.epochs,
            'batch_size': args.batch_size,
            'lr': args.lr
        }
    main(config)
