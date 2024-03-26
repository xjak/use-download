const $ = (name) => {
  const el = document.querySelector(name);
  if (el) {
    el.__proto__.$remove = () => el.parentNode.removeChild(el);
  } else {
    throw Error("$ " + name + " is not");
  }

  return el;
};

function saveImage(el, name) {
  const image = document.querySelector(el)
  const filename = document.querySelector(name).innerText

  const download = (width, height) => {
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

  const img = document.createElement('img')
  img.onload = function() {
    download(img.width, img.height)
  }
  img.src = image.src
}

window.onload = () => {
  // 删除遮罩层
  $('.soutu-btn').$remove()


  const b = document.createElement('button')
  b.innerText = '保存图片'
  b.style.position = 'fixed'
  b.style.right = '30px'
  b.style.bottom = '100px'
  b.style.zIndex = 9999
  b.addEventListener('click', function() {
    const use_name = localStorage.getItem('use_name')
    const use_src = localStorage.getItem('use_src')
    console.log(use_name, use_src)

    if (!use_name || !use_src) return
    saveImage(use_src, use_name)
  })
  $("body").appendChild(b)


  chrome.runtime.onMessage.addListener(function(request, secder, sendResponse) {
    console.log(99, request, secder, sendResponse)

    if (request.name && request.src) {
      localStorage.setItem('use_name', request.name)
      localStorage.setItem('use_src', request.src)
      sendResponse({ message: '操作成功' })
    }
  })
}

console.log("script body=>", chrome, localStorage);