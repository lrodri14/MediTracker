/*This JS file contains all the variable definitions, async and sync functions, and event listeners for the patient ad-
  dition to perform correctly, the variables are divided into three sections, the backedUpData variables, the management form
  variables and finally the clonedNodes variable, the function section consists of 2 async functions.*/

// ############################################# Variables #############################################################

// backedUpData variables
var allergySelection

// managementFormVariables
var allergiesTotalForms = document.querySelector('.allergies_management_form > #id_form-TOTAL_FORMS')
var antecedentsTotalForms = document.querySelector('.antecedents_management_form > #id_form-TOTAL_FORMS')

// clonedNodes Variables
var allergiesFormBlueprint = document.querySelector('.allergies-form .form-container').cloneNode(true)
var antecedentsFormBlueprint = document.querySelector('.antecedents-form .form-container').cloneNode(true)

var form = document.querySelector('form')
var inputs = document.querySelectorAll('input')
var generalInfoInputs = document.querySelectorAll('.general-info input, .general-info select')
var button = document.querySelectorAll('button')
var extraInfo = document.querySelector('.extra-info')
var insuranceSelection = document.querySelector('.insurance-form select')
var allergiesFormsContainer = document.querySelector('.allergies-form tbody')
var antecedentsFormsContainer = document.querySelector('.antecedents-form tbody')
var modal = document.querySelector('.modal')
var modalContent = document.querySelector('.modal-content')
var saveConfirmationModal = document.querySelector('.save-confirmation-modal')
var flagIcon = document.querySelector('.flag-icon')
var selectCountryCode = document.querySelector('#id_country_code')
var phoneNumberField = document.querySelector('#id_phone_number')


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


// Form Submit Event Listener
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
    unfilledInputs === 0 ? form.submit() : saveConfirmationModal.classList.add('save-confirmation-modal-show')
})


if (selectCountryCode){
    /* This event is fired whenever a change is being detected in one of the fields inside the form this event will
       create the url form the location.origin attribute inside the window object and a path we specified with the
       necessary parameters needed to make the request, the response contains a country number code we will need to
       display a new value inside the #id_contact element. We will change the flag dynamically grabbing the value from
       the target to create a whole new class and add it to the flagIcon element.*/
    selectCountryCode.addEventListener('change', (e) => {
        let url = window.location.origin + '/patients/collect_country_number_code?country_code=' + e.target.value
        flagIcon.classList.remove(flagIcon.classList[1])
        flagIcon.classList.add('flag-icon-' + e.target.value.toLowerCase())
        collectCountryNumberCode(url)
        .then(dialling_code => {
            phoneNumberField.value = dialling_code['dialling_code']
        })
    })
}


// Button Event Listeners
for (let i = 0; i<button.length; i++){
    /* This event will be fired every time a mouse over occurs over a button, the button-hover class will be added.*/
    button[i].addEventListener('mouseover', function(){
        this.classList.add('button-hover')
    })

    /* This event will be fired every time a mouse out occurs off a button, the button-hover class will be removed.*/
    button[i].addEventListener('mouseout', function(){
        this.classList.remove('button-hover')
    })
}

for (var i = 0; i<inputs.length; i++){
    /* This event will be fired every time a mouse over occurs over an input, the input-hover class will be added.*/
    inputs[i].addEventListener('mouseover', function(){
        this.classList.add('input-hover')
    })
    /* This event will be fired every time a mouse out occurs off an input, the button-hover class will be removed.*/
    inputs[i].addEventListener('mouseout', function(){
        this.classList.remove('input-hover')
    })
}

// Extra Info Event Listeners
if (extraInfo){

    // Mouse Over events
    extraInfo.addEventListener('mouseover', (e) =>{
        /* This event will be fired every time a mouse over occurs over a fa-plus icon, the fa-plus-hover class will be added.*/
        if (e.target.classList.contains('fa-plus')){
            e.target.classList.add('fa-plus-hover')
        }

        /* This event will be fired every time a mouse over occurs over a fa-trash icon, the fa-trash-hover class will be added.*/
        if (e.target.classList.contains('fa-trash')){
            e.target.classList.add('fa-trash-hover')
        }
    })

    extraInfo.addEventListener('mouseout', (e) =>{
        /* This event will be fired every time a mouse out occurs off fa-plus icon, the fa-plus-hover class will be removed.*/
        if (e.target.classList.contains('fa-plus')){
            e.target.classList.remove('fa-plus-hover')
        }

        /* This event will be fired every time a mouse out occurs off fa-trash icon, the fa-trash-hover class will be removed.*/
        if (e.target.classList.contains('fa-trash')){
            e.target.classList.remove('fa-trash-hover')
        }
    })

    // Click Events
    extraInfo.addEventListener('click', (e) =>{

        /*This event will be fired every time a target will the add-allergy class is clicked, this event will perform
          the following: will extract the 'url' from the data-url attribute, will define the allergySelection variable
          to the current elements inside the select of the allergiesInformation form, the data received will be displayed
          inside the modal, it will display a form for insurance addition.*/
        if (e.target.classList.contains('add-allergy')){
            const url = e.target.getAttribute('data-url')
            allergySelection = e.target.parentNode.firstChild
            elementAdditionFormAsync(url)
            .then(data => {
                modal.classList.add('modal-show')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('add-insurance')){
            /*This event will be fired every time a target will the add-insurance class is clicked, this event will perform
              the following: will extract the 'url' from the data-url attribute, to make the GET request,the data received
              will be displayed inside the modal, it will display a form for insurance addition.*/
            const url = e.target.getAttribute('data-url')
            elementAdditionFormAsync(url)
            .then(data => {
                modal.classList.add('modal-show')
                modalContent.innerHTML = data['html']
            })
        }

        if (e.target.classList.contains('add-allergy-form')){
            /*This event will be fired every time the target contains the add-allergy-form, this event will add another
              form to the list of forms available to add as many instances as needed in the Allergies and Antecedents
              form's list, to create as many instances as the user needs, the event does the following:
              1. Grab the amount of forms in existence.
              2. Grab the hidden input #id_form-TOTAL_FORMS for further modifications.
              3. Clone an allergies_form so we can added to our form's list and change it's attribute values.
              4. Grab the cloned node and through a loop change all it's attributes depending on the input type.
              5. Change the Total Forms Value to the amount of forms available plus one unit.
              6. Append the cloned node to the allergies_form list.*/
            let formAmount = document.querySelectorAll('.allergies-form .form-container')
            let allergyTotalForms = document.querySelector('.allergies_management_form #id_allergy_info-TOTAL_FORMS')
            let clonedNode = document.querySelector('.allergies-form .form-container:last-child').cloneNode(true)
            for (let i = 0; i<clonedNode.childNodes.length; i++){
                if (clonedNode.childNodes[i].firstChild){
                    if (clonedNode.childNodes[i].childNodes[0].nodeName === 'SELECT'){
                        clonedNode.childNodes[i].childNodes[0].name = 'allergy_info-' + formAmount.length + '-allergy_type'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_allergy_info-' + formAmount.length + '-allergy_type'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'TEXTAREA'){
                        clonedNode.childNodes[i].childNodes[0].name = 'allergy_info-' + formAmount.length + '-about'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_allergy_info-' + formAmount.length + '-about'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'INPUT' && clonedNode.childNodes[i].childNodes[0].type === 'checkbox'){
                        clonedNode.childNodes[i].childNodes[0].name = 'allergy_info-' + formAmount.length + '-DELETE'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_allergy_info-' + formAmount.length + '-DELETE'
                    }
                }
            }
            allergyTotalForms.value = formAmount.length + 1
            allergiesFormsContainer.appendChild(clonedNode)
        }

        if (e.target.classList.contains('delete-allergy-form')){
            /* This event will be fired every time the target contains the delete-allergy-form class in its classlist,
               The event will grab the form container of that particular form, it will check the checkbox to perform
               deletion of that specific form in the backend, and will add the class form-hide to the form container,
               so that it would disappear from the form's list.*/
            let formContainer = e.target.parentNode.parentNode
            for (let i = 0; i<formContainer.childNodes.length; i++){
                if (formContainer.childNodes[i].firstChild){
                    if (formContainer.childNodes[i].firstChild.type === 'checkbox'){
                        formContainer.childNodes[i].firstChild.checked = true
                    }
                }
            }
            formContainer.classList.add('form-hide')
        }

        if (e.target.classList.contains('add-antecedent-form')){
           /* This event will be fired every time the target contains the add-antecedent-form, this event will add another
              form to the list of forms available to add as many instances as needed in the Allergies and Antecedents
              form's list, to create as many instances as the user needs, the event does the following:
              1. Grab the amount of forms in existence.
              2. Grab the hidden input #id_form-TOTAL_FORMS for further modifications.
              3. Clone an antecedents_form so we can added to our form's list and change it's attribute values.
              4. Grab the cloned node and through a loop change all it's attributes depending on the input type.
              5. Change the Total Forms Value to the amount of forms available plus one unit.
              6. Append the cloned node to the antecedents_form list.*/
            let formAmount = document.querySelectorAll('.antecedents-form .form-container')
            let antecedentsTotalForms = document.querySelector('.antecedents_management_form #id_antecedent_info-TOTAL_FORMS')
            let clonedNode = antecedentsFormBlueprint.cloneNode(true)
            for (let i = 0; i<clonedNode.childNodes.length; i++){
                if (clonedNode.childNodes[i].firstChild){
                    if (clonedNode.childNodes[i].childNodes[0].nodeName === 'INPUT' && clonedNode.childNodes[i].childNodes[0].type === 'text'){
                        clonedNode.childNodes[i].childNodes[0].name = 'antecedent_info-' + formAmount.length + '-antecedent'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_antecedent_info-' + formAmount.length + '-antecedent'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'TEXTAREA'){
                        clonedNode.childNodes[i].childNodes[0].name = 'antecedent_info-' + formAmount.length + '-info'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_antecedent_info-' + formAmount.length + '-info'
                    }else if (clonedNode.childNodes[i].childNodes[0].nodeName === 'INPUT' && clonedNode.childNodes[i].childNodes[0].type === 'checkbox'){
                        clonedNode.childNodes[i].childNodes[0].name = 'antecedent_info-' + formAmount.length + '-DELETE'
                        clonedNode.childNodes[i].childNodes[0].id = 'id_antecedent_info-' + formAmount.length + '-DELETE'
                    }
                }
            }
            antecedentsTotalForms.value = formAmount.length + 1
            antecedentsFormsContainer.appendChild(clonedNode)
        }

        if (e.target.classList.contains('delete-antecedent-form')){
            /* This event will be fired every time the target contains the delete-antecedent-form class in its classlist,
               The event will grab the form container of that particular form, it will check the checkbox to perform
               deletion of that specific form in the backend, and will add the class form-hide to the form container,
               so that it would disappear from the form's list.*/
            let formContainer = e.target.parentNode.parentNode
            for (let i = 0; i<formContainer.childNodes.length; i++){
                if (formContainer.childNodes[i].firstChild){
                    if (formContainer.childNodes[i].firstChild.type === 'checkbox'){
                        formContainer.childNodes[i].firstChild.checked = true
                    }
                }
            }
            formContainer.classList.add('form-hide')
        }

    })
}

// Modal Event Listeners
if (modal){
    // Click Events

    modal.addEventListener('click', (e) => {
        /*This event will be fired every time the target is the modal itself, it will remove the modal-show class.*/
        if (e.target.classList.contains('modal')){
            e.target.classList.remove('modal-show')
        }
    })

    modal.addEventListener('mouseover', (e) => {
        /* This event will be fired every time a mouse over occurs over a button, the button-hover class will be added.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }

        /* This event will be fired every time a mouse over occurs over an input, the input-hover class will be added.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-hover')
        }
    })

    modal.addEventListener('mouseout', (e) => {
        /* This event will be fired every time a mouse out occurs off a button, the button-hover class will be removed.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-hover')
        }

        /* This event will be fired every time a mouse out occurs off a input, the input-hover class will be removed.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-hover')
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
        const form = e.target
        const url = form.action
        const method = form.method
        const csrfmiddlewaretoken = e.target.childNodes[0].value
        const formData = new FormData(form)
        if (e.target.classList.contains('add-allergy')){
            addElementAsync(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['html']){
                    modalContent.innerHTML = data['html']
                }else{
                    allergySelection.innerHTML = data['updated_selections']
                    modal.classList.remove('modal-show')
                }
            })
        }else{
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
    // Click Events
    saveConfirmationModal.addEventListener('click', (e) => {
        /*This event will be fired every time the target is the modal itself or a button with "No" in its text content.*/
        if (e.target === saveConfirmationModal || (e.target.nodeName === 'BUTTON' && e.target.textContent === 'No')){
            saveConfirmationModal.classList.remove('save-confirmation-modal-show')
        }

        /*This event will be fired every time the target is button with "Yes" in its text content.*/
        if (e.target.nodeName === 'BUTTON' && e.target.textContent === 'Yes'){
            form.submit()
        }
    })
}