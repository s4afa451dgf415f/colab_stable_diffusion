import random
import string
import subprocess
import sys
import os
import concurrent.futures
import time
import shutil

params = {}
for arg in sys.argv[1:]:
    if arg.startswith('--'):
        key_value = arg[len('--'):].split('=')
        if len(key_value) == 2:
            key, value = key_value
            params[key] = value

subprocess.run("cd /content/", shell=True)
if params["ui"] == "anapnoe手机端完美适配":
    subprocess.run("git clone https://github.com/anapnoe/stable-diffusion-webui /content/colabtools", shell=True)
elif params["ui"] == "AUTOMATIC1111原版v1.3.0(稳定)":
    subprocess.run(
        "git clone -b v1.3.0 --single-branch https://github.com/AUTOMATIC1111/stable-diffusion-webui /content/colabtools", shell=True)
else:
    subprocess.run(
        "git clone -b v1.5.1 --single-branch https://github.com/AUTOMATIC1111/stable-diffusion-webui /content/colabtools", shell=True)

checkpoint_url = {
    "Dark_sushi_mix.safetensors": "https://huggingface.co/mdl-mirror/dark-sushi-mix/resolve/main/darkSushiMixMix_brighter.safetensors",
    "AnythingV5V3_v5PrtRE.safetensors": "https://huggingface.co/ckpt/anything-v5.0/resolve/main/AnythingV5V3_v5PrtRE.safetensors",
    "chilloutmix_NiPrunedFp16Fix.safetensors": "https://huggingface.co/naonovn/chilloutmix_NiPrunedFp32Fix/resolve/main/chilloutmix_NiPrunedFp32Fix.safetensors",
    "rpg_V4.safetensors": "https://huggingface.co/Anashel/rpg/resolve/main/RPG-V4-Model-Download/RPG-v4.safetensors",
    "ProtoGen_X5.8-pruned-fp16.safetensors": "https://huggingface.co/darkstorm2150/Protogen_x5.8_Official_Release/resolve/main/ProtoGen_X5.8-pruned-fp16.safetensors",
    "none": "",
}


def run_git_download():
    start_time = time.time()
    subprocess.run(
        "git clone https://github.com/Physton/sd-webui-prompt-all-in-one /content/colabtools/extensions/sd-webui-prompt-all-in-one", shell=True)
    subprocess.run(
        "git clone https://github.com/Mikubill/sd-webui-controlnet /content/colabtools/extensions/sd-webui-controlnet", shell=True)
    subprocess.run(
        "git clone https://github.com/dtlnor/stable-diffusion-webui-localization-zh_CN /content/colabtools/extensions/stable-diffusion-webui-localization-zh_CN", shell=True)
    subprocess.run(
        "git clone https://github.com/fkunn1326/openpose-editor /content/colabtools/extensions/openpose-editor", shell=True)
    subprocess.run(
        "git clone https://github.com/DominikDoom/a1111-sd-webui-tagcomplete /content/colabtools/extensions/a1111-sd-webui-tagcomplete", shell=True)
    subprocess.run(
        "git clone https://github.com/Coyote-A/ultimate-upscale-for-automatic1111 /content/colabtools/extensions/ultimate-upscale", shell=True)
    subprocess.run(
        "git clone https://github.com/toriato/stable-diffusion-webui-wd14-tagger /content/colabtools/extensions/stable-diffusion-webui-wd14-tagger", shell=True)
    subprocess.run(
        "git clone https://github.com/nonnonstop/sd-webui-3d-open-pose-editor /content/colabtools/extensions/sd-webui-3d-open-pose-editor", shell=True)
    subprocess.run(
        "git clone https://github.com/hako-mikan/sd-webui-lora-block-weight /content/colabtools/extensions/sd-webui-lora-block-weight", shell=True)
    end_time = time.time()
    print("已克隆git耗时：", end_time - start_time, "秒")


def run_aria2c_download():
    start_time = time.time()
    subprocess.run(
        f'aria2c --console-log-level=error -c -x 16 -s 16 -k 1M {checkpoint_url[params["model"]]} -d /content/colabtools/models/Stable-diffusion -o {params["model"]}', shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11e_sd15_ip2p_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11e_sd15_ip2p.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11f1p_sd15_depth_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11f1p_sd15_depth.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_canny_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_canny.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_inpaint_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_inpaint.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_lineart_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11f1p_sd15_depth.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_mlsd_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_mlsd.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_normalbae_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_normalbae.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_openpose_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_openpose.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_scribble_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_scribble.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_seg_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_seg.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15_softedge_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15_softedge.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11p_sd15s2_lineart_anime_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11p_sd15s2_lineart_anime.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/comfyanonymous/ControlNet-v1-1_fp16_safetensors/resolve/main/control_v11f1e_sd15_tile_fp16.safetensors -d /content/colabtools/models/ControlNet -o control_v11f1e_sd15_tile_fp16.safetensors", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/lokCX/4x-Ultrasharp/resolve/main/4x-UltraSharp.pth -d /content/colabtools/models/ESRGAN/ -o 4x-UltraSharp.pth", shell=True)
    subprocess.run(
        "aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/datasets/daasd/CN.csv/resolve/main/CN.csv -d /content/colabtools/extensions/a1111-sd-webui-tagcomplete/tags -o CN.csv", shell=True)
    end_time = time.time()
    print("aria2c完成下载耗时：", end_time - start_time, "秒")


def curl_download():
    start_time = time.time()
    subprocess.run(
        "curl -Lo '/content/colabtools/models/VAE/vae-ft-mse-840000-ema-pruned.safetensors' https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors", shell=True)
    subprocess.run(
        "curl -Lo '/content/colabtools/models/VAE/kl-f8-anime2.ckpt' https://huggingface.co/hakurei/waifu-diffusion-v1-4/resolve/4c4f05104055c029ad577c18ac176462f0d1d7c1/vae/kl-f8-anime2.ckpt", shell=True)
    subprocess.run(
        "curl -Lo '/content/colabtools/models/VAE/animevae.pt' https://huggingface.co/swl-models/animvae/resolve/main/animevae.pt", shell=True)
    end_time = time.time()
    print("curl完成下载耗时：", end_time - start_time, "秒")


def wget_download():
    start_time = time.time()
    subprocess.run("apt install libunwind8-dev -yqq", shell=True)
    os.environ["LD_PRELOAD"] = "libtcmalloc.so.4"
    os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
    subprocess.run("sudo apt-get install sox ffmpeg libcairo2 libcairo2-dev", shell=True)
    end_time = time.time()
    print("wget完成下载耗时：", end_time - start_time, "秒")


def pip_download():
    start_time = time.time()
    subprocess.run("pip install xformers xformers==0.0.20", shell=True)
    end_time = time.time()
    print("pip完成下载耗时：", end_time - start_time, "秒")


executor = concurrent.futures.ThreadPoolExecutor(max_workers=5)
task1 = executor.submit(run_git_download)
task2 = executor.submit(run_aria2c_download)
task3 = executor.submit(curl_download)
task4 = executor.submit(wget_download)
task5 = executor.submit(pip_download)
concurrent.futures.wait([task1, task2, task3, task4, task5])

if os.path.exists(f'/content/colabtools/embeddings'):
    shutil.rmtree(f'/content/colabtools/embeddings')
subprocess.run("git clone https://huggingface.co/nolanaatama/embeddings /content/colabtools/embeddings", shell=True)

# 个人插件从云盘的extensions文件夹与VAE文件夹加载
if params["extensions"]:
    if os.path.exists("/content/drive/MyDrive/extensions"):
        subprocess.run("rsync -a /content/drive/MyDrive/extensions/* /content/colabtools/extensions", shell=True)
        print('已加载云盘里的插件')
    if os.path.exists("/content/drive/MyDrive/VAE"):
        subprocess.run("rsync -a /content/drive/MyDrive/VAE/* /content/colabtools/models/VAE", shell=True)
        print('已加载云盘里的VAE')
    if os.path.exists("/content/drive/MyDrive/embeddings"):
        subprocess.run("rsync -a /content/drive/MyDrive/embeddings/* /content/colabtools/embeddings", shell=True)
        print('已加载云盘里的embeddings')
    if os.path.exists("/content/drive/MyDrive/lora"):
        subprocess.run("mkdir -p /content/colabtools/models/Lora")
        subprocess.run("rsync -a /content/drive/MyDrive/lora/* /content/colabtools/models/Lora", shell=True)
        print('已加载云盘里的lora')
    if os.path.exists("/content/drive/MyDrive/checkpoint"):
        subprocess.run("rsync -a /content/drive/MyDrive/checkpoint/* /content/colabtools/models/Stable-diffusion", shell=True)
        print('已加载云盘里的Stable-diffusion')
