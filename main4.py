import subprocess
import sys
import os

params = {}
for arg in sys.argv[1:]:
    if arg.startswith('--'):
        key_value = arg[len('--'):].split('=')
        if len(key_value) == 2:
            key, value = key_value
            params[key] = value

os.chdir('/content/colabtools')
full_precision_str = "--share --lowram --disable-safe-unpickle  --disable-console-progressbars --xformers --enable-insecure-extension-access --precision full --no-half --no-half-vae --opt-sub-quad-attention --opt-channelslast --api"
half_precision_str = "--share --lowram  --disable-safe-unpickle  --disable-console-progressbars --xformers --enable-insecure-extension-access  --opt-sub-quad-attention --opt-channelslast --api"
if params["dark"] == "True":
    full_precision_str += " --theme='dark'"
    half_precision_str += " --theme='dark'"
else:
    full_precision_str += " --theme='light'"
    half_precision_str += " --theme='light'"
if params["token"] == "True":
    full_precision_str += f'  --ngrok={params["token"]} --ngrok-region="auto"'
    half_precision_str += f'  --ngrok={params["token"]} --ngrok-region="auto"'
if params["full"]:
    subprocess.run(f"python launch.py {full_precision_str}", shell=True)  # （解决精度不足但速度不够）
else:
    subprocess.run(f"python launch.py {half_precision_str}", shell=True)  # 半精度（速度提升1倍以上，但可能出现精度不足问题）
