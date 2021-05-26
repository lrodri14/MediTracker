/* This consults.js file contains all the variable definitions, async and sync functions, as well as all the Event Listeners
   needed to display the consults main page correctly, it is divided in 4 sections: Variable Definitions, Async and Sync
   functions, and event listeners. It is composed of two Async Functions.*/

/*#################################################### Variables #####################################################*/

let body = document.querySelector('body')
let modal = document.querySelector('.modal')
let modalContent = document.querySelector('.modal__content')

/*#################################################### Functions #####################################################*/

async function addConsultAW(url){

    /*The addConsultAW async function is used to display the add Consult form in the modals, this async func will make a
    GET request to the url provided and this will return a promise we can consume, the data retrieved will be displayed
    in our modal form in JSON Format. It takes a single argument, 'url' to make the GET request.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function requestPageAW(url){
    /* This async function will be used to collect the data from the previous or next page, this content will be
    received as a promise, so we need to return it in JSON format so we can process it, this content will be set to
    the tbody dynamically.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function submitConsultAW(url, method,csrfmiddlewaretoken, formData){
    /*This submitConsultAW async function is used to submit form data to the url passed, this async function will
    make a POST requests to the url provided, and will send two types of data, the data inside the form as well as
    the csrfmiddlewaretoken, if the request doesn't returns any error to the form, then this consult will be created
    and placed in the agenda for further confirmation, if not, the form will be re-rendered with the corresponding
    errors. This will create a Promise object we can consume, and the response will be received in JSON format. It takes
    4 arguments: 'url' to make the POST request, 'method' which we collect from the form 'method' attribute, 'csrf-
    middlewaretoken collect from the form hidden input and finally the form data.*/
    const result = await fetch(url, {method: method, headers: {'X-CSRFTOKEN':csrfmiddlewaretoken}, body: formData})
    const data = result.json()
    return data
}

/*#################################################### Event Listeners ###############################################*/

// Body Event Listeners

if (body){

    // Body mouseover events
    body.addEventListener('mouseover', (e) => {

        // This event will be fired everytime a mouseout occurs over an add-data item, it will add the button--active class from the target.
        if (e.target.classList.contains('add-data')){
            e.target.classList.add('add-data--active')
        }

        // This event will be fired everytime a mouseout occurs over a button, it will remove the button--active class from the target.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /*This event will be fired every time a mouseover occurs over a 'TD' or the target contains 'fa-edit'
        class in it's classList, This will make changes inside this row.*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-plus' class in it's
        classList, it will add the 'fa-plus-hover' class to the target.*/
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.add('data-table__create--active')
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-edit' class in it's
        classList, it will add the 'fa-edit-hover' class to the target.*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.add('data-table__update--active')
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-exlamation circle'
         class in it's classList, this will display the popup over the target, indicating the user, that the consult
         remains unlocked for further changes.*/
        if (e.target.classList.contains('fa-exclamation-circle')){
            popUp = e.target.parentNode.childNodes[1]
            popUp.classList.add('popup--display')
        }

    })

    // Body mouseout events
    body.addEventListener('mouseout', (e) => {

        // This event will be fired everytime a mouseout occurs over an add-data item, it will remove the button--active class from the target.
        if (e.target.classList.contains('add-data')){
            e.target.classList.remove('add-data--active')
        }

    // This event will be fired everytime a mouseout occurs over a button, it will remove the button--active class from the target.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /*This event will be fired every time a mouseover occurs over a 'TD' or the target contains 'fa-edit'
        class in it's classList, This will make changes inside this row.*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = ''
            row.style.color = ''
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-plus' class in it's
        classList, it will remove the 'fa-plus-hover' class to the target.*/
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.remove('data-table__create--active')
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-edit' class in it's
        classList, it will remove the 'fa-edit-hover' class to the target.*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.remove('data-table__update--active')
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-exlamation circle'
         class in it's classList, this will display the popup over the target, indicating the user, that the consult
         remains unlocked for further changes.*/
        if (e.target.classList.contains('fa-exclamation-circle')){
            popUp = e.target.parentNode.childNodes[1]
            popUp.classList.add('popup--display')
        }

    })

    // Body click events
    body.addEventListener('click', (e) => {

        /* This event will fired every time an icon with the 'fa-plus' is clicked, this event will display a modal
        containing the add consults form, this form will be retrieved from the server side, making an AJAX GET request.*/
        if (e.target.classList.contains('data-table__create') || e.target.classList.contains('add-data')){
            let url = e.target.getAttribute('data-url')
            addConsultAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

    })

}
// Modal Event Listeners

if (modal){

    // Modal Click Events

    modal.addEventListener('click', (e) => {

        /* This event will be fired every time the target is the modal or the modalContent, if each of these elements
        is clicked, then it will remove the modal and remove the 'no-consults-hide' class from the noConsults element.*/
        if (e.target === modal){
            modal.classList.remove('modal--display')
        }

    })

    // Modal Mouseover

    modal.addEventListener('mouseover', (e) => {

        /* This event will be fired every time the target class is modal__add-patient, it will add the add-data--active class.*/
        if (e.target.classList.contains('modal__add-patient')){
            e.target.classList.add('add-data--active')
        }
    })

    // Modal MouseOut Events

    modal.addEventListener('mouseout', (e) => {

        /* This event will be fired every time the target class is modal__add-patient, it will remove the add-data--active class.*/
        if (e.target.classList.contains('modal__add-patient')){
            e.target.classList.remove('add-data--active')
        }

    })

    // Modal Submit Events

    modalContent.addEventListener('submit', (e) => {

        /*This event will be fired every time the target's nodeName is 'FORM', this event will call an async function to
        send data to the server in a POST request, but before doing this request, we need to collect some data, the
         form data, we create a new FormData object and pass the form as a parameter, we collect the 'method' from the
         form.method attribute, we also collect the 'action' from the form.action attribute, and finally the value of the
         csrfmiddlewaretoken value from the hidden input. The form will be hidden and the data will be sent to the server,
         errors will be displayed depending on the data we received back from the server, once we send the data to the server.*/
        if (e.target.id === 'appointment-create-form'){
            e.preventDefault()
            e.stopPropagation()
            const formData = new FormData(e.target)
            const method = e.target.method
            const action = e.target.action
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            document.querySelector('.create-update-appointment-loader').classList.add('create-update-appointment-loader--display')
            submitConsultAW(action, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['success']){
                    modal.classList.remove('modal--display')
                    notificationWebsocket.send(JSON.stringify({'to': data['to'], 'created_by': data['created_by'], 'message': `Appointment has been created successfully for ${data['datetime']} by `, 'nf_type': 'appointment_created'}))
                } else {
                    modalContent.innerHTML = data['html']
                }
            })
        }

    })
}