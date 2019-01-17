function validateForm($form, configs) {
    var validations = configs.validations;
    var check = {
        empty: function(value) {
            return !value;
        },

        invalidEmail: function(value) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return !re.test(value);
        }
    };

    return Object.keys(validations).some(key => {
        var $fieldElement = $form.find(`[${validationKey}name="${key}"]`);
        // Fetching of value can change based on the type of field
        // Currently, assuming / limiting the field to input and textarea only.
        var value = $fieldElement.val();
        return validations[key].some(function(x) {
            var bln = check[x](value);
            var $errorMessages = $fieldElement
                // Assuming the parent holds the field and its related error messages
                .parent()
                .find('.error-messages');

            $errorMessages.find(`[${validationKey}type]`).removeClass('show');
            if (bln) {
                $errorMessages.find(`[${validationKey}type="${x}"]`).addClass('show');
            }
            return bln;
        });
    })
}
