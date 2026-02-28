---
name: ml-master
description: >
  Comprehensive ML/MLOps guide covering pipeline workflows, experiment
  tracking (MLflow, TensorBoard, W&B), model deployment, and research
  paper writing. Consolidates 5 ML skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# ML Master — Comprehensive ML/MLOps Guide

This skill provides end-to-end guidance for machine learning projects, from data collection through deployment and paper writing. It consolidates best practices for experiment tracking, MLOps tooling, model deployment, and academic publication.

---

## 1. When to Use This Skill

Use **ml-master** when working on:

- **ML Pipeline Development** — Building data preprocessing, training, and evaluation workflows
- **Experiment Tracking** — Logging metrics, hyperparameters, and artifacts across training runs
- **Model Deployment** — Serving models via REST APIs, batch processing, or edge devices
- **MLOps Infrastructure** — Setting up reproducible training pipelines, monitoring, and retraining
- **Research Papers** — Writing ML papers with proper structure, reproducibility, and LaTeX formatting
- **Tool Selection** — Choosing between MLflow, TensorBoard, Weights & Biases for your use case
- **Production ML** — Implementing model monitoring, drift detection, feature stores, and A/B testing

**Do NOT use** for:
- Pure data engineering pipelines (no ML component)
- Statistical analysis without predictive modeling
- BI dashboards or analytics reporting

---

## 2. ML Pipeline Workflow

### 2.1 Standard Pipeline Stages

```
Data Collection → Preprocessing → Feature Engineering → Training → Evaluation → Deployment
```

### 2.2 Data Collection

**Best Practices:**
- Version your raw data (DVC, S3 versioning, or LakeFS)
- Document data sources and collection timestamps
- Store metadata (schema, lineage, quality metrics)
- Separate train/validation/test splits early to prevent leakage

**Common Sources:**
- Databases (SQL queries, snapshots)
- APIs (paginated, rate-limited)
- File systems (CSV, Parquet, JSON)
- Streaming (Kafka, Kinesis)

**Anti-patterns:**
- Not versioning data
- Mixing train/test data during collection
- Ignoring data drift between collection dates

### 2.3 Preprocessing

**Typical Steps:**
1. Handle missing values (imputation, removal, or flagging)
2. Remove duplicates
3. Validate data types and ranges
4. Normalize/standardize numerical features
5. Encode categorical variables (one-hot, target, or embeddings)
6. Handle outliers (cap, remove, or transform)

**Code Pattern (scikit-learn):**
```python
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# Define preprocessing for different column types
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)
```

### 2.4 Feature Engineering

**Techniques:**
- **Binning/Discretization** — Continuous → categorical (age groups, price ranges)
- **Polynomial Features** — Interaction terms, squared terms
- **Domain-Specific** — Time-based (hour, day-of-week), geospatial (distance, density)
- **Embeddings** — Word2Vec, BERT for text; autoencoders for high-dimensional data
- **Aggregations** — User history (mean, max, count), time windows (rolling averages)

**Feature Selection:**
- Correlation analysis (remove redundant features)
- Recursive feature elimination (RFE)
- L1 regularization (LASSO) for sparse models
- Tree-based importance scores (XGBoost, Random Forest)

### 2.5 Training

**Standard Training Loop (PyTorch):**
```python
import torch
from torch.utils.data import DataLoader

def train_epoch(model, dataloader, optimizer, criterion, device):
    model.train()
    total_loss = 0

    for batch_idx, (data, target) in enumerate(dataloader):
        data, target = data.to(device), target.to(device)

        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    return total_loss / len(dataloader)

# Training loop with early stopping
best_val_loss = float('inf')
patience = 5
patience_counter = 0

for epoch in range(num_epochs):
    train_loss = train_epoch(model, train_loader, optimizer, criterion, device)
    val_loss = validate(model, val_loader, criterion, device)

    print(f'Epoch {epoch}: Train Loss = {train_loss:.4f}, Val Loss = {val_loss:.4f}')

    # Early stopping
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save(model.state_dict(), 'best_model.pth')
        patience_counter = 0
    else:
        patience_counter += 1
        if patience_counter >= patience:
            print('Early stopping triggered')
            break
```

### 2.6 Evaluation

**Classification Metrics:**
- Accuracy (use only for balanced datasets)
- Precision, Recall, F1-score
- ROC-AUC (binary), PR-AUC (imbalanced)
- Confusion matrix

**Regression Metrics:**
- MAE (Mean Absolute Error) — interpretable, robust to outliers
- MSE/RMSE (Mean Squared Error) — penalizes large errors
- R² (coefficient of determination)
- MAPE (Mean Absolute Percentage Error) — relative error

**Evaluation Checklist:**
- Test on held-out test set (never seen during training/validation)
- Check performance across subgroups (demographics, geographies)
- Analyze error cases (confusion matrix, residual plots)
- Compare against baseline (random, simple heuristic, previous model)

### 2.7 Deployment Preparation

Before deploying:
1. **Freeze preprocessing** — Save scalers, encoders, vocabularies
2. **Version model artifacts** — Model weights, config, preprocessing objects
3. **Document API contract** — Input schema, output format, latency SLA
4. **Test inference** — Unit tests for model.predict(), integration tests with API
5. **Benchmark performance** — Latency (p50, p95, p99), throughput (requests/sec)

---

## 3. Experiment Tracking Comparison

### 3.1 MLflow vs TensorBoard vs Weights & Biases

| Feature | MLflow | TensorBoard | Weights & Biases |
|---------|--------|-------------|------------------|
| **Backend** | Local files or DB | Local files | Cloud-hosted |
| **Setup Complexity** | Medium | Low | Low |
| **Pricing** | Free (open-source) | Free | Free tier + paid |
| **UI** | Good | Basic | Excellent |
| **Hyperparameter Sweeps** | Manual | Manual | Built-in (Sweeps) |
| **Model Registry** | Built-in | No | Yes |
| **Collaboration** | Self-hosted or paid | Limited | Native |
| **Artifact Storage** | Local/S3/Azure | Local | Cloud + S3 |
| **Best For** | On-prem MLOps | Quick local viz | Team collaboration |

### 3.2 Decision Framework

**Choose MLflow if:**
- You need on-premises deployment
- You want a model registry with versioning
- You're building production ML pipelines
- You need framework-agnostic tracking (scikit-learn, TensorFlow, PyTorch, XGBoost)

**Choose TensorBoard if:**
- You're primarily using TensorFlow/Keras or PyTorch
- You want quick local visualization without setup
- You don't need advanced hyperparameter tuning
- You're doing single-user research

**Choose Weights & Biases if:**
- You're working in a team
- You need advanced hyperparameter search (Bayesian optimization)
- You want collaborative reports and dashboards
- You're okay with cloud-hosted (or can self-host enterprise version)
- You need integrations with Hugging Face, PyTorch Lightning, etc.

---

## 4. MLflow

### 4.1 Setup

```bash
pip install mlflow

# Start UI server
mlflow ui --host 0.0.0.0 --port 5000

# With backend store (database) and artifact store (S3)
mlflow server \
  --backend-store-uri postgresql://user:pass@host/db \
  --default-artifact-root s3://my-bucket/mlflow \
  --host 0.0.0.0
```

### 4.2 Tracking Experiments

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score

# Set tracking URI (if using remote server)
mlflow.set_tracking_uri("http://localhost:5000")

# Create or set experiment
mlflow.set_experiment("fraud-detection")

# Start run
with mlflow.start_run(run_name="rf-baseline"):
    # Log parameters
    params = {
        "n_estimators": 100,
        "max_depth": 10,
        "min_samples_split": 5
    }
    mlflow.log_params(params)

    # Train model
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    # Evaluate and log metrics
    y_pred = model.predict(X_test)
    mlflow.log_metric("accuracy", accuracy_score(y_test, y_pred))
    mlflow.log_metric("f1_score", f1_score(y_test, y_pred, average='weighted'))

    # Log model
    mlflow.sklearn.log_model(model, "model")

    # Log artifacts (e.g., plots, data samples)
    fig, ax = plt.subplots()
    plot_confusion_matrix(y_test, y_pred, ax=ax)
    fig.savefig("confusion_matrix.png")
    mlflow.log_artifact("confusion_matrix.png")
```

### 4.3 Logging Metrics During Training

```python
# For iterative training (e.g., neural networks)
with mlflow.start_run():
    for epoch in range(num_epochs):
        train_loss = train_epoch(model, train_loader)
        val_loss = validate(model, val_loader)

        # Log metrics with step
        mlflow.log_metric("train_loss", train_loss, step=epoch)
        mlflow.log_metric("val_loss", val_loss, step=epoch)
```

### 4.4 Model Registry

```python
# Register model
model_uri = f"runs:/{run_id}/model"
mlflow.register_model(model_uri, "fraud-detection-model")

# Transition model to production
from mlflow.tracking import MlflowClient
client = MlflowClient()
client.transition_model_version_stage(
    name="fraud-detection-model",
    version=3,
    stage="Production"
)

# Load production model
model = mlflow.pyfunc.load_model(
    model_uri="models:/fraud-detection-model/Production"
)
predictions = model.predict(new_data)
```

### 4.5 Serving Models

```bash
# Serve model as REST API
mlflow models serve \
  -m models:/fraud-detection-model/Production \
  -p 5001 \
  --no-conda

# Test endpoint
curl -X POST http://localhost:5001/invocations \
  -H 'Content-Type: application/json' \
  -d '{"dataframe_split": {"columns": ["feature1", "feature2"], "data": [[1.0, 2.0]]}}'
```

---

## 5. TensorBoard

### 5.1 Setup

```bash
pip install tensorboard

# Launch TensorBoard
tensorboard --logdir=runs --port=6006
```

### 5.2 Logging with PyTorch

```python
from torch.utils.tensorboard import SummaryWriter
import torch
import torch.nn as nn

writer = SummaryWriter('runs/experiment_1')

# Log scalars (losses, metrics)
for epoch in range(num_epochs):
    train_loss = train_epoch(model, train_loader, optimizer, criterion)
    val_loss = validate(model, val_loader, criterion)

    writer.add_scalar('Loss/train', train_loss, epoch)
    writer.add_scalar('Loss/val', val_loss, epoch)

    # Log learning rate
    writer.add_scalar('Learning_Rate', optimizer.param_groups[0]['lr'], epoch)

# Log histograms (weight distributions)
for name, param in model.named_parameters():
    writer.add_histogram(name, param, epoch)
    if param.grad is not None:
        writer.add_histogram(f'{name}.grad', param.grad, epoch)

# Log images (for vision tasks)
writer.add_image('predictions', img_grid, epoch)

# Log model graph
writer.add_graph(model, sample_input)

writer.close()
```

### 5.3 Logging with TensorFlow/Keras

```python
import tensorflow as tf

# Define callbacks
tensorboard_callback = tf.keras.callbacks.TensorBoard(
    log_dir='runs/experiment_2',
    histogram_freq=1,
    write_graph=True,
    update_freq='epoch'
)

# Train with callback
model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=50,
    callbacks=[tensorboard_callback]
)
```

### 5.4 Hyperparameter Tuning Visualization

```python
from torch.utils.tensorboard import SummaryWriter
from tensorboard.plugins.hparams import api as hp

HP_LR = hp.HParam('learning_rate', hp.RealInterval(0.001, 0.1))
HP_BATCH_SIZE = hp.HParam('batch_size', hp.Discrete([32, 64, 128]))

with SummaryWriter('runs/hparam_tuning') as w:
    w.add_hparams(
        {'lr': 0.01, 'batch_size': 64},
        {'accuracy': 0.85, 'loss': 0.32}
    )
```

---

## 6. Weights & Biases

### 6.1 Setup

```bash
pip install wandb

# Login (creates ~/.netrc with API key)
wandb login
```

### 6.2 Basic Experiment Tracking

```python
import wandb

# Initialize run
wandb.init(
    project="fraud-detection",
    name="rf-baseline",
    config={
        "learning_rate": 0.01,
        "batch_size": 64,
        "epochs": 50,
        "architecture": "resnet50"
    }
)

# Log metrics
for epoch in range(num_epochs):
    train_loss = train_epoch(model, train_loader)
    val_loss = validate(model, val_loader)

    wandb.log({
        "train_loss": train_loss,
        "val_loss": val_loss,
        "epoch": epoch
    })

# Log final metrics
wandb.log({"test_accuracy": test_acc})

# Finish run
wandb.finish()
```

### 6.3 Logging Artifacts

```python
# Save model
torch.save(model.state_dict(), 'model.pth')
wandb.save('model.pth')

# Log files
wandb.save('config.yaml')

# Log tables (for datasets or predictions)
table = wandb.Table(
    columns=["id", "prediction", "ground_truth"],
    data=[[1, 0.9, 1], [2, 0.3, 0]]
)
wandb.log({"predictions": table})

# Log images
wandb.log({"confusion_matrix": wandb.Image(fig)})
```

### 6.4 Hyperparameter Sweeps

```yaml
# sweep.yaml
program: train.py
method: bayes  # random, grid, or bayes
metric:
  name: val_loss
  goal: minimize
parameters:
  learning_rate:
    distribution: log_uniform_values
    min: 0.0001
    max: 0.1
  batch_size:
    values: [32, 64, 128]
  dropout:
    distribution: uniform
    min: 0.1
    max: 0.5
```

```python
# train.py
import wandb

def train():
    wandb.init()
    config = wandb.config

    # Build model with config.learning_rate, config.batch_size, etc.
    model = build_model(config)

    # Train and log
    for epoch in range(config.epochs):
        train_loss = train_epoch(model, train_loader, config.learning_rate)
        val_loss = validate(model, val_loader)
        wandb.log({"train_loss": train_loss, "val_loss": val_loss})

# Run sweep
wandb.sweep(sweep_config, project="my-project")
wandb.agent(sweep_id, function=train, count=20)
```

### 6.5 Reports and Collaboration

- **Reports** — Create dashboards with charts, tables, and markdown
- **Artifacts** — Version datasets, models, and preprocessors
- **Workspaces** — Share experiments across team members
- **Alerts** — Get notified when metrics hit thresholds

```python
# Log artifacts with versioning
artifact = wandb.Artifact('fraud-dataset', type='dataset')
artifact.add_file('train.csv')
artifact.add_file('test.csv')
wandb.log_artifact(artifact)

# Use artifact in another run
artifact = wandb.use_artifact('fraud-dataset:latest')
artifact_dir = artifact.download()
```

---

## 7. Model Deployment

### 7.1 Serving Patterns

**REST API (Synchronous):**
- Use for: Low-latency predictions, user-facing applications
- Tools: Flask, FastAPI, MLflow serving
- Pattern: Request → Load model → Predict → Return JSON

**Batch Processing (Asynchronous):**
- Use for: Large-scale predictions, nightly jobs
- Tools: Apache Spark, Dask, AWS Batch
- Pattern: Read data → Predict in batches → Write results

**Edge Deployment:**
- Use for: Mobile apps, IoT devices, offline inference
- Tools: TensorFlow Lite, ONNX Runtime, CoreML
- Pattern: Convert model → Optimize (quantization) → Deploy to device

### 7.2 FastAPI Example

```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Load model and preprocessor at startup
model = joblib.load('model.pkl')
preprocessor = joblib.load('preprocessor.pkl')

class PredictionRequest(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: int
    probability: float

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    # Preprocess input
    features = np.array(request.features).reshape(1, -1)
    features_processed = preprocessor.transform(features)

    # Predict
    prediction = model.predict(features_processed)[0]
    probability = model.predict_proba(features_processed)[0].max()

    return PredictionResponse(
        prediction=int(prediction),
        probability=float(probability)
    )

@app.get("/health")
def health():
    return {"status": "healthy"}
```

```bash
# Run server
uvicorn main:app --host 0.0.0.0 --port 8000

# Test
curl -X POST http://localhost:8000/predict \
  -H 'Content-Type: application/json' \
  -d '{"features": [1.0, 2.0, 3.0]}'
```

### 7.3 Containerization

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY model.pkl preprocessor.pkl main.py ./

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t fraud-detector .
docker run -p 8000:8000 fraud-detector
```

### 7.4 A/B Testing Models

**Pattern:**
1. Deploy two model versions (A = current production, B = new challenger)
2. Route traffic: 90% to A, 10% to B
3. Log predictions and outcomes
4. Compare metrics (accuracy, latency, business KPIs)
5. Promote B if it outperforms A

**Implementation (Nginx-based routing):**
```nginx
upstream model_a {
    server model-a:8000;
}

upstream model_b {
    server model-b:8000;
}

split_clients "${remote_addr}" $upstream {
    90%     model_a;
    10%     model_b;
}

server {
    location /predict {
        proxy_pass http://$upstream;
    }
}
```

---

## 8. ML Paper Writing

### 8.1 Standard Structure

**Abstract (150-250 words):**
- Problem statement (1-2 sentences)
- Approach (2-3 sentences)
- Key results (2-3 sentences)
- Impact/conclusion (1 sentence)

**Introduction:**
- Motivation (why is this problem important?)
- Limitations of existing work
- Your contributions (numbered list)
- Paper outline ("The rest of the paper is organized as follows...")

**Related Work:**
- Group by themes (not chronologically)
- Compare approaches and highlight differences
- Position your work relative to prior art

**Methods:**
- Dataset description (size, splits, preprocessing)
- Model architecture (diagrams help)
- Training procedure (optimizer, learning rate schedule, regularization)
- Hyperparameters (table format)
- Evaluation metrics

**Results:**
- Main results table (compare against baselines)
- Ablation studies (remove components to show contributions)
- Visualizations (learning curves, attention maps, t-SNE)
- Error analysis (where does the model fail?)

**Discussion:**
- Interpretation of results
- Limitations (be honest)
- Broader impact (ethics, societal considerations)

**Conclusion:**
- Summarize contributions
- Future work

### 8.2 LaTeX Tips

```latex
% Use standard conference templates (NeurIPS, ICML, ACL)
\documentclass{article}
\usepackage[final]{neurips_2024}

% Essential packages
\usepackage{graphicx}
\usepackage{amsmath}
\usepackage{booktabs}  % Better tables
\usepackage{hyperref}  % Clickable references

% Figures
\begin{figure}[t]
    \centering
    \includegraphics[width=0.8\linewidth]{figures/architecture.pdf}
    \caption{Model architecture with attention mechanism.}
    \label{fig:architecture}
\end{figure}

% Tables
\begin{table}[t]
    \centering
    \caption{Results on test set. Best results in \textbf{bold}.}
    \label{tab:results}
    \begin{tabular}{lcc}
        \toprule
        Model & Accuracy & F1-Score \\
        \midrule
        Baseline & 85.2 & 83.1 \\
        Ours & \textbf{91.3} & \textbf{89.7} \\
        \bottomrule
    \end{tabular}
\end{table}

% Algorithms
\usepackage{algorithm}
\usepackage{algorithmic}
\begin{algorithm}
    \caption{Training Procedure}
    \begin{algorithmic}[1]
        \FOR{$epoch = 1$ to $N$}
            \FOR{each batch $(x, y)$ in $D_{train}$}
                \STATE $\hat{y} \gets f_\theta(x)$
                \STATE $\mathcal{L} \gets \text{CrossEntropy}(\hat{y}, y)$
                \STATE $\theta \gets \theta - \alpha \nabla_\theta \mathcal{L}$
            \ENDFOR
        \ENDFOR
    \end{algorithmic}
\end{algorithm}
```

### 8.3 Figures Best Practices

- **Vector formats** — Save plots as PDF or EPS (not PNG) for scalability
- **Readable fonts** — Use font size ≥ 10pt in plots
- **Color blindness** — Use colorblind-friendly palettes (e.g., seaborn's colorblind palette)
- **Captions** — Should be self-contained (reader should understand figure without reading main text)
- **Resolution** — If using raster images, 300 DPI minimum

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Set style for publication
sns.set_style("whitegrid")
sns.set_palette("colorblind")
plt.rcParams['font.size'] = 12
plt.rcParams['figure.dpi'] = 300

# Create plot
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(epochs, train_loss, label='Train')
ax.plot(epochs, val_loss, label='Validation')
ax.set_xlabel('Epoch')
ax.set_ylabel('Loss')
ax.legend()
ax.set_title('Training Curve')

# Save as vector format
fig.savefig('figures/training_curve.pdf', bbox_inches='tight')
```

### 8.4 Reproducibility Checklist

- [ ] Code released (GitHub with README)
- [ ] Model weights released (or instructions to reproduce)
- [ ] Dataset publicly available or described in detail
- [ ] Random seeds set and documented
- [ ] Dependencies specified (requirements.txt, environment.yaml)
- [ ] Hyperparameters listed in paper or appendix
- [ ] Hardware used (GPU type, memory, training time)
- [ ] Statistical significance tests (error bars, p-values)

**Code Release Pattern:**
```
paper-repo/
├── README.md           # How to reproduce results
├── requirements.txt    # Python dependencies
├── data/
│   └── download.sh     # Script to download dataset
├── src/
│   ├── model.py        # Model architecture
│   ├── train.py        # Training script
│   └── evaluate.py     # Evaluation script
├── configs/
│   └── default.yaml    # Hyperparameters
└── scripts/
    └── reproduce_results.sh
```

---

## 9. Production ML

### 9.1 Monitoring Model Drift

**Data Drift:**
- Input distribution changes over time (e.g., user demographics shift)
- Detection: Compare feature distributions (KL divergence, Kolmogorov-Smirnov test)

**Concept Drift:**
- Relationship between features and target changes (e.g., fraud patterns evolve)
- Detection: Monitor model performance metrics over time

**Implementation:**
```python
from scipy.stats import ks_2samp
import numpy as np

def detect_drift(reference_data, current_data, feature_names, threshold=0.05):
    drift_detected = {}

    for feature in feature_names:
        ref_values = reference_data[feature]
        curr_values = current_data[feature]

        # Kolmogorov-Smirnov test
        statistic, p_value = ks_2samp(ref_values, curr_values)

        drift_detected[feature] = {
            'drift': p_value < threshold,
            'p_value': p_value,
            'statistic': statistic
        }

    return drift_detected

# Alert if drift detected
drift_results = detect_drift(train_data, production_data, feature_names)
drifted_features = [f for f, r in drift_results.items() if r['drift']]

if drifted_features:
    print(f"ALERT: Drift detected in features: {drifted_features}")
    # Trigger retraining pipeline
```

### 9.2 Retraining Pipelines

**Strategies:**
- **Scheduled retraining** — Retrain weekly/monthly regardless of performance
- **Performance-based** — Retrain when accuracy drops below threshold
- **Drift-based** — Retrain when data/concept drift detected

**Pipeline Pattern (Airflow DAG):**
```python
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'ml-team',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'model_retraining',
    default_args=default_args,
    schedule_interval='@weekly'
)

extract_data = PythonOperator(
    task_id='extract_data',
    python_callable=extract_training_data,
    dag=dag
)

preprocess = PythonOperator(
    task_id='preprocess',
    python_callable=preprocess_data,
    dag=dag
)

train_model = PythonOperator(
    task_id='train_model',
    python_callable=train_and_log_model,
    dag=dag
)

evaluate = PythonOperator(
    task_id='evaluate',
    python_callable=evaluate_model,
    dag=dag
)

deploy = PythonOperator(
    task_id='deploy',
    python_callable=deploy_if_better,
    dag=dag
)

extract_data >> preprocess >> train_model >> evaluate >> deploy
```

### 9.3 Feature Stores

**Purpose:**
- Centralized repository for feature engineering logic
- Serve features for training (batch) and inference (online)
- Ensure train/serve consistency (no skew)

**Tools:**
- Feast (open-source)
- Tecton (managed)
- AWS SageMaker Feature Store
- Databricks Feature Store

**Feast Example:**
```python
from feast import FeatureStore
from datetime import datetime

# Load feature store
store = FeatureStore(repo_path=".")

# Get features for training (batch)
entity_df = pd.DataFrame({
    "user_id": [1001, 1002, 1003],
    "event_timestamp": [datetime.now()] * 3
})

training_df = store.get_historical_features(
    entity_df=entity_df,
    features=[
        "user_features:age",
        "user_features:transaction_count_7d",
        "user_features:avg_transaction_amount_30d"
    ]
).to_df()

# Get features for inference (online)
online_features = store.get_online_features(
    features=[
        "user_features:age",
        "user_features:transaction_count_7d"
    ],
    entity_rows=[{"user_id": 1001}]
).to_dict()
```

### 9.4 Data Versioning (DVC)

```bash
# Initialize DVC
dvc init

# Add data to DVC (creates .dvc file, stores data remotely)
dvc add data/train.csv

# Configure remote storage
dvc remote add -d myremote s3://my-bucket/dvc-storage

# Push data to remote
dvc push

# In another environment, pull data
dvc pull

# Version data with git
git add data/train.csv.dvc .dvc/config
git commit -m "Add training data v1"
git tag -a "data-v1" -m "Initial dataset"

# Later, checkout specific data version
git checkout data-v2
dvc checkout
```

---

## 10. Common Pitfalls

### 10.1 Data Leakage

**Definition:** Information from outside the training set influences the model.

**Examples:**
- Preprocessing on entire dataset before train/test split
- Including target-derived features (e.g., using future information)
- Time-based leakage (using future data to predict past events)

**Prevention:**
```python
# WRONG: Fit scaler on entire dataset
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test = train_test_split(X_scaled, test_size=0.2)

# CORRECT: Fit scaler only on training data
X_train, X_test = train_test_split(X, test_size=0.2)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Use fitted scaler
```

### 10.2 Overfitting

**Symptoms:**
- High training accuracy, low validation accuracy
- Model performs poorly on new data
- Extremely complex models (too many parameters)

**Solutions:**
- Regularization (L1, L2, Dropout)
- Early stopping (monitor validation loss)
- Cross-validation (k-fold to assess generalization)
- Data augmentation (increase training set diversity)
- Simplify model architecture

**Regularization Example:**
```python
# L2 regularization (Ridge)
from sklearn.linear_model import Ridge
model = Ridge(alpha=1.0)  # Higher alpha = stronger regularization

# Dropout (PyTorch)
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.dropout = nn.Dropout(0.5)  # Drop 50% of neurons during training
        self.fc2 = nn.Linear(256, 10)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x
```

### 10.3 Ignoring Class Imbalance

**Problem:**
- In fraud detection, 99% transactions are legitimate, 1% are fraud
- Model predicts "not fraud" for everything → 99% accuracy but useless

**Solutions:**
1. **Resampling:**
   - Oversample minority class (SMOTE, ADASYN)
   - Undersample majority class

2. **Class Weights:**
   ```python
   from sklearn.utils.class_weight import compute_class_weight

   class_weights = compute_class_weight(
       'balanced',
       classes=np.unique(y_train),
       y=y_train
   )

   # In scikit-learn
   model = RandomForestClassifier(class_weight='balanced')

   # In PyTorch
   criterion = nn.CrossEntropyLoss(weight=torch.tensor(class_weights))
   ```

3. **Different Metrics:**
   - Use F1-score, ROC-AUC, or PR-AUC instead of accuracy
   - Focus on recall if false negatives are costly (fraud detection)
   - Focus on precision if false positives are costly (medical diagnosis)

### 10.4 No Reproducibility

**Problem:**
- "It worked on my machine"
- Can't reproduce results from paper
- Different results every run

**Solutions:**
```python
# Set random seeds
import random
import numpy as np
import torch

def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

set_seed(42)

# Log everything
config = {
    'seed': 42,
    'model': 'resnet50',
    'optimizer': 'adam',
    'learning_rate': 0.001,
    'batch_size': 64,
    'epochs': 50,
    'device': 'cuda:0',
    'pytorch_version': torch.__version__,
    'cuda_version': torch.version.cuda
}

# Save config with model
torch.save({
    'model_state_dict': model.state_dict(),
    'config': config
}, 'model.pth')
```

### 10.5 Not Monitoring Production Models

**Problem:**
- Deploy and forget
- Model degrades silently
- No alerts when performance drops

**Solutions:**
- Log predictions and ground truth
- Monitor metrics in production (daily/weekly reports)
- Set up alerts (Slack, PagerDuty) when metrics fall below threshold
- A/B test new models before full rollout

```python
# Log predictions to monitoring system
import logging
from datetime import datetime

logger = logging.getLogger('model_monitoring')

def predict_and_log(model, features, user_id):
    prediction = model.predict(features)

    logger.info({
        'timestamp': datetime.now().isoformat(),
        'user_id': user_id,
        'features': features.tolist(),
        'prediction': prediction,
        'model_version': model.version
    })

    return prediction

# Batch evaluation (run daily)
def evaluate_production_model():
    # Get yesterday's predictions and outcomes
    predictions = load_predictions(date=yesterday)
    actuals = load_actuals(date=yesterday)

    accuracy = accuracy_score(actuals, predictions)

    if accuracy < THRESHOLD:
        send_alert(f"Model accuracy dropped to {accuracy:.2%}")
```

---

## Summary

This skill consolidates best practices across:
- **ML Pipelines** — Data collection through deployment
- **Experiment Tracking** — MLflow, TensorBoard, W&B
- **Production ML** — Monitoring, retraining, feature stores, drift detection
- **Research** — Paper writing, reproducibility, LaTeX formatting

**Next Steps After Using This Skill:**
1. Choose experiment tracking tool based on team size and infrastructure
2. Set up reproducible pipelines with version control for data and code
3. Implement monitoring and alerting for production models
4. Document methods thoroughly for reproducibility

Would you like to add this to the GODMODEDEV skillpository?
