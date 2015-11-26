/* Here all the common interactions will be defined, which are useful while developing HTMLs */

/* Requirement - explanation */
// Please check this link for explanation: https://github.com/kamlekar/HTML-Skinning-Boilerplate/issues/12

// Global Variable
var ignorableElements = [];
// Registering clicks on clickable 
var htmlClickElements = document.getElementsByClassName('html-click');
[].forEach.call(htmlClickElements, function(el){
	el.addEventListener('mousedown', htmlClick, true);
	el.addEventListener('mouseup', resetIgnoringElements, true);
});

// Defining outside click actions
document.addEventListener('mousedown', function(e){
	// First check whether the user clicked on the clickable element(s) or target element(s).
	// If user hasn't clicked on the clickable element or target element then reset the performed actions on the clickable element(s) and target element(s) with outside clicking is as active.
	// (For this, we need to add another common attribute to clicked element and target element)
	resetStyles();
});

// Defining outside click actions
document.addEventListener('mouseup', function(e){
	
});

function performActions(clickedElement, doOpposite){
	var metaInfo = clickedElement.dataset;
	var referenceOfTargetElement = metaInfo['htmlTarget'];
	// Go to target element(s) from the provided info in clicked element.
	// if target element(s) is not mentioned, assume the target element is the clicked element itself.
	var targetElements = referenceOfTargetElement ? document.querySelectorAll(referenceOfTargetElement) : [clickedElement]; 
	// Perform the toggle/add/remove of the class on the target element(s) as mentioned in the clicked element info.
	[].forEach.call(targetElements, markAsActive);
	markAsActive(clickedElement);

	var targetElementClass = metaInfo['htmlClass'];
	var toggleType = metaInfo['htmlToggle'] || 'toggle';
	var outsideClick = metaInfo['htmlOutsideClick'] || 'true';
	if(doOpposite){
		if(outsideClick === 'true'){
			var newToggleType = (toggleType === 'toggle' || toggleType === 'add')?'remove':'add';
			htmlActions(targetElements, newToggleType, targetElementClass, true);
		}
		else{
			// do nothing
		}
	}
	else{
		htmlActions(targetElements, toggleType, targetElementClass);

		// add elements to ignore when document is clicked
		ignorableElements = Array.prototype.slice.call(targetElements);
		ignorableElements.push.apply(ignorableElements, Array.prototype.slice.call([clickedElement]));
	}
}

function markAsActive(el){
	el.setAttribute('data-html-click-active', '');
	el.addEventListener('mousedown', gatherIgnoringElements);
	el.addEventListener('mouseup', resetIgnoringElements);
}

function unmarkAsActive(el){
	el.removeAttribute('data-html-click-active');
	el.removeEventListener('mousedown', gatherIgnoringElements);
	el.removeEventListener('mouseup', resetIgnoringElements);
}

function resetIgnoringElements(){
	ignorableElements = [];
}

function gatherIgnoringElements(){
	ignorableElements = document.querySelectorAll('[data-html-click-active]');
}

function resetStyles(){
	var resettableElements = Array.prototype.slice.call(htmlClickElements).filter(function(el){
		for(var j = 0;j < ignorableElements.length; j++){
			if(el === ignorableElements[j]){
				return false;
			}
		}
		return true;
	})
	for(var i = 0; i < resettableElements.length; i++){
		performActions(resettableElements[i], true);
	}
}
function htmlClick(e){
	var clickedElement = e.currentTarget;
	performActions(clickedElement);
}

function htmlActions(targetElements, toggleType, targetElementClass, removeActiveHtml){
	for(var i = 0; i < targetElements.length; i++){
		var targetElement = targetElements[i];
		if(removeActiveHtml){
			unmarkAsActive(targetElement);
		}
		if(targetElementClass){
			targetElement.classList[toggleType](targetElementClass);
		}
		else{
			// Throw error saying - Please provide class name to add to the target element.
		}
	}
}