/* This profile.js file contains all the variable declarations, all the async and sync functions and event listeners needed
   to display and work the profile template. This file composed of three main components, the variable declarations, the
   function section which contains 4 async functions and finally the event listeners.*/

/*////////////////////////////////////////////////////// Variables ///////////////////////////////////////////////////*/

var body = document.querySelector('body')
var content = document.querySelector('.content')
var editProfilePicture = document.querySelector('.edit-profile-picture-modal')
var editBackgroundPicture = document.querySelector('.background-edit-modal')
var profile = document.querySelector('.profile-picture')
var modal = document.querySelector('.modal')
var modalContent = document.querySelector('.modal-content')

/*////////////////////////////////////////////////////// Functions ///////////////////////////////////////////////////*/

// Async Functions
async function editFormAW(url){
    /* This editFormAW async function is used to display any editing operation form, it takes a single obligatory parameter:
       url, it is used to make the GET request to the server requesting the form. The response will be returned in JSON
       format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function editProfileAW(url, method, csrfmiddlewaretoken, formData){
    /*This editProfileAW function is used to update the profile asynchronously, this function takes 4 parameters we collect
    from the form that fires the submit event, we need to collect the 'url' to where we make our POST request, we also
    need to collect 'method' from the form.method attribute and 'csrfmiddlewaretoken' from the form's hidden input, finally
    we collect the formData from the form and send it in our request, the response will be converted to JSON Format and
    returned for further processing.*/
    const result = await fetch(url, {method:method, headers:{'X-CSRFToken': csrfmiddlewaretoken}, body:formData})
    const data = result.json()
    return data
}

async function sendCancelContactRequest(url){
    /* This sendCancelContactRequest async function is used to send or cancel contact linking requests, it takes a single
       obligatory parameter: url to which the request will be directed, this url comes along with a payload containing
       the 'procedure' key to indicate the server which action to take.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function removeContactAW(url){
    /* This removeContactAW async function is used to remove a contact linking, it takes a single obligatory parameter:
       url to which the request will be directed, this url comes along with a payload containing the 'procedure' key to
       indicate the server which action to take.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

/*//////////////////////////////////////////////// Event Listeners ///////////////////////////////////////////////////*/

// Body Event Listeners
if (body){

    // Mouseover events
    body.addEventListener('mouseover', (e) => {

        /* This event will be fired whenever the 'fa-edit' class resides in the target's classList, the fa-edit-hover class will be added */
        if (e.target.classList.contains('fa-edit')){
            e.target.classList.add('fa-edit-hover')
        }

        /* This event will be fired whenever the 'fa-user-plus' class resides in the target's classList, the fa-user-plus-hover class will be added */

        if (e.target.classList.contains('fa-user-plus')){
            e.target.classList.add('fa-user-plus-hover')
        }

        /* This event will be fired whenever the 'fa-user-slash' class resides in the target's classList, the fa-user-slash-hover class will be added */

        if (e.target.classList.contains('fa-user-slash')){
            e.target.classList.add('fa-user-slash-hover')
        }

        /* This event will be fired whenever the 'fa-trash' class resides in the target's classList, the fa-trash-hover class will be added */

        if (e.target.classList.contains('fa-trash')){
            e.target.classList.add('fa-trash-hover')
        }

        /* This event will be fired whenever the 'fa-camera' class resides in the target's classList, the fa-camera-hover class will be removed */

        if (e.target.classList.contains('fa-camera')){
            e.target.classList.add('fa-camera-hover')
        }

        /* This event will be fired whenever the target's nodeName is 'BUTTON', the button-hover class will be added */

        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }

        /* This event will be fired whenever target is the label of either the #id_profile_pic element or the #id_background_pic, the label-hover class will be added */

        if (e.target === document.querySelector('label[for=id_profile_pic]') || e.target === document.querySelector('label[for=id_background_pic]')){
            e.target.classList.add('label-hover')
        }

        /*This mouseover event will be fired every time a hover occurs over an input, this will add the input-hover class
          over the target and will increase it's width to 75%.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.add('input-hover')
        }
    })

    // Mouseout events
    body.addEventListener('mouseout', (e) => {

        /* This event will be fired whenever the 'fa-edit' class resides in the target's classList, the fa-edit-hover class will be removed */

        if (e.target.classList.contains('fa-edit')){
            e.target.classList.remove('fa-edit-hover')
        }

        /* This event will be fired whenever the 'fa-user-plus' class resides in the target's classList, the fa-user-plus-hover class will be removed */

        if (e.target.classList.contains('fa-user-plus')){
            e.target.classList.remove('fa-user-plus-hover')
        }

        /* This event will be fired whenever the 'fa-user-slash' class resides in the target's classList, the fa-user-slash-hover class will be removed */

        if (e.target.classList.contains('fa-user-slash')){
            e.target.classList.remove('fa-user-slash-hover')
        }

        /* This event will be fired whenever the 'fa-trash' class resides in the target's classList, the fa-trash-hover class will be removed */

        if (e.target.classList.contains('fa-trash')){
            e.target.classList.remove('fa-trash-hover')
        }

        /* This event will be fired whenever the 'fa-camera' class resides in the target's classList, the fa-camera-hover class will be removed */

        if (e.target.classList.contains('fa-camera')){
            e.target.classList.remove('fa-camera-hover')
        }

        /* This event will be fired whenever target is the label of either the #id_profile_pic element or the #id_background_pic, the label-hover class will be removed */

        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-hover')
        }

        if (e.target === document.querySelector('label[for=id_profile_pic]') || e.target === document.querySelector('label[for=id_background_pic]')){
            e.target.classList.remove('label-hover')
        }

       /*This mouseover event will be fired every time a mouse out occurs over an input, this will remove the input-hover class
          over the target and will decrease it's width to normal.*/
        if (e.target.nodeName === 'INPUT'){
            e.target.classList.remove('input-hover')
        }

    })

    body.addEventListener('click', (e) => {

        if (e.target.classList.contains('fa-arrow-alt-circle-down')){
            window.scrollY === 0 ? window.scrollTo({'top': body.scrollHeight, 'behavior': 'smooth'}) : window.scrollTo({'top': 0, 'behavior': 'smooth'})
            e.target.classList.contains('arrow-rotate') ? e.target.classList.remove('arrow-rotate') : e.target.classList.add('arrow-rotate')
        }

        if (e.target.classList.contains('fa-camera')){
            let url = e.target.getAttribute('data-url')
            editFormAW(url).
            then(data => {
                modal.classList.add('modal-show')
                modalContent.innerHTML = data['html']
            })
        }


        /* This event will be fired every time the target contains the fa-edit, fa-pen or fa-camera class in it's classList,
           this event will display the modal adding the modal-show class in its classList, it will collect the url from
           the data-url attribute and the type from the data-type attribute, to display the form it will collect the data
           using the editFormAW async function.*/
        if (e.target.classList.contains('fa-edit')){
            window.scrollTo({'left': body.scrollWidth, 'behavior': 'smooth'})
        }

        /* This event will be fired every time the target's classList contains the fa-user-plus or fa-user-slash
           class in it's classList, this event will collect the url and the procedure from the data-url and data-procedure
           target attributes, the event ises the sendCancelContactRequest async func to make the request, when we receive
           our server response, depending on the response content a process will be executed.*/
        if (e.target.classList.contains('fa-user-plus') || e.target.classList.contains('fa-user-slash')){
            let url = e.target.getAttribute('data-url') + '?procedure=' + e.target.getAttribute('data-procedure')
            sendCancelContactRequest(url)
            .then(data => {
                if (data['success']){
                    if (e.target.classList.contains('fa-user-plus')){
                        e.target.classList.remove('fa-user-plus')
                        e.target.classList.remove('fa-user-plus-hover')
                        e.target.setAttribute('data-procedure', 'cancel')
                        e.target.classList.add('fa-user-slash')
                    }else{
                        e.target.classList.remove('fa-user-slash')
                        e.target.classList.remove('fa-user-slash-hover')
                        e.target.setAttribute('data-procedure', 'send')
                        e.target.classList.add('fa-user-plus')
                    }
                }
            })
        }

        if (e.target.classList.contains('fa-trash')){
            /* This event will be fired every time the target's classList contains the fa-trash class in it's classList,
               the event collect's the data-url from the data-url attribute and makes the request using the removeContactAW
               async func, once we receive a success response, the icon will be changed and the data-url attribute set.*/
            let url = e.target.getAttribute('data-url')
            let contactID = url.slice(url.length - 2, url.length)
            removeContactAW(url)
            .then(data => {
                if (data['success']){
                    e.target.classList.remove('fa-trash')
                    e.target.classList.remove('fa-trash-hover')
                    e.target.setAttribute('data-url', '/accounts/send_cancel_contact_request/' + contactID)
                    e.target.setAttribute('data-procedure', 'send')
                    e.target.classList.add('fa-user-plus')
                }
            })
        }

        if (e.target.classList.contains('modal')){
            /* This event will be fired every time the target is the modal, the modal-show class will be removed. */
            modal.classList.remove('modal-show')
            modalContent.innerHTML = ''
        }

    })

    body.addEventListener('change', (e) => {
        /* This event will be fired every time a change occurs in the #id_profile_pic input, this event will first
           declare some variables, the imageInput which is the target, the imageSelected which is the .profile-pic-selected
           element, the file which we collect from the imageInput element files. The coordinates to make the cropping
           x, y, width, and height, we set the name of the file for the user. we will create a new FileReader Object,
           this instance will be set a load event listener, every time this element catches this event, the imageSelected.src
           attribute will be set to the target result. we will create a Cropper object and pass the image selected along with
           extra parameters to the object. Every time we move the cropper the x,y, width and height values will be changed
           dynamically. This is the data that will be sent to the server.*/
        if (e.target.id === 'id_profile_pic'){
            let imageInput = e.target
            let imageSelected = document.querySelector('.profile-pic-selected')
            let file = imageInput.files[0]
            let x = document.querySelector('#id_x')
            let y = document.querySelector('#id_y')
            let width = document.querySelector('#id_width')
            let height = document.querySelector('#id_height')
            document.querySelector('label[for=id_profile_pic]').innerHTML = file.name
            let reader = new FileReader();
            reader.addEventListener('load', (e) => {
                imageSelected.src = e.target.result
                image = imageSelected
                let cropper = new Cropper(image, {
                  aspectRatio: 4 / 6,
                  background: false,
                  crop(event) {
                    x.value = event.detail.x
                    y.value = event.detail.y
                    width.value = event.detail.width
                    height.value  = event.detail.height
                  },
                });
            })
            reader.readAsDataURL(file)
        }
    })

    body.addEventListener('submit', (e) => {
    /* This event will be fired whenever the body catches a submit event, this event will perform various operations,
    first, the data needed to perform the asynchronous request to the server, the url, method, csrf token and the formData,
    the request will be done, and if the response contains the 'html' key then this means an error was raised and will
    be rendered to the form.*/
        e.preventDefault()
        e.stopPropagation()
        if (e.target.nodeName === 'FORM'){
            let form = e.target
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            editProfileAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['success']){
                    content.innerHTML = data['success']
                    window.scrollTo({'left': 0, 'behavior': 'smooth'})
                }
            })
        }
    })
}

// Modal Event Listeners
if (modal){
    modal.addEventListener('submit', (e) => {
    /* This event will be fired whenever the modal catches a submit event, this event will perform various operations,
       first, the data needed to perform the asynchronous request to the server, the url, method, csrf token and the formData,
       the request will be done, and if the response contains the 'html' key then this means an error was raised and will
       be rendered to the form, if not, then the modal will be closed.*/
        e.preventDefault()
        e.stopPropagation()
        if (e.target.nodeName === 'FORM'){
            let form = e.target
            let url = form.action
            let method = form.method
            let csrfmiddlewaretoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            let formData = new FormData(form)
            editProfileAW(url, method, csrfmiddlewaretoken, formData)
            .then(data => {
                if (data['success']){
                    modalContent.innerHTML = ''
                    modal.classList.remove('modal-show')
                    content.innerHTML = data['success']
                    img = document.querySelector('img')
                    editProfilePicture = document.querySelector('.edit-profile-picture-modal')
                    editBackgroundPicture = document.querySelector('.background-edit-modal')
                    profile = document.querySelector('.profile-picture')
                }else{
                    modalContent.innerHTML = data['html']
                }
            })
        }
    })
}