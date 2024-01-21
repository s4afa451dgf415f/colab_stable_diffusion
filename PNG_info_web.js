(()=>{
  var CRC32;
  (function (factory) {
    if (typeof DO_NOT_EXPORT_CRC === "undefined") {
      if ("object" === typeof exports) {
        factory(exports);
      } else if ("function" === typeof define && define.amd) {
        define(function () {
          var module = {};
          factory(module);
          return module;
        });
      } else {
        factory((CRC32 = {}));
      }
    } else {
      factory((CRC32 = {}));
    }
  })(function (CRC32) {
    CRC32.version = "0.3.0";
    /* see perf/crc32table.js */
    function signed_crc_table() {
      var c = 0,
        table = new Array(256);

      for (var n = 0; n != 256; ++n) {
        c = n;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        c = c & 1 ? -306674912 ^ (c >>> 1) : c >>> 1;
        table[n] = c;
      }

      return typeof Int32Array !== "undefined" ? new Int32Array(table) : table;
    }

    var table = signed_crc_table();
    /* charCodeAt is the best approach for binary strings */
    var use_buffer = typeof Buffer !== "undefined";
    function crc32_bstr(bstr) {
      if (bstr.length > 32768)
        if (use_buffer) return crc32_buf_8(new Buffer(bstr));
      var crc = -1,
        L = bstr.length - 1;
      for (var i = 0; i < L; ) {
        crc = table[(crc ^ bstr.charCodeAt(i++)) & 0xff] ^ (crc >>> 8);
        crc = table[(crc ^ bstr.charCodeAt(i++)) & 0xff] ^ (crc >>> 8);
      }
      if (i === L) crc = (crc >>> 8) ^ table[(crc ^ bstr.charCodeAt(i)) & 0xff];
      return crc ^ -1;
    }

    function crc32_buf(buf) {
      if (buf.length > 10000) return crc32_buf_8(buf);
      for (var crc = -1, i = 0, L = buf.length - 3; i < L; ) {
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
      }
      while (i < L + 3) crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
      return crc ^ -1;
    }

    function crc32_buf_8(buf) {
      for (var crc = -1, i = 0, L = buf.length - 7; i < L; ) {
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
      }
      while (i < L + 7) crc = (crc >>> 8) ^ table[(crc ^ buf[i++]) & 0xff];
      return crc ^ -1;
    }

    /* much much faster to intertwine utf8 and crc */
    function crc32_str(str) {
      for (var crc = -1, i = 0, L = str.length, c, d; i < L; ) {
        c = str.charCodeAt(i++);
        if (c < 0x80) {
          crc = (crc >>> 8) ^ table[(crc ^ c) & 0xff];
        } else if (c < 0x800) {
          crc = (crc >>> 8) ^ table[(crc ^ (192 | ((c >> 6) & 31))) & 0xff];
          crc = (crc >>> 8) ^ table[(crc ^ (128 | (c & 63))) & 0xff];
        } else if (c >= 0xd800 && c < 0xe000) {
          c = (c & 1023) + 64;
          d = str.charCodeAt(i++) & 1023;
          crc = (crc >>> 8) ^ table[(crc ^ (240 | ((c >> 8) & 7))) & 0xff];
          crc = (crc >>> 8) ^ table[(crc ^ (128 | ((c >> 2) & 63))) & 0xff];
          crc =
            (crc >>> 8) ^ table[(crc ^ (128 | ((d >> 6) & 15) | (c & 3))) & 0xff];
          crc = (crc >>> 8) ^ table[(crc ^ (128 | (d & 63))) & 0xff];
        } else {
          crc = (crc >>> 8) ^ table[(crc ^ (224 | ((c >> 12) & 15))) & 0xff];
          crc = (crc >>> 8) ^ table[(crc ^ (128 | ((c >> 6) & 63))) & 0xff];
          crc = (crc >>> 8) ^ table[(crc ^ (128 | (c & 63))) & 0xff];
        }
      }
      return crc ^ -1;
    }
    CRC32.table = table;
    CRC32.bstr = crc32_bstr;
    CRC32.buf = crc32_buf;
    CRC32.str = crc32_str;
  });

  var uint8 = new Uint8Array(4);
  var int32 = new Int32Array(uint8.buffer);
  var uint32 = new Uint32Array(uint8.buffer);

  function extractChunks(data) {
    if (data[0] !== 0x89) throw new Error("Invalid .png file header");
    if (data[1] !== 0x50) throw new Error("Invalid .png file header");
    if (data[2] !== 0x4e) throw new Error("Invalid .png file header");
    if (data[3] !== 0x47) throw new Error("Invalid .png file header");
    if (data[4] !== 0x0d)
      throw new Error(
        "Invalid .png file header: possibly caused by DOS-Unix line ending conversion?"
      );
    if (data[5] !== 0x0a)
      throw new Error(
        "Invalid .png file header: possibly caused by DOS-Unix line ending conversion?"
      );
    if (data[6] !== 0x1a) throw new Error("Invalid .png file header");
    if (data[7] !== 0x0a)
      throw new Error(
        "Invalid .png file header: possibly caused by DOS-Unix line ending conversion?"
      );

    var ended = false;
    var chunks = [];
    var idx = 8;

    while (idx < data.length) {
      // Read the length of the current chunk,
      // which is stored as a Uint32.
      uint8[3] = data[idx++];
      uint8[2] = data[idx++];
      uint8[1] = data[idx++];
      uint8[0] = data[idx++];

      // Chunk includes name/type for CRC check (see below).
      var length = uint32[0] + 4;
      var chunk = new Uint8Array(length);
      chunk[0] = data[idx++];
      chunk[1] = data[idx++];
      chunk[2] = data[idx++];
      chunk[3] = data[idx++];

      // Get the name in ASCII for identification.
      var name =
        String.fromCharCode(chunk[0]) +
        String.fromCharCode(chunk[1]) +
        String.fromCharCode(chunk[2]) +
        String.fromCharCode(chunk[3]);

      // The IHDR header MUST come first.
      if (!chunks.length && name !== "IHDR") {
        throw new Error("IHDR header missing");
      }

      // The IEND header marks the end of the file,
      // so on discovering it break out of the loop.
      if (name === "IEND") {
        ended = true;
        chunks.push({
          name: name,
          data: new Uint8Array(0),
        });

        break;
      }

      // Read the contents of the chunk out of the main buffer.
      for (var i = 4; i < length; i++) {
        chunk[i] = data[idx++];
      }

      // Read out the CRC value for comparison.
      // It's stored as an Int32.
      uint8[3] = data[idx++];
      uint8[2] = data[idx++];
      uint8[1] = data[idx++];
      uint8[0] = data[idx++];

      var crcActual = int32[0];
      var crcExpect = CRC32.buf(chunk);
      if (crcExpect !== crcActual) {
        throw new Error(
          "CRC values for " +
            name +
            " header do not match, PNG file is likely corrupted"
        );
      }

      // The chunk data is now copied to remove the 4 preceding
      // bytes used for the chunk name/type.
      var chunkData = new Uint8Array(chunk.buffer.slice(4));

      chunks.push({
        name: name,
        data: chunkData,
      });
    }

    if (!ended) {
      throw new Error(".png file ended prematurely: no IEND header was found");
    }

    return chunks;
  }
  //decode
  function decode(data) {
    if (data.data && data.name) {
      data = data.data;
    }

    var naming = true;
    var text = "";
    var name = "";

    for (var i = 0; i < data.length; i++) {
      var code = data[i];

      if (naming) {
        if (code) {
          name += String.fromCharCode(code);
        } else {
          naming = false;
        }
      } else {
        if (code) {
          text += String.fromCharCode(code);
        } else {
          throw new Error(
            "Invalid NULL character found. 0x00 character is not permitted in tEXt content"
          );
        }
      }
    }

    return {
      keyword: name,
      text: text,
    };
  }

  const inputEvent = new Event("input");
  const changeEvent = new Event("change");
  let shadowRoot = null;
  let version_more_16 = null;
  let result = {};
  let png_info_blob = {};
  //readNovelAITag函数参考于秋叶大佬并进行了优化
  const readNovelAITag = async (file) => {
    let chunks = [];
    let textChunks = [];
    try {
    const buf = await file.arrayBuffer();
    chunks = extractChunks(new Uint8Array(buf));
    textChunks = chunks.filter(function (chunk) {
    return chunk.name === "tEXt" || chunk.name === "iTXt";
    });
    textChunks = textChunks.map(function (chunk) {
    if (chunk.name === "iTXt") {
    let data = chunk.data.filter((x) => x != 0x0);
    let txt = new TextDecoder().decode(data);
    return {
    keyword: "信息",
    text: txt.slice(10),
    };
    }
    return decode(chunk.data);
    });
    return textChunks;
    } catch (err) {
    console.error(err);
    } finally {
    chunks = null;
    textChunks = null;
    }
    return [];
    };

  //dom转blob
  async function convertDomImageToBlob(imageElement) {
    const imageUrl = imageElement.src;
    // const file = new File([blob], 'filename.png', {type: blob.type});
    return await readStoragePng(imageUrl);
  }

  //base64转blob
  async function readStoragePng(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);

    // 获取 MIME 类型
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // 创建 Blob 对象
    var blob = new Blob(
      [
        new Uint8Array(byteString.length).map(function (_, i) {
          return byteString.charCodeAt(i);
        }),
      ],
      { type: mimeString }
    );

    return blob;
  }

  //图片存到本地
let imgStorage=(img)=>{
  localStorage.setItem("png_info_img", img.src);
  }
  //延迟获取dom到pnginfo_image更新完后
  let delayPng_info = function () {
    return new Promise((resolve) => {
      this.shadowRoot = document.querySelector("gradio-app");
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 如果 id 为 pnginfo_image 的子元素被添加到 gradio-app 元素中
          if (
            mutation.addedNodes.length &&
            mutation.addedNodes[0].id === "pnginfo_image"
          ) {
            // 取消监听
            observer.disconnect();
            // 获取 id 为 pnginfo_image 的元素并进行操作
            resolve(mutation.addedNodes[0]);
          }
        });
      });
      observer.observe(this.shadowRoot, { childList: true, subtree: true });
    });
  };


  //此节点render-tree是否已形成
  function isElementRendered(el) {
    const style = window.getComputedStyle(el);

    if (style.getPropertyValue('display') === 'none') {
      return false;
    }

    // 判断是否有宽高
    if (el.offsetWidth <= 0 || el.offsetHeight <= 0) {
      return false;
    }

    return true;
  }

  let delay_png_change = function (png_info) {
    return new Promise((resolve) => {
      //用来判断点击事件进行resolve,因为初始化优先级没那么高，所以不用担心初始化的时候执行
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 如果 delay_png_change 存在了
          if (
            png_info.querySelector("img")
          ) {
            // 取消监听
            observer.disconnect();
            // 获取 id 为 delay_tab_click 的元素并进行操作
            resolve(png_info.querySelector("img"));
          }
        });
      });
      observer.observe(png_info, { childList: true, subtree: true });
    });
  };

  let delay_png_downloaded = function (downloadNode) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            downloadNode.querySelector("#txt2img_gallery > div.grid-wrap > div")
          ) {
            // 取消监听
            observer.disconnect();
            resolve(document.querySelector("#txt2img_gallery > div.grid-wrap > div >button >img"));
          }
        });
      });
      observer.observe(downloadNode, { childList: true, subtree: true });
    });
  };

  let delay_tab_click = function () {
    return new Promise((resolve) => {
      //用来判断点击事件进行resolve,因为初始化优先级没那么高，所以不用担心初始化的时候执行
      if(this.shadowRoot.querySelectorAll('#mode_img2img button')[2])
      {
        console.log('点击类读取')
        resolve(this.shadowRoot.querySelectorAll('#mode_img2img button')[2]);
      }
      this.shadowRoot = document.querySelector("gradio-app");
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 如果 delay_tab_click 存在了
          if (
            this.shadowRoot.querySelectorAll('#mode_img2img button')[2]
          ) {
            // 取消监听
            observer.disconnect();
            // 获取 id 为 delay_tab_click 的元素并进行操作
            resolve(this.shadowRoot.querySelectorAll('#mode_img2img button')[2]);
          }
        });
      });
      observer.observe(this.shadowRoot, { childList: true, subtree: true });
    });
  };

  let delay_canvas = function () {
    return new Promise((resolve) => {

      //用来判断点击事件进行resolve,因为初始化优先级没那么高，所以不用担心初始化的时候执行
      if(this.shadowRoot.querySelector("#img2maskimg > div.svelte-rlgzoo.fixed-height > div > div:nth-child(2)"))
      {
        console.log('点击类读取')
        resolve(this.shadowRoot.querySelector("#img2maskimg > div.svelte-rlgzoo.fixed-height > div > div:nth-child(2)"));
      }

      this.shadowRoot = document.querySelector("gradio-app");
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // 如果 id 为 delay_canvas 被添加到 gradio-app 元素中且6个子标签也存在了
          if (
            this.shadowRoot.querySelector("#img2maskimg > div.svelte-rlgzoo.fixed-height > div > div:nth-child(2)")&&this.shadowRoot.querySelector("#img2maskimg > div.svelte-rlgzoo.fixed-height > div > div:nth-child(2)").children[6]&&this.shadowRoot.querySelector("#img2maskimg > div.svelte-rlgzoo.fixed-height > div > div:nth-child(2)").children[6].style.display!=='none'
          ) {
            // 取消监听
            observer.disconnect();
            // 获取 delay_canvas 的元素并进行操作
            resolve(this.shadowRoot.querySelector("#img2maskimg > div.svelte-rlgzoo.fixed-height > div > div:nth-child(2)"));
          }
        });
      });
      observer.observe(this.shadowRoot, { childList: true, subtree: true });
    });
  };

  //文生图
  let txt2ImgFormFill = () => {
    shadowRoot=this.shadowRoot
    let result = this.result;
    const inputEvent = new Event("input");
    const changeEvent = new Event("change", {
      bubbles: true,
    });
    shadowRoot.querySelector("#tabs .tab-nav").children[0].click();
    if(!!result.Hiresupscaler && !shadowRoot.querySelector("#txt2img_hr > div.label-wrap.open")){
      shadowRoot.querySelector("#txt2img_hr > div.label-wrap").click();
    }
    if(!!result.Clipskip){
       shadowRoot.querySelectorAll(
      "#setting_CLIP_stop_at_last_layers input"
    )[0].value = Number(result.Clipskip);
    shadowRoot
      .querySelectorAll("#setting_CLIP_stop_at_last_layers input")[0]
      .dispatchEvent(inputEvent);

    shadowRoot.querySelectorAll(
      "#setting_CLIP_stop_at_last_layers input"
    )[1].value = Number(result.Clipskip||2);
    shadowRoot
      .querySelectorAll("#setting_CLIP_stop_at_last_layers input")[1]
      .dispatchEvent(inputEvent);
    }
    shadowRoot.querySelector("#txt2img_prompt textarea").value = result.prompt;
    shadowRoot
      .querySelector("#txt2img_prompt textarea")
      .dispatchEvent(inputEvent);

    shadowRoot.querySelector("#txt2img_neg_prompt textarea").value =
      result.negativePrompt;
    shadowRoot
      .querySelector("#txt2img_neg_prompt textarea")
      .dispatchEvent(inputEvent);

    shadowRoot.querySelectorAll("#txt2img_steps input")[0].value = Number(
      result.Steps
    );
    shadowRoot
      .querySelectorAll("#txt2img_steps input")[0]
      .dispatchEvent(inputEvent);

    shadowRoot.querySelectorAll("#txt2img_steps input")[1].value = Number(
      result.Steps
    );
    shadowRoot
      .querySelectorAll("#txt2img_steps input")[1]
      .dispatchEvent(inputEvent);

    shadowRoot.querySelector(`[value="${result.Sampler}"]`).checked = true;
    shadowRoot
      .querySelector(`[value="${result.Sampler}"]`)
      .dispatchEvent(changeEvent);

    shadowRoot.querySelectorAll("#txt2img_width input")[0].value = Number(
      result.Size.split("x")[0]
    );
    shadowRoot
      .querySelectorAll("#txt2img_width input")[0]
      .dispatchEvent(inputEvent);

    shadowRoot.querySelectorAll("#txt2img_width input")[1].value = Number(
      result.Size.split("x")[0]
    );
    shadowRoot
      .querySelectorAll("#txt2img_width input")[1]
      .dispatchEvent(inputEvent);

    shadowRoot.querySelectorAll("#txt2img_height input")[0].value = Number(
      result.Size.split("x")[1]
    );
    shadowRoot
      .querySelectorAll("#txt2img_height input")[0]
      .dispatchEvent(inputEvent);

    shadowRoot.querySelectorAll("#txt2img_height input")[1].value = Number(
      result.Size.split("x")[1]
    );
    shadowRoot
      .querySelectorAll("#txt2img_height input")[1]
      .dispatchEvent(inputEvent);

    shadowRoot.querySelector("#txt2img_seed input").value = Number(result.Seed);
    shadowRoot.querySelector("#txt2img_seed input").dispatchEvent(inputEvent);

    //高清修复
    //如果存在图片参数则对下拉框进行focus和mousevent
    const mousevent = new MouseEvent("mousedown", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      const focus = new MouseEvent("focus", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
    //sd版本小于1.6.0
    if(!this.version_more_16){
      if (!!result.Hiresupscaler) {
      //选择高清修复
      shadowRoot.querySelector("#txt2img_enable_hr input").checked =true
      shadowRoot.querySelector("#txt2img_enable_hr input").dispatchEvent(changeEvent);
      }
    }
    // else{
      // if (!!result.Hiresupscaler) {
      //   shadowRoot.querySelector("#txt2img_hr > div:nth-child(3)").style.display ="block"
      // }
      // else{
      //   shadowRoot.querySelector("#txt2img_hr > div:nth-child(3)").style.display ="none"
      // }
    // }
    //高清
    //hr放大器
    const hr_upscaler_element = document.querySelector(
      '#txt2img_hr_upscaler > label > div > div.wrap-inner> div > input'
    );
    hr_upscaler_element.dispatchEvent(focus);
    //将函数加入到任务队列待下一次轮询延迟下拉框加载完毕后执行
    queueMicrotask(() => {
        const Hiresupscaler_list_elem = shadowRoot.querySelector(
          `[data-value="${result.Hiresupscaler || "None"}"]`
        );
        Hiresupscaler_list_elem.dispatchEvent(mousevent);
    });

    //hr采样器
    const hr_sampler_element = document.querySelector(
        "#hr_sampler > label > div > div.wrap-inner> div > input"
    )
    //用户开启了hr采样器选项
    if(!!hr_sampler_element){
      hr_sampler_element.dispatchEvent(focus);
      queueMicrotask(() => {
      //将函数加入到任务队列待下一次轮询延迟下拉框加载完毕后执行
      const Hiressampler_list_elem = shadowRoot.querySelector(
        `[data-value="${result. Hiressampler || "Use same sampler"}"]`
      );
      Hiressampler_list_elem.dispatchEvent(mousevent);
    });
    }


    //v1.6.0新增
    const hr_checkpoint_element = document.querySelector(
        "#hr_checkpoint > label > div > div.wrap-inner > div > input"
    )
    //用户开启了hr_ckpt选项
    if(!!hr_checkpoint_element){
      hr_checkpoint_element.dispatchEvent(focus);
      queueMicrotask(() => {
      // 将函数加入到任务队列待下一次轮询延迟下拉框加载完毕后执行
      var Hirescheckpoint=result.Hirescheckpoint
          // ?result.Hirescheckpoint.replace(/ \[.*\]$/,""):""
        const Hirescheckpoint_list_elem = document.querySelector(
        `[data-value="${Hirescheckpoint || "Use same checkpoint"}"]`
      );
      try {
      Hirescheckpoint_list_elem.dispatchEvent(mousevent);
    } catch (error) {
      console.error(`出错了，可能没有指定的ckpt:${Hirescheckpoint}`);
    }
    });
    }

    if (!!result.Hiresupscaler) {
        shadowRoot.querySelectorAll("#txt2img_hires_steps input")[0].value =
        Number(result.Hiressteps) || 0;
      shadowRoot
        .querySelectorAll("#txt2img_hires_steps input")[0]
        .dispatchEvent(inputEvent);

      shadowRoot.querySelectorAll("#txt2img_hires_steps input")[1].value =
        Number(result.Hiressteps) || 0;
      shadowRoot
        .querySelectorAll("#txt2img_hires_steps input")[1]
        .dispatchEvent(inputEvent);

      shadowRoot.querySelectorAll("#txt2img_denoising_strength input")[0].value =
        Number(result.Denoisingstrength) || 0;
      shadowRoot
        .querySelectorAll("#txt2img_denoising_strength input")[0]
        .dispatchEvent(inputEvent);

      shadowRoot.querySelectorAll("#txt2img_denoising_strength input")[1].value =
        Number(result.Denoisingstrength) || 0;
      shadowRoot
        .querySelectorAll("#txt2img_denoising_strength input")[1]
        .dispatchEvent(inputEvent);

      shadowRoot.querySelectorAll("#txt2img_hr_scale input")[0].value =
        Number(result.Hiresupscale) || 1;
      shadowRoot
        .querySelectorAll("#txt2img_hr_scale input")[0]
        .dispatchEvent(inputEvent);

      shadowRoot.querySelectorAll("#txt2img_hr_scale input")[1].value =
        Number(result.Hiresupscale) || 1;
      shadowRoot
        .querySelectorAll("#txt2img_hr_scale input")[1]
        .dispatchEvent(inputEvent);
      //用户是否开启了高清prompt
      if(!!shadowRoot.querySelector("#hires_prompt > label > textarea")){
        shadowRoot.querySelector("#hires_prompt > label > textarea").value =
          result.HiresPrompt;
      shadowRoot
        .querySelector("#hires_prompt > label > textarea")
        .dispatchEvent(inputEvent);
      }
      if(!!shadowRoot.querySelector("#hires_neg_prompt > label > textarea")){
        shadowRoot.querySelector("#hires_neg_prompt > label > textarea").value =
          result.HiresNegativePrompt;
      shadowRoot
        .querySelector("#hires_neg_prompt > label > textarea")
        .dispatchEvent(inputEvent);
      }
    }
  };


  //图生图
  let img2ImgFormFill = () => {
    let result = this.result;
    const inputEvent = new Event("input");
    const changeEvent = new Event("change", {
      bubbles: true,
    });
      this.shadowRoot.querySelector("#tabs .tab-nav").children[1].click();
      this.shadowRoot.querySelectorAll('#mode_img2img button')[0].click()
    if(!!result.Clipskip){
      this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[0].value = Number(result.Clipskip)
      this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[0].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[1].value = Number(result.Clipskip)
      this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[1].dispatchEvent(inputEvent);
    }


      this.shadowRoot.querySelector('#img2img_prompt textarea').value = result.prompt
      this.shadowRoot.querySelector('#img2img_prompt textarea').dispatchEvent(inputEvent);

      this.shadowRoot.querySelector('#img2img_neg_prompt textarea').value = result.negativePrompt
      this.shadowRoot.querySelector('#img2img_neg_prompt textarea').dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_steps input')[0].value = Number(result.Steps)
      this.shadowRoot.querySelectorAll('#img2img_steps input')[0].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_steps input')[1].value = Number(result.Steps)
      this.shadowRoot.querySelectorAll('#img2img_steps input')[1].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll(`[value="${result.Sampler}"]`)[1].checked = true;
      this.shadowRoot.querySelectorAll(`[value="${result.Sampler}"]`)[1].dispatchEvent(changeEvent)

      this.shadowRoot.querySelectorAll('#img2img_width input')[0].value = Number(result.Size.split('x')[0])
      this.shadowRoot.querySelectorAll('#img2img_width input')[0].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_width input')[1].value = Number(result.Size.split('x')[0])
      this.shadowRoot.querySelectorAll('#img2img_width input')[1].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_height input')[0].value = Number(result.Size.split('x')[1])
      this.shadowRoot.querySelectorAll('#img2img_height input')[0].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_height input')[1].value = Number(result.Size.split('x')[1])
      this.shadowRoot.querySelectorAll('#img2img_height input')[1].dispatchEvent(inputEvent);

      this.shadowRoot.querySelector('#img2img_seed input').value = Number(result.Seed)
      this.shadowRoot.querySelector('#img2img_seed input').dispatchEvent(inputEvent);
      //图生图调用pnginfo的png
    const file = new File([this.png_info_blob], 'example.png');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const fileList = dataTransfer.files;
    this.shadowRoot.querySelector("#img2img_image input").files = fileList;
    this.shadowRoot.querySelector('#img2img_image input').dispatchEvent(changeEvent);
  };

  //局部重绘
  let inpaintTabFormFill=async ()=> {
    let result = this.result;
    const inputEvent = new Event("input");
    const changeEvent = new Event("change", {
      bubbles: true,
    });
    //局部重绘监听手机自适应
    let screenWidth = window.screen.width;
    //当屏幕为手机或者平板才会执行
    // if(screenWidth<=768){
    let inpaintButton=await delay_tab_click()
    inpaintButton.onclick=async ()=>{
      let temp=await delay_canvas()
      temp.classList.remove('wrap', 'svelte-yigbas');
        temp.querySelectorAll('canvas').forEach(e => e.style.height = '');
        temp.querySelectorAll('canvas').forEach(e => {e.style.width = '100%';console.log(e.style.width)});
    }
  // }
      this.shadowRoot.querySelector("#tabs .tab-nav").children[1].click();
      this.shadowRoot.querySelectorAll('#mode_img2img button')[2].click()
      if(!!result.Clipskip) {
        this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[0].value = Number(result.Clipskip)
        this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[0].dispatchEvent(inputEvent);

        this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[1].value = Number(result.Clipskip)
        this.shadowRoot.querySelectorAll('#setting_CLIP_stop_at_last_layers input')[1].dispatchEvent(inputEvent);
      }
      this.shadowRoot.querySelector('#img2img_prompt textarea').value = result.prompt
      this.shadowRoot.querySelector('#img2img_prompt textarea').dispatchEvent(inputEvent);

      this.shadowRoot.querySelector('#img2img_neg_prompt textarea').value = result.negativePrompt
      this.shadowRoot.querySelector('#img2img_neg_prompt textarea').dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_steps input')[0].value = Number(result.Steps)
      this.shadowRoot.querySelectorAll('#img2img_steps input')[0].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_steps input')[1].value = Number(result.Steps)
      this.shadowRoot.querySelectorAll('#img2img_steps input')[1].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll(`[value="${result.Sampler}"]`)[1].checked = true;
      this.shadowRoot.querySelectorAll(`[value="${result.Sampler}"]`)[1].dispatchEvent(changeEvent)

      this.shadowRoot.querySelectorAll('#img2img_width input')[0].value = Number(result.Size.split('x')[0])
      this.shadowRoot.querySelectorAll('#img2img_width input')[0].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_width input')[1].value = Number(result.Size.split('x')[0])
      this.shadowRoot.querySelectorAll('#img2img_width input')[1].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_height input')[0].value = Number(result.Size.split('x')[1])
      this.shadowRoot.querySelectorAll('#img2img_height input')[0].dispatchEvent(inputEvent);

      this.shadowRoot.querySelectorAll('#img2img_height input')[1].value = Number(result.Size.split('x')[1])
      this.shadowRoot.querySelectorAll('#img2img_height input')[1].dispatchEvent(inputEvent);

      this.shadowRoot.querySelector('#img2img_seed input').value = Number(result.Seed)
      this.shadowRoot.querySelector('#img2img_seed input').dispatchEvent(inputEvent);
      //图生图调用pnginfo的png
    const file = new File([this.png_info_blob], 'example.png');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const fileList = dataTransfer.files;
    this.shadowRoot.querySelector("#img2maskimg input").files = fileList;
    this.shadowRoot.querySelector('#img2maskimg input').dispatchEvent(changeEvent);
  };


  // let TaggerFormFill=()=>{
  //   let result = this.result;
  //   const inputEvent = new Event("input");
  //   const changeEvent = new Event("change", {
  //     bubbles: true,
  //   });
  //   let taggerNode=null
  //     let menu=[...document.querySelector("#tabs .tab-nav").children]
  //     menu.forEach(e=>{try{if(e.innerText=="Tag反推(Tagger)")taggerNode=e;throw error()}catch(err){}})
  //     console.log(taggerNode)
  //     taggerNode.click()
  //
  //   //   //图生图调用pnginfo的png
  //   const file = new File([this.png_info_blob], 'example.png');
  //   const dataTransfer = new DataTransfer();
  //   dataTransfer.items.add(file);
  //   const fileList = dataTransfer.files;
  //   console.log([this.shadowRoot.querySelector(" div.image-container > div > input")])
  //   this.shadowRoot.querySelector(" div.image-container > div > input").files = fileList;
  //   this.shadowRoot.querySelector(" div.image-container > div > input").dispatchEvent(changeEvent);
  // }

  //PNGinfo事件
  async function png_info_edit() {
    let png_info = await delayPng_info();
    this.version_more_16 =(Number(this.shadowRoot.querySelector("#footer > div.versions > a").innerText.replace(/\D/g, '')) >= 160)
    this.result = JSON.parse(localStorage.getItem("tempPngInfo")) || {};
    if (this.result.fillType === "txt2img") {
      txt2ImgFormFill();
    }
    if (this.result.fillType === "img2img") {
      img2ImgFormFill();
    }
    if (this.result.fillType === "inpaint_tab") {
      inpaintTabFormFill();
    }
        const changeEvent = new Event("change", {
    });

    //注册图片解析事件
    png_info.addEventListener("change", async (e) => {
      // 获取用户选择的文件
        const png_info_img = await delay_png_change(png_info);
    try{imgStorage(png_info_img)}
    catch(e){console.log('图太大。将不会被保存到本地，')}
    finally{
        let png_info_blob = await convertDomImageToBlob(png_info_img);
        this.png_info_blob = png_info_blob;
        let res = await readNovelAITag(png_info_blob);
        if(!res.length){
          this.shadowRoot.querySelector("#tab_pnginfo > div > div > div:nth-child(2) > div:nth-child(3)").innerText ="这不是一张stablediffusion图片"
          // this.shadowRoot.querySelector("#tagger图生文_tab").style.color='red'
          //tag反推（tagger）
        // this.shadowRoot.querySelector("#tagger图生文_tab").onclick =
        // () => {
        //   this.result.fillType = "inpaint_tab";
        //   localStorage.setItem("tempPngInfo", JSON.stringify(this.result));
        //   TaggerFormFill();
        // };
        }
        else{
          // this.shadowRoot.querySelector("#tagger图生文_tab").style.color=''
          this.shadowRoot.querySelector("#tab_pnginfo > div > div > div:nth-child(2) > div:nth-child(3)").innerText = res[0].text
      }
        //js对象形式转化
        const result = {};
        // const match = inputString.match(/(?<=prompt:)(.*)(?=Negative prompt:)/s)[0].trim();]
        let tempRes=res[0].text
        result.prompt = res[0].text.match(/(.+)(?=(\nNegative prompt))/s)?
            res[0].text.match(/(.+)(?=(\nNegative prompt))/s)[0].trim():res[0].text.match(/(.+)(?=(\nSteps))/s)[0].trim()
        result.negativePrompt = res[0].text.match(/(?<=Negative prompt:)(.*)(?=\nSteps:)/s)?
             res[0].text.match(/(?<=Negative prompt:)(.*)(?=\nSteps:)/s)[0]:""
      //否定预查来确认第一个或者最后一个来确保不重复
        let HiresPrompt = res[0].text.match(/(?<=Hires prompt: )(.*?)(?=(?!Hires negative prompt) Hires upscale|Hires negative prompt)/s)?
             res[0].text.match(/(?<=Hires prompt: )(.*?)(?=(?!Hires negative prompt), Hires upscale|, Hires negative prompt)/s)[0]:""
      // console.log(HiresPrompt)
        result.HiresPrompt=HiresPrompt.includes(",")?HiresPrompt.replace(/^"|"$/g, "").replace(/\\\\/g,"\\"):HiresPrompt

        let HiresNegativePrompt =res[0].text.match(/(?<=Hires negative prompt:)(.*)(?=Hires upscale)/s)?
             res[0].text.match(/(?<=Hires negative prompt: )(.*)(?=, Hires upscale[^r])/s)[0].trim():""
        result.HiresNegativePrompt=HiresNegativePrompt.includes(",")?HiresNegativePrompt.replace(/^"|"$/g, "").replace(/\\\\/g,"\\"):HiresNegativePrompt
      // console.log(result.prompt)
        tempRes=tempRes.replace(`${result.prompt}`,"").replace(`\nNegative prompt: ${result.negativePrompt}`,"")
            .replace(` Hires prompt: ${HiresPrompt},`,"").replace(` Hires negative prompt: ${HiresNegativePrompt}, `,"")
      // console.log(tempRes)
        let resArr = tempRes.trim().split(",");
        // console.log(resArr)
        resArr.forEach((e) => {
          try{result[e.split(":")[0].replace(/\s+/g, "")] = e.split(":")[1].
          replace(/<comma>/g, ",").replace(/<maohao>/g, ":").trim();}
          catch(err){
            console.log(err+"e")
          }
        });
        // console.log(result)
        this.result = result;

        //txt2img
        this.shadowRoot.querySelector("#txt2img_tab").onclick = () => {
          this.result.fillType = "txt2img";
          localStorage.setItem("tempPngInfo", JSON.stringify(this.result));
          txt2ImgFormFill();
        };
        //img2img
        this.shadowRoot.querySelector("#tab_pnginfo #img2img_tab").onclick =
          () => {
            this.result.fillType = "img2img";
            localStorage.setItem("tempPngInfo", JSON.stringify(this.result));
            img2ImgFormFill();
          };
        //inpaint_tab
        this.shadowRoot.querySelector("#tab_pnginfo #inpaint_tab").onclick =
          () => {
            this.result.fillType = "inpaint_tab";
            localStorage.setItem("tempPngInfo", JSON.stringify(this.result));
            inpaintTabFormFill();
          };
        }
    });
    //拖拽
    png_info.querySelector("#pnginfo_image > div.image-container > div ").addEventListener("drop",()=>{
      if(document.querySelector("#pnginfo_image > div.image-container > div > div > button:nth-child(2)"))
      png_info.querySelector("#pnginfo_image > div.image-container > div > div > button:nth-child(2)").click()
      png_info.dispatchEvent(changeEvent)
    })
  }

  document.addEventListener("DOMContentLoaded", async () => {
    //初始化图生图图片
    if(localStorage.getItem("png_info_img"))
    this.png_info_blob = await readStoragePng(
      localStorage.getItem("png_info_img")
    );
    //初始化png_info事件
    png_info_edit();
    //test
  });
})()
