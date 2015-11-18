/* Here all the common interactions will be defined, which are useful while developing HTMLs */

/* Requirement - explanation */
// Please check this link for explanation: https://github.com/kamlekar/HTML-Skinning-Boilerplate/issues/12

// First would be to add a class to a element when another/same element is clicked
var htmlClickElements = document.getElementsByClassName('html-click');
[].forEach.call(htmlClickElements, function(el){
	el.addEventListener('click', htmlClick, true);
});

// Defining outside click actions
document.addEventListener('click', function(e){
	// First check whether the user clicked on the clickable element(s) or target element(s).
	// If user hasn't clicked on the clickable element or target element then reset the performed actions on the clickable element(s) and target element(s) with outside clicking is as active.
	// (For this, we need to add another common attribute to clicked element and target element)
});

function htmlClick(e){
	var clickedElement = e.currentTarget;
	var metaInfo = clickedElement.dataset;
	var referenceOfTargetElement = metaInfo['htmlTarget'];
	// Go to target element(s) from the provided info in clicked element.
	// if target element(s) is not mentioned, assume the target element is the clicked element itself.
	var targetElements = referenceOfTargetElement ? document.querySelectorAll(referenceOfTargetElement) : [clickedElement]; 
	// Perform the toggle/add/remove of the class on the target element(s) as mentioned in the clicked element info.
	var targetElementClass = metaInfo['htmlClass'];
	var toggleType = metaInfo['htmlToggle'] || 'toggle';
	htmlActions(targetElements, toggleType, targetElementClass);
	// Reset the performed actions on the other clickable element(s) with outside clicking is as active.
	var ignorableElements = targetElements;
	ignorableElements.push(clickedElement);
	resetActions(ignorableElements);
}

function htmlActions(targetElements, toggleType, targetElementClass){
	for(var i = 0; i < targetElements.length; i++){
		var targetElement = targetElements[i];
		if(targetElementClass){
			targetElement.classList[toggleType](targetElementClass);
		}
		else{
			// Throw error saying - Please provide class name to add to the target element.
		}
	}
}

function resetActions(ignorableElements){
	var allHtmlClickAndTargetElements = document.querySelectorAll('[data-html-outside-click = true]');
}