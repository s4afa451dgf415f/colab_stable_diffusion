<h1 align="center">colab_stable_diffusion_webui</h1>
<div align="center">
  <div>👇点击图片进入colab👇</div>
  <a href="https://colab.research.google.com/github/s4afa451dgf415f/colab_stable_diffusion/blob/main/%E4%BA%91stable_diffusion(%E4%BF%AE%E5%A4%8D%E6%8C%96%E7%9F%BF%E5%AB%8C%E7%96%91).ipynb"><img src="./image/README/tmpktq2ywtz.png" width="768" height="512" alt="open in colab"></a> 
</div>

<div align="center">
🚀并行下载摇树优化，提供更快的部署🚀<br/>
🎇可选功能，使用户能够灵活定制🎇<br/>
✨如果喜欢请点个⭐吧！您的支持就是我持续更新的动力✨<br/>
 
简体中文 | [English](README_EN.md)

[功能列表](#Feature) | [视频演示](https://www.bilibili.com/video/BV17h4y1J79g/?spm_id_from=333.788.top_right_bar_window_history.content.click) | [疑难解答](#FAQ) | [更新日志](#Update) | [预览图](#Preview) 
</div>

<div id="Feature">

## 💡 功能列表
- [x] mod管理系统：可对mod进行管理，并采用线程池下载从而达到不占用网盘空间又优于拷贝云盘的速度
- [x] 图片信息本地读取脚本：利用js脚本对sd图片进行本地处理从而节省与服务器交互的时间与流量又确保了可靠性
- [x] 图片自动保存脚本:利用js脚本让生成的图片自动保存从而避免手动挨个保存图片的麻烦。
- [x] 手机自适应：利用媒体查询和改变全局样式从而避免了误触或使用[anapnoe](https://github.com/anapnoe/stable-diffusion-webui-ux)版本兼容
- [x] 初始化最佳配置：根据最佳使用体验进行初始化配置，解决用户进入页面手动配置的麻烦。
- [x] 使用[Automatic111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)版本自带的ngrok通道有效的提升网络速度。
- [x] 支持自定义的vae与插件，请在云盘新建文件夹"VAE"或"extensions"并自行管理
  
</div>

<div id="FAQ">
<h2>🔍 疑难解答</h2>
<h3>关于谷歌colab</h3> 

- 请确认有可以魔法上网的工具，工具用于谷歌colab的机器学习，属于合法范畴。 
- 优势：不需要显卡，手机也能用，云端运行速度快。缺点：每天登录需要重新部署且有时长限制
- 此项目为免费开源项目，并将持续维护更新。如果有任何广告动机请举报
- 由于人数较多，谷歌colab每个号的时间大概为4-6小时左右，多弄几个号在云盘里主号的json给其他号添加编辑权限就实现了所有号共用
- 一天内第一次启动过程约7分钟左右下载插件模型依赖，请耐心等待。之后如果再启动就非常快。 
- 你也可以电脑运行colab笔记本，手机直接打第四步给出的域名就行。
- 谷歌运行环境为12G 内存15G显存，大显存小内存所以推荐使用半精度进行计算
- mod管理单元中lora和checkpoint只需填下载地址即可，你也可以添加一些信息方便管理。
- 笔记本为单线程，请保证4、单元格处于未运行状态再管理mod。
- mod管理时建议mod名以"c站mod名（自定义中文名）"的形式进行命名，这样既可以方便搜索c站的sd图，又方便在使用时在lora列表进行搜索
- 新人不知道下哪些模型可以去推荐模型文档单元下载json文件。
- 自定义的vae与插件或想加载云盘里的模型请在云盘新建文件夹"VAE"或"extensions"或"lora"或"checkpoint"并自行管理
- 如果出现此代码为不可执行的代码请勿进行任何操作并等待修复，时长被限制概不负责
- 晚高峰人数较多，提示连接出错或断线为正常情况，可以尝试使用ngrok管道进行加速。
 
<h3>关于stable-diffusion</h3>

 - 如果图片信息读取图片“不是一张stable diffusion图片”说明作者上传的图片经过了压缩处理，可以复制文字与种子手动输入或者使用tagger图生文
 - 采样方法推荐 DDIM 与DPM++ 2M 高清放大推荐 潜变量最邻近和ultimate-upscale
 - 图片可以选择输出在云盘的outputs文件夹里或自动下载
 - 生成图的速度与执行代码的速度与网速无关，你就算断网几分钟他也在执行
 - there's not enough precision to represent the picture的解决方式是切换其他VAE，或者4、运行时勾选全精度，但生成图的速度会下降一半
 - 输入"<"即可调出lora
 
</div>

<div id="Update">
<h2>📔 更新日志</h2>

### v2.2.1(23/11/29)
- 新增1.6.0版本，此版本支持sdxl
### v2.2.0(23/11/12)
- 已更新xformer来符合colab的torch版本
- 解决httpx报错的问题
- 根据谷歌要求不再提供免费版本，请购买Colab Pro再使用
### v2.2.0(23/08/26)
- 部分重构下载管理模块，支持指定路径字段进行下载。
- webui升级至最新版本1.5.1,1.3.0改为稳定版本。
### v2.1.2(23/08/07)
- 可选择加载云盘中的config.json文件
### v2.1.1(23/07/22)
- 使用colab自带libtcmalloc来解决内存泄漏版本修复Ubantu22.04不兼容的问题
### v2.1.0(23/06/17)
- 也支持从云盘读取checkpoint和lora,请自行在云盘新建文件夹"checkpoint"、"lora"
- 模型文档可放在文件目录任意文件夹，将采用递归查找并读取
### v2.0.9(23/06/03)
- 默认版本改为[Automatic111v1.3.1](https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.3.1)
- 对[anapnoe](https://github.com/anapnoe/stable-diffusion-webui-ux)的更新进行了脚本兼容
### v2.0.8(23/06/01)
- mod下载单元采用线程池并行下载
### v2.0.7(23/05/28)
- 增加生成图片自动保存到本地设备的脚本
- 图片信息模块读取图片不是sd时，会推荐跳转到tagger模块
### v2.0.6(23/05/25)
- 因[xformers](https://github.com/facebookresearch/xformers)更新到0.0.20取消torch的下载，大幅节省下载时间
- 新增中译提示词[all-in-one](https://github.com/Physton/sd-webui-prompt-all-in-one)
### v2.0.5(23/05/19)
- torch问题已修复
### v.2.0.5 (23/05/14)
- 优化了下载。用LCS算法对mod的下载进行最小化更新
- 增加sd原版ui下暗配色为可选启动项
### v.2.0.4 (23/05/12)
- 增加openpose3d插件
- 增加推荐mod文档下载单元格
- 增加自定义插件和vae方法
### v.2.0.4 (23/05/09)
- 增加了不挂载云盘运行的选项
### v.2.0.3 (23/05/03)
- 根据大版本更新修复了脚本
- 默认UI改回[Automatic111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)，anapnoe为可选择
### v.2.0.2 (23/04/29)
- 内存泄露问题已解决
- 优化了mod管理单元的交互，支持切换文档了
### v.2.0.1 (23/04/27)
- 改用了更好更适配的ui系统，来源[anapnoe](https://github.com/anapnoe/stable-diffusion-webui-ux)
- 用指令一定程度解决了mod切换内存不足的问题
- 解决了图生图某些特定尺寸无法生成的问题
- 配置了ngrok加速
### v.2.0.0 (23/04/27)
- 增加了mod增删改查系统
- 重构mod下载模块，不需要再用云盘保存mod
### v.1.1.4 (23/04/24)
- 更新了controlnet 1.1
- 增加部分了自定义设置
### v.1.1.3 (23/04/21)
- 修复了出现怀疑挖矿提示框的问题
- 部分单元格采用异步下载提高执行效率
- 默认大模型换成了[Dark Sushi Mix](https://civitai.com/api/download/models/33482)
- controlNet控制模型默认数量变为3
### v.1.1.2 (23/04/17)
- 修复了手机局部绘图图片width过大的问题
### v.1.1.1 (23/04/12)
- 更新了[CN_tag_trans](https://www.bilibili.com/video/BV1tg4y137mt/?spm_id_from=333.880.my_history.page.click&vd_source=931a87555c05909a4816745522b3ce74)
- 增加了从png_info图片秒读秒填充的功能
</div>

<div id="Preview" align="center">
<h2 id="Preview">预览图</h2>
<img src="./image/README/mobilePhone.png" alt="cell phone">
<img src="./image/README/webUi.png" alt="webui">
</div>