function setWorkshopCustomLayout(e) {
    var $bottomContainer = $('.cont-sec'),
        $sectionLeft = $('section.loc-sec-lft'),
        $header = $('.loc-srch').find('.find-sec-blur-bg'),
        $sectionRight = $('#workshopInfoView.loc-sec-rgt'),
        $workshopView = $sectionLeft.find('#workshopView'),
        $workshopTitle = $sectionLeft.find('#locationTitleDiv');

    if ($bottomContainer.length) {
        var scrollTop = $(this).scrollTop();
        var bottomOffsetTop = $bottomContainer.offset().top + $bottomContainer.height();

        // Set car workshop height
        $workshopView.css({
            height: window.innerHeight - $header.outerHeight() - $workshopTitle.outerHeight()
        });

        $workshopView.parents('.slimScrollDiv').css({
            height:
                window.innerHeight -
                $header.outerHeight() -
                $workshopTitle.outerHeight() -
                $('.all-wrkshp-lnk.usr-all-wrkshp-link').outerHeight()
        });

        if (scrollTop > bottomOffsetTop - window.innerHeight) {
            $header.addClass('pFixed');
            $sectionLeft.css({
                position: 'absolute',
                top: '',
                // scroll in negative
                // window.innerHeight - (bottom offset top - scrollTop)
                bottom: window.innerHeight - bottomOffsetTop
            });
        } else if (scrollTop > $('section.loc-srch').offset().top) {
            $header.addClass('pFixed');
            $sectionLeft.css({
                position: 'fixed',
                top: '115px',
                bottom: ''
            });

            $sectionRight.css({
                float: 'right'
            });
        } else {
            $header.removeClass('pFixed');

            $sectionLeft.css({
                position: '',
                height: '',
                top: ''
            });

            $sectionRight.css({
                float: ''
            });
        }
    }
}
