/*This JS file contains all the variable definitions, async and sync functions, and event listeners for the patient ad-
  dition to perform correctly, the variables are divided into three sections, the backedUpData variables, the management form
  variables and finally the clonedNodes variable, the function section consists of 2 async functions.*/

// ############################################# Variables #############################################################

// backedUpData variables
let allergySelection

// managementFormVariables
let allergiesTotalForms = document.querySelector('#id_allergy_information-TOTAL_FORMS')
let antecedentsTotalForms = document.querySelector('#id_antecedent_information-TOTAL_FORMS')
let allergyFormsCount = 1
let antecedentFormsCount = 1

// clonedNodes Variables
let allergiesFormBlueprint = document.querySelector('.patient-form__allergies-form-container .form-container')
let antecedentsFormBlueprint = document.querySelector('.patient-form__antecedents-form-container .form-container')

let form = document.querySelector('.patient-form')
let inputs = document.querySelectorAll('input')
let generalInfoInputs = document.querySelectorAll('.patient-form__general-information-container input, .patient-form__general-information-container select')
let insuranceSelection = document.querySelector('.patient-form__insurance-form-container select')
let allergiesFormsContainer = document.querySelector('.patient-form__allergies-form-container tbody')
let antecedentsFormsContainer = document.querySelector('.patient-form__antecedents-form-container tbody')

let modal = document.querySelector('.modal')
let modalContent = document.querySelector('.modal__content')

let saveConfirmationModal = document.querySelector('.save-confirmation-modal')

let flagIcon = document.querySelector('.flag-icon')
let selectCountryCode = document.querySelector('#id_country_code')
let phoneNumberField = document.querySelector('#id_phone_number')

// ############################################# Functions #############################################################

async function elementAdditionFormAsync(url){
    /*This async function is used to retrieve the form to add elements as Allergies or Insurance carriers from the ser
      ver, and be able to display it in the modal, the only argument in accepts is an 'url', to where the GET request
      will be done, the data received will be returned in JSON Format.*/
    const result = await fetch(url)
    const data = await result.json()
    return data
}

async function addElementAsync(url, method, csrfmiddlewaretoken, formData){
    /*The addElementsAsync async function is used to add elements to the database asynchronously, it is used to add
      elements as Allergies or Insurance Carriers, it takes four arguments we all retrieve from the form that fires
      the submit event: 'url' to where the POST request will be done, the 'method' that we retrieve from the form.action
      attribute, the 'csrfmiddlewaretoken' the we retrieve from the form's hidden input, and we create a new FormData
      obj from the Form's content. The data received back is converted to JSON Format and returned.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken':csrfmiddlewaretoken}, body:formData})
    const data = await result.json()
    return data
}

async function collectCountryNumberCode(url){
    /* The collectCountryNumberCode async function is used to request a country number code from the server, this
       function is used to display the correct flag whenever a phone number field is being filled, it expects one
       single argument, url, which is used to make the request to the server, the response will be returned in JSON
       format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

// ############################################# Event Listeners #######################################################


if (form){

    // Mouseover events
    form.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a mouse over occurs over a button, the button--active class will be added.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /* This event will be fired every time a mouse over occurs over an input, the input-active class will be added.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-active')
        }

        /* This event will be fired every time the user hovers over an addition operation icon, it will add the form__create--active class */
        if (e.target.classList.contains('form__create-allergy') ||
            e.target.classList.contains('form__create-allergy-form') ||
            e.target.classList.contains('form__create-antecedent-form') ||
            e.target.classList.contains('form__create-insurance')) {
            e.target.classList.add('form__create--active')
        }

        /* This event will be fired every time the user hovers over a deletion operation icon, it will add the form__create--active class */
        if (e.target.classList.contains('form__delete-allergy-form') ||
            e.target.classList.contains('form__delete-antecedent-form')){
            e.target.classList.add('form__delete--active')
        }

    })

    // Mouseover events
    form.addEventListener('mouseout', (e) => {

        /* This event will be fired every time a mouse out occurs over an button, the button--active class will be added.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /* This event will be fired every time a mouse out occurs over an input, the input-active class will be added.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }

        /* This event will be fired every time the user hovers out an addition operation icon, it will remove the form__create--active class */
        if (e.target.classList.contains('form__create-allergy') ||
            e.target.classList.contains('form__create-allergy-form') ||
            e.target.classList.contains('form__create-antecedent-form') ||
            e.target.classList.contains('form__create-insurance')) {
            e.target.classList.remove('form__create--active')
        }

        /* This event will be fired every time the user hovers out a deletion operation icon, it will remove the form__create--active class */
        if (e.target.classList.contains('form__delete-allergy-form') ||
            e.target.classList.contains('form__delete-antecedent-form')){
            e.target.classList.remove('form__delete--active')
        }

    })

    // Mouseover events
    form.addEventListener('click', (e) => {

        /*This event will be fired every time a target will the add-allergy class is clicked, this event will perform
          the following: will extract the 'url' from the data-url attribute, will define the allergySelection variable
          to the current elements inside the select of the allergiesInformation form, the data received will be displayed
          inside the modal, it will display a form for insurance addition.*/
        if (e.target.classList.contains('form__create-allergy')){
            const url = e.target.getAttribute('data-url')
            allergySelection = e.target.parentNode.firstChild
            elementAdditionFormAsync(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }

        /*This event will be fired every time a target will the add-insurance class is clicked, this event will perform
          the following: will extract the 'url' from the data-url attribute, to make the GET request,the data received
          will be displayed inside the modal, it will display a form for insurance addition.*/
        if (e.target.classList.contains('form__create-insurance')){
            const url = e.target.getAttribute('data-url')
            elementAdditionFormAsync(url)
            .then(data => {
                modal.classList.add('modal--display')
                modalContent.innerHTML = data['html']
            })
        }


        /*This event will be fired every time the target contains the add-allergy-form, this event will add another
          form to the list of forms available to add as many instances as needed in the Allergies and Antecedents
          form's list, to create as many instances as the user needs, the event does the following:
          1. Grab the amount of forms in existence.
          2. Grab the hidden input #id_form-TOTAL_FORMS for further modifications.
          3. Clone an allergies_form so we can added to our form's list and change it's attribute values.
          4. Grab the cloned node and through a loop change all it's attributes depending on the input type.
          5. Change the Total Forms Value to the amount of forms available plus one unit.
          6. Append the cloned node to the allergies_form list.*/
        if (e.target.classList.contains('form__create-allergy-form')){
            let formAmount = document.querySelectorAll('.patient-form__allergies-form-container .form-container')
            let clonedNode = allergiesFormBlueprint.cloneNode(true)
            for (let i = 0; i<clonedNode.childNodes.length; i++){
                if (clonedNode.childNodes[i].firstChild){
                    if (clonedNode.childNodes[i].childNodes[0].nodeName === 'SELECT'){
                        clonedNode.childNodes[i].childNodes[0].name = 'allergy_information-' + formAmount.length + '-allergy_type'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_allergy_information-' + formAmount.length + '-allergy_type'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'TEXTAREA'){
                        clonedNode.childNodes[i].childNodes[0].name = 'allergy_information-' + formAmount.length + '-about'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_allergy_information-' + formAmount.length + '-about'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'INPUT' && clonedNode.childNodes[i].childNodes[0].type === 'checkbox'){
                        clonedNode.childNodes[i].childNodes[0].name = 'allergy_information-' + formAmount.length + '-DELETE'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_allergy_information-' + formAmount.length + '-DELETE'
                    }
                }
            }
            allergiesTotalForms.value = formAmount.length + 1
            allergyFormsCount += 1
            allergiesFormsContainer.appendChild(clonedNode)
        }


        /* This event will be fired every time the target contains the delete-allergy-form class in its classlist,
           The event will grab the form container of that particular form, it will check the checkbox to perform
           deletion of that specific form in the backend, and will add the class form--hide to the form container,
           so that it would disappear from the form's list.*/
        if (e.target.classList.contains('form__delete-allergy-form')){
            if (allergyFormsCount > 1){
                let formContainer = e.target.parentNode.parentNode
                for (let i = 0; i<formContainer.childNodes.length; i++){
                    if (formContainer.childNodes[i].firstChild){
                        if (formContainer.childNodes[i].firstChild.type === 'checkbox'){
                            formContainer.childNodes[i].firstChild.checked = true
                        }
                    }
                }
                formContainer.classList.add('form--hide')
                allergyFormsCount -= 1
            }
        }


       /* This event will be fired every time the target contains the add-antecedent-form, this event will add another
          form to the list of forms available to add as many instances as needed in the Allergies and Antecedents
          form's list, to create as many instances as the user needs, the event does the following:
          1. Grab the amount of forms in existence.
          2. Grab the hidden input #id_form-TOTAL_FORMS for further modifications.
          3. Clone an antecedents_form so we can added to our form's list and change it's attribute values.
          4. Grab the cloned node and through a loop change all it's attributes depending on the input type.
          5. Change the Total Forms Value to the amount of forms available plus one unit.
          6. Append the cloned node to the antecedents_form list.*/
        if (e.target.classList.contains('form__create-antecedent-form')){
            let formAmount = document.querySelectorAll('.patient-form__antecedents-form-container .form-container')
            let clonedNode = antecedentsFormBlueprint.cloneNode(true)
            for (let i = 0; i<clonedNode.childNodes.length; i++){
                if (clonedNode.childNodes[i].firstChild){
                    if (clonedNode.childNodes[i].childNodes[0].nodeName === 'INPUT' && clonedNode.childNodes[i].childNodes[0].type === 'text'){
                        clonedNode.childNodes[i].childNodes[0].name = 'antecedent_information-' + formAmount.length + '-antecedent'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_antecedent_information-' + formAmount.length + '-antecedent'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'TEXTAREA'){
                        clonedNode.childNodes[i].childNodes[0].name = 'antecedent_information-' + formAmount.length + '-info'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_antecedent_information-' + formAmount.length + '-info'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'INPUT' && clonedNode.childNodes[i].childNodes[0].type === 'checkbox'){
                        clonedNode.childNodes[i].childNodes[0].name = 'antecedent_information-' + formAmount.length + '-DELETE'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_antecedent_information-' + formAmount.length + '-DELETE'
                    }
                }
            }
            antecedentsTotalForms.value = formAmount.length + 1
            antecedentFormsCount += 1
            antecedentsFormsContainer.appendChild(clonedNode)
        }


        /* This event will be fired every time the target contains the delete-antecedent-form class in its classlist,
           The event will grab the form container of that particular form, it will check the checkbox to perform
           deletion of that specific form in the backend, and will add the class form--hide to the form container,
           so that it would disappear from the form's list.*/
        if (e.target.classList.contains('form__delete-antecedent-form')){
            if (antecedentFormsCount > 1){
                let formContainer = e.target.parentNode.parentNode
                    for (let i = 0; i<formContainer.childNodes.length; i++){
                        if (formContainer.childNodes[i].firstChild){
                            if (formContainer.childNodes[i].firstChild.type === 'checkbox'){
                                formContainer.childNodes[i].firstChild.checked = true
                            }
                        }
                    }
                    formContainer.classList.add('form--hide')
                    antecedentFormsCount -= 1
            }
        }
    })

    // Change Events
    form.addEventListener('change', (e) => {

        /* This event is fired whenever a change is being detected in one of the fields inside the form this event will
           create the url form the location.origin attribute inside the window object and a path we specified with the
           necessary parameters needed to make the request, the response contains a country number code we will need to
           display a new value inside the #id_contact element. We will change the flag dynamically grabbing the value from
           the target to create a whole new class and add it to the flagIcon element.
       */
        if (e.target.classList.contains('#id_country_code')){
            let url = window.location.origin + '/patients/collect_country_number_code?country_code=' + e.target.value
            flagIcon.classList.remove(flagIcon.classList[1])
            flagIcon.classList.add('flag-icon-' + e.target.value.toLowerCase())
            collectCountryNumberCode(url)
            .then(dialling_code => {
                phoneNumberField.value = dialling_code['dialling_code']
            })
        }

    })

    // Mouseover events
    form.addEventListener('submit', (e) => {

        /*This event listener will be fired every time as submit is performed, the event will be cancelled, before submitting
        any content, we first need to check if there are any left blank inputs, if that is the case, we should warn the user
        that the patient's instance information he is creating is not full, but that he can come back to update it any time,
        we show up a modal asking if he will continue filling the form or he will continue later, if he decides to continue
        filling, then the modal will be closed, if not, the form will be submitted.*/
        e.preventDefault()
        e.stopPropagation()
        unfilledInputs = 0
        for (let i = 0; i<generalInfoInputs.length; i++){
            if (generalInfoInputs[i].value !== ''){
                continue
            }else{
                unfilledInputs++
            }
        }
        unfilledInputs === 0 ? form.submit() : saveConfirmationModal.classList.add('save-confirmation-modal--display')
    })

}

// Modal Event Listeners
if (modal){

    // Click Events
    modal.addEventListener('click', (e) => {

        /*This event will be fired every time the target is the modal itself, it will remove the modal-show class.*/
        if (e.target.classList.contains('modal')){
            e.target.classList.remove('modal--display')
        }

    })

    modal.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a mouse over occurs over a button, the button--active class will be added.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /* This event will be fired every time a mouse over occurs over an input, the input-hover class will be added.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-active')
        }

    })

    modal.addEventListener('mouseout', (e) => {

        /* This event will be fired every time a mouse out occurs off a button, the button--active class will be removed.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /* This event will be fired every time a mouse out occurs off an input, the input-hover class will be removed.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }

    })

    modal.addEventListener('submit', (e) => {

        /*This event listener will be fired every time as submit is performed, the event will be cancelled, before submitting
        any content, we grab some data from the target as it is, the 'url' to where the POST request will be done, the
        'method' we grab from the method attribute in the target, the 'csrfmiddlewaretoken' we grab from the hidden input
        inside the form, and we create a new FormData from the data inside the form, if the target contains the 'add-allergy'
        class, then the select list of the available allergies will be updated, else the insurance selection will be updated.*/
        e.preventDefault()
        e.stopPropagation()
        const url = e.target.action
        const method = e.target.method
        const csrfmiddlewaretoken = e.target.childNodes[0].value
        const formData = new FormData(e.target)

        if (e.target.id === 'add-allergy-form'){
            addElementAsync(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['html']){
                    modalContent.innerHTML = data['html']
                }else{
                    allergySelection.innerHTML = data['updated_selections']
                    modal.classList.remove('modal-show')
                }
            })
        }

        if (e.target.id === 'add-insurance-form'){
            addElementAsync(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['html']){
                    modalContent.innerHTML = data['html']
                }else{
                    insuranceSelection.innerHTML = data['updated_selections']
                    modal.classList.remove('modal-show')
                }
            })
        }


    })

}

// Confirmation Modal Event Listeners
if (saveConfirmationModal){

    // Mouseover events
    saveConfirmationModal.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a mouse over occurs over a button, the button--active class will be added.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

    })

    // Mouseout Events
    saveConfirmationModal.addEventListener('mouseout', (e) => {

        /* This event will be fired every time a mouse out occurs off a button, the button--active class will be removed.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

    })

    // Click Events
    saveConfirmationModal.addEventListener('click', (e) => {

        /*This event will be fired every time the target is the modal itself or a button with "No" in its text content.*/
        if (e.target === saveConfirmationModal || (e.target.nodeName === 'BUTTON' && e.target.textContent === 'No')){
            saveConfirmationModal.classList.remove('save-confirmation-modal--display')
        }

        /*This event will be fired every time the target is button with "Yes" in its text content.*/
        if (e.target.nodeName === 'BUTTON' && e.target.textContent === 'Yes'){
            form.submit()
        }

    })
}