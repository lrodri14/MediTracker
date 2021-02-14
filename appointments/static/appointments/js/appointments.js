/* This consults.js file contains all the variable definitions, async and sync functions, as well as all the Event Listeners
   needed to display the consults main page correctly, it is divided in 4 sections: Variable Definitions, Async and Sync
   functions, and event listeners. It is composed of two Async Functions.*/

/*#################################################### Variables #####################################################*/

// Data Available

var body = document.querySelector('body')

if (document.querySelectorAll('table') !== 'undefined' && document.querySelectorAll('table') !== 'null'){
    var table = document.querySelector('table')
    var tbody = document.querySelector('tbody')
}

if (document.querySelectorAll('button') !== 'undefined' && document.querySelectorAll('button') !== 'null'){
    var button = document.querySelectorAll('button')
}

if (document.querySelector('.modal') !== 'undefined' && document.querySelector('.modal') !== 'null'){
    var modal = document.querySelector('.modal')
    var modalContent = document.querySelector('.modal-content')
}

// No Data Available

if (document.querySelector('#add-consult') !== 'undefined' && document.querySelector('#add-consult') !== 'null'){
    var addConsult = document.querySelector('#add-consult')
    var noConsults = document.querySelector('#no-consults')
}

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

    // Body Click Events
    body.addEventListener('click', (e) => {
    /* This event will be fired every time an angle icon is clicked, this event will grab the url for the
       GET request, then the response will be added to the tbody, as well as the paginator will be deleted
       to get the current one.*/
    if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
        const url = e.target.getAttribute('data-url')
        requestPageAW(url)
        .then(data => {
            document.querySelector('#paginator') && document.querySelector('#paginator').remove()
            tbody.innerHTML = data['html']
        })
    }
    })


    // Body Mouseover events
    body.addEventListener('mouseover', (e) => {
        // This event will be fired every time the target is a 'fa-angle', this event will add the 'fa-angle-hover' to its classList.
        if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
            e.target.classList.add('fa-angle-hover')
        }

    })

    body.addEventListener('mouseout', (e) => {
        // This event will be fired every time the target is a 'fa-angle', this event will remove the 'fa-angle-hover' to its classList.
        if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
            e.target.classList.remove('fa-angle-hover')
        }

    })

}

// Table Event Listeners

if (table){

    // Table Mouseover Events

    table.addEventListener('mouseover', (e) => {

        /*This event will be fired every time a mouseover occurs over a 'TD' or the target contains 'fa-edit'
        class in it's classList, This will make changes inside this row.*/
        if (e.target.nodeName === 'TD' ||  e.target.classList.contains('fa-edit')){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-plus' class in it's
        classList, it will add the 'fa-plus-hover' class to the target.*/
        if (e.target.classList.contains('fa-plus')){
            e.target.classList.add('fa-plus-hover')
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-edit' class in it's
        classList, it will add the 'fa-edit-hover' class to the target.*/
        if (e.target.classList.contains('fa-edit')){
            e.target.classList.add('fa-edit-hover')
        }

        /*This event will be fired every time a mouseover occurs over a target which contains the 'fa-exlamation circle'
         class in it's classList, this will display the popup over the target, indicating the user, that the consult
         remains unlocked for further changes.*/
        if (e.target.classList.contains('fa-exclamation-circle')){
            popUp = e.target.parentNode.childNodes[1]
            popUp.classList.add('popup-show')
        }

    })

    // Table Mouseout Events

    table.addEventListener('mouseout', (e) => {

        /*This event will be fired every time a mouse out occurs from a 'TD' or the target contains 'fa-edit'
        class in it's classList, This will make changes inside this row.*/
          if (e.target.nodeName === 'TD' ||  e.target.classList.contains('fa-edit')){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = ''
            row.style.color = ''
          }

        /*This event will be fired every time a mouse out occurs from a target which contains the 'fa-plus' class in it's
        classList, it will remove the 'fa-plus-hover' class to the target.*/
          if (e.target.classList.contains('fa-plus')){
            e.target.classList.remove('fa-plus-hover')
          }

        /*This event will be fired every time a mouse out occurs from a target which contains the 'fa-edit' class in it's
        classList, it will remove the 'fa-edit-hover' class to the target.*/
         if (e.target.classList.contains('fa-edit')){
            e.target.classList.remove('fa-edit-hover')
         }

        /*This event will be fired every time a mouse out occurs from a target which contains the 'fa-exclamation-circle'
         class in it's classList, this will hide the popup over the target, indicating the user, that the consult
         remains unlocked for further changes.*/
         if (e.target.classList.contains('fa-exclamation-circle')){
            popUp = e.target.parentNode.childNodes[1]
            popUp.classList.remove('popup-show')
         }

    })

    // Table Click Events

    table.addEventListener('click', (e) => {

        /* This event will fired every time an icon with the 'fa-plus' is clicked, this event will display a modal
        containing the add consults form, this form will be retrieved from the server side, making an AJAX GET request.*/
        if (e.target.classList.contains('fa-plus')){
            let url = e.target.getAttribute('data-url')
            addConsultAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal-show')
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
        if (e.target === modal || e.target === modalContent){
        modal.classList.remove('modal-show')
        if (noConsults && addConsult){
                addConsult.classList.remove('add-consults-hide')
                noConsults.classList.remove('no-consults-hide')
            }
        }

    })

    // Modal Mouseover

    modal.addEventListener('mouseover', (e) => {

        /* This event will be fired every time the target's nodeName is 'A' and it will add the 'add_new_patient_hover'
            class to the target.*/
        if (e.target.nodeName === 'A'){
            e.target.classList.add('add_new_patient_hover')
        }
        /* This event will be fired every time the target's nodeName is 'BUTTON' and it will add the 'button-hover'
            class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }

    })

    // Modal MouseOut Events

    modal.addEventListener('mouseout', (e) => {

        /* This event will be fired every time the target's nodeName is 'A' and it will remove the 'add_new_patient_hover'
            class to the target.*/
        if (e.target.nodeName === 'A'){
            e.target.classList.remove('add_new_patient_hover')
        }

        /* This event will be fired every time the target's nodeName is 'BUTTON' and it will remove the 'button-hover'
            class to the target.*/
        if (e.target.nodeName === 'BUTTON' ){
            e.target.classList.remove('button-hover')
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
        if (e.target.nodeName === 'FORM'){
            e.preventDefault()
            e.stopPropagation()
            const formData = new FormData(e.target)
            const method = e.target.method
            const action = e.target.action
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            document.querySelector('.create-update-appointment-loader').classList.add('create-update-appointment-loader-show')
            submitConsultAW(action, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['success']){
                    modal.classList.remove('modal-show')
                    notificationWebsocket.send(JSON.stringify({'to': data['created_by'],'message': `Appointment has been created successfully for ${data['datetime']} by `, 'nf_type': 'appointment_created'}))
                } else {
                    modalContent.innerHTML = data['html']
                }
            })
        }
    })
}

// Button Event Listeners

if (button){
    for (let i = 0; i<button.length; i++){

        // Button Mouseover Events

        /*This event will be fired every time the target is a button, it will add the button-hover class to the target.*/
        button[i].addEventListener('mouseover', function(){
            this.classList.add('button-hover')
        })

        // Button Mouseout Events

        /*This event will be fired every time the target is a button, it will remove the button-hover class to the target.*/
        button[i].addEventListener('mouseout', function(){
            this.classList.remove('button-hover')
        })
    }
}

//Add Consult Event Listeners

if (addConsult){

    // addConsult Levitating Effect

    /* This setInterval function will be executed every 0.5 seconds and will change the 'top' style attribute of the
    addConsult element from '90%' to '88%' and vice versa*/
    setInterval(function(){
        if (addConsult.style.top == '90%'){
            addConsult.style.top = '88%'
        } else {
            addConsult.style.top = '90%'
        }
    },500)

    // addConsult Click Event

    /* This event will fired every time an icon with the 'fa-plus' is clicked, this event will display a modal
    containing the add consults form, this form will be retrieved from the server side, making an AJAX GET request.*/
    addConsult.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        addConsultAW(e.target.getAttribute('data-url'))
        .then(data => {
            modal.classList.add('modal-show')
            modalContent.innerHTML = data['html']
            if (noConsults && addConsult){
                addConsult.classList.add('add-consults-hide')
                noConsults.classList.add('no-consults-hide')
            }
        })
        
    })

    // addConsult Mouseover Event

    /*This event will be fired every time the target is a button, it will add the add-consult-hover class to the target.*/
    addConsult.addEventListener('mouseover', () => {
        addConsult.classList.add('add-consult-hover')
    })

    // addConsult Mouseout Event

    /*This event will be fired every time the target is a button, it will remove the add-consult-hover class to the target.*/
    addConsult.addEventListener('mouseout', () => {
        addConsult.classList.remove('add-consult-hover')
    })

}