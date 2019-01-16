function validateForm($form) {
    var check = {
        empty: function(value) {
            return !value;
        },

        invalidEmail: function(value) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !re.test(value);
        }
    };

    var validations = {
        name: ['empty'],
        email: ['empty', 'invalidEmail'],
        message: ['empty']
    };

    var form = $form[0];

    for (var key in validations) {
        var value = form[key].value;
        validations[key].some(function(x) {
            var bln = check[x](value);
            var $errorMessages = $(form[key])
                .parent()
                .find('.error-messages');

            $errorMessages.find('[x-type]').removeClass('show');
            if (bln) {
                isReadyToSubmit = false;

                $errorMessages.find('[x-type="' + x + '"]').addClass('show');
            }
            return bln;
        });
    }
}
