/* This home.js file contains all the variable declarations, all the async functions and event listeners used for the
   home page to work properly. */

//////////////////////////////////////////////////////// Variables /////////////////////////////////////////////////////

var searchBar = document.querySelector('#search-bar')
var topMenuElements = document.querySelector('.wrapper-one')
var bottomMenuElements = document.querySelector('.wrapper-two')
var menuTitle = document.querySelector('h1')
var queryResults = document.querySelector('.query-results')
var tiles = document.querySelectorAll('.tile')
var icons = document.querySelectorAll('i')
var logoutTile = document.querySelector('#logout')
var sound = document.querySelector('audio')
var modal = document.querySelector('.modal')

document.querySelector('body').click()

//////////////////////////////////////////////////////// Functions /////////////////////////////////////////////////////

// Async Functions
async function userLookupAW(url){
    /* This userLookupAW function is used to display all the results from the query sent to the server, this function takes
       one single argument, the url along with the parameters to filter the results in the server, the response will
       be returned in JSON Format.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

////////////////////////////////////////////////// Event Listeners /////////////////////////////////////////////////////


// Search Bar Events
// Input Evens
/* This event will be fired every time an input is being types in the searchBar, this event will collect the url
   from the data-url attribute, this event will evaluate a condition, if the value of the target is not empty, the
   menu will be hidden and a the results from the server will be displayed, if the condition is not fulfilled, then
   the menu will be displayed again.*/

if (searchBar){

    searchBar.addEventListener('input', (e) => {

        if (e.target.value !== ''){
            let url = e.target.getAttribute('data-url') + '?query=' + e.target.value
            topMenuElements.classList.add('hide-menu')
            bottomMenuElements.classList.add('hide-menu')
            menuTitle.classList.add('hide-menu')
            userLookupAW(url)
                .then(data => {
                    queryResults.innerHTML = data['html']
                })
            queryResults.classList.add('query-results-show')
        }else{
            queryResults.innerHTML = "";
            topMenuElements.classList.remove('hide-menu')
            bottomMenuElements.classList.remove('hide-menu')
            menuTitle.classList.remove('hide-menu')
            queryResults.classList.remove('query-results-show')
        }

    })

}

// Query Results Event Listeners
if (queryResults){

    // Mouseover events
    queryResults.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
           properties from the row and add tr-hover and td-hover class*/
        if (e.target.nodeName === 'TD'){
            let row
            e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

    })

    queryResults.addEventListener('mouseout', (e) => {

      /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
         properties from the row and removed tr-hover and td-hover class*/
      if (e.target.nodeName === 'TD'){
        let row
        e.target.nodeName === 'TD' ? row = e.target.parentNode : row = e.target.parentNode.parentNode
            row.style.backgroundColor = ''
            row.style.color = ''
      }

    })

}

// Tiles event listeners
for (let i = 0; i<tiles.length; i++){
    // Mouseover events
    /* This event will be fired every time the target is a tile, several styles will be altered */
    tiles[i].addEventListener('mouseover', function(){
        tiles[i].classList.add('tile-hover')
        icons[i].classList.add('i-hover')
        sound.play()
    })

    // Mouseout events
    /* This event will be fired every time the target is a tile, several styles will be removed */
    tiles[i].addEventListener('mouseout', function(){
        tiles[i].classList.remove('tile-hover')
        icons[i].classList.remove('i-hover')
    })
}

// Logout Tile Events
/* This event will be fired every time a click occurs over the logoutTile, this event will show up the modal to confirm logout */
logoutTile.addEventListener('click', (e) => {
    modal.classList.add('modal-show')
})

// Modal Event Listeners
if (modal){

    // Click Events
    modal.addEventListener('click', (e) => {

        // This event will be fired every time the target is the modal, this event will close the modal.
        if (e.target === modal){
            modal.classList.remove('modal-show')
        }

    // This event will be fired every time the target is a button and its textContent is 'Yes', this event will show the loader.
        if (e.target.nodeName === 'BUTTON'){
            if (e.target.textContent === 'Yes'){
                document.querySelector('.logout-loader').classList.add('logout-loader-show')
            }
        }

        // This event will be fired every time the target is a button and its textContent is 'No', this event will close the modal.
        if (e.target.nodeName === 'BUTTON'){
            if (e.target.textContent === 'No'){
                modal.classList.remove('modal-show')
            }
        }

    })

    // Mouseover events
    modal.addEventListener('mouseover', (e) => {
        // This event will be fired every time the target is a button, the button-hover class will be added.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button-hover')
        }
    })

    // Mouse over events
    modal.addEventListener('mouseout', (e) => {
    // This event will be fired every time the target is a button, the button-hover class will be added.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button-hover')
        }
    })

}