@echo off
echo =====================================================================
echo  FoodShareAI - Opening Google Drive and Google Colab
echo =====================================================================
echo.
echo 1. Opening Google Drive in your default web browser...
start https://drive.google.com/drive/my-drive
echo.
echo 2. Opening Google Colab in your default web browser...
start https://colab.research.google.com/#create=true
echo.
echo 3. Opening your local folder with the files ready to drag-and-drop...
explorer "%~dp0"
echo.
echo =====================================================================
echo  Ready! Follow the 3 simple steps in your browser:
echo  1. On Google Colab, click "Upload" and choose:
echo     FoodShareAI_YOLOv8n_GPU_Training.ipynb
echo  2. On Google Drive, create folder "FoodShareAI" and drop:
echo     - food_detection_dataset.zip
echo     - best_epoch5_checkpoint.pt
echo =====================================================================
pause
