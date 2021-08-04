/* This password-reset-confirm.js file contains all the variable declarations, event listeners needed to display and work
   the password reset confirm template.

/*////////////////////////////////////////////////////// Variables ///////////////////////////////////////////////////*/

let newPassword1 = document.querySelector('#id_new_password1')
let newPassword2 = document.querySelector('#id_new_password2')
let reset = document.querySelector('.password-reset-confirm-form__submit-button')
let body = document.querySelector('body')

/*////////////////////////////////////////////////////// Event Listeners /////////////////////////////////////////////*/

// Body Event Listeners

// Body Mouseover Events
body.addEventListener('mouseover', (e) => {
    // This event will be fired every time the target is the reset button and it will have the button-hover class added.
    if (e.target === reset){
        reset.classList.add('submit-button--active')
    }
})

// Body Mouseout Events
body.addEventListener('mouseout', (e) => {
    // This event will be fired every time the target is the reset button and it will have the button-hover class removed.
    if (e.target === reset){
        reset.classList.remove('submit-button--active')
    }
})