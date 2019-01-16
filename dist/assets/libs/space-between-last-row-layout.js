// This file is used to manage the responsive layout

(function responsiveCards() {
    function fixCardsLayout() {
        var $cardParent = $('.ly-cards-parent');

        // remove already added dummy accounts
        $cardParent.find('.ly-card.dummy-card').remove();

        var $cards = $cardParent.find('.ly-card');

        var cardsCount = getNumberOfCards($cards);
        var cardsInRow = getNumberOfCardsInRow($cards);
        var numberOfMissingCardsInLastRow = getNumberOfMissingCardsInLastRow(
            cardsCount,
            cardsInRow
        );

        addDummyCardsToFixLayout($cardParent, numberOfMissingCardsInLastRow);
    }

    function getNumberOfCards($cards) {
        // @TODO: check whether each card is hidden or not
        return $cards.length;
    }

    function getNumberOfMissingCardsInLastRow(cardsCount, cardsInRow) {
        var missingCardsCount = cardsInRow - (cardsCount % cardsInRow);
        if (missingCardsCount === cardsCount) {
            return 0;
        }
        return missingCardsCount;
    }

    function getNumberOfCardsInRow($cards) {
        var obj = { x: [] }; // to cover the case when there are no cards
        var offset = 'x'; // the default dummy property key
        $cards.each(function() {
            var $self = $(this);
            offset = $self.offset().top;
            if (!obj[offset]) {
                obj[offset] = [];
            }

            obj[offset].push($self);
        });

        var values = [];
        for (var key in obj) {
            values.push(obj[key].length);
        }

        return Math.max.apply(null, values);
    }

    function addDummyCardsToFixLayout($cardParent, count) {
        var additionalClasses = $cardParent.attr('ly-card-class') || '';
        for (var i = 0; i < count; i++) {
            $cardParent.append(
                $('<div>', {
                    class: 'ly-card dummy-card ' + additionalClasses
                })
            );
        }
    }

    $(window).on('load', fixCardsLayout);
    $(window).on('resize', fixCardsLayout);
})();
