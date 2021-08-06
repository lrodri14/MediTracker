/* This JS File contains all the code to make the Providers App Work, it contains all the variable declarations for code
use, the definition of Asynchronous Functions and Synchronous functions, as well as all the Event Listeners needed to
execute these functions. The Functions Section contains two sections as well "Async Funcs" which contains all the Async
functions, it consists of 11 async function declarations, and the "Sync Funcs" which contains the only Sync functions all
over the file. The Event Listeners Section is composed of 3, the navigation bar events listener sections, the wrapper
event listeners section and the modal event listeners section.*/

// ##################################################### Variables #####################################################

// Available Data
let container = document.querySelector('.data')
let navigation = document.querySelector('.providers-navigation')
let tabs = document.querySelectorAll('.providers-navigation__tab')

// Modal
let modal = document.querySelector('.modal');
let modalContent = document.querySelector('.modal__content');


// #################################################### Functions ######################################################


// Async Functions

async function addProvidersFormAW(url, formType){
    /*Function used to display provider's form dynamically, it accepts two
      parameters, the 'url' for the "GET" request, and the 'formType', which
      we grab from the data-provider-type attribute in our target. This
      function will return the data from the request in JSON Format.*/
    const result = await fetch(url, {headers:{'FORM-TYPE': formType}})
    const data = result.json()
    return data
}

async function addVisitorsFormAW(url){
    /*Function used to display visitor's form, it accepts one parameter,
      the 'url' for the "GET" request, This function will return the data
      from the request in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function updateProvidersFormAW(url){
    /*Function used to display the update provider form, it accepts one parameter,
      the 'url' for the "GET" request, This function will return the data
      from the request in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function deleteProvidersFormAW(url){
    /*Function used to display the delete provider form, it accepts one parameter,
      the 'url' for the "GET" request, This function will return the data
      from the request in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function addUpdateProvidersAW(url, method, csrfmiddlewaretoken, formData){
    /*Function used to add providers to the database, this functions takes
      four parameters, the 'url' for the "POST" request, the 'method' which
      we collect from the form's method attribute, the 'csrfmiddlewaretoken'
      parameter, which receives the value from the csrfmiddlewaretoken attribute
      in every form's hidden input, and lastly the 'formData' the collection of
      all the data values in the form inputs. This function will return the
      result in JSON Format.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function deleteProvidersAW(url, method, csrfmiddlewaretoken){
    /*Function used to add providers to the database, this functions takes
      three parameters, the 'url' for the "POST" request, the 'method' which
      we collect from the form's method attribute, the 'csrfmiddlewaretoken'
      parameter, which receives the value from the csrfmiddlewaretoken attribute
      in every form's hidden input. This function will return the
      result in JSON Format.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}})
    const data = result.json()
    return data
}

async function requestProvidersAW(url){
    /*This function is used to request the providers from the server side every time we
      click on a tab in the navigation bar, it receives two parameters, 'url' for the
      "GET" request, and the 'providerType' which is sent as a header requesting that
      specific type of provider. This function will return it's result in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function requestVisitorsAW(url){
    /*This function is used to request the providers from the server side every time we
      click on a tab in the navigation bar, it receives one parameter, 'url' for the
      "GET" request, This function will return it's result in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function filterProvidersAW(url){
    /*This function is used retrieve specific providers from the server side
      depending on a query sent by a "GET" request. This function takes
      one paramaters, 'url' for the "GET" request This function will return
      it's result in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function filterVisitorsAW(url){
    /*This function is used retrieve specific visitors from the server side
      depending on a query sent by a "GET" request. This function takes
      two parameters, 'url' for the "GET" request, the 'query' which we collect from
      the input in the form. This function will return it's result in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function providerDetailsAW(url){
    /*This function is used to display the provider or visitor details
      in our page, it takes one parameter, the 'url' for the "GET"
      request. This function will return it's result in JSON Format.*/
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

async function collectCountryNumberCode(url){
    /* The collectCountryNumberCode async function is used to request a country number code from the server, this
       function is used to display the correct flag whenever a phone number field is being filled, it expects one
       single argument, url, which is used to make the request to the server, the response will be returned in JSON
       format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

// ##################################################### Event Listeners ###############################################

/////////////////////////////////
// Navigation Bar Event Listeners
if (navigation){

    // Click Events
    navigation.addEventListener('click', (e) => {

        /*This event will be fired every time a navigation bar is clicked, it will remove
          the 'tab-active' class from the all the tabs and add it to the target, so we can
          create an 'active' effect, it will pickup the following values 'url' and 'providerType
          these will be used in the async function called depeding on the tab clicked, if the
          visitors tab is clicked, the providerType variable will be useless. Once the function
          is executed, the JSON Format data will be added to the Wrapper inner HTML.'*/
        if (e.target.classList.contains('providers-navigation__tab')){
            tabs.forEach(tab => tab.classList.remove('providers-navigation__tab--active'))
            e.target.classList.add('providers-navigation__tab--active')
            let providerType = e.target.getAttribute('data-provider-type')
            let url = providerType ? e.target.getAttribute('data-url') + '?provider_type=' + providerType : e.target.getAttribute('data-url')
            if (providerType){
                requestProvidersAW(url)
                .then(data => {
                    container.innerHTML = data['html']
                })
            }else{
                requestVisitorsAW(url)
                .then(data => {
                    container.innerHTML = data['html']
                })
            }
        }

    })

    navigation.addEventListener('mouseover', (e) => {

        /* This event will add the 'tab-hover' class to the target to create a hovering effect. */
        if (e.target.classList.contains('providers-navigation__tab')){
            e.target.classList.add('providers-navigation__tab--hover')
        }

    })

    navigation.addEventListener('mouseout', (e) => {

        /* This event will remove the 'tab-hover' class from the target to create a hover off effect. */
        if (e.target.classList.contains('providers-navigation__tab')){
            e.target.classList.remove('providers-navigation__tab--hover')
        }

    })
}

//////////////////////////
// Wrapper Event Listeners
if (container){

    // Wrapper Click Events
    container.addEventListener('click', (e) => {

        /*This click event will be fired every time the 'fa-plus' icon is clicked,
          it will collect the following data form the target: 'url' form the data-url
          attribute and the 'providerType' from the data-provider-type attribute, and will
          execute an async function depending if the data-provider-type was localized. It will
          open the modal and display the JSON Formatted data in the modal content section,
          it returns a form.*/
        if (e.target.classList.contains('data-table__create') || e.target.classList.contains('add-data')){
            let providerType = e.target.getAttribute('data-provider-type')
            let url = providerType === 'LP' ? e.target.getAttribute('data-url') + '?provider_type=' + providerType : e.target.getAttribute('data-url') + '?provider_type=' + 'MP'
            if (providerType){
                addProvidersFormAW(url)
                .then(data => {
                    modalContent.innerHTML = data['html']
                    modal.classList.add('modal--display')
                })
            }else{
                addVisitorsFormAW(url)
                .then(data => {
                    modalContent.innerHTML = data['html']
                    modal.classList.add('modal--display')
                })
            }
        }

        /*This click event will be fired every time a table row is clicked,
          it will collect the following data form the target: 'url' form the data-url
          attribute, it will execute an async function for this process which will display
          the details of the element the user clicked. it will open the modal and display the
          JSON Formatted data in the modal content section, it returns a card-like template.*/
        if (e.target.closest('.data-table__item')){
            let target = e.target.closest('.data-table__item')
            let url = target.getAttribute('data-url')
            providerDetailsAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        /*This click event will be fired every time a 'fa-filter' icon is clicked,
          it won't collect any data, it will just add or remove the 'filter-form-show'
          class from the filter which resides at the right side of the wrapper, it will
          show up a filtering form.*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            document.querySelector('.filter-container__filter-form').classList.contains('') ? document.querySelector('.filter-form').classList.remove('filter-container__filter-form--display') : document.querySelector('.filter-container__filter-form').classList.add('filter-container__filter-form--display')
        }

        /*This click event will be fired every time a 'fa-edit' icon is clicked,
        it will collect the following data from the target: 'url' from the data-url
        attribute in the target, it will execute an async function, will open up the modal
        and show up the JSON Formatted data in the modal content section, it returns a form*/
        if (e.target.classList.contains('data-table__update')){
            let url = e.target.getAttribute('data-url')
            updateProvidersFormAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        /*This click event will be fired every time a 'fa-trash' icon is clicked,
        it will collect the following data from the target: 'url' from the data-url
        attribute in the target, it will execute an async function, will open up the modal
        and show up the JSON Formatted data in the modal content section, it returns a form*/
        if (e.target.classList.contains('data-table__delete')){
            let url = e.target.getAttribute('data-url')
            deleteProvidersFormAW(url)
            .then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

        if (e.target.classList.contains('data-table__send-mail')){
            let providerType = e.target.getAttribute('data-provider-type')
            let url = e.target.getAttribute('data-url') + '?provider_type=' + providerType
            sendEmailFormAW(url).
            then(data => {
                modalContent.innerHTML = data['html']
                modal.classList.add('modal--display')
            })
        }

    })

    // Wrapper Mouseover Events
    container.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a hover occurs over an item with the add-data class in it, it will add the
           add-data--active class */
        if (e.target.classList.contains('add-data')){
            e.target.classList.add('add-data--active')
        }

        /*This mouseover event is fired every time a hover occurs in a 'fa-plus' icon
          it will add the 'fa-plus-hover' class to the target*/
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.add('data-table__create--active')
        }

        /*This mouseover event is fired every time a hover occurs in a 'fa-edit' icon
          it will add the 'fa-edit-hover' class to the target*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.add('data-table__update--active')
        }

        /*This mouseover event is fired every time a hover occurs in a 'fa-trash' icon
          it will add the 'fa-trash-hover' class to the target*/
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.add('data-table__delete--active')
        }

        /*This mouseover event is fired every time a hover occurs in a 'fa-envelope' icon
          it will add the 'fa-envelope-hover' class to the target*/
        if (e.target.classList.contains('data-table__send-mail')){
            e.target.classList.add('fa-envelope-hover')
        }

        /*This mouseover event is fired every time a hover occurs in a 'fa-filter' icon
          it will add the 'fa-filter-hover' class to the target*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.add('filter-container__filter-display-button--active')
        }

        /*This mouseover event is fired every time a hover occurs in a table row, this event
          must be fired by it's children since it's impossible to hover over a tr element*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

        /*This mouseover event will be fired every time a hover occurs over an input, this will add the input-hover class
          over the target and will increase it's width to 75%*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-active')
        }

    })

    // Wrapper Mouseout Events
    container.addEventListener('mouseout', (e) => {

        /* This event will be fired every time a hover occurs over an item with the add-data class in it, it will remove the
           add-data--active class */
        if (e.target.classList.contains('add-data')){
            e.target.classList.remove('add-data--active')
        }

        /*This mouseout event is fired every time a mouseout event occurs in a 'fa-plus' icon,
          it will remove the 'fa-plus-hover' class to the target*/
        if (e.target.classList.contains('data-table__create')){
            e.target.classList.remove('data-table__create--active')
        }

        /*This mouseout event is fired every time a mouseout event occurs in a 'fa-edit' icon,
          it will remove the 'fa-edit-hover' class to the target*/
        if (e.target.classList.contains('data-table__update')){
            e.target.classList.remove('data-table__update--active')
        }

        /*This mouseout event is fired every time a mouseout event occurs in a 'fa-trash' icon,
          it will remove the 'fa-trash-hover' class to the target*/
        if (e.target.classList.contains('data-table__delete')){
            e.target.classList.remove('data-table__delete--active')
        }

        /*This mouseout event is fired every time a mouseout event occurs in a 'fa-envelope' icon,
          it will remove the 'fa-envelope-hover' class to the target*/
        if (e.target.classList.contains('data-table__send-mail')){
            e.target.classList.remove('fa-envelope-hover')
        }

        /*This mouseout event is fired every time a mouseout event occurs in a 'fa-filter' icon,
          it will remove the 'fa-filter-hover' class to the target*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.remove('filter-container__filter-display-button--active')
        }

        /*This mouseover event is fired every time a hover occurs in a table row, this event
          must be fired by it's children since it's impossible to hover over a tr element*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = ''
            row.style.color = ''
          }

        /*This mouseover event will be fired every time a mouse out occurs over an input, this will remove the input-hover class
          over the target and will decrease it's width to normal.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-active')
        }

    })

    // Wrapper Input Events
    container.addEventListener('input', (e) => {

        /*This event is fired every time the filter form receives an input, for each
        character this event will be fired. It will collect the following data from the
        target: 'url' form the action attribute in the form, 'query' which is collected
        from the input, 'type' which is collected from the classlist of the target. it will
        call an async func depending if the type attribute is present in the classlist
        the data returned in JSON Format is added to the innerHTML from the tbody element.*/
        if (e.target.nodeName === 'INPUT'){
            let form = e.target.parentNode.parentNode
            let query = e.target.value
            let type = form.getAttribute('data-provider-type')
            let url

            switch (type){
                case 'LP':
                case 'MP':
                    url = form.action + '?query=' + query + '&provider_type=' + type
                break
                case null:
                    url = form.action + '?query=' + query
                break
            }

            document.querySelector('#paginator') && document.querySelector('#paginator').remove()

            if (type){
                filterProvidersAW(url)
                .then(data => {
                    document.querySelector('tbody').innerHTML = data['html']
                })
            }else{
                filterVisitorsAW(url)
                .then(data => {
                    document.querySelector('tbody').innerHTML = data['html']
                })
            }
        }
    })

}

////////////////////////
// Modal Event Listeners
if (modal){

    // Modal Click Events
    modal.addEventListener('click', (e) => {

        /*This click event is fired every time the modal or the modal content
        is clicked, it will remove the 'modal-show' class from the modal*/
        if (e.target === modal || e.target === modalContent){
            modal.classList.remove('modal--display')
        }

        /*This click event is fired every time the button inside the modal
        or the modal content is clicked and it's text content contains the
        'No' word, it will remove the 'modal-show' class from the modal.*/
        if (e.target.textContent === 'No' || e.target.textContent === 'Continue'){
            e.preventDefault()
            e.stopPropagation()
            modal.classList.remove('modal--display')
        }

    })

    // Modal Mouseover Events
    modal.addEventListener('mouseover', (e) => {
        /*This event will be fired every time a hover occurs over a
          button, and will add the 'button-hover' class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /*This mouseover event will be fired every time a hover occurs over an input, this will add the input-hover class
          over the target and will increase it's width to 75%*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-hover')
        }
    })

    // Modal Mouseout Events
    modal.addEventListener('mouseout', (e) => {
        /*This event will be fired every time a hover out occurs over a
          button, and will remove the 'button-hover' class to the target.*/
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /*This mouseover event will be fired every time a mouse out occurs over an input, this will remove the input-hover class
          over the target and will decrease it's width to normal.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-hover')
        }

    })

    // Modal Change Events
    modal.addEventListener('change', (e) => {
        /* This event is fired whenever a change is being detected in one of the fields inside the form which resides
           inside the modal, this event will create the url form the location.origin attribute inside the window
           object and a path we specified with the necessary parameters needed to make the request, the response contains
           a country number code we will need to display a new value inside the #id_contact element. We will change the
           flag dynamically grabbing the value from the target to create a whole new class and add it to the flagIcon
           element.*/
        let flagIcon = document.querySelector('.flag-icon')
        if (e.target.id === 'id_country_code'){
            let url = window.location.origin + '/providers/collect_country_number_code?country_code=' + e.target.value
            flagIcon.classList.remove(flagIcon.classList[1])
            flagIcon.classList.add('flag-icon-' + e.target.value.toLowerCase())
            collectCountryNumberCode(url)
            .then(dialling_code => {
                document.querySelector('#id_contact').value = dialling_code['dialling_code']
            })
        }
    })

    // Modal Submit Events
    modal.addEventListener('submit', (e) => {
        e.preventDefault()
        e.stopPropagation()

        /*This submit event will be fired every time a form is submitted, and the form
          contains an id attribute with the 'delete-operation' value, it will collect
          the following data from the target: 'url' which is used to do the "POST" request,
          the 'method' which it collects from the method attribute in the form, the 'csrfmiddlewaretoke',
          used to protect the request against Cross-Site Request Forgeries attacks and collected from the
          '[name=csrfmiddlewaretoken]' hidden input value, the data received in JSON Format will be added
          to the wrapper InnerHTML, it will also make a check in if the '.add-providers' element is present,
          if it is, it will call the addIconLevitate function.*/
        if (e.target.id === 'delete-visitor-form' ||
            e.target.id === 'delete-provider-form'){
            let form = e.target
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            deleteProvidersAW(url, method, csrfmiddlewaretoken)
            .then(data => {
                if (data['updated_html']){
                    modal.classList.remove('modal--display')
                    container.innerHTML = data['updated_html']
                }
            }
          )
        }

        /*This submit event will be fired every time a form is submitted, it will collect
          the following data from the target: 'url' which is used to do the "POST" request,
          the 'method' which it collects from the method attribute in the form, the 'csrfmiddlewaretoke',
          used to protect the request against Cross-Site Request Forgeries attacks and collected from the
          '[name=csrfmiddlewaretoken]' hidden input value, the data received in JSON Format will be added
          to the wrapper InnerHTML, it will also make a check in if the'.add-providers' element is present
          , if it is, it will call the addIconLevitate function.*/

        if (e.target.nodeName === 'FORM'){

            let form = e.target
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)

            if (e.target.id === 'create-provider-form' ||
                e.target.id === 'update-provider-form' ||
                e.target.id === 'create-visitor-form' ||
                e.target.id === 'update-visitor-form'){
                addUpdateProvidersAW(url, method, csrfmiddlewaretoken, formData)
                .then(data => {
                    if (data['html']){
                        modalContent.innerHTML = data['html']
                    }else{
                        modal.classList.remove('modal--display')
                        container.innerHTML = data['updated_html']
                    }
                })
            }else{
                document.querySelector('.loader').classList.add('loader-show')
                sendEmailAW(url, method, csrfmiddlewaretoken, formData)
                .then(data => {
                    modalContent.innerHTML = data['html']
                })
            }

        }
    })
}