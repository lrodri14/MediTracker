/*This JS file contains all the variable declarations, Async functions and functions, and event listeners needed for
the Patients main page to work properly, it is divided into three sections: Variable Declarations, Functions and
event listeners, the Variable declarations section is divided into another two sections, for data availability and
no data present functionality, the data available section contains some an objects  which contain the respective
warning messages shown to the user in case there is any anomally in any patient's instance, it also contains a variable
called 'backedUpData', the purpose of this variable is to serve the data that present before a filtering operation.
The function section consists of 3 async functions and 1 sync function.*/

// ################################################ Variables ##########################################################

// Data available

let dataContainer = document.querySelector('.data')
let tbody = document.querySelector('tbody')
let addPatient = document.querySelector('.add-data')
let filterForm = document.querySelector('.filter-container__filter-form')
let warningPopup = document.querySelector('.popup')
let warningPopupText = document.querySelector('.popup__text')
let modal = document.querySelector('.modal')
let modalContent = document.querySelector('.modal__content')
let addData = document.querySelector('.add-data')

// Warning Messages
let warningMessages = {
    'no-id-registered' : "Individual over 18, ID information unknown",
    'expired-insurance' : "Medical Insurance's valid time concluded",
    'out-of-date-info' : "Patient's information outdated",
    'in-order': "Individual's information up to date"
}

// ################################################ Functions ##########################################################

// Async Functions

async function deleteAW(url){
    /*This deleteAW async functions it's purpose is to retrieve the deletion form
      used to delete patient instances, it accepts a single argument 'url', after
      the data was retrieved from the server, it's converted to JSON format and
      returned*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function filterResults(url){
    /*This filterResults async functions it's purpose is to retrieve the patients
      related data from the database based on a query the user inputs in the filter form,
      it accepts 4 arguments 'url' to where the POST request is done, the method which
      we retrieve from the form.action attribute, the 'csrfmiddlewaretoken' we retrieve
      from the input's hidden input and the formData, the data inputted into the form.
      after the data was retrieved from the server, it's converted to JSON format and
      returned*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function submitFormAW(form, csrfmiddlewaretoken){
    /*This submitFormAW async function it's purpose is to submit the deletion of patients
      from the database, it accepts 2 arguments 'url' to where the POST request is done, the method which
      we retrieve from the form.action attribute, the 'csrfmiddlewaretoken' we retrieve
      from the input's hidden input, after all this data is retrieved from the form, we make the request,
      this will return us some data from the server, after the data was retrieved from the server,
      it's converted to JSON format and returned*/
    const result = await fetch(form.action, {method:'POST', headers:{'X-CSRFToken': csrfmiddlewaretoken}})
    const data = await result.json()
    return data
}

// Sync Functions

function addIconLevitate(addPatientIcon){
    /*This function is used to perform the levitation effect in the
      .fa-plus icon every time there is no data available, it takes
      one parameter, 'addPatientIcon' is the icon itself. it will
      execute a setInterval function every 0.5 seconds, which just
      changes the style of the 'top' attribute in our element.*/
    setInterval(function(){
        if (addPatientIcon.style.top == '90%'){
            addPatientIcon.style.top = '88%'
        } else {
            addPatientIcon.style.top = '90%'
        }
    },500)
}

function deleteItem(event){
    /*
        This function is used to execute the deletion over an element by clicking in the delete icon, this function
        is called over inline calling.
    */
    event.preventDefault()
    event.stopPropagation()
    let url = event.target.parentNode.getAttribute('data-url')
    deleteAW(url).
    then(data => {
        modalContent.innerHTML = data['html']
        modal.classList.add('modal--display')
    })
}

function updateItem(event){
    /*
        This function is used to execute the updating over an element by clicking in the update icon, this function
        is called over inline calling.
    */
    event.preventDefault()
    event.stopPropagation()
    let url = event.target.parentNode.getAttribute('data-url')
    window.location.href = url
}

// ############################################ Event Listeners ########################################################

// addData Event Listeners, this events will be fired when there is not data available to show.

if (addData){

    /* Every time a hover occurs over this element, this event will be fired, it will add the add-patient-hover
       class to the element*/
    addData.addEventListener('mouseover', () => {
        addData.classList.add('add-data--active')
    })

    /* Every time a hover occurs over this element, this event will be fired, it will remove the add-patient-hover
       class from the element*/
    addData.addEventListener('mouseout', () => {
        addData.classList.remove('add-data--active')
    })
}

// Data Container

if (dataContainer){

    dataContainer.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a hover occurs in the icons or a data-table__item item, this will change many style
           properties from the row*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

       // This event will be fired, every time the user hovers over data-table__create icon, the data-table__create--active class will be added.
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.add('data-table__create--active')
        }

       // This event will be fired, every time the user hovers over data-table__update icon, the data-table__update--active class will be added.
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.add('data-table__update--active')
        }

       // This event will be fired, every time the user hovers over data-table__delete icon, the data-table__delete--active will be added.
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.add('data-table__delete--active')
        }

       // This event will be fired, every time the user hovers over data-table__warning or data-table__in-order icon, the popup will be displayed.
        if (e.target.classList.contains('data-table__warning') || e.target.classList.contains('data-table__in-order')){
            filterForm.classList.remove('filter-container__filter-form--display')
            let positionY = e.clientY - 12
            let messageCode = e.target.getAttribute('data-message-code')
            warningPopupText.innerText = warningMessages[messageCode]
            warningPopup.classList.add('popup--display')
            warningPopup.style.top = String(positionY + 'px')
        }

       // This event will be fired, every time the user hovers over data-filter-container__filter-display-button, the data-filter-container__filter-display-button--active will be removed.
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.add('filter-container__filter-display-button--active')
        }

       // This event will be fired, every time the user hovers over an input, the input-active will be added.
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-active')
        }

    })

    dataContainer.addEventListener('mouseout', (e) => {

        /* This event will be fired every time a hover occurs in the icons or a data-table__item item, this will remove many style
           properties from the row*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = ''
            row.style.color = ''
        }

       // This event will be fired, every time the user hovers out data-table__create icon, the data-table__create--active class will be removed.
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.remove('data-table__create--active')
        }

       // This event will be fired, every time the user hovers out data-table__update icon, the data-table__update--active class will be removed.
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.remove('data-table__update--active')
        }

       // This event will be fired, every time the user hovers out data-table__delete icon, the data-table__delete--active will be removed.
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.remove('data-table__delete--active')
        }


        if (e.target.classList.contains('data-table__warning') || e.target.classList.contains('data-table__in-order')){
            warningPopup.classList.remove('popup--display')
        }

       // This event will be fired, every time the user hovers over data-filter-container__filter-display-button, the data-filter-container__filter-display-button--active will be removed.
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.remove('filter-container__filter-display-button--active')
        }

       // This event will be fired, every time the user hovers out an input, the input-active will be removed.
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }

    })

    dataContainer.addEventListener('click', (e) => {

        /* This event will be fired if the target is a e.target.classList.contains('filter-container__filter-display-button') icon, and depending if the filter form contains the
           filter-container__filter-form--display class or not, will add or remove this class.*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            warningPopup.classList.remove('popup--display')
            warningPopup.style.top = ''
            filterForm.classList.contains('filter-container__filter-form--display') ? filterForm.classList.remove('filter-container__filter-form--display') : filterForm.classList.add('filter-container__filter-form--display')
        }
    })

    dataContainer.addEventListener('input', (e) => {
       const url = filterForm.action + '?query=' + e.target.value
        filterResults(url)
        .then(data => {
            tbody.innerHTML = data['html']
        })
    })

}

// Modal Event Listeners

if (modal){

    // Modal click event listeners
    modal.addEventListener('click', (e) => {

        // This event will be fired if the target is the modal, it will remove the class 'modal-show' from the modal.
        if (e.target === modal){
            modal.classList.remove('modal--display')
        }

        /* This event will be fired if the target is a button and contains the 'no' textContent or 'ok',
           it will remove the class 'modal-show' from the modal.*/
        if (e.target.value === 'no' || e.target.textContent === 'Ok'){
            e.stopPropagation()
            e.preventDefault()
            modal.classList.remove('modal--display')
        }

    })


    // Modal Mouseover Events
    modal.addEventListener('mouseover', (e) =>{

        // This event will be fired, every time the user hovers over a button, the button-form-hover class will be added.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

    })

    // Modal Mouseout Events
    modal.addEventListener('mouseout', (e) =>{

        // This event will be fired, every time the user hovers out a button, the button-form-hover class will be removed.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

    })

    // Modal Submit Events
    modal.addEventListener('submit', (e) => {

        /*This event will be fired every time the target is a form, it will collect some data from the target, as the
          action attribute value and the csrfmiddlwaretoken, it will make a request using the submitFormAW and depending
          if the form used was filter, it will insert that data inside the backedUpContent variable inside the container,
          else the new data retrieved will be added to the container.*/
        e.stopPropagation()
        e.preventDefault()
        const form = document.querySelector('#patient-delete-form')
        const csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value

        if (e.target === form){
            submitFormAW(form, csrfmiddlewaretoken)
            .then(data => {
                console.log(data)
                if (data.hasOwnProperty('patients')){
                    modalContent.innerHTML = data['html']
                    dataContainer.innerHTML = data['patients']
                    // This function is called in case there are no more instances available, the add button will be displayed and levitated
                    addIconLevitate(document.querySelector('.add-data'))
                }else{
                    modalContent.innerHTML = data['html']
                }
            })
        }

    })

}