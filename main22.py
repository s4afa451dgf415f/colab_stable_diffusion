import json
import re
import subprocess
import shutil
import os
from concurrent.futures import ThreadPoolExecutor
import sys

check_dir = "/content/colabtools/models/Stable-diffusion"
lora_dir = "/content/colabtools/models/Lora"

params = {}
for arg in sys.argv[1:]:
    if arg.startswith('--'):
        key_value = arg[len('--'):].split('=')
        if len(key_value) == 2:
            key, value = key_value
            params[key] = value
def swap(arr, l, r):
    temp = arr[l]
    arr[l] = arr[r]
    arr[r] = temp


def checkRelateMod(oldMod, newMod):
    try:
        return oldMod and newMod and oldMod['downloadLink'] == newMod['downloadLink']
    except Exception as e:
        print(e)


def sanitize_filename(filename):
    # 定义不兼容字符的正则表达式模式
    pattern = r'[\\/:*?"<>|]'
    # 使用下划线替换不兼容字符
    sanitized_filename = re.sub(pattern, '_', filename)
    return sanitized_filename


def compatibility(preContent):
    for item in preContent:
        if bool(item['path']):
            item['path'] = re.sub("stable-diffusion-webui", "colabtools", item['path'])
            item['path'] = re.sub(r"colabtools_\w+", "colabtools", item['path'])


def dealRelateMod(oldRenameMod, newRenameMod):
    old_file_path = f"{oldRenameMod['path']}/{oldRenameMod['name']}"
    # 新模型的定义不带后缀名，所以需要加上处理，且在预处理情况下不知道路径那么只能沿用老模型的路径和名字
    new_file_dir = (
        newRenameMod['path']
        if newRenameMod.get('path') and newRenameMod['path'] != ""
        else oldRenameMod['path']
    )
    new_file_name = (
        sanitize_filename(newRenameMod['name']) + os.path.splitext(oldRenameMod['name'])[1]
        if newRenameMod['name'] and newRenameMod['name'] != "未命名"
        else oldRenameMod['name']
    )
    new_file_path = f"{new_file_dir}/{new_file_name}"
    if old_file_path != new_file_path:
        try:
            if os.path.exists(old_file_path):
                os.rename(old_file_path, new_file_path)
                oldRenameMod['path'] = new_file_dir
                oldRenameMod['name'] = new_file_name
                print(f"{old_file_path}更改为{new_file_path}成功")
            else:
                print(f"{old_file_path}不存在，重命名失败")
        except OSError as e:
            print(f"更改{old_file_path}时发生错误: {e}")
    else:
        print(f"{newRenameMod['name']}已存在且无任何改变，将忽视")


def deleteMod(oldDeMod):
    file_path = f"{oldDeMod['path']}/{oldDeMod['name']}"
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            # oldCo的行也要进行同步删除
            print(f"{oldDeMod['name']}删除成功")
        else:
            print(f"{oldDeMod['name']}不存在，删除失败")
    except OSError as e:
        print(f"删除{oldDeMod['name']}时发生错误: {e}")


def LCS(oldCo, newCo):
    oldStartIdx = 0  # 旧前指针
    newStartIdx = 0  # 新前指针
    oldEndIdx = len(oldCo) - 1  # 旧后指针
    newEndIdx = len(newCo) - 1  # 新后指针
    oldStartMod = oldCo[oldStartIdx]  # 旧前Mod
    oldEndMod = oldCo[oldEndIdx]  # 旧后Mod
    newStartMod = newCo[newStartIdx]  # 新前Mod
    newEndMod = newCo[newEndIdx]  # 新后Mod
    linkMap = {}
    while oldStartIdx <= oldEndIdx and newStartIdx <= newEndIdx:
        # 新前旧前
        if checkRelateMod(oldStartMod, newStartMod):
            dealRelateMod(oldStartMod, newStartMod)
            oldStartIdx += 1
            newStartIdx += 1
            if newStartIdx > newEndIdx or oldStartIdx > oldEndIdx:
                break
            oldStartMod = oldCo[oldStartIdx]
            newStartMod = newCo[newStartIdx]
        # 新后旧后
        elif checkRelateMod(oldEndMod, newEndMod):
            dealRelateMod(oldEndMod, newEndMod)
            oldEndIdx -= 1
            newEndIdx -= 1
            if newStartIdx > newEndIdx or oldStartIdx > oldEndIdx:
                break
            oldEndMod = oldCo[oldEndIdx]
            newEndMod = newCo[newEndIdx]
        # 新后旧前
        elif checkRelateMod(oldStartMod, newEndMod):
            dealRelateMod(oldStartMod, newEndMod)
            oldStartIdx += 1
            newEndIdx -= 1
            if newStartIdx > newEndIdx or oldStartIdx > oldEndIdx:
                break
            oldStartMod = oldCo[oldStartIdx]
            newEndMod = newCo[newEndIdx]
        # 新前旧后
        elif checkRelateMod(oldEndMod, newStartMod):
            dealRelateMod(oldEndMod, newStartMod)
            oldEndIdx -= 1
            newStartIdx += 1
            if newStartIdx > newEndIdx or oldStartIdx > oldEndIdx:
                break
            oldEndMod = oldCo[oldEndIdx]
            newStartMod = newCo[newStartIdx]
        # 四种均未找到
        else:
            # if not linkMap:
            linkMap = {}
            # 从 oldStartIdx 开始，到oldEndIdx结束，创建linkMap映射对象
            for i in range(oldStartIdx, oldEndIdx + 1):
                downloadLink = oldCo[i]['downloadLink']
                if downloadLink is not None:
                    linkMap[downloadLink] = i
            idxInOld = linkMap.get(newStartMod['downloadLink'], None)
            if idxInOld is None:
                print(f"{newStartMod['name']}不存在于旧mod,{newStartMod['downloadLink']}将添加到下载任务队列")
                content.append(newStartMod)

            else:
                dealRelateMod(oldCo[idxInOld], newStartMod)
                swap(oldCo, idxInOld, oldEndIdx)
                oldEndIdx -= 1
            # 指针下移，移动新的头
            newStartIdx += 1
            if newStartIdx > newEndIdx:
                break
            newStartMod = newCo[newStartIdx]
            oldEndMod = oldCo[oldEndIdx]
            # oldStartIdx += 1
    print('new', newStartIdx, newEndIdx)
    print('old', oldStartIdx, oldEndIdx)
    # new这里还有剩余Mod没有处理
    if newStartIdx <= newEndIdx:
        for i in range(newStartIdx, newEndIdx + 1):
            print(f"{newCo[i]['name']}为新且不重复mod，将添加到下载任务队列")
            content.append(newCo[i])

    elif oldStartIdx <= oldEndIdx:
        i = oldStartIdx
        while i <= oldEndIdx:
            if i < len(oldCo):
                print(f"{oldCo[i]['name']}为旧不重复mod，将删除")
                deleteMod(oldCo[i])
                del oldCo[i]
                oldEndIdx -= 1
            else:
                break


# LCS(oldArr,oldArr)
with open(params["json_dir"], 'r') as modelFile:
    preContent = json.loads(modelFile.read())
    compatibility(preContent)

oldCo = json.loads(os.environ["oldCo"])

# 更新阶段
if 'oldCo' and len(oldCo) > 0:
    content = []
    print(oldCo)
    print(preContent)
    LCS(oldCo, preContent)
    print(content)
# 初始化阶段
else:
    oldCo = []
    content = preContent

# 部分下载的情况
selected_mods = [x.strip() for x in params["name"].split('与') if x.strip()]


def get_file_size(file_path):
    try:
        file_size_bytes = os.path.getsize(file_path)
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if file_size_bytes < 1024.0:
                break
            file_size_bytes /= 1024.0
        return f"{file_size_bytes:.2f} {unit}"
    except OSError as e:
        print(f"Error: {e}")
        return None


def get_civitai_file(str):
    match = re.search(r'[^/]+$', str.decode())
    if match:
        return match.group(0).split('\n')[0]
    else:
        print("无法从输出中提取文件名")


def move_model(source_path, target_path):
    try:
        shutil.move(source_path, target_path)
    except OSError as e:
        print(f"Error: {e}")


def download_file(item):
    # for item in content:
    if selected_mods and item['name'] not in selected_mods:
        return
    download_url = item['downloadLink']
    # huggingface
    match = re.search(r'/([^/]*)$', download_url)
    file_name = match.group(1)
    # 开始下载
    cmd = f"aria2c --console-log-level=error -c -x 16 -s 16 -k 1M {download_url} -d {lora_dir}" if '.' not in match.group(
        1) else f"aria2c --console-log-level=error -c -x 16 -s 16 -k 1M {download_url} -d {lora_dir} -o {file_name}"
    result = subprocess.run(cmd, shell=True, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    if result.returncode == 0:
        # 判断是civitai还是hugging face还是自定义
        # civitai
        if '.' not in file_name:
            file_name = get_civitai_file(result.stdout)
        # 如果定义了名字则重命名
        if item['name'] != '未命名':
            # 需要进行文件名的兼容处理
            temp_name = sanitize_filename(item['name']) + os.path.splitext(file_name)[1]
            os.rename(f"{lora_dir}/{file_name}", f"{lora_dir}/{temp_name}")
            final_name = temp_name
        else:
            final_name = file_name
        source_path = f"{lora_dir}/{final_name}"
        file_size = get_file_size(source_path)
        # 如果path定义了则进行移动
        if item.get('path') and item['path'] != "":
            target_path = item['path']
            move_model(source_path, target_path)
            item['path'] = target_path
            print(file_name + '已下载，重命名为：' + final_name)
            print('移动--', final_name, f'到{target_path}')
        # 如果为checkpoint则进行移动
        elif file_size and 'GB' in file_size:
            move_model(source_path, check_dir)
            item['path'] = check_dir
            print(file_name + '已下载，重命名为：' + final_name)
            print('移动checkpoint--', final_name, f'到{check_dir}文件夹')
        # 如果为lora则直接调用source_path
        else:
            item['path'] = lora_dir
            print(file_name + '已下载，重命名为：' + final_name)
        # 改变item['name']用于最小化更新的重命名判断
        item['name'] = final_name
        oldCo.append(item)
    else:
        print(f"{item['name']}下载失败,请检查{item['downloadLink']}")


# download_file(item)
# 使用线程池进行下载
with ThreadPoolExecutor(max_workers=5) as executor:
    for item in content:
        executor.submit(download_file, item)
