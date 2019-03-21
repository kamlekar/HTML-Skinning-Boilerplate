// Main js file
// Hint: Include any js framework in js folder

// lazyload images script start
const ll = new LazyLoad({
	elements_selector: ".lazy",
	load_delay: 100,
	threshold: 0,
});

document.addEventListener("DOMContentLoaded", function () {
	var lazyloadImages = document.querySelectorAll("img.lazy");
	var lazyloadThrottleTimeout;

	function lazyload() {
		if (lazyloadThrottleTimeout) {
			clearTimeout(lazyloadThrottleTimeout);
		}

		lazyloadThrottleTimeout = setTimeout(function () {
			var scrollTop = window.pageYOffset;
			lazyloadImages.forEach(function (img) {
				if (img.offsetTop < (window.innerHeight + scrollTop)) {
					img.src = img.dataset.src;
					img.classList.remove('lazy');
				}
			});
			if (lazyloadImages.length == 0) {
				document.removeEventListener("scroll", lazyload);
				window.removeEventListener("resize", lazyload);
				window.removeEventListener("orientationChange", lazyload);
			}
		}, 0);
	}

	document.addEventListener("scroll", lazyload);
	window.addEventListener("resize", lazyload);
	window.addEventListener("orientationChange", lazyload);
});
// lazyload images script end