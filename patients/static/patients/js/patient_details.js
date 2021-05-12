/* This JS File contains all the variable declarations, async  and sync functions, and event listeners needed to show a
   particular patient's details, the variable section is divided into 4 divisions: backedUpData, imgPreview, titles and
   containers, the function section is divided into two divisions, sync functions and async functions, it contains a total
   of 5 functions, 4 of them sync and one left async.*/

// ##################################################### Variables #####################################################

let body = document.querySelector('body')

// Containers
let generalInfo = document.querySelector('.general-info')
let extras = document.querySelector('.extras')
let appointments = document.querySelector('.appointments')
let exams = document.querySelector('.exams')
let charges = document.querySelector('.charges')
let title = document.querySelector('#patient-name')

// Image Preview
let previewImg = document.querySelector('.image-preview')
let image = document.querySelector('.previewed-image')

// Modal
let modal = document.querySelector('.modal')
let modalContent = document.querySelector('.modal-content')

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
    switch (classList[0]){
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


async function requestPageAW(url){
    /* This async function will be used to collect the data from the previous or next page, this content will be
    received as a promise, so we need to return it in JSON format so we can process it, this content will be set to
    the tbody dynamically.*/
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

// ##################################################### Event Listeners ###############################################

// Body Event Listeners
// Body Mouseover events
body.addEventListener('mouseover', (e) => {

    // This event will be fired, every time the user hovers over a 'fa-angle-right' or 'fa-angle-left', the fa-angle-hover class will be added.
    if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
        e.target.classList.add('fa-angle-hover')
    }

    // This event will be fired, every time the user hovers over a 'fa-plus', the fa-plus-hover class will be added.
    if (e.target.classList.contains('fa-plus')){
        e.target.classList.add('fa-plus-hover')
    }

    // This event will be fired, every time the user hovers over a 'fa-edit', the fa-edit-hover class will be added.
    if (e.target.classList.contains('fa-edit')){
        e.target.classList.add('fa-edit-hover')
    }

    /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
       properties from the row and add tr-hover and td-hover class*/
    if (e.target.nodeName === 'TD'){
        let row
        e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
        row.style.backgroundColor = '#FFFFFF'
        row.style.color = '#000000'
    }

    /* This event will be fired every time a hover occurs over the target and the target or parentNode contains the
       info-tab class, and will add the tab-hover class*/
    if (e.target.classList.contains('info-tab') || e.target.parentNode.classList.contains('info-tab')){
        let tab = e.target.classList.contains('info-tab') ? e.target : e.target.parentNode
        tab.classList.add('tab-hover')
    }

    /*This event will be fired every time a hover occurs over the fa-envelope icon and the fa-envelope-hover class will be added*/
    if (e.target.classList.contains('fa-envelope')){
        e.target.classList.add('fa-envelope-hover')
    }


    /*This event will be fired every time a hover occurs over the fa-filter icon and the fa-filter-hover class will be added*/
    if (e.target.classList.contains('fa-filter')){
        e.target.classList.add('fa-filter-hover')
    }

    /*This event will be fired every time a hover occurs over the fa-sync-alt icon and the fa-sync-alt-hover class will be added*/
    if (e.target.classList.contains('fa-sync-alt')){
        e.target.classList.add('fa-sync-alt-hover')
    }

    /*This event will be fired every time a hover occurs over a button and the button-form--hover class will be added*/
    if (e.target.nodeName === 'BUTTON'){
        const button = e.target
        button.classList.add('button-form-hover')
    }

})

// Body Mouseout Events
body.addEventListener('mouseout', (e) => {

    // This event will be fired, every time the user hover out occurs on a 'fa-angle-right' or 'fa-angle-left', the fa-angle-hover class will be removed.
    if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
        e.target.classList.remove('fa-angle-hover')
    }

    // This event will be fired, every time the user hovers over a 'fa-plus', the fa-plus-hover class will be removed.
    if (e.target.classList.contains('fa-plus')){
        e.target.classList.remove('fa-plus-hover')
    }

    // This event will be fired, every time the user hovers over a 'fa-edit', the fa-edit-hover class will be removed.
    if (e.target.classList.contains('fa-edit')){
        e.target.classList.remove('fa-edit-hover')
    }

  /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
     properties from the row and removed tr-hover and td-hover class*/
      if (e.target.nodeName === 'TD' || ((e.target.classList.contains('fa-trash') || e.target.classList.contains('fa-edit')))){
        let row
        e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = ''
            row.style.color = ''
      }

/* This event will be fired every time a mouseout occurs off a target and the target or parentNode contains the
   info-tab class, and the tab-hover class will be removed*/
  if (e.target.classList.contains('info-tab') || e.target.parentNode.classList.contains('info-tab')){
        let tab = e.target.classList.contains('info-tab') ? e.target : e.target.parentNode
        tab.classList.remove('tab-hover')
    }

    /*This event will be fired every time a mouseout occurs off the fa-envelope icon and the fa-envelope-hover class will be removed*/
    if (e.target.classList.contains('fa-envelope')){
        e.target.classList.remove('fa-envelope-hover')
    }

    /*This event will be fired every time a mouseout occurs off the fa-filter icon and the fa-filter-hover class will be removed*/
    if (e.target.classList.contains('fa-filter')){
        e.target.classList.remove('fa-filter-hover')
    }

    /*This event will be fired every time a mouseout occurs off a fa-sync-alt icon and the fa-sync-alt-hover class will be removed*/
    if (e.target.classList.contains('fa-sync-alt')){
        e.target.classList.remove('fa-sync-alt-hover')
    }

    /*This event will be fired every time a mouseout occurs off a button and the button-hover class will be removed*/
    if (e.target.nodeName === 'BUTTON'){
        const button = e.target
        button.classList.remove('button-form-hover')
    }

})

body.addEventListener('click', (e) => {

    /* This event will be fired every time an angle icon is clicked, this event will grab the url for the
       GET request, then the response will be added to the dataTable, as well as the paginator will be deleted
       to get the current one.*/
    if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
        let requestedDetails
        let paginator
        let tableData
        let url
        switch (e.target.parentNode.parentNode.id){
            case 'consults-paginator':
                requestedDetails = 'consults'
                paginator = document.querySelector('#consults-paginator')
                tableData = document.querySelector('.appointments tbody')
                break
            case 'exams-paginator':
                requestedDetails = 'exams'
                paginator = document.querySelector('#exams-paginator')
                tableData = document.querySelector('.exams tbody')
                break
            case 'charges-paginator':
                requestedDetails = 'charges'
                paginator = document.querySelector('#charges-paginator')
                tableData = document.querySelector('.charges tbody')
                break
        }

        if (e.target.getAttribute('data-url').includes('requested_details')){
            url = e.target.getAttribute('data-url')
        }else{
            url = e.target.getAttribute('data-url') + '&requested_details=' + requestedDetails
        }

        requestPageAW(url)
        .then(data => {
            if (data['html']){
                paginator && paginator.remove()
                tableData.innerHTML = data['html']
            }
        })
    }

    /* This event will be fired every time a click occurs over the target and the target or parentNode contains the
       info-tab class, and will add the tab-hover class, the function will grab the tab clicked, and all the exiting
       tabs, will remove the tab-active class from all the tabs and finally add it to the tab clicked, afterwards, it
       will read the tab clicked innerText and depending of this value will set the title.innerText to the tab's inner text,
       call the corresponding sync function for the scrolling functionality.*/
    if (e.target.classList.contains('info-tab') || e.target.parentNode.classList.contains('info-tab')){
        let tab = e.target.classList.contains('info-tab') ? e.target : e.target.parentNode
        let tabs = document.querySelectorAll('.info-tab')
        for (let i = 0; i<tabs.length; i++){
            tabs[i].classList.remove('tab-active')
        }
        tab.classList.add('tab-active')

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

    /* These event listeners are used to show and hide the filtering form, as well as creating a backup of the data that
       is present in the container at the time the form is showed, to every time we reload the results, the backedUpData
       will be displayed.*/
    if (e.target.classList.contains('fa-filter') && e.target.classList.contains('appointments-filter')){

        let form = document.querySelector('.appointments-form')
        form.classList.contains('show-form') ? form.classList.remove('show-form') : form.classList.add('show-form')
        appointmentsBackUp = document.querySelector('.appointments').innerHTML

    } else if (e.target.classList.contains('fa-filter') && e.target.classList.contains('exams-filter')){

        let form = document.querySelector('.exams-form')
        form.classList.contains('show-form') ? form.classList.remove('show-form') : form.classList.add('show-form')
        examsBackUp = document.querySelector('.exams').innerHTML

    } else if (e.target.classList.contains('fa-filter') && e.target.classList.contains('charges-filter')){

        let form = document.querySelector('.charges-form')
        form.classList.contains('show-form') ? form.classList.remove('show-form') : form.classList.add('show-form')
        chargesBackUp = document.querySelector('.charges').innerHTML

    }else if (e.target.classList.contains('fa-filter') && e.target.classList.contains('vaccines-filter')){

        let form = document.querySelector('.vaccines-form')
        form.classList.contains('show-form') ? form.classList.remove('show-form') : form.classList.add('show-form')
        vaccinesBackUp = document.querySelector('.vaccines').innerHTML

    }else if (e.target.classList.contains('fa-filter') && e.target.classList.contains('surgeries-filter')){

        let form = document.querySelector('.surgeries-form')
        form.classList.contains('show-form') ? form.classList.remove('show-form') : form.classList.add('show-form')
        surgeriesBackup = document.querySelector('.surgeries').innerHTML

    }

    if (e.target.classList.contains('fa-envelope')){
        let url = e.target.getAttribute('data-url')
        sendEmailFormAW(url).
        then(data => {
            modalContent.innerHTML = data['html']
            modal.classList.add('modal-show')
        })
    }

})

// Body Submit event Listeners

/* All these event listeners will be fired every time a filtering is done to request data from the BackEnd through a query,
   depending on the class the target contains a specific data will be retrieved. This function will collect some data from
   the target as the 'url' which we will retrieve from the action attribute in the target, the 'method' we retrieve from the
   method attribute from the target, the 'type' of data we will retrieve, the 'csrfmiddlewaretoken', data that we collect
   from the hidden input in our form, and lastly our data, we create a new FormData obj with the content inside our form,
   we also set the wrapper variable to the actual container active, and the data received from the backend will be set to
   the container active.*/

body.addEventListener('submit', (e) => {
        e.preventDefault()
        e.stopPropagation()
        let tableData
        let queryString = defineQuerystring(e.target.classList)
    if (e.target.classList.contains('appointments-form')){
        tableData = document.querySelector('.appointments tbody')
        const url = e.target.action + queryString
        filterResultsAW(url)
        .then(data => {
            tableData.innerHTML = data['html']
        })
    } else if (e.target.classList.contains('exams-form')){
        tableData = document.querySelector('.exams tbody')
        const url = e.target.action + queryString
        filterResultsAW(url)
        .then(data => {
            tableData.innerHTML = data['html']
        })
    } else if (e.target.classList.contains('charges-form')){
        tableData = document.querySelector('.charges tbody')
        const url = e.target.action + queryString
        filterResultsAW(url)
        .then(data => {
            tableData.innerHTML = data['html']
        })
    }else if (e.target.classList.contains('vaccines-form')){
        tableData = document.querySelector('.vaccines tbody')
        const url = e.target.action + queryString
        filterResultsAW(url)
        .then(data => {
            tableData.innerHTML = data['html']
        })
    }else{
        tableData = document.querySelector('.surgeries tbody')
        const url = e.target.action + queryString
        filterResultsAW(url)
        .then(data => {
            tableData.innerHTML = data['html']
        })
    }
})

// Exams Event Listeners
if (exams){

    // Exams Mouseouver events

    exams.addEventListener('mouseover', (e) => {

        /* This event will be fired every time the target contains the exam-filename class in it's classlist, it will add
           the previewImg element the image-preview-show class to make visible the container where the image will be
           displayed, and we will remove the form if it's shown. Also we will set the src attribute to the data-img-src
           attribute of the target*/

        if (e.target.classList.contains('exam-filename')){
            previewImg.classList.add('image-preview-show')
            image.src = e.target.getAttribute('data-img-src')
            document.querySelector('.exams-form').classList.remove('show-form')
        }
    })

    // Exams mouseout events

    exams.addEventListener('mouseout', (e) => {

        /* This event will be fired every time the target contains the exam-filename class in it's classlist and the
           previewImg element will be hidden by removing the image-preview-show class, also the src attribute from the
           image will be removed.*/

        if (e.target.classList.contains('exam-filename')){
            previewImg.classList.remove('image-preview-show')
            image.src = ''
        }
    })
}


// Modal Event Listeners

if (modal){

    modal.addEventListener('click', (e) => {

        if (e.target === modal || e.target.textContent === 'Continue'){
            modal.classList.remove('modal-show')
        }

    })


    modal.addEventListener('submit', (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (e.target.nodeName === 'FORM'){
            let form = e.target
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('.modal [name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
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