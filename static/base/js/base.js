/*
    This base.js file contains all the variable declarations, async and sync functions and event listeners for the base
    template to work properly.
*/

///////////////////////////////////////////////// Variables ////////////////////////////////////////////////////////////
let username = document.querySelector('.social-section').getAttribute('data-user')
let loaderModal = document.querySelector('.global-loader-modal')
let globalNavigator = document.querySelector('.global-navigator')
let socialSection = document.querySelector('.social-section')
let socialSectionData = document.querySelector('.social-section__data')
let socialSectionTabs = document.querySelectorAll('.social-section__tab')
let notificationsPopup = document.querySelector('.notifications-popup')
let chatWindow = document.querySelector('.social-section__chat-content')

///////////////////////////////////////////////// Functions ////////////////////////////////////////////////////////////

// Async functions

async function displayContactsAW(url){
    /*The displayContactsAW async function is used to display all the contacts the user is linked with, it takes
      a single argument: url, used to perform the request to the server, the response will be return in json format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function displayChatAW(url){
    /*The displayChatAW async function is used to display all the chats the user has opened, it takes a single
      argument: url, used to perform the request to the server, the response will be return in json format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function sendMessageAW(url, method, csrfmiddlwaretoken, formData){
    /*The displayChatAW async function is used to display all the chats the user has opened, it takes a single
      argument: url, used to perform the request to the server, the response will be return in json format.*/
    const result = await fetch(url, {'method': method, 'headers': {'X-CSRFToken': csrfmiddlwaretoken}, 'body': formData})
    const data = result.json()
    return data
}

async function displayRequestsAW(url){
    /*The displayRequestsAW async function is used to display all the requests the user has received, it takes a
      single argument: url, used to perform the request to the server, the response will be return in json format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

async function requestResponseAW(url){
    /*The requestResponseAW async function is used to accept or deny any requests the user has received, it receives
      a single argument: url, which contains the request reply along with it. The response will be returned in json
      format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

// Sync functions

function displayMessage(fromUser, message){
    /* This displayMessage function is used to display the messages inside the chatWindow, it takes two arguments, the
       sender and the message itself, we will create a div element to store our message, and add the message body, we
       will check if the identity variable contains the same user as the fromUser parameter, if the condition is fulfilled
       the 'message' class will be added, else the 'reply' class will be added, afterwards, the message will be added to
       the chatWindow and the chatWindow scroll will be set to the bottom.*/
    let messageContent = document.createElement('div')
    messageContent.textContent = message
    fromUser === identity ? messageContent.classList.add('social-section__message') : messageContent.classList.add('social-section__reply')
    chatWindow.appendChild(messageContent)
    chatWindow.scrollTop = chatWindow.scrollHeight
}

// WebSockets

// Notifications WebSocket Url
NWSUrl = 'ws://' + window.location.host
let notificationWebsocket = new WebSocket(NWSUrl)

notificationWebsocket.addEventListener('message', (e) => {
    if (notificationsPopup.getAttribute('data-status') === 'True'){
        notificationsPopup.classList.add('notification-popup--display')
        notificationsPopup.textContent = e.data
        setTimeout(function(){
            notificationsPopup.classList.remove('notification-popup--display')
        }, 5000)
    }
})

// Chat Websocket URL
let CWSUrlBluePrint = 'ws://' + window.location.host + '/chat'
let chatWebsocket = null

function activateChatWebSocketEvents(CWS){
    if (CWS !== null){
        CWS.addEventListener('message', (e) => {
            data = JSON.parse(e.data)
            if (data['username'] != username){
                let messageContainer = document.createElement('div')
                messageContainer.classList.add('social-section__reply')
                messageContainer.textContent = data['message']
                chatWindow.appendChild(messageContainer)
            }
        })
    }
}


///////////////////////////////////////////////// Event Listeners //////////////////////////////////////////////////////

window.addEventListener('mousemove', (e) => {

    /* This event will be fired every time the cursor is 50px or more in the Y Axis and 5px or less in the X Axis, this event
       will display the globalNavigator, if the it does not fulfills these conditions, the navigator will not be shown or it
       will be hidden.*/
    if (globalNavigator){
        if ((e.clientY >= 50) && (e.clientX <= 0)){
        globalNavigator.classList.add('global-navigator--display')
        }else if (e.clientX > globalNavigator.offsetWidth){
            globalNavigator.classList.remove('global-navigator--display')
        }
    }

    /* This event will be fired every time the cursor is 10px less than the screen width this event will display the socialSection,
       if the it does not fulfills these conditions, the socialSection will not be shown or it will be hidden.*/
    if (socialSection){
        if (e.clientX >= (window.screen.width - 1) && !socialSection.classList.contains('social-section--display')){
            socialSection.classList.add('social-section--display')
            if (socialSectionData.innerHTML == ""){
                let url = socialSectionTabs[0].getAttribute('data-url')
                socialSectionTabs[0].classList.add('social-section__tab--active')
                displayContactsAW(url)
                .then(data => {
                    socialSectionData.innerHTML = data['html']
                })
            }
        }else if (e.clientX <= (window.screen.width - socialSection.offsetWidth)){
            socialSection.classList.remove('social-section--display')
        }
    }

})

// Global Navigator Event Listeners
if (globalNavigator){

    // Mouseover Events
    globalNavigator.addEventListener('mouseover', (e) => {

        /* This event will be triggered any time the target contains either the global-navigator-tab, fas or fa-times class,
           the global-navigator-tab-hover class will be added*/
        if (e.target.closest('.global-navigator__tab')){
            let tab = e.target.closest('.global-navigator__tab')
            tab.classList.add('global-navigator__tab--active')
        }

    })

    // Mouseout Events
    globalNavigator.addEventListener('mouseout', (e) => {

        /* This event will be triggered any time the target contains either the global-navigator-tab, fas or fa-times class,
           the global-navigator-tab-hover class will be removed*/
        if (e.target.closest('.global-navigator__tab')){
            let tab = e.target.closest('.global-navigator__tab')
            tab.classList.remove('global-navigator__tab--active')
        }

    })

}

// Social Section Event Listeners
if (socialSection){

    // Mouseover events
    socialSection.addEventListener('mouseover', (e) => {

        /* This event will be triggered whenever the target contains the cell class, some styles will be edited and added.*/
        if (e.target.closest('.social-section__cell')){
            let cell = e.target.closest('.social-section__cell')
            cell.style.backgroundColor = "#FFFFFF"
            cell.style.color = "#000000"
        }

        // This event will be triggered every time the target contains the 'social-section-tab' class, social-section-tab-hover class will be added
         if (e.target.classList.contains('social-section__tab')){
            e.target.classList.add('social-section__tab--active-hover')
         }

        // This event will be triggered every time the target contains the accept-contact-request class, accept-contact-request-hover class will be added
        if (e.target.classList.contains('social-section__accept-contact-request')){
            e.target.classList.add('social-section__accept-contact-request--active')
        }

        // This event will be triggered every time the target contains the deny-contact-request class, deny-contact-request-hover class will be added
        if (e.target.classList.contains('social-section__deny-contact-request')){
            e.target.classList.add('social-section__deny-contact-request--active')
        }

        // This event will be triggered every time the target contains the send-message-btn class, send-message-btn-hover class will be added
       /* Why is it not working with the social-section__send-message-button class? */
        if (e.target.classList.contains('fa-paper-plane')){
            e.target.classList.add('social-section__send-message-button--active')
        }

    })

    socialSection.addEventListener('mouseout', (e) => {

        /* This event will be triggered whenever the target contains the cell class, some styles will be edited and removed.*/
        if (e.target.closest('.social-section__cell')){
            let cell = e.target.closest('.social-section__cell')
            cell.style.backgroundColor = ''
            cell.style.color = ''
        }

        // This event will be triggered every time the target contains the 'social-section-tab' class, social-section-tab-hover class will be removed
        if (e.target.classList.contains('social-section__tab')){
            e.target.classList.remove('social-section__tab--active-hover')
        }

        // This event will be triggered every time the target contains the accept-contact-request class, accept-contact-request-hover class will be removed
        if (e.target.classList.contains('social-section__accept-contact-request')){
            e.target.classList.remove('social-section__accept-contact-request--active')
        }

        // This event will be triggered every time the target contains the deny-contact-request-hover class, deny-contact-request-hover class will be removed
        if (e.target.classList.contains('social-section__deny-contact-request')){
            e.target.classList.remove('social-section__deny-contact-request--active')
        }

        // This event will be triggered every time the target contains the send-message-btn class, send-message-btn-hover class will be removed
       /* Why is it not working with the social-section__send-message-button class? */
        if (e.target.classList.contains('fa-paper-plane')){
            e.target.classList.remove('social-section__send-message-button--active')
        }

    })

    // Click Events
    socialSection.addEventListener('click', (e) => {


        /* This event will be fired whenever the target contains the social-section-tab class in it's
           classList, when the event is fired all the tabs will have the social-section-tab-active class
           removed, and the target will have the same class added, afterwards the url will be collected
           from the data-url attribute in the target and the parameters will be added, we will make use
           of the displayContactsAW to request the information from the server, the response will be added
           to the socialSectionData.innerHTML */
        if (e.target.classList.contains('social-section__tab')){
            for (let i = 0; i<socialSectionTabs.length; i++){
                socialSectionTabs[i].classList.remove('social-section__tab--active')
            }
            e.target.classList.add('social-section__tab--active')
            let url = e.target.getAttribute('data-url')
            displayContactsAW(url)
            .then(data => {
                socialSectionData.innerHTML = data['html']
            })
        }

        /* This event will be fired every time the classList contains the accept-contact request or deny-contact-request
           class, we will grab the url from the data-url attribute, and the response from the data-response
           attribute, these are the parts that will shape our URL, we will make use the requestResponseAW async
           function to send the user response to the server, the server response with the updated content will be
           added to the socialSectionData.innerHTML*/
        if (e.target.classList.contains('social-section__accept-contact-request') || e.target.classList.contains('social-section__deny-contact-request')){
            e.preventDefault()
            e.stopPropagation()
            let url = e.target.getAttribute('data-url') + '?response=' + e.target.getAttribute('data-response')
            requestResponseAW(url)
            .then(data => {
                if (data['html']){
                    socialSectionData.innerHTML = data['html']
                    if (data['accepted']){
                        notificationWebsocket.send(JSON.stringify({'to': data['to'], 'created_by': data['created_by'], 'message': ' just accepted your contact addition request', 'nf_type': 'contact_request_accepted'}))
                    }
                }else{
                    e.target.parentNode.remove()
                }
            })
        }

        /* This event will be fired whenever the target contains the chat class in its classList, we will
           collect the url from the data-url attribute, we need this to make the request to the server, the response
           contains the token and extra elements we need to create our instance of the Twilio Chat Client. The
           ['html'] response will be added to the socialSectionData.innerHTML, the response also contains an
           ['identity'] key and a ['channel_name'] key, these will be stored inside inside the identity and
           and channelName variables, we also set the chatWindow variable to the div which will contain the messages,
           To create our chat client we use the create function in Twilio.Chat.Client and we pass the token we received
           from the response inside the ['token'] key, this function will make a request to the Twilio servers and return
           a promise we will consume, it will return the client instance, so we store it inside the chatClient class.
           after the collect our chatClient instance we get it's subscribed channels, making use of the
           getSubscribedChannels function. This will return a promise we will consume, and we will call the
           createOrJoinChannel function.*/
        if (e.target.closest('.social-section__chat')){
            let chatUrl = e.target.closest('.social-section__chat').getAttribute('data-url')
            let pk = e.target.closest('.social-section__chat').getAttribute('data-pk')
            let CWSUrl = CWSUrlBluePrint + '?pk=' + pk
            // Closing current websocket connection, if there is one.
            if (chatWebsocket !== null){
                chatWebsocket.close()
            }
            chatWebsocket = new WebSocket(CWSUrl)
            activateChatWebSocketEvents(chatWebsocket)
            displayChatAW(chatUrl)
            .then(data => {
                socialSectionData.innerHTML = data['html']
                chatWindow = document.querySelector('.social-section__chat-content')
            })
        }

        /* This event will be fired every time the target contains fa-paper-plane in it's classList, this event will collect
           the value from the #id_message element, and check if there is a channel available, if the condition is
           fulfilled, the channel sendMessage function will be called, passing the message as it's parameter. Finally
           the #id_message element will be cleared.*/

           /* Why is it not working with the social-section__send-message-button class? */
        if (e.target.classList.contains('fa-paper-plane')){
            let message = document.querySelector('#id_text').value
            if (message.length > 0){
                let form = socialSection.querySelector('form')
                let action = form.action
                let method = form.method
                let csrfmiddlwaretoken = socialSection.querySelector('[name=csrfmiddlewaretoken]').value
                let formData = new FormData(form)
                let pk = form.getAttribute('data-chat-pk')
                sendMessageAW(action, method, csrfmiddlwaretoken, formData)
                .then((data) => {
                    if (data['success'] == true){
                        chatWebsocket.send(JSON.stringify({'pk': pk, 'message': message, 'username': username}))
                        document.querySelector('#id_text').value = ''
                        let messageContainer = document.createElement('div')
                        messageContainer.classList.add('social-section__message')
                        messageContainer.textContent = message
                        chatWindow.appendChild(messageContainer)
                    }
                })
            }
        }
    })

    /* This event will be fired whenever the enter key is pressed, it will collect the value inside the #id_message element
       and pass it to the sendMessage Twilio Channel instance method for further processing.*/
    socialSection.addEventListener('keypress', (e) => {
        if (e.which === 13){
            let message = document.querySelector('#id_text').value
            if (message.length > 0){
                let form = socialSection.querySelector('form')
                let action = form.action
                let method = form.method
                let csrfmiddlwaretoken = socialSection.querySelector('[name=csrfmiddlewaretoken]').value
                let formData = new FormData(form)
                let pk = form.getAttribute('data-chat-pk')
                sendMessageAW(action, method, csrfmiddlwaretoken, formData)
                .then((data) => {
                    if (data['success'] == true){
                        chatWebsocket.send(JSON.stringify({'pk': pk, 'message': message, 'username': username}))
                        notificationWebsocket.send(JSON.stringify({'to': data['to'], 'message': `You have a received message from ${data['to']}`, 'nf_type':'received_message'}))
                        document.querySelector('#id_text').value = ''
                        let messageContainer = document.createElement('div')
                        messageContainer.classList.add('social-section__message')
                        messageContainer.textContent = message
                        chatWindow.appendChild(messageContainer)
                    }
                })
            }
        }
    })
}

//// Window Event Listeners
//// This event will be fired every time the browser changes it's readyState attribute status

// This event will be fired when the browser readyState attribute changes to online, the global loader will be hidden.
window.addEventListener('online', () => {
  loaderModal.classList.remove('global-loader-modal--display')
})

// This event will be fired when the browser readyState attribute changes to offline, the global loader will be displayed.
window.addEventListener('offline', () => {
  loaderModal.classList.add('global-loader-modal--display')
})