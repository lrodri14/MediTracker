/* This settings.js files contains all the variable declarations, async and sync functions, and event listeners, needed
   to make the settings template work properly, this file is composed of 7 async functions, and one synchronous function.
   The file is also divided into three sections: Variable Declarations, Functions, Event Listeners.*/

/*###################################################### Variables ###################################################*/

var body = document.querySelector('body')
var tabs = document.querySelectorAll('.tab')
var wrapper = document.querySelector('.wrapper')
var modal = document.querySelector('.modal')
var modalContent = document.querySelector('.modal-content')

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
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function changeWallpaperAW(url, method, csrfmiddlewaretoken, formData){
    const result = await fetch(url, {method : method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

async function changeAvailability(url, method, csrfmiddlewaretoken, formData){
    let result = await fetch(url, {method: method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    let data = result.json()
    return data
}

async function requestPageAW(url){
    /* This async function will be used to collect the data from the previous or next page, this content will be
    received as a promise, so we need to return it in JSON format so we can process it, this content will be set to
    the wrapper dynamically.*/
    const result = await fetch(url)
    const data = result.json()
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

async function updateSettingsAW(url, method, csrfmiddlewaretoken, formData){
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body: formData})
    const data = result.json()
    return data
}

// Functions

// Sync Functions

function addIconLevitate(addItemIcon){
    /*This function is used to perform the levitation effect in the
      .fa-plus icon every time there is no data available, it takes
      one parameter, 'addItemIcon' is the icon itself. it will
      execute a setInterval function every 0.5 seconds, which just
      changes the style of the 'top' attribute in our element.*/
      if (addItemIcon !== null && addItemIcon !== undefined){
            setInterval(function(){
                if (addItemIcon.style.top == '90%'){
                    addItemIcon.style.top = '88%'
                } else {
                    addItemIcon.style.top = '90%'
                }
            },500)
      }
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
    if (e.target.classList.contains('tab')){
        e.preventDefault()
        e.stopPropagation()
        tabs.forEach(tab => tab.classList.remove('tab-active'))
        e.target.classList.add('tab-active')
        let url = e.target.getAttribute('data-url')
        displaySettingsAW(url)
        .then(data => {
            wrapper.innerHTML = data['html']
            // This function is called to ensure that the add icon levitates in case there are no more instances to display
            addIconLevitate(document.querySelector('.add-data'))
        })
    }

})

body.addEventListener('mouseover', (e) => {
    /* This event will be fired every time the target contains the 'tab' class in its classlist, it will add the tab-hover class*/
    if (e.target.classList.contains('tab') || e.target.classList.contains('general-option-tab') || e.target.classList.contains('profile-option-tab')){
        e.target.classList.add('tab-hover')
    }

})

body.addEventListener('mouseout', (e) => {
    /* This event will be fired every time the target contains the 'tab' class in its classlist, it will remove the tab-hover class*/
    if (e.target.classList.contains('tab') || e.target.classList.contains('general-option-tab') || e.target.classList.contains('profile-option-tab')){
        e.target.classList.remove('tab-hover')
    }

})


// Wrapper Event Listeners

if (wrapper){

    /* This assignment is done for filtering purposes, every time the form input is blank, this content will be added.*/
    var backedUpContent = wrapper.innerHTML

    wrapper.addEventListener('mouseover', (e) => {


        /* This event will be fired every time a hover occurs in an element with the 'TD' nodeName of the childs are the
           'fa-trash' or 'fa-edit' icons, this event will change some styles in the table rows.*/
        if (e.target.nodeName === 'TD' || ((e.target.classList.contains('fa-trash') || e.target.classList.contains('fa-edit')))){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /* This event will be fired every time the target contains the 'fa-filter' class in its classList, it will add
           the 'fa-filter-hover' class to the target.*/
        if (e.target.classList.contains('fa-filter')){
            e.target.classList.add('fa-filter-hover')
        }

        /* This event will be fired every time the target contains the 'fa-plus' class in its classList, it will add
           the 'fa-plus-hover' to the target.*/
        if (e.target.classList.contains('fa-plus')){
            e.target.classList.add('fa-plus-hover')
        }

        /* This event will be fired every time the target contains the 'fa-edit' class in its classList, it will add
           the 'fa-edit-hover' to the target.*/
        if (e.target.classList.contains('fa-edit')){
            e.target.classList.add('fa-edit-hover')
        }

        /* This event will be fired every time the target contains the 'fa-trash' class in its classList, it will add
           the 'fa-trash-hover' to the target.*/
        if (e.target.classList.contains('fa-trash')){
            e.target.classList.add('fa-trash-hover')
        }

        if (e.target.nodeName === 'INPUT'){
        /* This event will be fired every time the target's nodeName is INPUT it will add
           the 'input-hover' class to the target.*/
            e.target.classList.add('input-hover')
        }

        /* This event will be fired every time the target's nodeName is BUTTON it will add
           the 'button-hover' class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }

        /* This event will be fired every time the target contains the 'wallpaper' class in its classList, it will add
           the 'wallpaper-trash-hover' to the target.*/
        if (e.target.classList.contains('wallpaper')){
            e.target.classList.add('wallpaper-hover')
        }

    })

    wrapper.addEventListener('mouseout', (e) => {

    /* This event will be fired every time a hover occurs in an element with the 'TD' nodeName of the childs are the
       'fa-trash' or 'fa-edit' icons, this event will remove some styles in the table rows.*/
      if (e.target.nodeName === 'TD' || ((e.target.classList.contains('fa-trash') || e.target.classList.contains('fa-edit')))){
        let row
        e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = ''
            row.style.color = ''
      }

        /* This event will be fired every time the target contains the 'fa-filter' class in its classList, it will remove
           the 'fa-filter-hover' class to the target.*/
        if (e.target.classList.contains('fa-filter')){
            e.target.classList.remove('fa-filter-hover')
        }

        /* This event will be fired every time the target contains the 'fa-plus' class in its classList, it will remove
           the 'fa-plus-hover' to the target.*/
        if (e.target.classList.contains('fa-plus')){
            e.target.classList.remove('fa-plus-hover')
        }

        /* This event will be fired every time the target contains the 'fa-edit' class in its classList, it will remove
           the 'fa-edit-hover' to the target.*/
        if (e.target.classList.contains('fa-edit')){
            e.target.classList.remove('fa-edit-hover')
        }

        /* This event will be fired every time the target contains the 'fa-trash' class in its classList, it will remove
           the 'fa-trash-hover' to the target.*/
        if (e.target.classList.contains('fa-trash')){
            e.target.classList.remove('fa-trash-hover')
        }

        /* This event will be fired every time the target's nodeName is INPUT it will remove
           the 'input-hover' class to the target.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-hover')
        }

        /* This event will be fired every time the target's nodeName is BUTTON it will remove
           the 'button-hover' class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-hover')
        }

        /* This event will be fired every time the target contains the 'wallpaper' class in its classList, it will remove
           the 'wallpaper-trash-hover' to the target.*/
        if (e.target.classList.contains('wallpaper')){
            e.target.classList.remove('wallpaper-hover')
        }

    })

    wrapper.addEventListener('click', (e) => {


        if (e.target.classList.contains('general-option-tab')){
            let tab = e.target
            let tabs = document.querySelectorAll('general-option-tab')
            let url = tab.getAttribute('data-url')
            for (let i = 0; i<tabs.length; i++){
                tabs[i].classList.remove('tab-active')
            }
            tab.classList.add('tab-active')
            requestGeneralSettingsAW(url)
            .then(data => {
                document.querySelector('#general-settings-content').innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('profile-option-tab')){
            let tab = e.target
            let tabs = document.querySelectorAll('profile-option-tab')
            let url = tab.getAttribute('data-url')
            for (let i = 0; i<tabs.length; i++){
                tabs[i].classList.remove('tab-active')
            }
            tab.classList.add('tab-active')
            requestGeneralSettingsAW(url)
            .then(data => {
                document.querySelector('#profile-settings-content').innerHTML = data['html']
            })
        }

        if (e.target.nodeName === 'TD'){
        /* This event will be fired every time the target it's a table data cell, this event will open the modal and
           display the details of the clicked object. For this we need to make a 'GET' request to the server to retrieve
           the information, once it is collected, it is presented in the modal.*/
            const url = e.target.parentNode.getAttribute('data-url')
            viewElementAW(url)
            .then(data => {
                modal.classList.add('modal-show')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('fa-filter')){
            /* This event will be fired every time the target contains the 'fa-filter' class in its classList, this will
            either hide or display the form based on the current status.*/
            const form = document.querySelector('.filter-form')
            form.classList.contains('show-filter-form') ? form.classList.remove('show-filter-form') : form.classList.add('show-filter-form')
        }

        if (e.target.classList.contains('fa-plus')){
            /* This event will be fired every time the target contains the 'fa-plus' class in it's classList, this event
               will display the addition form for the current type of object displayed. The form presented depends on the
               'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
               is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal-show')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('fa-edit')){
        /* This event will be fired every time the target contains the 'fa-edit' class in it's classList, this event
           will display the edit form for the current type of object displayed. The form presented depends on the
           'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
           is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal-show')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('fa-trash')){
        /* This event will be fired every time the target contains the 'fa-trash' class in it's classList, this event
           will display the deletion form for the current type of object displayed. The form presented depends on the
           'url' collected from the 'data-url' attribute from the target, finally, the modal is displayed and the form
           is presented.*/
            e.preventDefault()
            e.stopPropagation()
            const url = e.target.getAttribute('data-url')
            showForm(url)
            .then(data => {
                modal.classList.add('modal-show')
                modalContent.innerHTML = data['html']
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
                modal.classList.add('modal-show')
            })
        }

        if (e.target.classList.contains('wallpaper')){
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

    wrapper.addEventListener('input', (e) => {
        /* This event will be fired every time a form input is being changed, this event will make an AJAX request to the
           server, for filtering purposes, we need ro collect some before making the request, data such as the 'url' for
           the request, 'method' we collect from the form.method attribute and finally the query, we grab from the target
           value. The response will be rendered in the tbody.*/
        if (e.target.nodeName === 'INPUT' && e.target.parentNode.parentNode.classList.contains('filter-form')){
            let form = e.target.parentNode.parentNode
            let url = form.action + '?query=' + e.target.value
            filterResultsAW(url)
            .then(data => {
                document.querySelector('#paginator') && document.querySelector('#paginator').remove();
                document.querySelector('tbody').innerHTML = data['html']
            })
        }})


    wrapper.addEventListener('change', (e) => {
        if (e.target.id === 'id_availability'){
            let form = document.querySelector('form')
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            changeAvailability(url, method, csrfmiddlewaretoken, formData)
        }
    })


    wrapper.addEventListener('submit', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.target.nodeName === 'FORM'){
            const url = e.target.action
            const method = e.target.method
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            const formData = new FormData(e.target)
            updateSettingsAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                wrapper.innerHTML = data['html']
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
            modal.classList.remove('modal-show')
        }

        // This event will be fired every time the target is the a button with the value of 'no', the 'show-modal' class will be removed from the modal.
        if (e.target.value === 'no' || e.target.textContent === "Ok"){
            e.preventDefault()
            e.stopPropagation()
            modal.classList.remove('modal-show')
        }

    })

    // Modal Mouseover Events

    modal.addEventListener('mouseover', (e) => {

        /* This event will be fired every time the target's nodeName is 'BUTTON', the 'button-hover' class will be added to the target*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }

        /* This event will be fired every time the target's nodeName is 'INPUT', the 'input-hover' class will be added to the target*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-hover')
        }

    })

    // Modal Mouseout Events

    modal.addEventListener('mouseout', (e) => {

        /* This event will be fired every time the target's nodeName is 'BUTTON', the 'button-hover' class will be removed to the target*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-hover')
        }

        /* This event will be fired every time the target's nodeName is 'INPUT', the 'input-hover' class will be removed to the target*/
         if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-hover')
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
            /* This event will be fired every time the form contains the 'add' or 'update' class in it's classList, this
               form will collect make use of the information collected above to make the request, after we receive a response,
               we check if the response contains an error, if it does, the error is rendered in the form, if not, the wrapper
               html is updated and the backedUpContent variable reassigned and the modal is closed.*/
            if (e.target.classList.contains('add') || e.target.classList.contains('update')){
                addUpdateElementAW(url, method, csrfmiddlewaretoken, data)
                .then(data => {
                    if ('html' in data){
                        modalContent.innerHTML = data['html']
                    }else{
                        wrapper.innerHTML = data['updated_html']
                        modal.classList.remove('modal-show')
                    }
                })
            }

            if (e.target.id === 'delete'){
            /* This event will be fired every time the form contains the 'delete' class in it's classList, this
               form will collect make use of the information collected above to make the request, after we receive a response,
               the wrapper's html is updated and the backedUpContent variable reassigned and the modal is closed.*/
                deleteElementAW(url, method, csrfmiddlewaretoken)
                .then(data => {
                    if (data['updated_html']){
                        wrapper.innerHTML = data['updated_html']
                        modal.classList.remove('modal-show')
                        // This function is called to ensure that the add icon levitates in case there are no more instances to display
                        addIconLevitate(document.querySelector('.add-data'))
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
                        modal.classList.remove('modal-show')
                    }
                })
            }


         }
    })
}