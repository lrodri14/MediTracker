/* This password-reset-confirm.js file contains all the variable declarations, event listeners needed to display and work
   the password reset confirm template.

/*////////////////////////////////////////////////////// Variables ///////////////////////////////////////////////////*/

let newPassword1 = document.querySelector('#id_new_password1')
let newPassword2 = document.querySelector('#id_new_password2')
let reset = document.querySelector('.password-reset-confirm-form__submit-button')
let body = document.querySelector('body')

/*////////////////////////////////////////////////////// Event Listeners /////////////////////////////////////////////*/

// Body Event Listeners
// Body Input Events
body.addEventListener('input', (e) => {
    /* This event will be fired every time the target is newPassword1 or newPassword2, this event will check if the
       two fields are not empty, if the condition is fulfilled, the reset button will have the button-fadeIn class added,
       if not it won't be added or it will be removed.*/
    if (e.target === newPassword1 || e.target === newPassword2){
        if (newPassword1.value.length > 0 && newPassword2.value.length > 0){
            reset.classList.add('submit-button--fade-in')
        }else{
            reset.classList.remove('submit-button--fade-in')
        }
    }
})

// Body Mouseover Events
body.addEventListener('mouseover', (e) => {
    // This event will be fired every time the target is the reset button and it will have the button-hover class added.
    if (e.target === reset){
        reset.classList.add('submit-button--hover')
    }
})

// Body Mouseout Events
body.addEventListener('mouseout', (e) => {
    // This event will be fired every time the target is the reset button and it will have the button-hover class removed.
    if (e.target === reset){
        reset.classList.remove('submit-button--hover')
    }
})