/* Here all the common interactions will be defined, which are useful while developing HTMLs */

// First would be to add a class to a element when another/same element is clicked
var htmlClickElements = document.getElementsByClassName('html-click');
[].forEach.call(htmlClickElements, function(el){
	el.addEventListener('click', htmlClick, true);
});
function htmlClick(e){
	var el = e.currentTarget;
	var htmlTarget = el.dataset['html-target'];
	var targetClass = el.dataset['html-class'];
	var	targetElement = htmlTarget ? document.getElementById(htmlTarget) : el;
	if(targetClass){
		targetElement.classList.toggle(targetClass);
	}
}

// resetting the added class when clicked outside of that element
document.addEventListener('click', function(e){
	var targetEl = e.target;
	[].forEach.call(htmlClickElements, function(el){
		var htmlTarget = el.dataset['html-target'];
		var targetClass = el.dataset['html-class'];
		var	targetElement = htmlTarget ? document.getElementById(htmlTarget) : el;
	});
});
