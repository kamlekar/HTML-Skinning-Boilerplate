// Main js file
// Hint: Include any js framework in js folder

// lazy load images script start
echo.init({
	offset: 100,
	throttle: 250,
	unload: true,
	callback: function (element, op) {
		if (op === 'load') {
			element.classList.add('loaded');
		} else {
			element.classList.remove('loaded');
		}
	}
});
echo.render(onscroll);
// lazy load images script end
