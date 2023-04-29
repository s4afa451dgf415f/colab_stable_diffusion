# **colab_stable_diffusion_webui**
-[![](https://img.shields.io/static/v1?message=Open%20in%20Colab&logo=googlecolab&labelColor=5c5c5c&color=0f80c1&label=%20&style=flat)](https://colab.research.google.com/github/s4afa451dgf415f/colab_stable_diffusion/blob/main/%E4%BA%91stable_diffusion(%E4%BF%AE%E5%A4%8D%E6%8C%96%E7%9F%BF%E5%AB%8C%E7%96%91).ipynb)<br>


### 关于谷歌colab
- 请确认有可以魔法上网的工具，工具用于谷歌colab的机器学习，属于合法范畴。 
- 优势：不需要显卡，手机也能用，且云端运行速度快。缺陷：交互时易中断，需要优质的魔法工具才能获得好的体验。 
- 一天为8小时使用时间，多搞几个账号就够用了,云盘里model.json文件拷过去就能复制所有mod
- 一天内第一次启动过程约7分钟左右下载插件模型依赖，请耐心等待。之后如果再启动就非常快。 
- 你也可以电脑魔法上网colab，手机直接打开代码运行后给出的域名就行。
- 谷歌运行环境为12G 内存15G显存，大显存小内存所以推荐使用半精度进行计算
 
 ## 关于sd
 - lora和checkpoint可在笔记本页面自定义下载，lora建议勾选保存到云盘下次不用下载
 - 采样方法推荐 DDIM 与DPM++ 2M 高清放大推荐 潜变量(bicubic)与潜变量最邻近
 - 图片输出在在云盘的outputs文件夹里
 - 生成图的速度与执行代码的速度与网速无关，你就算断网几分钟他也在执行
 - 什么时候我该刷新了？ 控制台没输出进度，且点击按钮没有任何反应或ui组件加载时没有出现process字样且加载时间超过20秒
 - 如果要使用手机进行局部绘图请使用Edge浏览器，谷歌浏览器不兼容
 - 报错或无法解决的问题请加群710895662
 
## Update?
### v.2.0.2 (23/04/29)
- 内存泄露问题已解决
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
