/* This update_consult.js file contains all the variables definitions, async and sync functions, assignments,
as well as event listeners need for the Consult Update View to work properly in the Appointments App, this file is
composed of 5 async functions, and 1 sync function.*/

/*#################################################### Variables #####################################################*/

// General

var form = document.querySelector('form')
var formInputs = document.querySelectorAll('input:not([type=checkbox]):not([type=hidden]):not([type=file]):not(#id_name), textarea')
var button = document.querySelectorAll('button')
var navigation = document.querySelector('.navigation')
var prevSlide = document.querySelector('.fa-angle-left')
var nextSlide = document.querySelector('.fa-angle-right')
var controllers = [prevSlide, nextSlide]
// Consult Information

var generalInfo = document.querySelector('.general-info')
var patientInfo = document.querySelector('#patient-info')
var patientInfoPopUp = document.querySelector('.patient-info-popup')
var exams = document.querySelector('.fa-file-medical-alt')
var medicalBook = document.querySelector('.fa-book-medical')
var padlock = document.querySelector('.fa-lock')
var lock = document.querySelector('.lock')
var lockInput = document.querySelector('#id_lock')
var lockPopUp = document.querySelector('.popup')

// Diagnose

var diagnose = document.querySelector('.diagnose')
var indications = document.querySelector('#id_indications')
var actions = document.querySelector('#id_actions')

// Exams

var examsModal = document.querySelector('.exams-modal')
var examsData = document.querySelector('.exams-data')
var previewImg = document.querySelector('.preview-image')
var image = document.querySelector('.previewed-image')
var addForm = document.querySelector('.add-form')
var remExam = document.querySelector('.fa-trash')

// Drugs

var drugCategoryFilter = document.querySelector('#id_category')
var drugList = document.querySelector('#drugs')
var addDrug = document.querySelector('.add-drug')
var addDrugModal = document.querySelector('.add-drug-modal')
var addDrugModalContent = document.querySelector('.add-drug-modal-content')
var addDrugForm = document.querySelector('.add-drug-modal-content form')
var checkedDrugs = []

// Medical Tests

var addTest = document.querySelector('.add-test')
var addTestModal = document.querySelector('.add-test-modal')
var testing = document.querySelector('#id_testing')
var MedicalTestTypeFilter = document.querySelector('#id_test_type')
var addTestForm = document.querySelector('.add-test-modal-content form')
var checkedTests = []

// Modals

var modal = document.querySelector('.modal')
var recordsModal = document.querySelector('.records-modal')
var recordsTable = document.querySelector('.records-table')
var recordsSummary = document.querySelector('.records-general-information')
var prescriptionModal = document.querySelector('.prescription-modal')
var prescriptionModalContent = document.querySelector('.prescription-modal-content')

// Navigator
navigation.innerHTML = '<li></li>'.repeat(document.querySelectorAll('.diagnose > div').length)
navigation.childNodes[0].classList.add('navigator-active')

/*#################################################### Functions #####################################################*/

// Async Functions

async function addDrugAsync(url, method, formData, csrfmiddlewaretoken){
    /*This addDrugAsync function is used to drugs asynchronously to the server, this function takes 4 paramaters we collect
    from the form that fires the submit event, we need to collect the 'url' to where we make our POST request, we also
    need to collect 'method' from the form.method attribute and 'csrfmiddlewaretoken' from the form's hidden input, finally
    we collect the formData from the form and send it in our request, the response will be converted to JSON Format and
    returned for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken':csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

async function retrieveDrugsFilterAsync(url){
    /* This retrieveDrugsFilterAsync function is used to filter the drugs options in the drugs select element, this
    function only takes one argument, the url containing the parameters for the GET request, the response will be
    converted into JSON Format and finally, displayed in the select box. It takes a single argument, the 'url' to make
    the GET request.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function addTestAsync(url, method, formData, csrfmiddlewaretoken){
    /*This addTestAsync function is used to drugs asynchronously to the server, this function takes 4 paramaters we collect
    from the form that fires the submit event, we need to collect the 'url' to where we make our POST request, we also
    need to collect 'method' from the form.method attribute and 'csrfmiddlewaretoken' from the form's hidden input, finally
    we collect the formData from the form and send it in our request, the response will be converted to JSON Format and
    returned for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken':csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

async function retrieveMedicalTestsFilterAsync(url){
    /* This retrieveMedicalTestsFilterAsync function is used to filter the medical tests options in the testing select element, this
    function only takes one argument, the url containing the parameters for the GET request, the response will be
    converted into JSON Format and finally, displayed in the select box. It takes a single argument, the 'url' to make
    the GET request.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function requestRecords(url){
    /* This requestRecords function is used to display the records filled of this current patient, this data will be
     displayed in the records modal as a table, the response will be converted into JSON Format and finally, displayed
     in the modal. It takes a single argument, the 'url' to make the GET request.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function consultSummaryAW(url){
    /* This consultSummaryAW function is used to display a summary of the most important things from a consult in the
        consult summary section, This function only takes one single argument, the 'url' with the primary key of that
        consult.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function submitConsultAW(url, method, csrfmiddlewaretoken, formData){
    /* This submitConsultAW function is used to submit the consult to the server, once the consult has been sent to the
    server, if the response contains a prescription, then the prescription modal will be displayed containing the prescription
    in PDF Format, if not, the user will be redirected to the consults main page, (This is not part of the async func
    functionality but it makes part of this process), The function takes 4 arguments, the 'url' to make the POST request,
    the 'method' which we collect from the form.method attribute, the 'csrfmiddlewaretoken' we collect from the forms hidden
    input and finally the formData we collect from the form and create a new FormData object, the response is converted into
    JSON Format for future use.*/
    const result = await fetch(url, {method: method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body: formData})
    const data = result.json()
    return data
}

// Functions

function diagnoseScroll(elScrollLeft, elScrollWidth, distance, element, eTarget, navigation){

    /* The diagnoseScroll function is used to scroll the diagnose section and activating a navigator dot based on the
       scroll distance of that element. This function takes 6 arguments, 'elScrollLeft' which is the distance that
       exists from the left which is 0 to the current position scrolled of that element, 'elScrollWidth' expects
       the whole width of that element, in this case the '.diagnose' element, 'distance' is the distance that the element
       will be scrolled, 'element' is the element that will be scrolled, in all the cases of this file, it will be the
       '.diagnose' element, 'eTarget' is the controller that was clicked either a 'fa-angle-left' or 'fa-angle-right'
       element, and based on the element clicked is the direction in which the section will be scrolled, 'navigation'
       is the set of navigator dots in the navigator section. Now with all this data, the function will decide where to
       scroll based on the arrow that was clicked, making use of the scrollTo function.*/

    let activeElement = Math.round((elScrollLeft / distance))

    if (eTarget.classList.contains('fa-angle-left') && elScrollLeft !== 0){
        element.scrollTo({
            left: elScrollLeft - distance,
            behavior: 'smooth'
        })
    }

    if (eTarget.classList.contains('fa-angle-right') && elScrollLeft !== elScrollWidth){
        element.scrollTo({
            left: elScrollLeft + distance,
            behavior: 'smooth'
        })
    }
}

/*#################################################### Assignments ###################################################*/


// Asignments

// This assignment is made to ensure that every time a consult is opened, it is locked, no matter if it was left opened in the last opening.

lockInput.value = 'True'


/*#################################################### Event Listeners ###############################################*/


/*####################################################  General ######################################################*/

// Patient Info PopUp
if (patientInfo){

    /* This event will be fired every time a hover occurs over the name of the patient in the general info section, this
    event will display a popup with all the information about the patient.*/
    patientInfo.addEventListener('mouseover', () => {
        patientInfoPopUp.classList.add('popup-show')
    })

    /* This event will be fired every time a hover out occurs over the name of the patient in the general info section, this
    event will hide the popup with all the information about the patient.*/
    patientInfo.addEventListener('mouseout', () => {
        patientInfoPopUp.classList.remove('popup-show')
    })
}

if (medicalBook){

    /* This event will be fired every time a mouseover occurs of an element with the 'fa-book-medical' class in its class
        list. This event will add the fa-book-medical-hover class to the target.*/
    medicalBook.addEventListener('mouseover', function(){
        this.classList.add('fa-book-medical-hover')
    })

    /* This event will be fired every time a mouseout occurs of an element with the 'fa-book-medical' class in its class
    list. This event will remove the fa-book-medical-hover class to the target.*/
    medicalBook.addEventListener('mouseout', function(){
        this.classList.remove('fa-book-medical-hover')
    })

    /* This click event will be fired every time the target contains the 'fa-book-medical' class in its classlist, and
    this event will grab the 'url' from the data-url attribute from the target to make an AJAX request to the server, and
    display all the consults previously filled for this patient in a modal, where you will be able to take a look to the most
    important aspects of that consult.*/
    medicalBook.addEventListener('click', () => {
        let url = medicalBook.getAttribute('data-url')
        requestRecords(url)
        .then(data => {
            recordsTable.innerHTML = data['html']
            if (document.querySelector('#no-records')){
                recordsSummary.classList.add('records-general-information-hide')
            }
        })
        recordsModal.classList.add('records-modal-show')
    })

}

// Button Event Listeners
if (button){

    for (let i = 0; i<button.length; i++){
        /* This event will be fired every time a mouseover occurs over a button, this event will add the button-hover
            class to it's classlist.*/
        button[i].addEventListener('mouseover', function(){
            this.classList.add('button-hover')
        })

        /* This event will be fired every time a mouseout occurs over a button, this event will remove the button-hover
            class to it's classlist.*/
        button[i].addEventListener('mouseout', function(){
            this.classList.remove('button-hover')
        })

    }

}


// Exams Event Listeners

if (exams){

    /* This event will be fired every time a mouseover occurs over the exams icon, this event will add the fa-file-medical-alt-hover
        class to it's classlist.*/
    exams.addEventListener('mouseover', function(){
        this.classList.add('fa-file-medical-alt-hover')
    })

    /* This event will be fired every time a mouseout occurs over the exams icon, this event will remove the fa-file-medical-alt-hover
        class to it's classlist.*/
    exams.addEventListener('mouseout', function(){
        this.classList.remove('fa-file-medical-alt-hover')
    })

    /* This event will be fired every time a click occurs over the exams icon, this event will display the examsModal
    with it's form as a content.*/
    exams.addEventListener('click', function(){
        examsModal.classList.add('exams-modal-show')
    })

}

// Lock Event Listeners

if (lock){

    // This event will be fired every time, the target is the lock element, and will display the warning popup.
    lock.addEventListener('mouseover', () => {
        lockPopUp.classList.add('popup-show')
    })

    // This event will be fired every time, the target is the lock element, and will hide the warning popup.
    lock.addEventListener('mouseout', () => {
        lockPopUp.classList.remove('popup-show')
    })

    lock.addEventListener('click', (e) => {
        /* This event will be fired every time the lock element is clicked, this event will perform various actions,
           the padlock in case of being in locked mode, then that 'fa-lock' class will be removed and the 'fa-unlock' class
           added, vice versa if the pad was unlocked, also the most important is that the value of the 'lockInput' input
           will be set to False if it was locked and to True if it was unlocked.*/
        if (e.target.classList.contains('lock') || e.target.classList.contains('lock-switch')){
            lock.classList.contains('lock-active') ? lock.classList.remove('lock-active') : lock.classList.add('lock-active')
            lockInput.value === 'True' ? lockInput.value = 'False' : lockInput.value = 'True'
            if (padlock.classList.contains('fa-lock')){
                padlock.classList.remove('fa-lock')
                padlock.classList.add('fa-unlock')
            }else{
                padlock.classList.remove('fa-unlock')
                padlock.classList.add('fa-lock')
            }
        }

    })
}

/*#################################################### Records Table Modal ###########################################*/

// Records Table
if (recordsTable){

    // RecordsTable Mouseover Events

    recordsTable.addEventListener('mouseover', (e) => {
        /* This event will be fired every time the target is a table data cell inside the table, this event will perform
            various actions, it will change some styles of the row and will grab the 'data-url' attribute from the row,
            to display the information in the summary section.*/
        if (e.target.nodeName === 'TD'){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            let url = row.getAttribute('data-url')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
            consultSummaryAW(url)
            .then(data => {
                recordsSummary.innerHTML = data['html']
            })
        }
    })

    // RecordsTable Mouseout Events

    recordsTable.addEventListener('mouseout', (e) => {

          /* This event will be fired every time the target is a table cell inside the table, every time a hover out occurs,
             this event will remove the styles previously set to the table row.*/

          if (e.target.nodeName === 'TD'){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = ''
            row.style.color = ''

          }

    })
}


// Records Modal Event Listeners

if (recordsModal){

    // This event will be fired any time the target is the recordsModal itself, it will remove the 'records-modal-show' class from its classList
    recordsModal.addEventListener('click', (e) => {
        if (e.target === recordsModal){
            recordsModal.classList.remove('records-modal-show')
        }
    })
}



/*########################################################## Exams Modal #############################################*/

// Exams Modal

if (examsModal){

    // Exams Modal Mouseover Events

    examsModal.addEventListener('mouseover', function(e){

        // This event will be fired every time a hover occurs over an element with the 'add-exam' class in it's classList, it will add the 'add-exam-hover' class.

        if (e.target.classList.contains('add-exam')){
            e.target.classList.add('add-exam-hover')
        }

        // This event will be fired every time a hover occurs over an element with the 'fa-plus' class in it's classList, it will add the 'fa-plus-hover' class.

        if (e.target.classList.contains('fa-plus')){
            e.target.classList.add('fa-plus-hover')
        }

        // This event will be fired every time a hover occurs over an element with the 'fa-trash' class in it's classList, it will add the 'fa-trash-hover' class.

        if (e.target.classList.contains('fa-trash')){
            e.target.classList.add('fa-trash-hover')
        }

        // This event will be fired every time a hover occurs over an element with the 'fa-eye' class in it's classList, it will add the 'fa-eye-hover' class.

        if (e.target.classList.contains('fa-eye')){
            e.target.classList.add('fa-eye-hover')
        }

        /* This event will be fired every time the element contains the 'filename' class, it it's classList, and the
           and the exams-modal-show class is set in the modal, this event will perform some actions, it will grab the
           file element inside that form, and collect the file object. After this information is collected, the event
           will create a FileReader object, and will set an event listener to this object, a 'load' event, what this event
           will perform is that it will load the file object, and prepare it to get displayed in the preview section,
           to load this file object we use the readAsDataURL() FileReader method.*/

        if (e.target.classList.contains('filename') && e.target.innerText !== '' && examsModal.classList.contains('exams-modal-show')){
            let imagePreview = document.querySelector('.previewed-image')
            let file
            for (let i = 0; i<e.target.parentNode.childNodes.length; i++){
                if (e.target.parentNode.childNodes[i].firstChild && e.target.parentNode.childNodes[i].firstChild.type === 'file'){
                    file = e.target.parentNode.childNodes[i].firstChild.files[0]
                }
            }
            let reader = new FileReader()
            reader.addEventListener('load', (e) => {
                imagePreview.src = e.target.result
                if (imagePreview.parentNode.classList.contains('preview-image-display')){
                    imagePreview.classList.add('previewed-image-show')
                }
            })
            reader.readAsDataURL(file);
        }

    })

    // Exams Modal Mouseout Events

    examsModal.addEventListener('mouseout', function(e){
        // This event will be fired every time a hover out occurs on an element with the 'add-exam' class in it's classList, it will remove the 'add-exam-hover' class.

        if (e.target.classList.contains('add-exam')){
            e.target.classList.remove('add-exam-hover')
        }

        // This event will be fired every time a hover out occurs over an element with the 'fa-plus' class in it's classList, it will remove the 'fa-plus-hover' class.

        if (e.target.classList.contains('fa-plus')){
            e.target.classList.remove('fa-plus-hover')
        }

        // This event will be fired every time a hover out occurs over an element with the 'fa-trash' class in it's classList, it will remove the 'fa-trash-hover' class.

        if (e.target.classList.contains('fa-trash')){
            e.target.classList.remove('fa-trash-hover')
        }

        // This event will be fired every time a hover occurs over an element with the 'fa-eye' class in it's classList, it will remove the 'fa-eye-hover' class.

        if (e.target.classList.contains('fa-eye')){
            e.target.classList.remove('fa-eye-hover')
        }

        /* This event will be fired when a hover out occurs over an element with the 'filename' class, it its claslist, this will remove the
           'previewed-image' class from the preview section to hide it, and remove the 'src' attribute from the img element.*/
         if (e.target.classList.contains('filename') && e.target.innerText !== ''){
            let imagePreview = document.querySelector('.previewed-image')
            imagePreview.classList.remove('previewed-image-show')
            imagePreview.src = ''
        }
    })


    // Exams Modal Click Events

    examsModal.addEventListener('click', function(e){

        // This event will be fired every time the target is the modal itself, it will remove the 'exams-modal-show' to remove it.
        if (e.target.classList.contains('exams-modal') || e.target.innerText === 'Save'){
            this.classList.remove('exams-modal-show')
        }

        /* This event will be fired every time the target contains the 'fa-trash' class in it's classlist, this event
            will perform various actions, it will check the checkbox of the current form in order to get deleted in the
            server side, also will hide the current form.*/
        if (e.target.classList.contains('fa-trash')){
            let parentNode = e.target.parentNode.parentNode
            for (let i = 0; i<parentNode.childNodes.length; i++){
                if (parentNode.childNodes[i].firstChild){
                    if (parentNode.childNodes[i].firstChild.type === 'checkbox'){
                        parentNode.childNodes[i].firstChild.checked = true
                    }
                }
            }
            parentNode.classList.add('form-hide')
        }

        /*This event will be fired every time the target contains the 'fa-eye' class in it's classList, this event will
          set the form into exams-preview mode, and will display the section to show the preview of the exam.*/
        if (e.target.classList.contains('fa-eye')){
            examsData.classList.contains('exams-data-preview-set') ? examsData.classList.remove('exams-data-preview-set') : examsData.classList.add('exams-data-preview-set')
            previewImg.classList.contains('preview-image-display') ? previewImg.classList.remove('preview-image-display') : previewImg.classList.add('preview-image-display')
        }

    })

    // Exams Change Events

    examsModal.addEventListener('change', function(e){

        /* This event will be fired every time a change occurs over a an input element which type is a file, what this
            event will do is, that it will fill the Filename data cell with the name of the file.*/
        if (e.target.nodeName === 'INPUT' && e.target.type === 'file'){
            var parent = e.target.parentNode.parentNode
            var filenameSpace
            for (let i = 0; i<parent.childNodes.length; i++){
                if (parent.childNodes[i].classList){
                    if (parent.childNodes[i].classList.contains('filename')){
                        filenameSpace = parent.childNodes[i]
                    }
                }
            }
            filenameSpace.innerText = e.target.files[0]['name']
        }

    })

}

addForm.addEventListener('click', function(){
    /* This event will be fired every time the target is the addForm element, this event will add another
      form to the list of forms available to add as many instances as needed in the Exams
      form's list, to create as many instances as the user needs, the event does the following:
      1. Grab the amount of forms in existence.
      2. Grab the hidden input #id_form-TOTAL_FORMS for further modifications.
      3. Clone an exams_form so we can added to our form's list and change it's attribute values.
      4. Grab the cloned node and through a loop change all it's attributes depending on the input type.
      5. Change the Total Forms Value to the amount of forms available plus one unit.
      6. Append the cloned node to the exams_forms list.*/
    let formAmount = document.querySelectorAll('.form-container')
    let totalAmountFormManagement = document.querySelector('#id_form-TOTAL_FORMS')
    let clonedForm = formAmount[0].cloneNode(true)
    let formContainers = document.querySelector('tbody')
    for (let i = 0; i<clonedForm.childNodes.length; i++){
        if (clonedForm.childNodes[i].firstChild){
            if (clonedForm.childNodes[i].firstChild.nodeName === 'INPUT' && clonedForm.childNodes[i].firstChild.type === 'file'){
                clonedForm.childNodes[i].childNodes[0].value = null
                clonedForm.childNodes[i].childNodes[1].htmlFor = 'id_form-' + formAmount.length + '-image'
                clonedForm.childNodes[i].childNodes[0].name = 'form-' + formAmount.length + '-image'
                clonedForm.childNodes[i].childNodes[0].id = 'id_form-' + formAmount.length + '-image'
            }else if (clonedForm.childNodes[i].firstChild.nodeName === 'INPUT' && clonedForm.childNodes[i].firstChild.type === 'checkbox'){
                clonedForm.childNodes[i].childNodes[0].name = 'form-' + formAmount.length + '-DELETE'
                clonedForm.childNodes[i].childNodes[0].id = 'id_form-' + formAmount.length + '-DELETE'
            }else if (clonedForm.childNodes[i].firstChild.nodeName === 'SELECT'){
                clonedForm.childNodes[i].childNodes[0].value = null
                clonedForm.childNodes[i].childNodes[0].name = 'form-' + formAmount.length + '-type'
                clonedForm.childNodes[i].childNodes[0].id = 'id_form-' + formAmount.length + '-type'
            }
        }

        if (clonedForm.childNodes[i].classList){
            if (clonedForm.childNodes[i].classList.contains('filename')){
                clonedForm.childNodes[i].innerText = ''
            }
        }

    }
    totalAmountFormManagement.value = formAmount.length + 1
    clonedForm.classList.remove('form-hide')
    formContainers.appendChild(clonedForm)
})


/*####################################################### Diagnose Modal #############################################*/

// Diagnose Event Listeners

diagnose.addEventListener('scroll', function(){

    /* This scroll event is fired when a scroll occurs in the diagnose element, this event will be the one in charge
       of activating the correct navigator dot in the navigation bar.*/

    let navigationDots = navigation.childNodes
    let distance = diagnose.scrollWidth/navigationDots.length
    let activeElement = Math.round(diagnose.scrollLeft/distance)
    for (let i = 0; i<navigationDots.length; i++){
        if (navigationDots[i] !== navigationDots[activeElement]){
            navigationDots[i].classList.remove('navigator-active')
        }
        navigationDots[activeElement].classList.add('navigator-active')
    }

})


// Controllers

if (controllers){

    for (let i = 0; i<controllers.length; i++){

        // Controllers Mouseover events

        // This event will be fired every time a hover occurs over a controller, it will add the 'angle-active' class to the classList.
        controllers[i].addEventListener('mouseover', function(){
            this.classList.add('fa-angle-hover')
        })

        // Controllers Mouseout events

        // This event will be fired every time a hover out occurs from a controller, it will remove the 'angle-active' class to the classList.
        controllers[i].addEventListener('mouseout', function(){
            this.classList.remove('fa-angle-hover')
        })

        // Controllers Click events

        // This event will be fired every time a click occurs in a controller, it will call diagnoseScroll function to perform the scroll in the diagnose element.
        controllers[i].addEventListener('click', function(e){
            diagnoseScroll(diagnose.scrollLeft, diagnose.scrollWidth, diagnose.scrollWidth/navigation.childNodes.length, diagnose, e.target, navigation)
        })

    }

}

// Drug Category Filter Event Listeners

if (drugCategoryFilter){

    drugCategoryFilter.addEventListener('change', function(e){
        /* This event will be target any time the category filter dropdown detects a change, it will asynchronously
           display the drugs that belong to the category the user chose. This event will perform many actions such as
           grab the url to make the 'GET' request, afterwards, collecting the category to filter the drugs, after this
           data is collected, the checkboxes will be updated with the information retrieved from the server and finally
           checking the options that were checked in case there were.*/
        const data = e.target.options[e.target.selectedIndex].value
        const url = e.target.parentNode.getAttribute('data-url') + '?category=' + data
        retrieveDrugsFilterAsync(url)
        .then(data => {
            document.querySelector('#id_drugs').innerHTML = data['updated_drugs']
            // Better way to take control of the already checked checkboxes
            let checkboxes = document.querySelectorAll('#id_drugs input[type=checkbox]')
            for (let i = 0; i<checkedDrugs.length; i++){
                let checkedDrug = checkedDrugs[i]
                for (let j = 0; j<checkboxes.length; j++){
                    if (checkedDrug.value === checkboxes[j].value){
                        checkboxes[j].checked = true
                    }
                }
            }
        })
    })
}

// Check for a better way to improve this code.
// Better way to take control of the already checked checkboxes

if (drugList){

    // Whenever we do a filtering of the drugs options, we will keep a backup of the drugsPrescribed and the checkedDrugs.
    let drugsPrescribed = []

    // DrugList Event Listeners
    drugList.addEventListener('change', function(e){
        /* This event listener will be the one in charge of updating the medicine input text whenever a new drug is checked
           to prescribe to a patient, */
        indications.value = ''
        // Actual drug that was selected or checked
        let drugPrescribed = e.target.parentNode.innerText
        /* Check if the drug prescribed already exists in the list of prescribed drugs we have filled before.
           If it didn't exist, it will add it.*/
        if (drugsPrescribed.indexOf(drugPrescribed + ' -') === -1){
            drugsPrescribed.push(drugPrescribed + ' -')
            checkedDrugs.push(e.target)
        }else{
            /* If it exists, then it will be removed since the change event that the drugsList caught, was the unchecking of a box*/
            drugsPrescribed.splice(drugsPrescribed.indexOf(drugPrescribed + ' -'), 1)
            checkedDrugs.splice(checkedDrugs.indexOf(e.target), 1)
        }
        // Add the drugs in the prescribedDrugs list to the indications textArea for further indications.
        for (let i = 0; i<drugsPrescribed.length; i++){
            if (indications.value.split('\n').indexOf(drugsPrescribed[i]) === -1){
                indications.value += drugsPrescribed[i] + '\n'
            }
        }

    })
}


// Medical Test Type Filter Event Listeners

if (MedicalTestTypeFilter){

    MedicalTestTypeFilter.addEventListener('change', function(e){
        /* This event will be target any time the type filter dropdown detects a change, it will asynchronously
           display the tests that belong to the test type the user chose. This event will perform many actions such as
           grab the url to make the 'GET' request, afterwards, collecting the category to filter the drugs, after this
           data is collected, the checkboxes will be updated with the information retrieved from the server and finally
           checking the options that were checked in case there were.*/
        const data = e.target.options[e.target.selectedIndex].value
        const url = e.target.parentNode.getAttribute('data-url') + '?test_type=' + data
        retrieveMedicalTestsFilterAsync(url)
        .then(data => {
            document.querySelector('#id_testing').innerHTML = data['updated_tests']
//          Better way to take control of the already checked checkboxes
            let checkboxes = document.querySelectorAll('#id_testing input[type=checkbox]')
            for (let i = 0; i<checkedTests.length; i++){
                let checkedTest = checkedTests[i]
                for (let j = 0; j<checkboxes.length; j++){
                    if (checkedTest.value === checkboxes[j].value){
                        checkboxes[j].checked = true
                    }
                }
            }
        })
    })
}

// Testing Event Listeners

if (testing){

    // This event will be fired every time the target is the testing element, it will add or remove elements from the checkedTests Array
    testing.addEventListener('change', (e) => {

        checkedTests.includes(e.target) ? checkedTests.splice(checkedTests.indexOf(e.target), 1) : checkedTests.push(e.target)

    })

}

// Add Test Event Listeners

if (addTest){

    // This event will be fired every time the addDrug element is hovered, it will add the 'add-drug-hover' class to the classList.
    addTest.addEventListener('mouseover', function(e){
        this.classList.add('add-test-hover')
    })

    // This event will be fired every time a hover out occurs in the addDrug element, it will remove the 'add-drug-hover' class from the classList.
    addTest.addEventListener('mouseout', function(e){
        this.classList.remove('add-test-hover')
    })

    // This event will be fired every time a click occurs in the addDrug element, this event will add the 'modal-show' class to the addDrugModal element.
    addTest.addEventListener('click', function(e){
        addTestModal.classList.add('modal-show')
    })

}

// Add Test Modal Event Listeners.

if (addTestModal){

    // addDrugModal click event listeners
    addTestModal.addEventListener('click', function(e){
        /* This event will be fired every time the target is the addDrugModal element, this event will clear the form and remove the errors if needed.*/
        if (e.target.classList.contains('add-test-modal')){
            document.querySelector('.add-test-modal .error').innerText = ''
            addTestForm.reset()
            this.classList.remove('modal-show')
        }
    })

    // This event will be fired every time the target is a button inside the addDrugModal element, this will add the 'button-hover' class to the target's classList.
    addDrugModal.addEventListener('mouseover', function(e){
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }
    })

    // This event will be fired every time the target is a button inside the addDrugModal element, this will remove the 'button-hover' class to the target's classList.
    addDrugModal.addEventListener('mouseout', function(e){
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-hover')
        }
    })

    /* This event will be fired whenever the addTestModal catches a submit event, this event will perform various operations,
       first, the data needed to perform the asynchronous request to the server, the url, method, csrf token and the formData,
       the request will be done, and if the response contains the 'html' key then this means an error was raised and will
       be rendered to the form, if not, then the modal will be closed and the form will be reset, the select option will
       be updated and the checkboxes that were checked, will be checked again.*/
    addTestModal.addEventListener('submit', function(e){
        e.preventDefault()
        e.stopPropagation()
        const url = addTestForm.action
        const method = addTestForm.method
        const data = new FormData(addTestForm)
        const csrfmiddlewaretoken = document.querySelector('.add-medical-test-form > [name=csrfmiddlewaretoken]').value
        addTestAsync(url, method, data, csrfmiddlewaretoken)
        .then(data => {
            if (data['html']){
                const error = document.querySelector('.add-medical-test-form .error')
                error.innerText = 'This test is already listed.'
            }else{
                addTestModal.classList.remove('modal-show')
                document.querySelector('.add-medical-test-form .error').innerText = ''
                addTestForm.reset()
                document.querySelector('#id_testing').innerHTML = data['updated_tests_list']
                // Better way to take control of the already checked checkboxes
                let checkboxes = document.querySelectorAll('#id_testing input[type=checkbox]')
                for (let i = 0; i<checkedTests.length; i++){
                    let checkedTest = checkedTests[i]
                    for (let j = 0; j<checkboxes.length; j++){
                        if (checkedTest.value === checkboxes[j].value){
                            checkboxes[j].checked = true
                        }
                    }
                }
            }
        })
    })

}

// Add Drug Event Listeners

if (addDrug){

    // This event will be fired every time the addDrug element is hovered, it will add the 'add-drug-hover' class to the classList.
    addDrug.addEventListener('mouseover', function(e){
        this.classList.add('add-drug-hover')
    })

    // This event will be fired every time a hover out occurs in the addDrug element, it will remove the 'add-drug-hover' class from the classList.
    addDrug.addEventListener('mouseout', function(e){
        this.classList.remove('add-drug-hover')
    })

    // This event will be fired every time a click occurs in the addDrug element, this event will add the 'modal-show' class to the addDrugModal element.
    addDrug.addEventListener('click', function(e){
        addDrugModal.classList.add('modal-show')
    })

}

// Add Drug Modal Event Listeners.
if (addDrugModal){

    // addDrugModal click event listeners
    addDrugModal.addEventListener('click', function(e){
        /* This event will be fired every time the target is the addDrugModal element, this event will clear the form and remove the errors if needed.*/
        if (e.target.classList.contains('add-drug-modal')){
            document.querySelector('.add-drug-modal .error').innerText = ''
            addDrugForm.reset()
            this.classList.remove('modal-show')
        }
    })

    // This event will be fired every time the target is a button inside the addDrugModal element, this will add the 'button-hover' class to the target's classList.
    addDrugModal.addEventListener('mouseover', function(e){
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }
    })

    // This event will be fired every time the target is a button inside the addDrugModal element, this will remove the 'button-hover' class to the target's classList.
    addDrugModal.addEventListener('mouseout', function(e){
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-hover')
        }
    })

    /* This event will be fired whenever the addDrugModal catches a submit event, this event will perform various operations,
       first, the data needed to perform the asynchronous request to the server, the url, method, csrf token and the formData,
       the request will be done, and if the response contains the 'html' key then this means an error was raised and will
       be rendered to the form, if not, then the modal will be closed and the form will be reset, the select option will
       be updated and the checkboxes that were checked, will be checked again.*/
    addDrugModal.addEventListener('submit', function(e){
        e.preventDefault()
        e.stopPropagation()
        const url = addDrugForm.action
        const method = addDrugForm.method
        const data = new FormData(addDrugForm)
        const csrfmiddlewaretoken = document.querySelector('.add-drug-form > [name=csrfmiddlewaretoken]').value
        addDrugAsync(url, method, data, csrfmiddlewaretoken)
        .then(data => {
            if (data['html']){
                const error = document.querySelector('.add-drug-form .error')
                error.innerText = 'This drug is already listed.'
            }else{
                addDrugModal.classList.remove('modal-show')
                document.querySelector('.add-drug-form .error').innerText = ''
                addDrugForm.reset()
                document.querySelector('#id_drugs').innerHTML = data['updated_drugs_list']
                // Better way to take control of the already checked checkboxes
                let checkboxes = document.querySelectorAll('#id_drugs input[type=checkbox]')
                for (let i = 0; i<checkedDrugs.length; i++){
                    let checkedDrug = checkedDrugs[i]
                    for (let j = 0; j<checkboxes.length; j++){
                        if (checkedDrug.value === checkboxes[j].value){
                            checkboxes[j].checked = true
                        }
                    }
                }
            }
        })
    })

}

/*############################################### Forms Proper Functionality #########################################*/


// Forms Event Listeners
if (form){
    form.addEventListener('submit', (e) => {
        /* This event will be fired every time a submit occurs over this form, this event will be stopped and default
        prevented, this because we need to evaluate some conditions before continuing, this event will check if there
        are any empty inputs in the form, depending on this condition a modal will be displayed or the prescription modal
        will display the prescription.*/
        e.preventDefault()
        e.stopPropagation()
        let unfilledInputs = 0
        for (let i = 0; i<formInputs.length; i++){
            if (formInputs[i].value !== ''){
                continue
            }else{
                unfilledInputs++
            }
        }

        if (unfilledInputs === 0){
        /* If there are no inputs empty, the form will be submitted and the prescription modal will be displayed with
        the prescription in PDF Format, ready for printing, if the server returns errors, the pdf will be not displayed and
        the errors will be shown.*/
            let url = e.target.action
            let method = e.target.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(e.target)
            submitConsultAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                console.log(data)
                if (data['prescription_path']){
                    prescriptionModalContent.setAttribute('data-pdf', data['prescription_path'])
                    pdfPath = prescriptionModalContent.getAttribute('data-pdf')
                    PDFObject.embed(pdfPath, prescriptionModalContent)
                    prescriptionModal.classList.add('prescription-modal-show')
                }
            })
            .catch(error => {
                form.submit()
            })
        } else{
            /*If there are, the confirmation modal will be displayed.*/
            modal.classList.add('modal-show')
        }
    })
}

// Modal Event Listeners

if (modal){

    // Modal Click Event Listeners

    modal.addEventListener('click', (e) => {

        e.preventDefault()
        e.stopPropagation()
        // This event will be fired every time the target is the modal itself, or a button with 'No' as it's text content, this will remove the 'modal-show' class from the modal.
        if (e.target === modal || (e.target.nodeName === 'BUTTON' && e.target.textContent === 'No')){
            modal.classList.remove('modal-show')
        }

        /* This event will be fired every time the target is a button and the textContent is 'Yes', this event will
           perform some actions and evaluate some conditions before deciding what instruction to execute, first we need
           to collect all the information needed to do a POST request to the server, so the current consult can be saved,
           afterwards, our inputs will be evalutated, if there are any indications in indications input or any indications
           in the actions input, we will call the submitConsultAW to add the consult async to the server, this will return
           a response, it contains the prescription in PDF format, this will be displayed in the prescriptionModal, if there
           is no values in these inputs, then the form will be submitted automatically. if the server returns errors, the pdf
           will be not displayed and the errors will be shown.*/
        if (e.target.nodeName === 'BUTTON' && e.target.textContent === 'Yes'){
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            submitConsultAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['prescription_path']){
                    prescriptionModalContent.setAttribute('data-pdf', data['prescription_path'])
                    pdfPath = prescriptionModalContent.getAttribute('data-pdf')
                    PDFObject.embed(pdfPath, prescriptionModalContent)
                    prescriptionModal.classList.add('prescription-modal-show')
                    modal.classList.remove('modal-show')
                }
            })
            .catch(error => {
                form.submit()
            })
        }
   })
}

// PrescriptionModal event listeners

prescriptionModal.addEventListener('click', (e) => {

    // This event will be fired every time the target's textContent is 'Save Consult', this event will change the window's location to the main consults page.
    if (e.target.textContent === 'Save Consult'){
        window.location.href = e.target.getAttribute('data-url')
    }
})

