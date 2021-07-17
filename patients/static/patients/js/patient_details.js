/* This JS File contains all the variable declarations, async  and sync functions, and event listeners needed to show a
   particular patient's details, the variable section is divided into 4 divisions: backedUpData, imgPreview, titles and
   containers, the function section is divided into two divisions, sync functions and async functions, it contains a total
   of 5 functions, 4 of them sync and one left async.*/

// ##################################################### Variables #####################################################


// Containers
let navigation = document.querySelector('.navigation')
let container = document.querySelector('.details-container')
let appointments = document.querySelector('.appointments')
let exams = document.querySelector('.exams')
let charges = document.querySelector('.charges')
let title = document.querySelector('#patient-name')

let examPreview = document.querySelector('.exam-preview')
let examImage = document.querySelector('.exam-preview__image')

// Modal
let modal = document.querySelector('.modal')
let modalContent = document.querySelector('.modal__content')

// Title
let titleOriginalContent = title.innerText

// ##################################################### Functions #####################################################

/* This functions will be used to perform the smooth automatic scrolling every time we click on a navigation tab*/
// Sync Functions
function generalScroll(){
    /*This function will scroll the window object left to 0 in a smooth behavior.*/
    window.scrollTo({
        left: 0,
        behavior: 'smooth'
    })
}

function appointmentsScroll(){
    /*This function will scroll the window object left the width of the window screen * 2 in a smooth behavior.*/
    window.scrollTo({
        left: window.screen.availWidth,
        behavior: 'smooth'
    })
}

function examsScroll(){
    /*This function will scroll the window object left the width of the window screen * 3 in a smooth behavior.*/
    window.scrollTo({
        left: window.screen.availWidth * 2,
        behavior: 'smooth'
    })
}

function chargesScroll(){
    /*This function will scroll the window object left the width of the window screen * 4 in a smooth behavior.*/
    window.scrollTo({
        left: window.screen.availWidth * 3,
        behavior: 'smooth'
    })
}

function vaccinesAndSurgeriesScroll(){
    /*This function will scroll the window object left the width of the window screen * 5 in a smooth behavior.*/
    window.scrollTo({
        left: window.screen.availWidth * 4,
        behavior: 'smooth'
    })
}

function defineQuerystring(classList){
    let dayFrom
    let monthFrom
    let yearFrom
    let dayTo
    let monthTo
    let yearTo
    let filterRequestType
    switch (classList[1]){
        case 'appointments-form':
            dayFrom = document.querySelector('.appointments-form #id_date_from_day').value
            monthFrom = document.querySelector('.appointments-form #id_date_from_month').value
            yearFrom = document.querySelector('.appointments-form #id_date_from_year').value
            dayTo = document.querySelector('.appointments-form #id_date_to_day').value
            monthTo = document.querySelector('.appointments-form #id_date_to_month').value
            yearTo = document.querySelector('.appointments-form #id_date_to_year').value
            filterRequestType = 'appointments'
            break
        case 'exams-form':
            dayFrom = document.querySelector('.exams-form #id_date_from_day').value
            monthFrom = document.querySelector('.exams-form #id_date_from_month').value
            yearFrom = document.querySelector('.exams-form #id_date_from_year').value
            dayTo = document.querySelector('.exams-form #id_date_to_day').value
            monthTo = document.querySelector('.exams-form #id_date_to_month').value
            yearTo = document.querySelector('.exams-form #id_date_to_year').value
            filterRequestType = 'exams'
            break
        case 'charges-form':
            dayFrom = document.querySelector('.charges-form #id_date_from_day').value
            monthFrom = document.querySelector('.charges-form #id_date_from_month').value
            yearFrom = document.querySelector('.charges-form #id_date_from_year').value
            dayTo = document.querySelector('.charges-form #id_date_to_day').value
            monthTo = document.querySelector('.charges-form #id_date_to_month').value
            yearTo = document.querySelector('.charges-form #id_date_to_year').value
            filterRequestType = 'charges'
            break
        case 'vaccines-form':
            dayFrom = document.querySelector('.vaccines-form #id_date_from_day').value
            monthFrom = document.querySelector('.vaccines-form #id_date_from_month').value
            yearFrom = document.querySelector('.vaccines-form #id_date_from_year').value
            dayTo = document.querySelector('.vaccines-form #id_date_to_day').value
            monthTo = document.querySelector('.vaccines-form #id_date_to_month').value
            yearTo = document.querySelector('.vaccines-form #id_date_to_year').value
            filterRequestType = 'vaccines'
            break
        case 'surgeries-form':
            dayFrom = document.querySelector('.surgeries-form #id_date_from_day').value
            monthFrom = document.querySelector('.surgeries-form #id_date_from_month').value
            yearFrom = document.querySelector('.surgeries-form #id_date_from_year').value
            dayTo = document.querySelector('.surgeries-form #id_date_to_day').value
            monthTo = document.querySelector('.surgeries-form #id_date_to_month').value
            yearTo = document.querySelector('.surgeries-form #id_date_to_year').value
            filterRequestType = 'surgeries'
            break
    }

    let dateFrom = yearFrom + '-' + monthFrom + '-' + dayFrom
    let dateTo = yearTo + '-' + monthTo + '-' + dayTo
    return queryString = '?date_from=' +  dateFrom + '&date_to=' + dateTo + '&filter_request_type=' + filterRequestType
}

// Async Functions
async function filterResultsAW(url){
    /* This function will be used to perform the filtering functionality for every data related to the specific patient,
       it requites 4 parameters we will grab to make the POST request successfully: 'url', required to make the POST
       request to this address, 'method' is the method used for the request, 'csrfmiddlewaretoken' we grab from the form
       hidden input and lastly the 'formData', we create a new FormData object using the information in the inputs of the
       form, we send this information and the response we return it in JSON Format.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function requestFormAW(url){
    /* This async function will be used to display creation and update forms, based on the url requested. This information
        will be displayed dynamically, since it will be received in JSON Format. */
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function sendEmailFormAW(url){
    /*This function is used to display the send email form
      in our page, it takes one parameter, the 'url' for the "GET"
      request. This function will return it's result in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function sendEmailAW(url, method, csrfmiddlewaretoken, formData){
    /*Function used to send emails to any providers, this functions takes
      three parameters, the 'url' for the "POST" request, the 'method' which
      we collect from the form's method attribute, the 'csrfmiddlewaretoken'
      parameter, which receives the value from the csrfmiddlewaretoken attribute
      in every form's hidden input. This function will return the
      result in JSON Format.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function addVaccineTypeAW(url, method, csrfmiddlewaretoken, formData){
    /*Function used to add vaccines this functions takes three parameters, the 'url' for the "POST" request, the 'method' which
      we collect from the form's method attribute, the 'csrfmiddlewaretoken' parameter, which receives the value from the csrfmiddlewaretoken attribute
      in every form's hidden input. This function will return the result in JSON Format.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}


async function addUpdateDeleteRecordAW(url, method, csrfmiddlewaretoken, formData){
    /*Function used to add appointments, vaccines or surgeries related to the current patient, this functions takes
      three parameters, the 'url' for the "POST" request, the 'method' which
      we collect from the form's method attribute, the 'csrfmiddlewaretoken'
      parameter, which receives the value from the csrfmiddlewaretoken attribute
      in every form's hidden input. This function will return the
      result in JSON Format.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function displayDetailsAW(url){
    /* This function will be used to display details about a specific element, either a surgery or a vaccine,
       it requites 4 parameters we will grab to make the POST request successfully: 'url', required to make the POST
       request to this address, 'method' is the method used for the request, 'csrfmiddlewaretoken' we grab from the form
       hidden input and lastly the 'formData', we create a new FormData object using the information in the inputs of the
       form, we send this information and the response we return it in JSON Format.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}


// ##################################################### Event Listeners ###############################################

if (navigation){

    navigation.addEventListener('mouseover', (e) => {
        /* This event will be fired every time a mouseout occurs off a target and the target or parentNode contains the
           info-tab class, and the tab-hover class will be removed*/
          if (e.target.classList.contains('navigation__tab') || e.target.parentNode.classList.contains('navigation__tab')){
                let tab = e.target.classList.contains('navigation__tab') ? e.target : e.target.parentNode
                tab.classList.add('navigation__tab--hover')
            }
    })

    navigation.addEventListener('mouseout', (e) => {
        /* This event will be fired every time a mouseout occurs off a target and the target or parentNode contains the
           info-tab class, and the tab-hover class will be removed*/
          if (e.target.classList.contains('navigation__tab') || e.target.parentNode.classList.contains('navigation__tab')){
                let tab = e.target.classList.contains('navigation__tab') ? e.target : e.target.parentNode
                tab.classList.remove('navigation__tab--hover')
            }
    })

    navigation.addEventListener('click', (e) => {

        /* This event will be fired every time a click occurs over the target and the target or parentNode contains the
       info-tab class, and will add the tab-hover class, the function will grab the tab clicked, and all the exiting
       tabs, will remove the tab-active class from all the tabs and finally add it to the tab clicked, afterwards, it
       will read the tab clicked innerText and depending of this value will set the title.innerText to the tab's inner text,
       call the corresponding sync function for the scrolling functionality.*/
        if (e.target.classList.contains('navigation__tab') || e.target.parentNode.classList.contains('navigation__tab')){
            let tab = e.target.classList.contains('navigation__tab') ? e.target : e.target.parentNode
            let tabs = document.querySelectorAll('.navigation__tab')
            for (let i = 0; i<tabs.length; i++){
                tabs[i].classList.remove('navigation__tab--active')
            }
            tab.classList.add('navigation__tab--active')

            if (tab.innerText === 'General'){
                generalScroll()
                title.innerText = titleOriginalContent
            }else if (tab.innerText === 'Appointments'){
                appointmentsScroll()
                title.innerText = tab.innerText
            }else if (tab.innerText === 'Exams'){
                examsScroll()
                title.innerText = tab.innerText
            }else if (tab.innerText === 'Charges'){
                chargesScroll()
                title.innerText = tab.innerText
            }else{
                vaccinesAndSurgeriesScroll()
                title.innerText = tab.innerText
            }
        }
    })

}

// Container Event Listeners

if (container){

    // Container Mouseover events
    container.addEventListener('mouseover', (e) => {

        // This event will be fired, every time the user hovers over a 'fa-plus', the fa-plus-hover class will be added.
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.add('data-table__create--active')
        }

        // This event will be fired, every time the user hovers over a 'fa-edit', the fa-edit-hover class will be added.
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.add('data-table__update--active')
        }

        // This event will be fired, every time the user hovers over a 'fa-trash', the fa-trash-hover class will be added.
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.add('data-table__delete--active')
        }

        /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
           properties from the row and add tr-hover and td-hover class*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /*This event will be fired every time a hover occurs over the fa-calendar-check icon and the fa-calendar-check--active class will be added*/
        if (e.target.classList.contains('fa-calendar-check')){
            e.target.classList.add('fa-calendar-check--active')
        }

        /*This event will be fired every time a hover occurs over the fa-envelope icon and the fa-envelope--active class will be added*/
        if (e.target.classList.contains('fa-envelope')){
            e.target.classList.add('fa-envelope--active')
        }

        /*This event will be fired every time a hover occurs over the fa-filter icon and the fa-filter-hover class will be added*/
        if (e.target.classList.contains('fa-filter')){
            e.target.classList.add('filter-container__filter-display-button--active')
        }

        /* This event will be fired every time the target contains the exam-filename class in it's classlist, it will add
           the previewImg element the image-preview-show class to make visible the container where the image will be
           displayed, and we will remove the form if it's shown. Also we will set the src attribute to the data-img-src
           attribute of the target*/
        if (e.target.classList.contains('exam-filename')){
            examPreview.classList.add('exam-preview--display')
            examImage.src = e.target.getAttribute('data-img-src')
            document.querySelector('.exams-form').classList.remove('filter-container__filter-form--display')
        }

        /*This event will be fired every time a hover occurs over a button and the button-form--hover class will be added*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

    })

    // Contaienr Mouseout Events
    container.addEventListener('mouseout', (e) => {


        // This event will be fired, every time the user hovers over a 'fa-plus', the fa-plus-hover class will be removed.
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.remove('data-table__create--active')
        }

        // This event will be fired, every time the user hovers over a 'fa-edit', the fa-edit-hover class will be removed.
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.remove('data-table__update--active')
        }

        // This event will be fired, every time the user hovers over a 'fa-trash', the fa-trash-hover class will be removed.
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.remove('data-table__delete--active')
        }

      /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
         properties from the row and removed tr-hover and td-hover class*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = ''
            row.style.color = ''
        }

        /*This event will be fired every time a mouseout occurs off the fa-calendar-check icon and the fa-calendar-check--active class will be removed*/
        if (e.target.classList.contains('fa-calendar-check')){
            e.target.classList.remove('fa-calendar-check--active')
        }

        /*This event will be fired every time a mouseout occurs off the fa-envelope icon and the fa-envelope--active class will be removed*/
        if (e.target.classList.contains('fa-envelope')){
            e.target.classList.remove('fa-envelope--active')
        }

        /*This event will be fired every time a mouseout occurs off the fa-filter icon and the fa-filter-hover class will be removed*/
        if (e.target.classList.contains('fa-filter')){
            e.target.classList.remove('filter-container__filter-display-button--active')
        }

        /* This event will be fired every time the target contains the exam-filename class in it's classlist and the
           previewImg element will be hidden by removing the image-preview-show class, also the src attribute from the
           image will be removed.*/
        if (e.target.classList.contains('exam-filename')){
            examPreview.classList.remove('image-preview--display')
            examImage.src = ''
        }

        /*This event will be fired every time a mouseout occurs off a button and the button-hover class will be removed*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

    })

    // Container Click Events
    container.addEventListener('click', (e) => {

        /* This event will be fired every time the target contains the 'fa-plus' class, this will display the modal and the
           content that it's been requested.*/
        if (e.target.classList.contains('data-table__create') ||
            e.target.classList.contains('data-table__update') ||
            e.target.classList.contains('data-table__delete')){
            let url = e.target.getAttribute('data-url')
            requestFormAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        /* These event listeners are used to show and hide the filtering form, as well as creating a backup of the data that
           is present in the container at the time the form is showed, to every time we reload the results, the backedUpData
           will be displayed.*/
        if (e.target.classList.contains('filter-container__display-filter-button')){
            let form = e.target.parentNode.children[1]
            form.classList.contains('filter-container__filter-form--display') ? form.classList.remove('filter-container__filter-form--display') : form.classList.add('filter-container__filter-form--display')
        }

        /* This event will be fired every time a vaccine row is clicked, this will display vaccine details */
        if (e.target.parentNode.classList.contains('vaccine-details')){
            let url = e.target.parentNode.getAttribute('data-url')
            displayDetailsAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        // If the target contains the 'fa-calendar-check' class, the modal will be displayed along with the appointment creation form.

        if (e.target.classList.contains('fa-calendar-check')){
            let url = e.target.getAttribute('data-url')
            requestFormAW(url).
            then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        // If the target contains the 'fa-envelope' class, the modal will be displayed along with the email form.

        if (e.target.classList.contains('fa-envelope')){
            let url = e.target.getAttribute('data-url')
            sendEmailFormAW(url).
            then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

    })

    // Container Submit event Listeners

    /* All these event listeners will be fired every time a filtering is done to request data from the BackEnd through a query,
       depending on the class the target contains a specific data will be retrieved. This function will collect some data from
       the target as the 'url' which we will retrieve from the action attribute in the target, the 'method' we retrieve from the
       method attribute from the target, the 'type' of data we will retrieve, the 'csrfmiddlewaretoken', data that we collect
       from the hidden input in our form, and lastly our data, we create a new FormData obj with the content inside our form,
       we also set the wrapper variable to the actual container active, and the data received from the backend will be set to
       the container active.*/

    container.addEventListener('submit', (e) => {
            e.preventDefault()
            e.stopPropagation()
            let queryString = defineQuerystring(e.target.classList)
            tableData = e.target.parentNode.parentNode.querySelector('tbody')
            const url = e.target.action + queryString
            filterResultsAW(url)
            .then(data => {
                tableData.innerHTML = data['html']
            })
    })
}

// Modal Event Listeners

if (modal){

    // Modal mouseover Events
    modal.addEventListener('mouseover', (e) => {

        /*This event will be fired every time a hover occurs over a #add-new-vaccine icon and the data-table__create--active class will be added*/
        if (e.target.id === 'add-new-vaccine'){
            e.target.classList.add('data-table__create--active')
        }

        /*This event will be fired every time a hover occurs over a button and the button-form--hover class will be added*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

    })


    // Modal mouseout Events
    modal.addEventListener('mouseout', (e) => {

        /*This event will be fired every time a hover occurs over a #add-new-vaccine icon and the data-table__create--active class will be remove*/
        if (e.target.id === 'add-new-vaccine'){
            e.target.classList.remove('data-table__create--active')
        }

        /*This event will be fired every time a hover occurs over a button and the button-form--hover class will be removed*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

    })

    // Click Events

    modal.addEventListener('click', (e) => {

        // If the target is the modal or it contains the "Continue" word, the modal will be hidden.

        if (e.target === modal || e.target.textContent === 'Continue' || e.target.textContent === 'Cancel'){
            modalContent.innerHTML = ''
            modal.classList.remove('modal--display')
        }


        /* This event will be fired every time the target contains the 'fa-plus' and it's inside a modal, this will display
           a formed based on the url collected.
        */

        if (e.target.id == 'add-new-vaccine'){
            let url = e.target.getAttribute('data-url')
            requestFormAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
            })
        }

    })

    // Submit Events

    modal.addEventListener('submit', (e) => {

        e.stopPropagation()
        e.preventDefault()
        let form = e.target
        let url = form.action
        let method = form.method
        let csrfmiddlewaretoken = document.querySelector('.modal [name=csrfmiddlewaretoken]').value
        let formData = new FormData(form)

        /* This event will be fired every time the target's id is 'appointment-create-form' it is used to create appointments */
        if (e.target.id = 'appointment-create-form'){
            addUpdateDeleteRecordAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                appointments.innerHTML = data['html']
                modal.classList.remove('modal--display')
                modalContent.innerHTML = ''
            })
        }

        /* This event will be fired every time the target's id is 'add-vaccine-operation' it is used to create vaccines */
        if (e.target.id === 'add-new-vaccine-form'){
            let primary_key = e.target.getAttribute('data-primary-key')
            addVaccineTypeAW(url  + '/' + primary_key, method, csrfmiddlewaretoken, formData)
            .then(data => {
                modalContent.innerHTML = data['html']
            })
        }

        /* This event will be fired every time the target's id is 'add-vaccine-record' it is used to create vaccine records */
        if (e.target.id === 'add-vaccine-record-form' ||
            e.target.id === 'update-vaccine-record-form' ||
            e.target.id === 'delete-vaccine-record-form'){
            addUpdateDeleteRecordAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                document.querySelector('#vaccine-records').innerHTML = data['html']
                modal.classList.remove('modal--display')
                modalContent.innerHTML = ''
            })
        }

        /* This event will be fired every time the target's id is 'email-form' it is used to send emails */
        if (e.target.id === 'email-form'){
            sendEmailAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                modalContent.innerHTML = data['html']
            })
        }

    })

}


/* This event listener will be fired every time the page is loaded and will set the window scroll 0 to the left. */
window.addEventListener('load', (e) => {
    generalScroll()
})