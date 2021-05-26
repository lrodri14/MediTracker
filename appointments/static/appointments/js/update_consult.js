/* This update_consult.js file contains all the variables definitions, async and sync functions, assignments,
as well as event listeners need for the Consult Update View to work properly in the Appointments App, this file is
composed of 5 async functions, and 1 sync function.*/

/*#################################################### Variables #####################################################*/

// General
let form = document.querySelector('.consult')
let lock = document.querySelector('.consult__lock')
let padLock = document.querySelector('.consult__lock-icon')
let lockInput = document.querySelector('#id_lock')
let formInputs = document.querySelectorAll('input:not([type=checkbox]):not([type=hidden]):not([type=file]):not(#id_name), textarea')
let navigation = document.querySelector('.consult__navigation')

// Diagnose
let diagnose = document.querySelector('.consult__diagnose')
let drugsList = document.querySelector('#id_drugs')
let testing = document.querySelector('#id_testing')

// Pop-ups
let patientInfoPopUp = document.querySelector('.patient-information-popup')
let lockPopUp = document.querySelector('.consult-lock-popup')

// Exam Results
let examResultsModal = document.querySelector('.exams')
let examResultsData = document.querySelector('.exams__data')
let dataPreview = document.querySelector('.exams-preview')
let resultData = document.querySelector('.exams-preview__image')

// Checkboxes Backup
let checkedDrugs = []
let checkedTests = []

// Modals
let modal = document.querySelector('.modal')
let modalContent = document.querySelector('.modal__content')
let prescriptionModal = document.querySelector('.prescription-modal')
let prescriptionModalContent = document.querySelector('.prescription-modal__content')
let modalBackUp = document.querySelector('.modal__reminder')

// Navigator
navigation.innerHTML = '<li></li>'.repeat(document.querySelectorAll('.consult__diagnose-data').length)
navigation.childNodes[0].classList.add('navigator--active')

/*#################################################### Functions #####################################################*/

// Async Functions

async function requestElementCreationFormAsync(url){

    /* This requestElementCreationForm function is used to request element creation forms for testing and drugs, this
    function only takes one argument, the url containing the parameters for the GET request, the response will be
    converted into JSON Format and finally, displayed in the select box. It takes a single argument, the 'url' to make
    the GET request.*/

    const result = await fetch(url)
    const data = result.json()
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

async function addElementAsync(url, method, formData, csrfmiddlewaretoken){
    /*This addElementAsync function is used to create tests or drugs asynchronously to the server, this function takes 4 paramaters we collect
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

// This assignment is made to ensure that every time a consult is opened, it is locked, no matter if it was left opened in the last opening.

lockInput.value = 'True'


/*#################################################### Event Listeners ###############################################*/

// Form Event Listeners

if (form){

    // Form mouseover events
    form.addEventListener('mouseover', (e) => {

        // This event will be fired every time the target is the patient's name title, it will add the popup--display class to the target.
        if (e.target.classList.contains('consult__patient-identification')){
            patientInfoPopUp.classList.add('popup--display')
        }

        // This event will be fired every time the target is the consult lock, it will add the popup--display class to the target.
        if (e.target.closest('.consult__lock-container')){
            lockPopUp.classList.add('popup--display')
        }

        // This event will be fired every time the target is a consult icon, it will add the consult__icon--active class to the target.
        if (e.target.classList.contains('consult__records-icon') ||
            e.target.classList.contains('consult__examination-icon') ||
            e.target.classList.contains('consult__vaccination-icon') ||
            e.target.classList.contains('fa-angle-right') ||
            e.target.classList.contains('fa-angle-left')){
            e.target.classList.add('consult__icon--active')
        }

        // This event will be fired every time the target is an addition sign.
        if (e.target.classList.contains('consult__add-test') || e.target.classList.contains('consult__add-drug')){
            e.target.classList.add('consult__add-item--active')
        }

    })

    // Form mouseout events
    form.addEventListener('mouseout', (e) => {

        // This event will be fired every time the target is the patient's name title, it will remove the popup--display class to the target.
        if (e.target.classList.contains('consult__patient-identification')){
            patientInfoPopUp.classList.remove('popup--display')
        }

        // This event will be fired every time the target is the consult lock, it will remove the popup--display class to the target.
        if (e.target.closest('.consult__lock-container')){
            lockPopUp.classList.remove('popup--display')
        }

        // This event will be fired every time the target is a consult icon, it will remove the consult__icon--active class to the target.
        if (e.target.classList.contains('consult__records-icon') ||
            e.target.classList.contains('consult__examination-icon') ||
            e.target.classList.contains('consult__vaccination-icon') ||
            e.target.classList.contains('fa-angle-right') ||
            e.target.classList.contains('fa-angle-left')){
            e.target.classList.remove('consult__icon--active')
        }

        // This event will be fired every time the target is an addition sign.
        if (e.target.classList.contains('consult__add-test') || e.target.classList.contains('consult__add-drug')){
            e.target.classList.remove('consult__add-item--active')
        }

    })

    // Form scroll events
    form.addEventListener('scroll', (e) => {

        // This event will be fired when the target contains the consult__diagnose class, it will activate the corresponding navigator element.
        /* This scroll event is fired when a scroll occurs in the diagnose element, this event will be the one in charge
            of activating the correct navigator dot in the navigation bar.*/
        if (e.target.classList.contains('consult__diagnose')){
            let navigationDots = navigation.childNodes
            let distance = diagnose.scrollWidth/navigationDots.length
            let activeElement = Math.round(diagnose.scrollLeft/distance)
            for (let i = 0; i<navigationDots.length; i++){
                navigationDots[i].classList.remove('navigator--active')
            }
            navigationDots[activeElement].classList.add('navigator--active')
        }

    })

    // Form click events
    form.addEventListener('click', (e) => {

        // This event will be fired every time the target is an angle icon, and it will perform the scrolling.
        if (e.target.classList.contains('fa-angle-left') || e.target.classList.contains('fa-angle-right')){
            diagnoseScroll(diagnose.scrollLeft, diagnose.scrollWidth, diagnose.scrollWidth/navigation.childNodes.length, diagnose, e.target, navigation)
        }

        /* This click event will be fired every time the target contains the 'fa-book-medical' class in its classlist, and
            this event will grab the 'url' from the data-url attribute from the target to make an AJAX request to the server, and
            display all the consults previously filled for this patient in a modal, where you will be able to take a look to the most
            important aspects of that consult.*/
        if (e.target.classList.contains('consult__records-icon')){
            let url = e.target.getAttribute('data-url')
            requestRecords(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                if (document.querySelector('#no-records')){
                    document.querySelector('.records-summary').classList.add('records-summary-hide')
                }
            })
            modal.classList.add('modal--display')
        }

        // This event will be fired every time the target is the examination icon, and it will add the exams--display class to the exams modal.
        if (e.target.classList.contains('consult__examination-icon')){
            examResultsModal.classList.add('exams--display')
         }

          /* This click event will be fired every time the target contains the 'fa-book-medical' class in its classlist, and
            this event will grab the 'url' from the data-url attribute from the target to make an AJAX request to the server, and
            display all the consults previously filled for this patient in a modal, where you will be able to take a look to the most
            important aspects of that consult.*/
         if (e.target.classList.contains('consult__vaccination-icon')){
            let url = e.target.getAttribute('data-url')
            requestElementCreationFormAsync(url)
                .then(data => {
                    modalContent.innerHTML = data['html']
                })
            modal.classList.add('modal--display')
        }

         // This event will be fired every time the target is inside the consult lock container, this will lock and unlock the consult for further changes.
        if (e.target.closest('.consult__lock-container')){
            lock.classList.contains('lock-active') ? lock.classList.remove('lock-active') : lock.classList.add('lock-active')
            lockInput.value === 'True' ? lockInput.value = 'False' : lockInput.value = 'True'
            if (padLock.classList.contains('fa-lock')){
                padLock.classList.remove('fa-lock')
                padLock.classList.add('fa-unlock')
            }else{
                padLock.classList.remove('fa-unlock')
                padLock.classList.add('fa-lock')
            }
        }

        // This event will be fired every time the target is an addition sign, this will open up the modal an provide the appropriate addition form.
        if (e.target.classList.contains('consult__add-test') || e.target.classList.contains('consult__add-drug')){
            if (e.target.classList.contains('consult__add-test')){
                let url = e.target.getAttribute('data-url')
                requestElementCreationFormAsync(url)
                .then(data => {
                    modalContent.innerHTML = data['html']
                })
                modal.classList.add('modal--display')
            }else{
                let url = e.target.getAttribute('data-url')
                requestElementCreationFormAsync(url)
                .then(data => {
                    modalContent.innerHTML = data['html']
                })
                modal.classList.add('modal--display')
            }
        }

    })

    // Form change events
    form.addEventListener('change', (e) => {

        /* This event will be target any time the category filter dropdown detects a change, it will asynchronously
           display the drugs that belong to the category the user chose. This event will perform many actions such as
           grab the url to make the 'GET' request, afterwards, collecting the category to filter the drugs, after this
           data is collected, the checkboxes will be updated with the information retrieved from the server and finally
           checking the options that were checked in case there were.*/
       if (e.target.id === '#id_test_type'){
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
       }

        /* This event will be target any time the type filter dropdown detects a change, it will asynchronously
           display the tests that belong to the test type the user chose. This event will perform many actions such as
           grab the url to make the 'GET' request, afterwards, collecting the category to filter the drugs, after this
           data is collected, the checkboxes will be updated with the information retrieved from the server and finally
           checking the options that were checked in case there were.*/
        if (e.target.id === '#id_category'){
            const data = e.target.options[e.target.selectedIndex].value
            const url = e.target.parentNode.getAttribute('data-url') + '?test_type=' + data
            retrieveMedicalTestsFilterAsync(url)
            .then(data => {
                document.querySelector('#id_testing').innerHTML = data['updated_tests']
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
            })
        }

        // This event will be fired every time the changes occur on the drugs list, it will check the previously checked boxes.
        if (e.target.id === '#id_drugs'){

            // Check for a better way to improve this code.
            // Better way to take control of the already checked checkboxes
            // Whenever we do a filtering of the drugs options, we will keep a backup of the drugsPrescribed and the checkedDrugs.
            let drugsPrescribed = []

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
        }

        // This event will be fired every time the target is the testing element, it will add or remove elements from the checkedTests Array
        if (e.target.id === '#id_testing'){
            checkedTests.includes(e.target) ? checkedTests.splice(checkedTests.indexOf(e.target), 1) : checkedTests.push(e.target)
        }

    })

    // Form submit events
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
            if (modal.innerHTML !== modalBackUp){
                modal.innerHTML = modalBackUp
            }
            modal.classList.add('modal-show')
        }
    })
}

/*############################################ Exams Displaying and Results Modal ####################################*/

// Exam Results Modal

if (examResultsModal){

    // Exams Modal Mouseover Events

    examResultsModal.addEventListener('mouseover', function(e){

        // This event will be fired every time a hover occurs over an element with the exams__add-result-form class in it's classList, it will add the exams__add-result-form--active class.

        if (e.target.classList.contains('exams__add-result-form')){
            e.target.classList.add('exams__add-result-form--active')
        }

        // This event will be fired every time a hover occurs over an element with the exams__delete-result-form class in it's classList, it will add the exams__delete-result-form--active class.

        if (e.target.classList.contains('exams__delete-result-form')){
            e.target.classList.add('exams__delete-result-form--active')
        }

        // This event will be fired every time a hover occurs over an element with the 'exams__preview-button' class in it's classList, it will add the 'exams__preview-button--active' class.

        if (e.target.classList.contains('exams__preview-button')){
            e.target.classList.add('exams__preview-button--active')
        }

        // This event will be fired every time a hover occurs over an element with the 'exams__add-exam-result' class in it's classList, it will add the 'exams__add-exam-result--active' class.

        if (e.target.classList.contains('exams__add-exam-result')){
            e.target.classList.add('exams__add-exam-result--active')
        }

        // This event will be fired every time a hover occurs over a button element, it will add the 'button--active' class.

        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /* This event will be fired every time the element contains the 'exams__filename' class, it it's classList, and the
           and the exams-modal-show class is set in the modal, this event will perform some actions, it will grab the
           file element inside that form, and collect the file object. After this information is collected, the event
           will create a FileReader object, and will set an event listener to this object, a 'load' event, what this event
           will perform is that it will load the file object, and prepare it to get displayed in the preview section,
           to load this file object we use the readAsDataURL() FileReader method.*/

        if (e.target.classList.contains('exams__filename') && e.target.innerText !== '' && examResultsModal.classList.contains('exams--display')){

            let file
            for (let i = 0; i<e.target.parentNode.childNodes.length; i++){
                if (e.target.parentNode.childNodes[i].firstChild && e.target.parentNode.childNodes[i].firstChild.type === 'file'){
                    file = e.target.parentNode.childNodes[i].firstChild.files[0]
                }
            }
            let reader = new FileReader()
            reader.addEventListener('load', (e) => {
                resultData.src = e.target.result
                if (resultData.parentNode.classList.contains('exams-preview--display')){
                    resultData.classList.add('exams-preview__image--display')
                }
            })
            reader.readAsDataURL(file);
        }

    })

    // Exams Modal Mouseout Events

    examResultsModal.addEventListener('mouseout', function(e){

        // This event will be fired every time a hover occurs over an element with the exams__add-result-form class in it's classList, it will remove the exams__add-result-form--active class.

        if (e.target.classList.contains('exams__add-result-form')){
            e.target.classList.remove('exams__add-result-form--active')
        }

        // This event will be fired every time a hover occurs over an element with the exams__delete-result-form class in it's classList, it will remove the exams__delete-result-form--active class.

        if (e.target.classList.contains('exams__delete-result-form')){
            e.target.classList.remove('exams__delete-result-form--active')
        }

        // This event will be fired every time a hover occurs over an element with the 'exams__preview-button' class in it's classList, it will remove the 'exams__preview-button--active' class.

        if (e.target.classList.contains('exams__preview-button')){
            e.target.classList.remove('exams__preview-button--active')
        }

        // This event will be fired every time a hover occurs over an element with the 'exams__add-exam-result' class in it's classList, it will remove the 'exams__add-exam-result--active' class.

        if (e.target.classList.contains('exams__add-exam-result')){
            e.target.classList.remove('exams__add-exam-result--active')
        }

        // This event will be fired every time a hover occurs over a button element, it will remove the 'button--active' class.

        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /* This event will be fired when a hover out occurs over an element with the 'filename' class, it its claslist, this will remove the
           'previewed-image' class from the preview section to hide it, and remove the 'src' attribute from the img element.*/
         if (e.target.classList.contains('exams__filename') && e.target.innerText !== ''){
            resultData.classList.remove('exams-preview__image--display')
            resultData.src = ''
        }
    })


    // Exams Modal Click Events

    examResultsModal.addEventListener('click', function(e){

        // This event will be fired every time the target is the modal itself, it will remove the 'exams-modal-show' to remove it.
        if (e.target === examResultsModal || e.target.innerText === 'Save'){
            this.classList.remove('exams--display')
            dataPreview.classList.remove('exams-preview--display')
        }

        /* This event will be fired every time the target is the addExamForm element, this event will add another
          form to the list of forms available to add as many instances as needed in the Exams
          form's list, to create as many instances as the user needs, the event does the following:
          1. Grab the amount of forms in existence.
          2. Grab the hidden input #id_form-TOTAL_FORMS for further modifications.
          3. Clone an exams_form so we can added to our form's list and change it's attribute values.
          4. Grab the cloned node and through a loop change all it's attributes depending on the input type.
          5. Change the Total Forms Value to the amount of forms available plus one unit.
          6. Append the cloned node to the exams_forms list.*/

          if (e.target.classList.contains('exams__add-result-form')){
            let formAmount = document.querySelectorAll('.exams__form-container')
            let totalAmountFormManagement = document.querySelector('#id_exam-TOTAL_FORMS')
            let clonedForm = formAmount[0].cloneNode(true)
            let formContainers = document.querySelector('tbody')
            for (let i = 0; i<clonedForm.childNodes.length; i++){
                if (clonedForm.childNodes[i].firstChild){
                    if (clonedForm.childNodes[i].firstChild.nodeName === 'INPUT' && clonedForm.childNodes[i].firstChild.type === 'file'){
                        clonedForm.childNodes[i].childNodes[0].value = null
                        clonedForm.childNodes[i].childNodes[1].htmlFor = 'id_exam-' + formAmount.length + '-image'
                        clonedForm.childNodes[i].childNodes[0].name = 'exam-' + formAmount.length + '-image'
                        clonedForm.childNodes[i].childNodes[0].id = 'id_exam-' + formAmount.length + '-image'
                    }else if (clonedForm.childNodes[i].firstChild.nodeName === 'INPUT' && clonedForm.childNodes[i].firstChild.type === 'checkbox'){
                        clonedForm.childNodes[i].childNodes[0].name = 'exam-' + formAmount.length + '-DELETE'
                        clonedForm.childNodes[i].childNodes[0].id = 'id_exam-' + formAmount.length + '-DELETE'
                    }else if (clonedForm.childNodes[i].firstChild.nodeName === 'SELECT'){
                        clonedForm.childNodes[i].childNodes[0].value = null
                        clonedForm.childNodes[i].childNodes[0].name = 'exam-' + formAmount.length + '-type'
                        clonedForm.childNodes[i].childNodes[0].id = 'id_exam-' + formAmount.length + '-type'
                    }
                }

                if (clonedForm.childNodes[i].classList){
                    if (clonedForm.childNodes[i].classList.contains('filename')){
                        clonedForm.childNodes[i].innerText = ''
                    }
                }

            }
            totalAmountFormManagement.value = formAmount.length + 1
            clonedForm.classList.remove('exams__result-form--hide')
            formContainers.appendChild(clonedForm)
         }

        /* This event will be fired every time the target contains the 'fa-trash' class in it's classlist, this event
            will perform various actions, it will check the checkbox of the current form in order to get deleted in the
            server side, also will hide the current form.*/
        if (e.target.classList.contains('exams__delete-result-form')){
            let parentNode = e.target.parentNode.parentNode
            for (let i = 0; i<parentNode.childNodes.length; i++){
                if (parentNode.childNodes[i].firstChild){
                    if (parentNode.childNodes[i].firstChild.type === 'checkbox'){
                        parentNode.childNodes[i].firstChild.checked = true
                    }
                }
            }
            parentNode.classList.add('exams__result-form--hide')
        }

        /*This event will be fired every time the target contains the 'fa-eye' class in it's classList, this event will
          set the form into exams-preview mode, and will display the section to show the preview of the exam.*/
        if (e.target.classList.contains('exams__preview-button')){
            examResultsData.classList.contains('exams__preview-mode') ? examResultsData.classList.remove('exams__preview-mode') : examResultsData.classList.add('exams__preview-mode')
            dataPreview.classList.contains('exams-preview--display') ? dataPreview.classList.remove('exams-preview--display') : dataPreview.classList.add('exams-preview--display')
        }

    })

    // Exams Change Events

    examResultsModal.addEventListener('change', function(e){

        /* This event will be fired every time a change occurs over a an input element which type is a file, what this
            event will do is, that it will fill the Filename data cell with the name of the file.*/
        if (e.target.nodeName === 'INPUT' && e.target.type === 'file'){
            let parent = e.target.parentNode.parentNode
            let filenameSpace
            for (let i = 0; i<parent.childNodes.length; i++){
                if (parent.childNodes[i].classList){
                    if (parent.childNodes[i].classList.contains('exams__filename')){
                        filenameSpace = parent.childNodes[i]
                    }
                }
            }
            filenameSpace.innerText = e.target.files[0]['name']
        }
    })

}

/*############################################ Modal Event Listeners ####################################*/

if (modal){

    // Modal MouseOver event listeners
    modal.addEventListener('mouseover', (e) => {

        // This event will be fired every time the target contains the 'fa-plus' class, it will add the 'fa-plus-hover' class to it.
        if (e.target.classList.contains('modal__add-item')){
            e.target.classList.add('modal__add-item--active')
        }

       // This event will be fired every time the target is an input, and it will add the input-active class to it.

        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-active')
        }

        // This event will be fired every time the target is a button, and it will add the button hover class to it.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /* This event will be fired every time the target is a table data cell inside the record's table, this event will perform
            various actions, it will change some styles of the row and will grab the 'data-url' attribute from the row,
            to display the information in the summary section.*/

        if (e.target.closest('.record')){
            let row = e.target.closest('.record')
            let consultSummary = document.querySelector('.records-summary')
            let url = row.getAttribute('data-url')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
            consultSummaryAW(url)
            .then(data => {
                consultSummary.innerHTML = data['html']
            })
        }

    })


    // Modal MouseOut event listeners
    modal.addEventListener('mouseout', (e) => {

        // This event will be fired every time the target contains the 'fa-plus' class, it will add the 'fa-plus-hover' class to it.

        if (e.target.classList.contains('modal__add-item')){
            e.target.classList.remove('modal__add-item--active')
        }

       // This event will be fired every time the target is an input, and it will remove the input-active class to it.

        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }

        // This event will be fired every time the target is a button, and it will remove the button hover class to it.

        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

      /* This event will be fired every time the target is a table cell inside the records table, every time a hover out occurs,
         this event will remove the styles previously set to the table row. */

        if (e.target.closest('.record')){
            let row = e.target.closest('.record')
            row.style.backgroundColor = ''
            row.style.color = ''
        }

    })


    // Modal Click Event Listeners

    modal.addEventListener('click', (e) => {

//        e.preventDefault()
//        e.stopPropagation()


        // This event will be fired every time the target contains the 'fa-plus' class, it will display the corresponding form.
        if (e.target.classList.contains('modal__add-item')){
            let url = e.target.getAttribute('data-url')
            requestElementCreationFormAsync(url)
            .then(data => {
                modalContent.innerHTML = data['html']
            })
        }


        // This event will be fired every time the target is the modal itself, or a button with 'No' as it's text content, this will remove the 'modal-show' class from the modal.
        if (e.target === modal || e.target === modalContent || (e.target.nodeName === 'BUTTON' && e.target.textContent === 'No')){
            modalContent.innerHTML = modalBackUp
            modal.classList.remove('modal--display')
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
                    prescriptionModal.classList.add('prescription-modal--display')
                    modal.classList.remove('modal--display')
                }
            })
            .catch(error => {
                form.submit()
            })
        }
   })


   //   Modal Submit Events

   modal.addEventListener('submit', (e) => {

       e.stopPropagation()
       e.preventDefault()

       let url = e.target.action
       let method = e.target.method
       let formData = new FormData(e.target)
       let csrfmiddlewaretoken = document.querySelector('.modal [name=csrfmiddlewaretoken]').value

        /* This event will be fired every time a submit occurs and the target contains the 'add-medical-test-form' class, this will
           create MedicalTest instances, and return an updated list as a response. */

       if (e.target.id = 'add-medical-test-form'){
            addElementAsync(url, method, formData, csrfmiddlewaretoken)
            .then(data => {
                if (data['html']){
                    modalContent.innerHTML = data['html']
                }else{
                    testing.innerHTML = data['updated_tests_list']
                    let checkboxes = document.querySelectorAll('#id_testing input[type=checkbox]')
                    for (let i = 0; i<checkedTests.length; i++){
                        let checkedTest = checkedTests[i]
                        for (let j = 0; j<checkboxes.length; j++){
                            if (checkedTest.value === checkboxes[j].value){
                                checkboxes[j].checked = true
                            }
                        }
                     }
                    modal.classList.remove('modal--display')
                }
            })
       }

        /* This event will be fired every time a submit occurs and the target contains the 'add-drug-form' class, this will
           create Drug instances, and return an updated list as a response. */

       if (e.target.id = 'add-drug-form'){

            addElementAsync(url, method, formData, csrfmiddlewaretoken)
            .then(data => {
                if (data['html']){
                    modalContent.innerHTML = data['html']
                }else{
                    drugsList.innerHTML = data['updated_drugs_list']
                    let checkboxes = document.querySelectorAll('#id_drugs input[type=checkbox]')
                    for (let i = 0; i<checkedDrugs.length; i++){
                        let checkedDrug = checkedDrugs[i]
                        for (let j = 0; j<checkboxes.length; j++){
                            if (checkedDrug.value === checkboxes[j].value){
                                checkboxes[j].checked = true
                            }
                        }
                     }
                    modal.classList.remove('modal--display')
                }
            })
       }


       /* This event will be fired every time a submit occurs and the target contains the 'vaccination-operation-form' class, this will
           create Vaccination Records instances, and return an updated list as a response. */

       if (e.target.id === 'add-vaccine-record-form'){
            addElementAsync(url, method, formData, csrfmiddlewaretoken)
            .then(data => {
                modal.classList.remove('modal--display')
            })
       }

       /* This event will be fired every time a submit occurs and the target contains the 'add-vaccine-operation' id, this will
           create Vaccine instances, and return an updated form as a response. */

       if (e.target.id === 'add-vaccine-form'){
            url = url + '/' + e.target.getAttribute('data-primary-key')
            addElementAsync(url, method, formData, csrfmiddlewaretoken)
            .then(data => {
                if (data['html']){
                    modalContent.innerHTML = data['html']
                }
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