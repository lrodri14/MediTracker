/* This settings.js files contains all the variable declarations, async and sync functions, and event listeners, needed
   to make the settings template work properly, this file is composed of 7 async functions, and one synchronous function.
   The file is also divided into three sections: Variable Declarations, Functions, Event Listeners.*/

/*###################################################### Variables ###################################################*/

var body = document.querySelector('body')
var tabs = document.querySelectorAll('.settings-navigator__tab')
var container = document.querySelector('.data')
var modal = document.querySelector('.modal')
var modalContent = document.querySelector('.modal__content')

/*###################################################### Functions ###################################################*/

// Async Functions
async function displaySettingsAW(url){
    /* This displaySettingsAW async function is used to display the settings of the users choice, this async func will
       retrieve the content of that particular settings and display it inside the wrapper container, this async func
       accepts one single parameter: 'url' which we retrieve from the tab 'data-url' attribute, to make the 'GET'
       request. The response will be converted into JSON and returned for further processing.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function requestGeneralSettingsAW(url){
    /* This requestGeneralSettings async function is used to display the general settings, this async func will
       retrieve the content of that particular settings and display it inside the wrapper container, this async func
       accepts one single parameter: 'url' which we retrieve from the tab 'data-url' attribute, to make the 'GET'
       request. The response will be converted into JSON and returned for further processing.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function changeWallpaperAW(url, method, csrfmiddlewaretoken, formData){
    /* This changeWallpaperAW function is used update the users wallpaper of choice, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    const result = await fetch(url, {method : method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

async function changeAvailability(url, method, csrfmiddlewaretoken, formData){
    /* This changeWallpaperAW function is used update the users availability, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    let result = await fetch(url, {method: method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    let data = result.json()
    return data
}

async function toggleSFX(url, method, csrfmiddlewaretoken, formData){
    /* This toggleSFX function is used update the users sfx settings, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    let result = await fetch(url, {method: method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    let data = result.json()
    return data
}

async function toggleNotifications(url, method, csrfmiddlewaretoken, formData){
    /* This toggleNotifications function is used update the users notification settings, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    let result = await fetch(url, {method: method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    let data = result.json()
    return data
}

async function showForm(url){
    /* This showForm async function is used to display the form for a particular use such as adding, deleting or updating
       any instances of any object, this form will be displayed in the modal container, this function accepts one single
       parameter: 'url' to make the 'GET' request, this response will be return as JSON for further response.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function addUpdateElementAW(url, method, csrfmiddlewaretoken, formData){
    /* This addUpdateElementAW function is used to add or to update any objects, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken':csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

async function deleteElementAW(url, method, csrfmiddlewaretoken){
    /* The deleteItemAW async function is used to delete items belonging to the current user, this function will display
       corresponding form for the operation, it will be displayed in the modal container, this function accepts,3 parameters:
       'url' we collect from the form.action attribute, the 'method' we collect from the form.method attribute and finally
       the 'csrfmiddlewaretoken' from the form's hidden input, the response will be returned in JSON Format for further
       processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken':csrfmiddlewaretoken}, body:{'choice':'yes'}})
    const data = await result.json()
    return data
}

async function viewElementAW(url){
    /* This viewElementAW function is used to display the details of any object, this content will be displayed inside the
       modal container, the function accepts one single parameter: 'url' to make the 'GET' request, the response will
       be returned in JSON format, for further processing.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function filterResultsAW(url){
    /* The filterResultsAW async function is used to filter items belonging to the current user, this function is called
       whenever an input event is fired in the filter inputs every table contains, this function accepts,4 parameters:
       'url' we collect from the form.action attribute, the 'method' we collect from the form.method attribute,
       the 'csrfmiddlewaretoken' from the form's hidden input, and finally the 'formData' we collect form the forms inputs
       the response will be returned in JSON Format for further processing.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function manageSubscriptionSettingsAW(url){
    /* This updateSettingsAW function is used update the users settings upon a change event, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function changeSubscriptionType(url, method, csrfmiddlewaretoken, action){
    /* This updateSettingsAW function is used update the users settings upon a change event, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken':csrfmiddlewaretoken}, body:action})
    const data = result.json()
    return data
}

async function updatePasswordAW(url, method, csrfmiddlewaretoken, formData){
    /* This updatePasswordAW function is used update the users password, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken':csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function updateSessionExpiryTime(url, method, csrfmiddlewaretoken, formData){
    /* This updateSessionExpiry function is used update the users session expire time, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function updateSettingsAW(url, method, csrfmiddlewaretoken, formData){
    /* This updateSettingsAW function is used update the users settings upon a change event, this function will display the corresponding
       form for the specific operation, this form will be displayed in the modal container, the function accepts, 4
       parameters: 'url' we collect from the form.action attribute, 'method' we grab from the form.method attribute,
       'csrfmiddlewaretoken' that we collect form the form's hidden input, and finally the 'formData' we collect from
       the form's inputs, the response will be returned in JSON format for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function unblockUser(url){
    /* This unblockUser function is used to unblock a specific user selected, the function accepts one single parameter:
    'url' to make the 'GET' request, the response will be returned in JSON format, for further processing.*/
    const result = await fetch(url)
    const data =  result.json()
    return data
}

/*###################################################### Events Listeners ############################################*/

// Body Event Listeners

body.addEventListener('click', (e) => {

    /* This event listeners will be fired every time a click occurs over an element with 'tab' class in its classList,
       this event will be stopped, we need to perform some extra functionality, first we need to set the 'active' class
       for the target clicked, to provide an active effect, afterwards we remove the previous content inside our wrapper,
       to fill it with the new one. To collect the new data from the server we need to do a 'GET' request, and the url
       for this request we grab it from the data-url attribute from the target, when we finally get our response, we will
       fill the wrapper with the new content and re-define the backedUpContent variable for filtering purposes.*/
    if (e.target.classList.contains('settings-navigator__tab')){
        e.preventDefault()
        e.stopPropagation()
        tabs.forEach(tab => tab.classList.remove('settings-navigator__tab--active'))
        e.target.classList.add('settings-navigator__tab--active')
        let url = e.target.getAttribute('data-url')
        displaySettingsAW(url)
        .then(data => {
            container.innerHTML = data['html']
        })
    }

})

body.addEventListener('mouseover', (e) => {

    /* This event will be fired every time the target contains the 'tab' class in its classlist, it will add the tab-hover class*/
    if (e.target.closest('.settings-navigator__tab')){
        e.target.closest('.settings-navigator__tab').classList.add('settings-navigator__tab--hover')
    }

})

body.addEventListener('mouseout', (e) => {

    /* This event will be fired every time the target contains the 'tab' class in its classlist, it will remove the tab-hover class*/
    if (e.target.closest('.settings-navigator__tab')){
        e.target.closest('.settings-navigator__tab').classList.remove('settings-navigator__tab--hover')
    }

})

// Wrapper Event Listeners

if (container){

    /* This assignment is done for filtering purposes, every time the form input is blank, this content will be added.*/
    var backedUpContent = container.innerHTML

    container.addEventListener('mouseover', (e) => {


        /* This event will be fired every time a hover occurs in an element with the 'TD' nodeName of the childs are the
           'fa-trash' or 'fa-edit' icons, this event will change some styles in the table rows.*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /* This event will be fired every time a hover occurs in a tab inside the general or profile settings.*/
        if (e.target.classList.contains('general-settings__tab') || e.target.classList.contains('profile-settings__tab')){
            e.target.classList.add('tab--hover')
        }

        /* This event will be fired every time the target contains the 'fa-filter' class in its classList, it will add
           the 'fa-filter-hover' class to the target.*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.add('filter-container__filter-display-button--active')
        }

        /* This event will be fired every time the target contains the 'fa-plus' class in its classList, it will add
           the 'fa-plus-hover' to the target.*/
        if (e.target.classList.contains('data-table__create') || e.target.classList.contains('add-data')){
            e.target.classList.add('data-table__create--active')
        }

        /* This event will be fired every time the target contains the 'fa-edit' class in its classList, it will add
           the 'fa-edit-hover' to the target.*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.add('data-table__update--active')
        }

        /* This event will be fired every time the target contains the 'fa-trash' class in its classList, it will add
           the 'fa-trash-hover' to the target.*/
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.add('data-table__delete--active')
        }

        /* This event will be fired every time the target contains the 'fa-unlink' class in its classList, it will add
           the 'fa-unlink-hover' to the target.*/
        if (e.target.classList.contains('data-table__unlink')){
            e.target.classList.add('data-table__unlink--active')
        }

        /* This event will be fired every time the target contains the 'data-table__unblock' class in its classList, it will add
           the 'data-table__unblock--active' to the target.*/
        if (e.target.classList.contains('data-table__unblock')){
            e.target.classList.add('data-table__unblock--active')
        }

        /* This event will be fired every time the target contains the link class or the targets parent, this will add the
           link-hover class.*/
        if (e.target.closest('.links-container__link')){
           let linkItem = e.target.closest('.links-container__link')
           linkItem.classList.add('links-container__link--active')
        }

        if (e.target.nodeName === 'INPUT'){
        /* This event will be fired every time the target's nodeName is INPUT it will add
           the 'input-hover' class to the target.*/
            e.target.classList.add('input-active')
        }

        /* This event will be fired every time the target's nodeName is BUTTON it will add
           the 'button-hover' class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /* This event will be fired every time the target's classlist contains the downgrade class it will add
           the 'downgrade--active' class to the target.*/
        if (e.target.classList.contains('downgrade-button')){
            e.target.classList.add('downgrade-button--active')
        }

        /* This event will be fired every time the target's classlist contains the upgrade class it will add
           the 'upgrade--active' class to the target.*/
        if (e.target.classList.contains('upgrade-button')){
            e.target.classList.add('upgrade-button--active')
        }

        /* This event will be fired every time the target contains the 'wallpaper' class in its classList, it will add
           the 'wallpaper-trash-hover' to the target.*/
        if (e.target.classList.contains('wallpaper-row__wallpaper')){
            e.target.classList.add('wallpaper-row__wallpaper--active')
        }

    })

    container.addEventListener('mouseout', (e) => {

    /* This event will be fired every time a hover occurs in an element with the 'TD' nodeName of the childs are the
       'fa-trash' or 'fa-edit' icons, this event will remove some styles in the table rows.*/
      if (e.target.closest('.data-table__item')){
        let row = e.target.closest('.data-table__item')
        row.style.backgroundColor = ''
        row.style.color = ''
      }

        /* This event will be fired every time a hover occurs in a tab inside the general or profile settings.*/
        if (e.target.classList.contains('general-settings__tab') || e.target.classList.contains('profile-settings__tab')){
            e.target.classList.remove('tab--hover')
        }

        /* This event will be fired every time the target contains the 'fa-filter' class in its classList, it will remove
           the 'fa-filter-hover' class to the target.*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.remove('filter-container__filter-display-button--active')
        }

        /* This event will be fired every time the target contains the 'fa-plus' class in its classList, it will remove
           the 'fa-plus-hover' to the target.*/
        if (e.target.classList.contains('data-table__create') || e.target.classList.contains('add-data')){
            e.target.classList.remove('data-table__create--active')
        }

        /* This event will be fired every time the target contains the 'fa-edit' class in its classList, it will remove
           the 'fa-edit-hover' to the target.*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.remove('data-table__update--active')
        }

        /* This event will be fired every time the target contains the 'fa-trash' class in its classList, it will remove
           the 'fa-trash-hover' to the target.*/
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.remove('data-table__delete--active')
        }

        /* This event will be fired every time the target contains the 'fa-unlink' class in its classList, it will remove
           the 'fa-unlink-hover' to the target.*/
        if (e.target.classList.contains('data-table__unlink')){
            e.target.classList.remove('data-table__unlink--active')
        }

        /* This event will be fired every time the target contains the 'data-table__unblock' class in its classList, it will remove
           the 'data-table__unblock--active' from the target.*/
        if (e.target.classList.contains('data-table__unblock')){
            e.target.classList.remove('data-table__unblock--active')
        }

        /* This event will be fired every time the target contains the link class or the targets parent, this will remove the
           link-hover class.*/
        if (e.target.closest('.links-container__link')){
           let linkItem = e.target.closest('.links-container__link')
           linkItem.classList.remove('links-container__link--active')
        }


        /* This event will be fired every time the target's nodeName is INPUT it will remove
           the 'input-hover' class to the target.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }

        /* This event will be fired every time the target's nodeName is BUTTON it will remove
           the 'button-hover' class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /* This event will be fired every time the target's classlist contains the downgrade class it will remove
           the 'downgrade--active' class to the target.*/
        if (e.target.classList.contains('downgrade-button')){
            e.target.classList.remove('downgrade-button--active')
        }

        /* This event will be fired every time the target's classlist contains the upgrade class it will remove
           the 'upgrade--active' class to the target.*/
        if (e.target.classList.contains('upgrade-button')){
            e.target.classList.remove('upgrade-button--active')
        }

        /* This event will be fired every time the target contains the 'wallpaper' class in its classList, it will remove
           the 'wallpaper-trash-hover' to the target.*/
        if (e.target.classList.contains('wallpaper-row__wallpaper')){
            e.target.classList.remove('wallpaper-row__wallpaper--active')
        }

    })

    container.addEventListener('click', (e) => {

        if (e.target.classList.contains('general-settings__tab')){
            let tab = e.target
            let tabs = document.querySelectorAll('.general-settings__tab')
            let url = tab.getAttribute('data-url')
            for (let i = 0; i<tabs.length; i++){
                tabs[i].classList.remove('tab--active')
            }
            tab.classList.add('tab--active')
            requestGeneralSettingsAW(url)
            .then(data => {
                document.querySelector('.general-settings__content').innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('profile-settings__tab')){
            let tab = e.target
            let tabs = document.querySelectorAll('.profile-settings__tab')
            let url = tab.getAttribute('data-url')
            for (let i = 0; i<tabs.length; i++){
                tabs[i].classList.remove('tab--active')
            }
            tab.classList.add('tab--active')
            requestGeneralSettingsAW(url)
            .then(data => {
                document.querySelector('.profile-settings__content').innerHTML = data['html']
            })
        }

        if (e.target.closest('.data-table__item')){
        /* This event will be fired every time the target it's a table data cell, this event will open the modal and
           display the details of the clicked object. For this we need to make a 'GET' request to the server to retrieve
           the information, once it is collected, it is presented in the modal.*/
            const url = e.target.closest('.data-table__item').getAttribute('data-url')
            viewElementAW(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('filter-container__filter-display-button')){
            /* This event will be fired every time the target contains the 'fa-filter' class in its classList, this will
            either hide or display the form based on the current status.*/
            const form = document.querySelector('.filter-container__filter-form')
            form.classList.contains('filter-container__filter-form--display') ? form.classList.remove('filter-container__filter-form--display') : form.classList.add('filter-container__filter-form--display')
        }

        if (e.target.classList.contains('data-table__create')){
            /* This event will be fired every time the target contains the 'fa-plus' class in it's classList, this event
               will display the addition form for the current type of object displayed. The form presented depends on the
               'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
               is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('add-data')){
            /* This event will be fired every time the target contains the 'add-data' class in it's classList, this event
               will display the addition form for the current type of object displayed. The form presented depends on the
               'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
               is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('data-table__update')){
        /* This event will be fired every time the target contains the 'fa-edit' class in it's classList, this event
           will display the edit form for the current type of object displayed. The form presented depends on the
           'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
           is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('data-table__delete')){
        /* This event will be fired every time the target contains the 'fa-trash' class in it's classList, this event
           will display the deletion form for the current type of object displayed. The form presented depends on the
           'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
           is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('data-table__unlink')){
        /* This event will be fired every time the target contains the 'fa-unlink' class in it's classList, this event
           will display the deletion form for the current type of object displayed. The form presented depends on the
           'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
           is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('data-table__unblock')){
        /* This event will be fired every time the target contains the 'data-table__unblock' class in it's classList, this event
           will unblock the user selected and will return the list with the new data.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            unblockUser(url)
            .then(data => {
                let container = document.querySelector('.profile-settings__content')
                container.innerHTML = data['html']
            })
        }

        if (e.target.nodeName === 'BUTTON' && e.target.type !== 'submit'){
            /* This event will be fired every time the target is a button, this event will present any form
            if needed in the modal, the form that will be presented in the modal based on the
            'data-url' attribute in the target.*/
            let url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        if (e.target.classList.contains('upgrade-button') || e.target.classList.contains('downgrade-button')){
            let url = e.target.getAttribute('data-url')
            manageSubscriptionSettingsAW(url)
            .then((data) => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        if (e.target.classList.contains('wallpaper-row__wallpaper')){
            /* This event will be fired every time the target contains a wallpaper class, and will change the wallpaper
             based on the users choice.*/
            document.querySelector('#id_wallpaper').value = e.target.getAttribute('data-value')
            let form = document.querySelector('#user-settings-form')
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            changeWallpaperAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['response'] === 'success'){
                    document.querySelector('#background').src = e.target.src
                }
            })
        }

    })

    container.addEventListener('input', (e) => {
        /* This event will be fired every time a form input is being changed, this event will make an AJAX request to the
           server, for filtering purposes, we need ro collect some before making the request, data such as the 'url' for
           the request, 'method' we collect from the form.method attribute and finally the query, we grab from the target
           value. The response will be rendered in the tbody.*/
        if (e.target.nodeName === 'INPUT' && e.target.closest('.filter-container__filter-form')){
            let form = e.target.parentNode.parentNode
            let url = form.action + '?query=' + e.target.value
            filterResultsAW(url)
            .then(data => {
                document.querySelector('tbody').innerHTML = data['html']
            })
        }})


    container.addEventListener('change', (e) => {

        if (e.target.id === 'id_availability'){
            /* This event will be fired every time the target contains an id_availability id, this will change the users status. */
            let form = document.querySelector('form')
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            changeAvailability(url, method, csrfmiddlewaretoken, formData)
        }

        if (e.target.id === 'id_sfx'){
            /* This event will be fired every time the target contains an id_sfx id, this will change the users status. */
            let form = document.querySelector('form')
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            toggleSFX(url, method, csrfmiddlewaretoken, formData)
        }

        if (e.target.id === 'id_notifications'){
            /* This event will be fired every time the target contains an id_notifications id, this will change the users status. */
            let form = document.querySelector('form')
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            toggleNotifications(url, method, csrfmiddlewaretoken, formData)
        }

        if (e.target.id === 'id_session_expire_time' || e.target.id === 'id_tzone'){
            /* This event will be fired every time the target contains an id_session_expire_time or id_tzone id,
            this will change the users session expire time or tzone. */
            let form = document.querySelector('form')
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            updateSessionExpiryTime(url, method, csrfmiddlewaretoken, formData)
        }

    })

    container.addEventListener('submit', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.target.nodeName === 'FORM'){
            const url = e.target.action
            const method = e.target.method
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            const formData = new FormData(e.target)
            updateSettingsAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                container.innerHTML = data['html']
            })
        }
    })
}


// Modal Event Listeners

if (modal){

    // Modal Click Events

    modal.addEventListener('click', (e) => {

        // This event will be fired every time the target is the modal, the 'show-modal' class will be removed from the modal.
        if (e.target === modal){
            modal.classList.remove('modal--display')
        }

        // This event will be fired every time the target is the a button with the value of 'no', the 'show-modal' class will be removed from the modal.
        if (e.target.value === 'no' || e.target.textContent === "Ok"){
            e.preventDefault()
            e.stopPropagation()
            modal.classList.remove('modal--display')
        }

    })

    // Modal Mouseover Events

    modal.addEventListener('mouseover', (e) => {

        /* This event will be fired every time the target's nodeName is 'BUTTON', the 'button-hover' class will be added to the target*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /* This event will be fired every time the target's nodeName is 'INPUT', the 'input-hover' class will be added to the target*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-active')
        }

    })

    // Modal Mouseout Events

    modal.addEventListener('mouseout', (e) => {

        /* This event will be fired every time the target's nodeName is 'BUTTON', the 'button-hover' class will be removed to the target*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /* This event will be fired every time the target's nodeName is 'INPUT', the 'input-hover' class will be removed to the target*/
         if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }

    })

    // Modal Submit Events

    modal.addEventListener('submit', (e) => {

        /* Whenever this event will be fired, this data will be collected, the form itself which is the target, the 'url'
           for the 'POST' request we collect from the form.action attribute, the 'method' we collect from the form.method
           attribute, the 'csrfmiddlewaretoken' we collect from the form's hidden input, and finally the formData we collect
           from the form's inputs.*/
        e.preventDefault()
        e.stopPropagation()
        const form = e.target
        const url = form.action
        const method = form.method
        const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
        const data = new FormData(form)

         // All these events will be fired if the target's nodeName is a FORM

         if (e.target.nodeName === 'FORM'){

            /* This event will be fired every time the form contains the 'upgrade-form' class in it's classList, it makes sure to
               upgrade the user's account from basic to premium */
            if (e.target.classList.contains('upgrade-form')){
                   const action = new FormData
                   action.append('action', 'upgrade')
                   changeSubscriptionType(url, method, csrfmiddlewaretoken, action)
                   .then((data) => {
                        modalContent.innerHTML = data['response']
                        container.innerHTML = data['html']
                        setTimeout(() => {
                            modal.classList.remove('modal--display')
                        }, 15000)
                   })
            }

            /* This event will be fired every time the form contains the 'upgrade-form' class in it's classList, it makes sure to
               downgrade the user's account from basic to premium */
            if (e.target.classList.contains('downgrade-form')){
                   const action = new FormData
                   action.append('action', 'downgrade')
                   changeSubscriptionType(url, method, csrfmiddlewaretoken, action)
                   .then((data) => {
                        modalContent.innerHTML = data['response']
                        container.innerHTML = data['html']
                        setTimeout(() => {
                            modal.classList.remove('modal--display')
                        }, 15000)
                   })
            }

            /* This event will be fired every time the form contains the 'creation-update-form' class in it's classList, this
               form will collect make use of the information collected above to make the request, after we receive a response,
               we check if the response contains an error, if it does, the error is rendered in the form, if not, the wrapper
               html is updated and the backedUpContent variable reassigned and the modal is closed.*/
            if (e.target.classList.contains('creation-update-form')){
                addUpdateElementAW(url, method, csrfmiddlewaretoken, data)
                .then(data => {
                    if ('html' in data){
                        modalContent.innerHTML = data['html']
                    }else{
                        container.innerHTML = data['updated_html']
                        modal.classList.remove('modal--display')
                    }
                })
            }

            if (e.target.classList.contains('deletion-form')){
            /* This event will be fired every time the form contains the 'delete' class in it's classList, this
               form will collect make use of the information collected above to make the request, after we receive a response,
               the wrapper's html is updated and the backedUpContent variable reassigned and the modal is closed.*/
                deleteElementAW(url, method, csrfmiddlewaretoken)
                .then(data => {
                    if (data['updated_html']){
                        container.innerHTML = data['updated_html']
                        modal.classList.remove('modal--display')
                    }else{
                        modalContent.innerHTML = data["error"]
                    }
                })
            }

            if (e.target.classList.contains('password-form')){
            /* This event will be fired every time the form contains the 'password-form' class in it's classList, this
               form will collect make use of the information collected above to make the request, after we receive a response,
               we check if the response contains an error, if it does, the error is rendered in the form, the modal is closed.*/
                updatePasswordAW(url, method, csrfmiddlewaretoken, data)
                .then(data => {
                    if (data['html']){
                        modalContent.innerHTML = data['html']
                    }else{
                        modal.classList.remove('modal--display')
                    }
                })
            }


         }
    })
}