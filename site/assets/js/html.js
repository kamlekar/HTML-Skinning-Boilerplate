/* Here all the common interactions will be defined, which are useful while developing HTMLs */

/* Requirement - explanation */
// class =>
// "html-click": When this class is applied to an element, the click behaviours mentioned in this library will be triggered based on the provided additional attributes which are mentioned below.
// Attributes =>
// data-html-class: This attribute holds the value of the class name which need to be added to the target element.
// data-html-target: This attribute holds the value to call the target element. The value can be ID or class name or tag name. (as I am using querySelector).
// data-html-toggle: This attribute holds the value of the toggle state, whether to add the class or remove the class or toggle the class (on clicked again). Possible values are "add", "remove" and "toggle". Default value is "toggle".
// data-html-outside-click: This attribute holds the boolean value which states whether to reset the added/removed class on click of the outside of the "html-click" element and referenced target element.

/* Theory */
// Whenever a element with "html-click" class is clicked, the value of attribute data-html-class is added a class name to the element whose class name or ID is mentioned as value in the attribute data-html-target, of the clicked element.
// The click should work for dynamic elements also.
// The click should work as toggle functionality or only add or only remove, as the attribute is provided.

// First would be to add a class to a element when another/same element is clicked
var htmlClickElements = document.getElementsByClassName('html-click');
[].forEach.call(htmlClickElements, function(el){
	el.addEventListener('click', htmlClick, true);
});
function htmlActions(els, classAction){
	for(var i = 0; i < els.length; i++){
		var el = els[i];
		var htmlTarget = el.dataset['htmlTarget'];
		var targetClass = el.dataset['htmlClass'];
		var	targetElement = htmlTarget ? document.querySelectorAll(htmlTarget) : el;


		if(targetClass){
			// check if targetElement is an array
			if(typeof targetElement === "object" && targetElement.length){
				[].forEach.call(targetElement, function(el){
					el.classList[classAction](targetClass);
				});
			}
			// check if targetElement is a valid element
			else if(targetElement){ 
				targetElement.classList[classAction](targetClass);
			}
			else{
				// Throw error saying - target element is not found in the Document.
			}
		}
		else{
			// Throw error saying - Please provide class name to add to the target element.
		}
	}
}
function htmlClick(e){
	var el = e.currentTarget;
	// Setting default value to true for resetting the added/removed class 
	// on outside click of the element
	var outsideClick = el.dataset['htmlOutsideClick'] || true;
	var htmlTarget = el.dataset['htmlTarget'];
	var targetElement = htmlTarget ? document.querySelectorAll(htmlTarget) : [el]; 
	if(false){
		// stopPropagation explanation: 
		// I added a function "resetClick", which removes the dynamically added class 
		// when user clicks anywhere on the document but not on the element with "html-click" class
		// To make sure the document click is triggered only on non-html-click elements, I am 
		// adding this e.stopPropagation()
		e.stopPropagation();
	}
	else{
		// Don't reset the added/removed class from the target element
	}
	// reset the added or removed class from the other "html-click" elements
	var newHtmlClickElements = document.getElementsByClassName('html-click');
	[].forEach.call(newHtmlClickElements, function(el){
		var t = el.dataset['htmlTarget'];
		var tEl = t ? document.querySelectorAll(t) : [el];
		var toggle = el.dataset['htmlToggle'] || 'toggle';
		// Don't reset the added/removed class if html-toggle is not "toggle"
		if(toggle === "add"){
			htmlActions(tEl, "remove");
		}
		else if(toggle === "remove"){
			htmlActions(tEl, "add");
		}
		else{
			// if toggle
			htmlActions(tEl, "toggle");
		}
	});
	// Default value is "toggle"
	var toggleValue = el.dataset['htmlToggle'] || 'toggle';
	// Valid toggle attribute values
	if(/add|remove|toggle/i.test(toggleValue)){
		htmlActions(el, toggleValue);
	}
	// Invalid toggle attribute values
	else{
		// Throw error - please provide valid toggle attribute value
	}
}
function resetClick(el){
	htmlActions(el, 'remove');
}
// resetting the added class when clicked outside of that element
document.addEventListener('click', function(e){
	var targetEl = e.target;
	[].forEach.call(htmlClickElements, resetClick);
});
