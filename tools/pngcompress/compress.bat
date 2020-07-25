echo "È_ º¥¶¿Ì..."

set work_path=D:\client\cocosCreator\assets\resources
cd %work_path% 

for /R %%i in (*.png) do (
  pngquant -f --ext .png --quality 50-50 "%%i"
)

pause