const $ = (name) => {
  const el = document.querySelector(name);
  if (el) {
    el.__proto__.$remove = () => el.parentNode.removeChild(el);
  } else {
    throw Error("$ " + name + " is not");
  }

  return el;
};

const $s = (name) => {
  const el = document.querySelectorAll(name);
  if (!el) {
    throw Error("$ " + name + " is not");
  }
  return el;
};

const saveImage = (src, filename) => {

  const download = (image, width, height) => {
    var canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    var ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)
    
    var dataURL = canvas.toDataURL('image/png')
    var a = document.createElement('a')
    a.href = dataURL
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.onload = function() {
    download(img, img.width, img.height)
  }
  img.src = src
}

const h = (name, style, ob) => {
  const el = document.createElement(name)
  for (let i in ob) {
    el[i] = ob[i]
  }
  for (let i in style) {
    el.style[i] = style[i]
  }
  return el
}

// 主图下载
const bigImgBtn = () => {

  const btn = h('button', {
    right: '30px',
    bottom: '100px',
    position: 'fixed',
    zIndex: 9999
  }, {
    innerText: '下载'
  })

  btn.addEventListener('click', function() {
    const use_name = localStorage.getItem('use_name')
    const use_src = localStorage.getItem('use_src')
    console.log(use_name, use_src)

    if (!use_name || !use_src) return
    saveImage(use_src, use_name)
  })
  $("body").appendChild(btn)
}

// 侧边
const rightBtn = () => {
  const els = $s(config.rightImgSrc)

  for (let i = 0; i < els.length; i++) {

    const img = els[i].querySelector('img')

    if (img) {
      const btn = h('button', {
        left: '0px',
        bottom: '0px',
        position: 'absolute',
        zIndex: 9999
      }, {
        innerText: '下载'
      })

      const use_name = els[i].querySelector('.c-color-gray').innerText
      btn.addEventListener('click', () => {
        saveImage(img.src, use_name)
      })

      els[i].style.position = 'relative'
      els[i].appendChild(btn)

      const targetImg = h('img', {
        position: 'fixed',
        zIndex: 9999,
        left: 0,
        top: 0,
        width: '400px'
      }, {
        src: img.src
      })
      
      img.parentElement.addEventListener('mouseenter', (e) => {
        document.body.appendChild(targetImg)
      })

      img.parentElement.addEventListener('mouseleave', (e) => {
        document.body.removeChild(targetImg)
      })
    }

  }
}

window.onload = () => {
  // 删除遮罩层
  $('.soutu-btn').$remove()

  // 详情
  bigImgBtn()

  // 侧边
  rightBtn()


  chrome.runtime.onMessage.addListener(function(request, secder, sendResponse) {
    if (request.name && request.src) {
      localStorage.setItem('use_name', request.name)
      localStorage.setItem('use_src', request.src)
      sendResponse({ message: '操作成功' })
    }
  })
}

console.log("script body=>", chrome, localStorage);

console.log("config =>", config);