$('.contact-form').on('submit', function(e) {
    e.preventDefault();
    var $form = $('.contact-form');
    
    var invalid = validateForm($form, {
        validations: {
            name: ['empty'],
            email: ['empty', 'invalidEmail'],
            message: ['empty']
        }
    });
    
    if (!invalid) {
        grecaptcha.ready(function() {
            grecaptcha.execute(window['reCAPTCHA_site_key'], {action: 'homepage'}).then(function(token) {
                var data = $form.serializeArray();
                data.push({name: 'g-recaptcha-response', value: token});
                doAjaxCall($form, data);
            })
        });
        
        
        function doAjaxCall($form, data){
            var form = $form[0];
            $.ajax({
                type: 'POST',
                url: $form.attr('action'), // use the form's action attribute as the endpoint
                data: data, // use the data from the form
                headers: {
                    Accept: 'application/json' // this makes the server send you a JSON response
                },
                success: function(
                    response // handle the successful submission of your POST
                ) {
                    console.log(response); // response contains the form submission that was just made
                    // alert("Thank you for your submission, we'll get back to you soon :)");
                    form.reset(); // reset the form

                    showSuccessMessage();
                },
                error: function(response) {
                    showErrorMessage();
                },
                complete: function(response) {
                    form.reset();

                    setTimeout(function() {
                        removeErrorMessages();
                    }, 3000);
                }
            });


            function showSuccessMessage(){

            }

            function showErrorMessage(){

            }

            function removeErrorMessages(){

            }
        }
    }
});
