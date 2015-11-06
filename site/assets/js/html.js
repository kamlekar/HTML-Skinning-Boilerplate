/* Here all the common interactions will be defined, which are useful while developing HTMLs */

/* Requirement */
// Whenever a element with "html-click" class is clicked, the value of attribute data-html-class is added a class name to the element whose class name or ID is mentioned as value in the attribute data-html-target.
// The click should work for dynamic elements also.
// The click should work as toggle functionality.
// Possible values for data-html-target are
// - .class name - adds the data-html-class value to all classes with the class name provided.
// - #ID - adds the data-html-class to the id.
// - none - adds the data-html-class to the clicked element itself.


// First would be to add a class to a element when another/same element is clicked
var htmlClickElements = document.getElementsByClassName('html-click');
[].forEach.call(htmlClickElements, function(el){
	el.addEventListener('click', htmlClick, true);
});
function htmlActions(el, classAction){
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
function htmlClick(e){
	var el = e.currentTarget;
	// Setting default value to true for resetting the added/removed class 
	// on outside click of the element
	var outsideClick = el.dataset['htmlOutsideClick'] || true;
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
