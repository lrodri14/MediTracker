/* This consult_register.js file contains all the variables, async functions and event listeners needed to display
   the Agenda template in the Appointments App. It is composed of 6 Async Functions.*/

/*#################################################### Variables #####################################################*/

if (document.querySelector('.wrapper') !== 'undefined' && document.querySelector('.wrapper') !== 'null'){
    var wrapper = document.querySelector('.wrapper')
    var dataTable = document.querySelector('.data-table')
    var form = document.querySelector('.filter-form')
}

if (document.querySelector('.modal') !== 'undefined' && document.querySelector('.modal') !== 'null'){
    var modal = document.querySelector('.modal')
    var modalContent = document.querySelector('.modal-content')
}

/*#################################################### Functions #####################################################*/

async function requestPageAW(url){
    /* This async function will be used to collect the data from the previous or next page, this content will be
    received as a promise, so we need to return it in JSON format so we can process it, this content will be set to
    the dataTable dynamically.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

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


if (wrapper){

    //Wrapper MouseOver

    wrapper.addEventListener('mouseover', (e) => {

        // This event will be fired every time the target is a 'fa-angle', this event will add the 'fa-angle-hover' to its classList.
        if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
            e.target.classList.add('fa-angle-hover')
        }

        /* This event will be fired every time a hover occurs on a target which nodeName is 'BUTTON', this will add the
        button-form-hover class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-form-hover')
        }

        /* This event will be fired every time a hover occurs on a target which classList contains 'fa-filter' this will add the
        fa-filter-hover class to the target.*/
        if (e.target.classList.contains('fa-filter')){
            e.target.classList.add('fa-filter-hover')
        }

        /* This event will be fired every time a hover occurs on a target which is a table data cell or classList
        contains 'fa-edit' or 'fa-check' this will add the some styles to the parent's row of this elements.*/
        if (e.target.nodeName === 'TD' || (e.target.classList.contains('fa-edit') || e.target.classList.contains('fa-check') || e.target.classList.contains('fa-times-circle'))){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /* This event will be fired every time a hover occurs on a target which classList contains 'fa-edit' this will add the
        fa-edit-hover class to the target.*/
        if (e.target.classList.contains('fa-edit')){
            e.target.classList.add('fa-edit-hover')
        }

        /* This event will be fired every time a hover occurs on a target which classList contains 'fa-check' this will add the
        fa-check-hover class to the target.*/
        if (e.target.classList.contains('fa-check')){
            e.target.classList.add('fa-check-hover')
        }

        /* This event will be fired every time a hover occurs on a target which classList contains 'fa-times-circle' this will add the
        fa-times-circle-hover class to the target.*/
        if (e.target.classList.contains('fa-times-circle')){
            e.target.classList.add('fa-times-circle-hover')
        }

    })

    //Wrapper MouseOut

    wrapper.addEventListener('mouseout', (e) => {

        // This event will be fired every time the target is a 'fa-angle', this event will remove the 'fa-angle-hover' to its classList.
        if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
            e.target.classList.remove('fa-angle-hover')
        }

        /* This event will be fired every time a hover out occurs on a target which nodeName is 'BUTTON', this will remove the
        button-form-hover class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-form-hover')
        }

        /* This event will be fired every time a hover out occurs on a target which classList contains 'fa-filter' this will remove the
        fa-filter-hover class to the target.*/
        if (e.target.classList.contains('fa-filter')){
            e.target.classList.remove('fa-filter-hover')
        }

        /* This event will be fired every time a hover out occurs on a target which is a table data cell or classList
        contains 'fa-edit' or 'fa-check' this will remove some styles to the parent's row of this elements.*/
        if (e.target.nodeName === 'TD' || !e.target.classList.contains('fa-filter')){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = ''
            row.style.color = ''
        }

        /* This event will be fired every time a hover out occurs on a target which classList contains 'fa-edit' this will remove the
        fa-edit-hover class to the target.*/
        if (e.target.classList.contains('fa-edit')){
            e.target.classList.remove('fa-edit-hover')
        }

        /* This event will be fired every time a hover out occurs on a target which classList contains 'fa-check' this will remove the
        fa-check-hover class to the target.*/
        if (e.target.classList.contains('fa-check')){
            e.target.classList.remove('fa-check-hover')
        }

        /* This event will be fired every time a hover out occurs on a target which classList contains 'fa-times-circle' this will remove the
        fa-times-circle-hover class to the target.*/
        if (e.target.classList.contains('fa-times-circle')){
            e.target.classList.remove('fa-times-circle-hover')
        }

    })

    //Wrapper Click

    wrapper.addEventListener('click', (e) => {

        /* This event will be fired every time an angle icon is clicked, this event will grab the url for the
           GET request, then the response will be added to the tbody, as well as the paginator will be deleted
           to get the current one.*/
        if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
            url = e.target.getAttribute('data-url')
            requestPageAW(url)
            .then(data => {
                dataTable.innerHTML = data['html']
            })
        }

        /*This target will be fired every time the target is the modal or the modalContent itself, this will remove the
          modal-show class from the modal, hiding it.*/
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal-content')){
            e.target.classList.remove('modal-show')
        }

        /* This event will be fired every time a click occurs on the fa-filter icon, this will check if the filter form
        is shown or hidden, and perform the displaying or hiding depending on the previous condition.*/
        if (e.target.classList.contains('fa-filter')){
            form.classList.contains('show-form') ? form.classList.remove('show-form') : form.classList.add('show-form')
        }

        /*This event will be fired every time the target contains the 'fa-edit' class in it's classList, this event will
        call the updateAW async function to show the corresponding form for updating the consult, it will collect the
        url from the target data-url attribute.*/
        if (e.target.classList.contains('fa-edit')){
            e.preventDefault()
            e.stopPropagation()
            let url = e.target.parentNode.getAttribute('data-url')
            updateAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal-show')
            })
        }

        /*This event will be fired every time the target contains the 'fa-check' class in it's classList, this event will
        call the confirmAW async function to show the confirm the current consult, finally will dynamically update results.*/
        if (e.target.classList.contains('fa-check')){
            e.preventDefault()
            e.stopPropagation()
            confirmAW(e.target.parentNode.getAttribute('data-url'))
            .then(data => {
                dataTable.innerHTML = data['html']
            })
        }

        /*This event will be fired every time the target contains the 'fa-times-circle' class in it's classList, this event will
        call the cancelAW async function to show the corresponding form for cancelling the consult, it will collect the
        url from the target data-url attribute.*/
        if (e.target.classList.contains('fa-times-circle')){
            e.stopPropagation()
            e.preventDefault()
            cancelAW(e.target.parentNode.getAttribute('data-url'))
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal-show')
            })
        }

        /*This event will be fired every time the target contains 'no' as it's value, this target will remove 'modal-show'
          class from the modal.*/
        if (e.target.value === 'no'){
            e.preventDefault()
            modal.classList.remove('modal-show')
        }

    })


    //Wrapper Submit

    wrapper.addEventListener('submit', (e) => {
        /*This event will be fired every time a submit occurs and the target contains the 'modal-cancel-form' class in it's
        classlist, this event will stop the itself, and collect the data needed to cancel the consult, this consists of
        the url, method, csrfmiddlewaretoken and the form data, once this data is collected from the form, we proceed to
        call our asynchronous function, the response is dynamically displayed in our table.*/
        if (e.target.nodeName === 'FORM' && e.target.classList.contains('cancel-form')){
            e.preventDefault()
            const form = e.target
            const url = form.action
            const method = form.method
            const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            submitCancelAW(url, method, csrfmiddlewaretoken)
            .then(data => {
                dataTable.innerHTML = data['html']
            })
            modal.classList.remove('modal-show')
        /*This event will be fired every time a submit occurs and the target contains the 'update-date-form' class in it's
        classlist, this event will stop the itself, and collect the data needed to update the consult, this consists of
        the url, method, csrfmiddlewaretoken and the form data, once this data is collected from the form, we proceed to
        call our asynchronous function, the response is dynamically displayed in our table.*/
        }else if (e.target.nodeName === 'FORM' && e.target.classList.contains('update-date-form')){
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
                }else{
                    document.querySelector('.create-update-appointment-loader').classList.remove('create-update-appointment-loader-show')
                    modalContent.innerHTML = data['html']
                }
            })
        } else{
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

    /* Modal Mouseover */

    modal.addEventListener('mouseover', (e) => {
    /*This event is fired every time a hover occurs over an element which id is add_new_patient, this will add the
      add_new_patient_hover class to the target.*/
        if (e.target.id === 'add_new_patient'){
            e.target.classList.add('add_new_patient_hover')
        }
    })

    /*Modal Mouseout*/

    modal.addEventListener('mouseout', (e) => {
    /*This event is fired every time a hover out occurs over an element which id is add_new_patient, this will remove the
      add_new_patient_hover class to the target.*/
        if (e.target.id === 'add_new_patient'){
            e.target.classList.remove('add_new_patient_hover')
        }
    })
}