function stickItems($parent, itemClass, selectClass) {
    // Attach dummy element items which acts as the selected item when selected item is out of fold when scrolled
    // This dummy element will be on top of the scrolling contaner
    $parent.prepend('<div class="' + itemClass + ' sticky top"></div>');
    // This dummy element will be on bottom of the scrolling container
    $parent.append('<div class="' + itemClass + ' sticky bottom"></div>');

    var $items = $('.' + itemClass),
        $stickyTop = $('.' + itemClass + '.sticky.top'),
        $stickyBottom = $('.' + itemClass + '.sticky.bottom');

    // Click event registering each item in the list to show the selected item
    $items.click(function(e) {
        if (!$(e.target).hasClass('sticky')) {
            $items.removeClass(selectClass);
            $stickyTop.css('display', 'none');
            $stickyBottom.css('display', 'none');
            $(this).addClass(selectClass);
        }
    });

    // Scroll event
    // This scroll event is detect whether the selected item is in fold or out of fold
    $parent.scroll(function() {
        var $self = $(this);
        // selected item
        var $selected = $('.' + itemClass + '.' + selectClass);
        // offset top of selected item
        var cTop = $selected.offset().top;
        // offset top of scrolling container
        var pTop = $self.offset().top;
        // Height of selected item
        var cHeight = $selected.height();
        // Height of the scrolling container
        var pHeight = $self.height();
        // if offset top of selected item is less than or equal to offset top of the scrolling container
        // it means the selected item is on top of the visible fold
        if (cTop - pTop <= 0) {
            // When the selected item is on top of the visible fold
            // show the dummy element
            $stickyTop.html($selected.html()).css({
                display: 'block',
                // move the dummy element to scroll top value to show it on top
                top: $(this).scrollTop()
            });
            // Make sure that bottom dummy element is in hidden state
            $stickyBottom.css('display', 'none');
        } else if (cTop > pTop && cTop < pTop + pHeight) {
            // the selected element is in visible fold, so no need to do anything

            // Make sure the dummy elements are in hidden state
            $stickyTop.css('display', 'none');
            $stickyBottom.css('display', 'none');
        } else {
            // the selected item is on bottom of the visible fold

            // Make sure the top dummy element is in hidden state
            $stickyTop.css('display', 'none');

            // Show the bottom dummy element
            $stickyBottom.html($selected.html()).css({
                display: 'block',
                // Move the dummy element to show it on bottom of the scrolling container
                bottom: -$(this).scrollTop()
            });
        }
    });
}

// Call the function
// first argument : jquery element object
// second argument: common class to the items inside the container
// third argument: class to apply styles to the selected item
stickItems($('.parent'), 'item', 'select');
