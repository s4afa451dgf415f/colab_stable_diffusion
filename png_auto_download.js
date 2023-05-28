(()=>{
  let delay_generate_button = function () {
    return new Promise((resolve) => {
      this.shadowRoot = document.querySelector("gradio-app");
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 如果 id 为 pnginfo_image 的子元素被添加到 gradio-app 元素中
          if (
            mutation.addedNodes.length &&
            mutation.addedNodes[0].id === "txt2img_generate"
          ) {
            // 取消监听
            observer.disconnect();
            // 获取 id 为 pnginfo_image 的元素并进行操作
            resolve();
          }
        });
      });
      observer.observe(this.shadowRoot, { childList: true, subtree: true });
    });
  };

  //图片下载到本地
    function downloadImage(url, fileName) {
  fetch(url).then(response => {
    return response.blob();
  }).then(blob => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

  //t2i下载
  let t2idownload=(ParentNode)=>{
    return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      // console.log('mutations',mutations)
      try{
      mutations.forEach((mutation) => {
        if (mutation.target.localName==='img'||(mutation.addedNodes[0]&&mutation.addedNodes[0].localName==='img'))
        {
          // console.log(mutation);
          t2iState='fufilled';
          [...ParentNode.querySelectorAll('.thumbnail-item > img')].forEach(resNode=>{
             let nameArr=resNode.src.split('/')
            let name=decodeURIComponent(nameArr[nameArr.length-1])
            downloadImage(resNode.src,name)
        })
          observer.disconnect();
          throw '强制跳出循环'
      }});}
      catch(out){
        resolve()
      }
    });
    observer.observe(ParentNode, { attributes: true,childList: true, subtree: true });
  });
  }

  //i2i下载
    let i2idownload=(ParentNode)=>{
    return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      // console.log('mutations',mutations)
      try{
      mutations.forEach((mutation) => {
        if (mutation.target.localName==='img'||(mutation.addedNodes[0]&&mutation.addedNodes[0].localName==='img'))
        {
          // console.log(mutation);
          t2iState='fufilled';
          [...ParentNode.querySelectorAll('.thumbnail-item > img')].forEach(resNode=>{
             let nameArr=resNode.src.split('/')
            let name=decodeURIComponent(nameArr[nameArr.length-1])
            downloadImage(resNode.src,name)
        })
          observer.disconnect();
          throw '强制跳出循环'
      }});}
      catch(out){
        resolve()
      }
    });
    observer.observe(ParentNode, { attributes: true,childList: true, subtree: true });
  });
  }

  //extras下载
    let extdownload=(ParentNode)=>{
    return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      // console.log('mutations',mutations)
      try{
      mutations.forEach((mutation) => {
        if (mutation.target.localName==='img'||(mutation.addedNodes[0]&&mutation.addedNodes[0].localName==='img'))
        {
          // console.log(mutation);
          extState='fufilled';
          [...ParentNode.querySelectorAll('.thumbnail-item > img')].forEach(resNode=>{
             let nameArr=resNode.src.split('/')
            let name=decodeURIComponent(nameArr[nameArr.length-1])
            downloadImage(resNode.src,name)
        })
          observer.disconnect();
          throw '强制跳出循环'
      }});}
      catch(out){
        resolve()
      }
    });
    observer.observe(ParentNode, { attributes: true,childList: true, subtree: true });
  });
  }

  async function png_download_init(){
    let self = this;
    await delay_generate_button();
    self.t2iState='pending'
    self.i2iState='pending'
    self.extState='pending'

    //注册t2i生成按钮点击事件进行下载
    document.querySelector("#txt2img_generate").onclick=async function(){
      //根节点
      let Rootnode=document.querySelector("#txt2img_gallery")
      //第一次获取第一张图片节点,需要从根节点开始找
      if(self.t2iState==='pending')
      {
      await t2idownload.call(self,Rootnode)
      }
      else{
      //对于图片节点的父节点
        let ParentNode=Rootnode.querySelector("#txt2img_gallery > div.grid-wrap > div")
        //下载图片并更新旧节点
        t2idownload.call(self,ParentNode)
      }
    }

    //注册i2i生成按钮点击事件进行下载
    document.querySelector("#img2img_generate").onclick=async function(){
      //根节点
      let Rootnode=document.querySelector("#img2img_gallery")
      //第一次获取第一张图片节点,需要从根节点开始找
      if(self.i2iState==='pending')
      {
      await i2idownload.call(self,Rootnode)
      }
      else{
      //对于图片节点的父节点
        let ParentNode=Rootnode.querySelector("#img2img_gallery > div.grid-wrap > div")
        //下载图片并更新旧节点
        i2idownload.call(self,ParentNode)
      }
    }
    //注册extra生成按钮点击事件进行下载
    document.querySelector("#extras_generate").onclick=async function(){
      //根节点
      let Rootnode=document.querySelector("#extras_gallery")
      //第一次获取第一张图片节点,需要从根节点开始找
      if(self.extState==='pending')
      {
      await extdownload.call(self,Rootnode)
      }
      else{
      //对于图片节点的父节点
        let ParentNode=Rootnode.querySelector("#extras_gallery > div.grid-wrap > div")
        //下载图片并更新旧节点
        extdownload.call(self,ParentNode)
      }
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    png_download_init()
  });
})()