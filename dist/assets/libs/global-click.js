/* Here all the common interactions will be defined, which are useful while developing HTMLs */

/* Requirement - explanation */
// Please check this link for explanation: https://github.com/kamlekar/HTML-Skinning-Boilerplate/issues/12
var htmljs = (function(){ 
	// Global Variable
	var ignorableElements = [];
	var htmlClickElements = function(){
		return document.getElementsByClassName('html-click');
	}
	var init = function(){
		// Registering clicks on clickable 
		[].forEach.call(htmlClickElements(), function(el){
			el.addEventListener('click', htmlClick, true);
		});

		// Defining outside click actions
		document.addEventListener('click', function(e){
			// First check whether the user clicked on the clickable element(s) or target element(s).
			// If user hasn't clicked on the clickable element or target element then reset the performed actions on the clickable element(s) and target element(s) with outside clicking is as active.
			// (For this, we need to add another common attribute to clicked element and target element)
			var resettableElements = [].slice.call(htmlClickElements()).filter(function(el){
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

			// reset
			resetIgnoringElements();
		});
	}

	function performActions(clickedElement, doOpposite){
		var metaInfo = clickedElement.dataset;
		var referenceOfTargetElement = metaInfo['htmlTarget'];
		// Adding unique value as custom attribute to fetch the target element relative to the clicked element
		clickedElement.setAttribute('data-html-dummy-selector', '1');
		if(referenceOfTargetElement){
			// Replace "this " string with custom attribute with value
			referenceOfTargetElement = referenceOfTargetElement.replace("this ", '[data-html-dummy-selector="1"] ');
			// Go to target element(s) from the provided info in clicked element.
			// if target element(s) is not mentioned, assume the target element is the clicked element itself.
			var targetElements = document.querySelectorAll(referenceOfTargetElement);
		}
		else{
			var targetElements = [clickedElement];
		} 
		// After getting the relative element, the added custom attribute is useless
		// So, remove it
		clickedElement.removeAttribute('data-html-dummy-selector');
		// Perform the toggle/add/remove of the class on the target element(s) as mentioned in the clicked element info.

		var targetElementClass = metaInfo['htmlClass'] || 'active';
		var toggleType = metaInfo['htmlToggle'] || 'toggle';
		var outsideClick = metaInfo['htmlOutsideClick'] || 'true';
		if(doOpposite){
			//
			unmarkAsActive(clickedElement);
			//
			if(outsideClick === 'true'){
				var newToggleType = (toggleType === 'toggle' || toggleType === 'add')?'remove':'add';
				htmlActions(targetElements, newToggleType, targetElementClass, true);
			}
			else{
				// do nothing
			}
		}
		else{
			//
			[].forEach.call(targetElements, markAsActive);
			markAsActive(clickedElement);

			htmlActions(targetElements, toggleType, targetElementClass);

			// add elements to ignore when document is clicked
			ignorableElements = [].slice.call(targetElements);
			ignorableElements.push.apply(ignorableElements, [].slice.call([clickedElement]));
		}
	}

	function markAsActive(el){
		el.setAttribute('data-html-click-active', '');
		el.addEventListener('click', gatherIgnoringElements);
	}

	function unmarkAsActive(el){
		el.removeAttribute('data-html-click-active');
		el.removeEventListener('click', gatherIgnoringElements);
	}

	function resetIgnoringElements(){
		ignorableElements = [];
	}

	function gatherIgnoringElements(){
		ignorableElements = document.querySelectorAll('[data-html-click-active]');
	}

	function htmlClick(e){
		// resetting previously active elements
		var previousIgnorableElements = document.querySelectorAll('[data-html-click-active]');
		[].forEach.call(previousIgnorableElements, unmarkAsActive);
		
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
	return {
		init: init,
		click: htmlClick
	}
})();

htmljs.init();