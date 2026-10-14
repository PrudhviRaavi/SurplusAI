# FoodShareAI — Google Colab Free GPU Training Workflow

This directory contains the complete, self-contained preparation bundle for fine-tuning the FoodShareAI YOLOv8n food-detection model on a free Google Colab NVIDIA GPU (T4).

---

## 📦 Directory Contents & Inventory

| File | Size | SHA-256 Hash | Purpose |
| :--- | :--- | :--- | :--- |
| **`FoodShareAI_YOLOv8n_GPU_Training.ipynb`** | 34.2 KB | `62321C830938C66496D4687EB4BBB8F840EFB932B9EAD72B7332A24FD97F030B` | Verified Google Colab Notebook with preflight, Drive persistence, progressive sync, safety guards, and evaluation. |
| **`food_detection_dataset.zip`** | 796.7 MB | `C3B01ACE73F7598B0C594FC7F4BEAD7DE5BAA6D667A632A5E3D57C9E4917E94C` | Portable dataset archive containing all 2,950 verified images and labels across train (2,061), val (589), and test (300) splits. |
| **`best_epoch5_checkpoint.pt`** | 23.35 MB | `1DA8CD2C9CC6911108DA61456B5E5FC7D6BD84D1C79A24DC18E2321A602FAF6B` | Exact copy of the experimental Epoch 5 baseline checkpoint (original remains unmodified in `runs/`). |
| **`food_detection_colab.yaml`** | 660 B | `2CE2F5C7D3392B16538BAD50B8F99B598B8B3531514C670D28CB6D85A68176F1` | Standalone Linux-compatible dataset configuration pointing to local runtime extraction with all 30 classes. |
| **`google_drive_upload_manifest.json`** | ~2.1 KB | `(Upload Spec)` | Structured upload manifest specifying target Drive paths, verified hashes, and security exclusion rules. |
| **`package_manifest.json`** | ~1.6 KB | `(Inventory)` | Comprehensive package inventory with file counts, sizes, and verified checksums. |

---

## 🔒 Safety & Resource Policy

- **Budget**: Strictly **$0.00 (FREE)** using Google Colab's complimentary T4 GPU runtime.
- **Production Checkpoint**: The production model at `ml-service/models/food_detection/best.pt` is **completely untouched**.
- **Zero Auto-Promotion**: Candidate weights are saved to Google Drive for manual inspection; they are **never** placed into production automatically.
- **Training Guard**: Training is disabled by default (`START_TRAINING = False`).
- **Evaluation Guards**: Validation and test evaluations are paused by default (`RUN_VALIDATION_EVAL = False`, `RUN_TEST_EVALUATION = False`) to prevent accidental lengthy runs.
- **Held-Out Test Set**: The 300 test images are reserved exclusively for final evaluation of the winning candidate.
- **Hardware-Aware Configuration**: Automatically detects available GPU VRAM and adjusts batch size conservatively (16 for 15GB T4, 8 for 8GB, 4 for 4GB). Halts cleanly if no GPU is allocated.
- **Disconnect Recovery**: Epoch checkpoints (`last.pt`, `best.pt`) and `results.csv` are synced to Google Drive at the end of every epoch.

---

## 🚀 Step-by-Step Launch Instructions

### Step 1: Upload Assets to Google Drive (One-time, ~2–3 minutes)
1. Open [Google Drive](https://drive.google.com).
2. In your Drive root (`MyDrive`), create a new folder named:
   ```
   FoodShareAI
   ```
3. Upload these two files from `ml-service/colab_preparation/` into your new `FoodShareAI` folder:
   - `food_detection_dataset.zip` (796.7 MB)
   - `best_epoch5_checkpoint.pt` (23.35 MB)

*(Do NOT upload source code, `.env` files, or virtual environments).*

### Step 2: Open the Notebook in Google Colab
1. Open [Google Colab](https://colab.research.google.com).
2. Click the **Upload** tab and select:
   `ml-service/colab_preparation/FoodShareAI_YOLOv8n_GPU_Training.ipynb`
3. Alternatively, upload the `.ipynb` file to your Google Drive `FoodShareAI` folder and right-click -> **Open with Google Colaboratory**.

### Step 3: Enable the Free GPU Accelerator
1. In the Colab top menu, click **Runtime** -> **Change runtime type**.
2. Under **Hardware accelerator**, select **T4 GPU**.
3. Under **GPU type**, ensure **Standard** (Free Tier) is selected.
4. Click **Save**.

### Step 4: Run Preflight & Verification Cells (Safe to Run)
Run Cells 1 through 4 sequentially:
- **Cell 1 (Preflight)**: Verifies that an NVIDIA GPU and CUDA are allocated. Detects VRAM and configures hardware-conservative batch sizing. Halts cleanly if on CPU.
- **Cell 2 (Mount Drive)**: Prompts for Google account authorization to mount `/content/drive`. Verifies that both required assets exist in `MyDrive/FoodShareAI/` and reports exactly which file is missing if any.
- **Cell 3 (Extract Dataset)**: Unzips the 2,950 images onto Colab's fast NVMe disk, validates 1-to-1 label pairing, and validates split counts (2,061 train, 589 val, 300 test).
- **Cell 4 (Verify Checkpoint)**: Confirms the Epoch 5 weights load cleanly, matches SHA-256 hash, and verifies all 30 class names.

### Step 5: Launch Training (Requires Your Explicit Approval)
1. In **Cell 5**, locate the confirmation guard:
   ```python
   START_TRAINING = False
   ```
2. Change it to:
   ```python
   START_TRAINING = True
   ```
3. Run **Cell 5**.
4. Training fine-tunes for 20 epochs at `imgsz=640` using conservative batch sizing (~12–15 minutes total on T4 GPU).
5. Progressive sync saves `last.pt`, `best.pt`, and `results.csv` directly to `Google Drive > FoodShareAI > experiments >` after every epoch.
6. Checkpoint integrity is verified via SHA-256 hash matching upon completion.

### Step 6: Disconnect Recovery & Evaluation
- **Cell 6 (Disconnect Recovery)**: Scans Drive for interrupted runs. If a run stopped early, change `RESUME_TRAINING = True` in this cell to resume seamlessly from `last.pt` (without restarting from Epoch 5).
- **Cell 7 (Validation Evaluation)**: Set `RUN_VALIDATION_EVAL = True` to evaluate the candidate on all 589 validation images and compare against the Epoch 5 baseline (`mAP@50: 0.1991`).
- **Cell 8 (Held-Out Test)**: Set `RUN_TEST_EVALUATION = True` **only once** on your final candidate to confirm generalization on 300 unseen test images.
- **Cell 9 (Structured Report)**: Generates a JSON report with hardware specs, baseline hashes, candidate hashes, and safety assertions, saving it directly to Google Drive.
