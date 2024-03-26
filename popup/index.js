console.log('html => ', this)

const $ = (name) => {
  const el = document.querySelector(name);
  if (el) {
    el.__proto__.$remove = () => el.parentNode.removeChild(el);
  } else {
    throw Error("$ " + name + " is not");
  }

  return el;
};


window.onload = () => {
	$('#save').addEventListener('click', e => {
		const name = $('#name').value
		const src = $('#src').value

		if (!name || !src) return alert('error')

		localStorage.setItem('name', name)
		localStorage.setItem('src', src)

		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { name, src }, function(res) {
				console.log(1, res)
				if(res.message) window.close()
			})
		})


	})
	

	$('#name').value = localStorage.getItem('name', name)
	$('#src').value = localStorage.getItem('src', src)
	
}