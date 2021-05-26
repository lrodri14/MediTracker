/* This consult_register.js file contains all the variables, async functions and event listeners needed to display
   the Agenda template in the Appointments App. It is composed of 6 Async Functions.*/

/*#################################################### Variables #####################################################*/

let container = document.querySelector('.data')
let dataTable = document.querySelector('.data-table-container')
let modal = document.querySelector('.modal')
let modalContent = document.querySelector('.modal__content')
let form = document.querySelector('.filter-container__filter-form')
let loader = document.querySelector('.create-update-appointment-loader')

/*#################################################### Functions #####################################################*/

async function cancelAW(url){
    /* This cancelAW async function is used to cancel consults that were previously scheduled, this function will display
    the form needed to cancel the consult in the modal, it takes only one argument, the url to make the GET request.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function confirmAW(url){
    /* This confirmAW async function is used to confirm consults that were previously scheduled, this function will display
    the form needed to confirm the consult in the modal, it takes only one argument, the url to make the GET request.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function updateAW(url){
    /* This updateAW async function is used to update consults that were previously scheduled, this function will display
    the form needed to update the consult in the modal, it takes only one argument, the url to make the GET request.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function submitCancelAW(url, method, csrfmiddlewaretoken){
    /*The submitCancelAW function is used to cancel the consults that were scheduled, previously the cancelAW async func
    displayed the form needed to cancel the consult, this submitCancelAW async func will make a POST request to cancel
    the consult in the server side depending on the option selected by the user, it takes 3 arguments, the 'url' to
    make the POST request, the 'method' we collect from the form.method attribute and finally the 'csrfmiddlewaretoken'
    we collect from the forms hidden input.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}})
    let data = await result.json()
    return data
}

async function submitUpdateAW(url, method, csrfmiddlewaretoken, formData){
    /*The submitUpdateAW function is used to update the consults that were scheduled, previously the updateAW async func
    displayed the form needed to update the consult, this submitUpdateAW async func will make a POST request to update
    the consult in the server side depending on the option selected by the user, it takes 3 arguments, the 'url' to
    make the POST request, the 'method' we collect from the form.method attribute and finally the 'csrfmiddlewaretoken'
    we collect from the forms hidden input.*/
    const result = await fetch(url, {method:method, headers:{'X_CSRFToken':csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

async function filterResultsAW(url, method, csrfmiddlewaretoken, formData){
    /* This filterResultsAW async function is used to filter results from the Agenda based on a date query, this func
    takes four parameters, the 'url' which we collect from the form's action attribute, the 'method' we collect from
    the form's method attribute, csrfmiddlewaretoken we collect from the form's hidden input,and the 'formData' which
     we collect from the form and convert it into a formData object. The response will be converted into JSON before
     dynamically showing it.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

/*#################################################### Event Listeners ###############################################*/


if (container){

    //Container MouseOver

    container.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a hover occurs on a target which nodeName is 'BUTTON', this will add the
        button--active class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /* This event will be fired every time a hover occurs on a target is the show filter button, this will add the
        filter_container__filter-display-button--active class to the target.*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.add('filter-container__filter-display-button--active')
        }

        /* This event will be fired every time a hover occurs on a target which is a table data cell
           this will add the some styles to the row.*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /* This event will be fired every time a hover out occurs on a target which is an update button this will add the
        data-table__update--active class to the target.*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.add('data-table__update--active')
        }

        /* This event will be fired every time a hover out occurs on a target which is a confirmation button this will add the
        data-table__confirm--active class to the target.*/
        if (e.target.classList.contains('data-table__confirm')){
            e.target.classList.add('data-table__confirm--active')
        }

        /* This event will be fired every time a hover out occurs on a target which is an cancellation button this will add the
        data-table__cancel--active class to the target.*/
        if (e.target.classList.contains('data-table__cancel')){
            e.target.classList.add('data-table__cancel--active')
        }

    })

    //Container MouseOut

    container.addEventListener('mouseout', (e) => {

        /* This event will be fired every time a hover out occurs on a target which nodeName is 'BUTTON', this will remove the
        button-form-hover class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /* This event will be fired every time a hover out occurs on a target which classList contains 'fa-filter' this will remove the
        fa-filter-hover class to the target.*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.remove('filter-container__filter-display-button--active')
        }

        /* This event will be fired every time a hover occurs on a target which is a table data cell
           this will add the some styles to the row.*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = ''
            row.style.color = ''
        }

        /* This event will be fired every time a hover out occurs on a target which is an update button this will remove the
        data-table__update--active class to the target.*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.remove('data-table__update--active')
        }

        /* This event will be fired every time a hover out occurs on a target which is a confirmation button this will remove the
        data-table__confirm--active class to the target.*/
        if (e.target.classList.contains('data-table__confirm')){
            e.target.classList.remove('data-table__confirm--active')
        }

        /* This event will be fired every time a hover out occurs on a target which is a confirmation button this will remove the
        data-table__cancel--active class to the target.*/
        if (e.target.classList.contains('data-table__cancel')){
            e.target.classList.remove('data-table__cancel--active')
        }

    })

    //Container Click

    container.addEventListener('click', (e) => {

        /*This target will be fired every time the target is the modal or the modalContent itself, this will remove the
          modal-show class from the modal, hiding it.*/
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal__content')){
            e.target.classList.remove('modal--display')
        }

        /* This event will be fired every time a click occurs on the fa-filter icon, this will check if the filter form
        is shown or hidden, and perform the displaying or hiding depending on the previous condition.*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            form.classList.contains('filter-container__filter-form--display') ? form.classList.remove('filter-container__filter-form--display') : form.classList.add('filter-container__filter-form--display')
        }

        /*This event will be fired every time the target contains the 'fa-edit' class in it's classList, this event will
        call the updateAW async function to show the corresponding form for updating the consult, it will collect the
        url from the target data-url attribute.*/
        if (e.target.classList.contains('data-table__update')){
            e.preventDefault()
            e.stopPropagation()
            let url = e.target.parentNode.getAttribute('data-url')
            updateAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        /*This event will be fired every time the target contains the 'fa-check' class in it's classList, this event will
        call the confirmAW async function to show the confirm the current consult, finally will dynamically update results.*/
        if (e.target.classList.contains('data-table__confirm')){
            e.preventDefault()
            e.stopPropagation()
            confirmAW(e.target.parentNode.getAttribute('data-url'))
            .then(data => {
                dataTable.innerHTML = data['html']
                notificationWebsocket.send(JSON.stringify({'to': data['to'], 'message': `${data['patient']} confirmed an appointment for ${data['datetime']}`, 'nf_type':'appointment_update'}))
            })
        }

        /*This event will be fired every time the target contains the 'fa-times-circle' class in it's classList, this event will
        call the cancelAW async function to show the corresponding form for cancelling the consult, it will collect the
        url from the target data-url attribute.*/
        if (e.target.classList.contains('data-table__cancel')){
            e.stopPropagation()
            e.preventDefault()
            cancelAW(e.target.parentNode.getAttribute('data-url'))
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        /*This event will be fired every time the target contains 'no' as it's value, this target will remove 'modal-show'
          class from the modal.*/
        if (e.target.value === 'no'){
            e.preventDefault()
            modal.classList.remove('modal--display')
        }

    })


    //Container Submit

    container.addEventListener('submit', (e) => {

        /*This event will be fired every time a submit occurs and the target's id is 'cancel-appointment-form'
         this event will stop the itself, and collect the data needed to cancel the consult, this consists of
        the url, method, csrfmiddlewaretoken and the form data, once this data is collected from the form, we proceed to
        call our asynchronous function, the response is dynamically displayed in our table.*/
        if (e.target.id === 'cancel-appointment-form'){
            e.preventDefault()
            const form = e.target
            const url = form.action
            const method = form.method
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            submitCancelAW(url, method, csrfmiddlewaretoken)
            .then(data => {
                dataTable.innerHTML = data['html']
                notificationWebsocket.send(JSON.stringify({'to': data['to'], 'message': `${data['patient']} cancelled an appointment for ${data['datetime']}`, 'nf_type':'appointment_update'}))
            })
            modal.classList.remove('modal--display')
        }

        /*This event will be fired every time a submit occurs and the target contains the 'update-date-form' class in it's
        classlist, this event will stop the itself, and collect the data needed to update the consult, this consists of
        the url, method, csrfmiddlewaretoken and the form data, once this data is collected from the form, we proceed to
        call our asynchronous function, the response is dynamically displayed in our table.*/
        if (e.target.id === 'update-appointment-form'){
            e.preventDefault()
            const form = e.target
            const method = form.method
            const url = form.action
            const data = new FormData(form)
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            document.querySelector('.create-update-appointment-loader').classList.add('create-update-appointment-loader-show')
            submitUpdateAW(url, method, csrfmiddlewaretoken, data)
            .then(data => {
                if (data['updated_html']){
                    dataTable.innerHTML = data['updated_html']
                    modal.classList.remove('modal-show')
                    notificationWebsocket.send(JSON.stringify({'to': data['to'], 'message': `${data['patient']} updated an appointment date to ${data['datetime']}`, 'nf_type':'appointment_update'}))
                }else{
                    document.querySelector('.create-update-appointment-loader').classList.remove('create-update-appointment-loader-show')
                    modalContent.innerHTML = data['html']
                }
            })
        }

        if (e.target.classList.contains('filter-container__filter-form')){
            /*This event will be fired every time a submit occurs and the target is the filter results form
            this event will stop the itself, and collect the data needed to filter the consults, this consists of
            the url , once this data is collected from the form, we proceed to call our asynchronous function, the
            response is dynamically displayed in our table.*/
            e.preventDefault()
            let fromDay = document.querySelector('#id_date_from_day').value
            let fromMonth = document.querySelector('#id_date_from_month').value
            let fromYear = document.querySelector('#id_date_from_year').value
            let toDay = document.querySelector('#id_date_to_day').value
            let toMonth = document.querySelector('#id_date_to_month').value
            let toYear = document.querySelector('#id_date_to_year').value
            let fromDate = fromYear + "-" + fromMonth + "-" + fromDay
            let toDate = toYear + "-" + toMonth + "-" + toDay
            const url = e.target.action + '?date_from=' + fromDate + '&date_to=' + toDate
            filterResultsAW(url)
            .then(data => {
                dataTable.innerHTML = data['html']
            })
        }
    })
}

// Modal

if (modal){

    // Modal Click Events

    // This event will be fired every time the target is the modal, it will remove the modal--display class from the element.
    if (e.target.classList.contains('modal')){
        e.target.classList.remove('modal--display')
    }

}