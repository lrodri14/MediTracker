/* This main.js file contains all the variable declarations, async functions and sync functions needed for the main.html
   template to perform correctly.*/


///////////////////////////////////////////////// Variables ////////////////////////////////////////////////////////////

var body = document.querySelector('body')
var container = document.querySelector('.container')
var quoteContainer = document.querySelector('.container__quote')
var loginBtn = document.querySelector('#login-btn')
var signUpBtn = document.querySelector('#signup-btn')
var modal = document.querySelector('.modal')
var modalContent = document.querySelector('.modal__content')
var accountType = document.querySelector('.account-type-selector')


///////////////////////////////////////////////// Functions ////////////////////////////////////////////////////////////


// Async Functions
async function loginFormAW(url){
    /* This loginFormAW function is used to display the login form dynamically, it takes a single argument: url which is
       used to make the request to the server, the response will be returned in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function passwordResetFormAW(url){
    /* This passwordResetFormAw function is used to display the password reset form dynamically,  it takes a single
       argument: url which is used to make the request to the server, the response will be returned in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function loginAW(formData, url, method, csrfmiddlewaretoken){
    /* This loginAW function is used to login the user and to display errors dynamically, this function expects 4 args
       formData, url, method, csrfmiddlewaretoken, these are the arguments we will use to make the POST request to the
       server, once we receive our response, we will return it in JSON Format.*/
    const result = await fetch(url, {method: method, headers: {'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function signUpFormAW(url){
    /* This loginFormAW function is used to display the login form dynamically, it takes a single argument: url which is
       used to make the request to the server, the response will be returned in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function signUpAW(formData, url, method, csrfmiddlewaretoken){
    /* This signUpAW function is used to signup the user and to display errors dynamically, this function expects 4 args
       formData, url, method, csrfmiddlewaretoken, these are the arguments we will use to make the POST request to the
       server, once we receive our response, we will return it in JSON Format.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

///////////////////////////////////////////////// Event Listeners //////////////////////////////////////////////////////

// Body Event Listeners
if (body){

    // Mouseover events
    body.addEventListener('mouseover', (e) => {

        /* This event will be fired every time the target contains the login or sign-up class in it's classList, it will
           add the hover-over class */
        if (e.target === loginBtn || e.target === signUpBtn){
            e.target.classList.add('container__auth-button--active')
        }

        /* This event will be fired every time the target contains the doctor-type or assistant-type class in it's
           classList, it will add the account-type-selector-hover class */
        if (e.target.classList.contains('account-type-selector__tile')){
            e.target.classList.add('account-type-selector__tile--active')
        }

    })

    // Mouseout Events
    body.addEventListener('mouseout', (e) => {

        /* This event will be fired every time the target contains the login or sign-up class in it's classList, it will
           remove the hover-over class */
        if (e.target === loginBtn || e.target === signUpBtn){
            e.target.classList.remove('container__auth-button--active')
        }

        /* This event will be fired every time the target contains the doctor-type or assistant-type class in it's
           classList, it will remove the account-type-selector-hover class */
        if (e.target.classList.contains('account-type-selector__tile')){
            e.target.classList.remove('account-type-selector__tile--active')
        }

    })

    // Click Events
    body.addEventListener('click', (e) => {

        /* This event will be fired every time the target is the container, this event will show up all the hidden elements */
        if (e.target === container){
            loginBtn.classList.remove('container__elements--fade-out')
            signUpBtn.classList.remove('container__elements--fade-out')
            quoteContainer.classList.remove('container__elements--fade-out')
            accountType.classList.remove('account-type-selector--display')
        }

        /* This event will be fired every time the target contains the login class in its classList, it will hide the
           sign-up button and collect the url from the data-url attribute and make a request through the loginFormAW func,
           the response will be added to the modalContent and finally the modal will be displayed */
        if (e.target === loginBtn){
            loginBtn.classList.add('container__elements--fade-out')
            signUpBtn.classList.add('container__elements--fade-out')
            quoteContainer.classList.add('container__elements--fade-out')
            accountType.classList.remove('account-type-selector--display')
            const url = e.target.getAttribute('data-url')
            loginFormAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
                username = document.querySelector('#id_username')
                password = document.querySelector('#id_password')
                submitBtn = document.querySelector('.login-form__submit-button')
            })
        }

        /* This event will be fired every time the target contains the sign-up class in its classList, it will hide the
           login button, finally the accountType modal will be displayed */
        if (e.target === signUpBtn){
            loginBtn.classList.add('container__elements--fade-out')
            signUpBtn.classList.add('container__elements--fade-out')
            quoteContainer.classList.add('container__elements--fade-out')
            accountType.classList.add('account-type-selector--display')
        }

      /* This event will be fired every time the target contains either the doctor-type or assistant-type class in its
         classList, we collect the type from the data-type attribute and the url from the data-url attribute, we build
         up our url and call the signUpFormAW function to make the request to the server, finally the response will be
         added to the modalContent.innerHTML and the modal will be displayed.*/
        if (e.target.classList.contains('account-type-selector__tile')){
            let type = e.target.getAttribute('data-type')
            let url = e.target.getAttribute('data-url') + '?account_type=' + type
            signUpFormAW(url)
            .then(data => {
                accountType.classList.remove('account-type-selector--display')
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
                signUpInputs = document.querySelectorAll('input,select')
                submitBtn = document.querySelector('.signup-form__submit-button')
            })
        }
    })

}

// Modal Event Listeners
if (modal){

    // MouseOver events
    modal.addEventListener('mouseover', (e) => {

        // This event will be fired when the target is submit, the button-hover class will be added.
        if (e.target === submitBtn){
            submitBtn.classList.add('button--active')
        }

        // This event will be fired when the target's nodeName is 'INPUT', the input-hover class will be added.
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-active')
        }

        // This event will be fired when the target's classList contains new-password-hover class, the new-password-hover class will be added.
        if (e.target.classList.contains('login-form__password-reset')){
            e.target.classList.add('login-form__password-reset--hover')
        }

        // This event will be fired when the target's classList contains continue class, the continue class will be added.
        if (e.target.classList.contains('password_reset_done__continue-button')){
            e.target.classList.add('password_reset_done__continue-button--hover')
        }
    })

    // MouseOut events
    modal.addEventListener('mouseout', (e) => {

        // This event will be fired when the target is submit, the button-hover class will be removed.
        if (e.target === submitBtn){
            submitBtn.classList.remove('button--active')
        }

        // This event will be fired when the target's nodeName is 'INPUT', the input-hover class will be removed.
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }


        // This event will be fired when the target's classList contains new-password-hover class, the new-password-hover class will be removed.
        if (e.target.classList.contains('login-form__password-reset')){
            e.target.classList.remove('login-form__password-reset--hover')
        }

        // This event will be fired when the target's classList contains continue class, the continue class will be removed.
        if (e.target.classList.contains('password_reset_done__continue-button')){
            e.target.classList.remove('password_reset_done__continue-button--hover')
        }
    })


    // Click Event
    modal.addEventListener('click', (e) =>{

        /* This event will be fired every time the target is the modal, this event will hide the modal, and display the
           buttons.*/
        if (e.target === modal){
            modal.classList.remove('modal--display')
            loginBtn.classList.remove('container__elements--fade-out')
            signUpBtn.classList.remove('container__elements--fade-out')
            quoteContainer.classList.remove('container__elements--fade-out')
            accountType.classList.remove('account-type-selector--display')
        }

        /* This event will be fired every time the target contains the password-reset class in it's classList, this event
           will display the reset password form, we will collect the url from the anchor href attribute to make the request,
           the response will be added to the modalContent.innerHTMl*/
        if (e.target.classList.contains('login-form__password-reset')){
            e.preventDefault()
            e.stopPropagation()
            passwordResetFormAW(e.target.href)
            .then(data => {
                modalContent.innerHTML = data['html']
            })
        }

        /* This event will be fired every time the target contains the continue class in it's classList, this event
           will display the login form, we will collect the url from the data-url attribute to make the request,
           the response will be added to the modalContent.innerHTMl, this procedure will only be performed once a pass-
           word reset form has taken place.*/
        if (e.target.classList.contains('password-reset-done__continue-button')){
            let url = e.target.getAttribute('data-url')
            loginFormAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
            })
        }

    })

    // Submit Events
    modal.addEventListener('submit', (e) => {

        e.preventDefault()
        e.stopPropagation()

        // This event will be fired every time the target is a form, and the form data will be collected.
        if (e.target.nodeName === 'FORM'){
            let form = e.target
            let formData = new FormData(form)
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('input[type=hidden]').value

            /* If the target contains the login-form classList, the loginAW function will be called, if the data is
               authentic then the user will be logged in, if not, an error will be displayed.*/
             if (e.target.classList.contains('login-form')){
                 loginAW(formData, url, method, csrfmiddlewaretoken)
                .then(data => {
                    if (data['html']){
                        modalContent.innerHTML = data['html']
                        username = document.querySelector('#id_username')
                        password = document.querySelector('#id_password')
                        submitBtn = document.querySelector('.login-form__submit-button')
                        passwordReset = document.querySelector('.login-form__password-reset')
                    }else{
                        window.location.href = '/home/'
                    }
                })
             }

            /* If the target contains the password-reset-form class in it's classList, the loginAW function will be called,
               and the response will be added to the modalContent.innerHTML*/
             if (e.target.classList.contains('password-reset-form')){
                loginAW(formData, url, method, csrfmiddlewaretoken)
                .then(data => {
                    if (data['html']){
                        modalContent.innerHTML = data['html']
                    }
                })
             }

            /* If the target's classList contains the signup-form class in its classList, the signUpAW function will be
               called and depending if we received errors or not, they will be displayed, else, the login form will
               be displayed.*/
            if (e.target.classList.contains('signup-form')){
                signUpAW(formData, url, method, csrfmiddlewaretoken)
                .then(data => {
                    if (data['error']){
                        modalContent.innerHTML = data['html']
                        signUpInputs = document.querySelectorAll('input,select')
                        submitBtn = document.querySelector('.signup-form__submit-button')
                    }else{
                        modal.classList.remove('modal--display')
                        loginBtn.click()
                    }
                })
            }
        }
    })

}