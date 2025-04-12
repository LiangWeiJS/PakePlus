// console.log(document.getElementsByTagName('a').length);
document.addEventListener('UniAppJSBridgeReady', function() {
	var as=document.getElementsByTagName('a')
	for (var i = 0; i < as.length; i++) { 
		as[i].addEventListener('click', function() {
			var that=this
		  uni.postMessage({
			data: {
			  href: that.href,
			  title:that.firstChild.textContent
			}
		  });
		});
	}
})
