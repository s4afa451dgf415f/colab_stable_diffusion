import os
import random
import string

# 指定已存在的目录
target_dir = "/"

# 获取目录下的所有子目录
subdirs = [name for name in os.listdir(target_dir) if os.path.isdir(os.path.join(target_dir, name)) and name != "content"and name != "proc"and name != "sys"]

# 从子目录中随机选择一个目录
random_dir = random.choice(subdirs)

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for _ in range(length))
colabtools =generate_random_string(6)

if subdirs:
    random_dir = random.choice(subdirs)
else:
    print("目录下没有满足条件的子目录。")
dir=f"/{random_dir}/{colabtools}"
print(f"您的路径指定为{dir}")
del subdirs,random_dir,colabtools
os.mkdir(dir)