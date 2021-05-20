/* This home.js file contains all the variable declarations, all the async functions and event listeners used for the
   home page to work properly. */

//////////////////////////////////////////////////////// Variables /////////////////////////////////////////////////////

var searchBar = document.querySelector('.main-menu__search-bar')
var topMenuElements = document.querySelector('.main-menu__upper-row')
var bottomMenuElements = document.querySelector('.main-menu__lower-row')
var menuTitle = document.querySelector('.main-menu__title')
var queryResults = document.querySelector('.data-table__query-results')
var tiles = document.querySelectorAll('.main-menu__tile')
var icons = document.querySelectorAll('main-menu__tile-icon')
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
            topMenuElements.classList.add('main-menu__elements--fade-out')
            bottomMenuElements.classList.add('main-menu__elements--fade-out')
            menuTitle.classList.add('main-menu__elements--fade-out')
            userLookupAW(url)
                .then(data => {
                    queryResults.innerHTML = data['html']
                })
            queryResults.classList.add('data-table__query-results--display')
        }else{
            queryResults.innerHTML = "";
            topMenuElements.classList.remove('main-menu__elements--fade-out')
            bottomMenuElements.classList.remove('main-menu__elements--fade-out')
            menuTitle.classList.remove('main-menu__elements--fade-out')
            queryResults.classList.remove('data-table__query-results--display')
        }

    })

}

// Query Results Event Listeners
if (queryResults){

    // Mouseover events
    queryResults.addEventListener('mouseover', (e) => {

        /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
           properties from the row and add tr-hover and td-hover class*/
        if (e.target.classList.contains('data-table__data')){
            let row = e.target.parentNode
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

    })

    queryResults.addEventListener('mouseout', (e) => {

      /* This event will be fired every time a hover occurs in the icons or a td cell, this will change many style
         properties from the row and removed tr-hover and td-hover class*/
        if (e.target.classList.contains('data-table__data')){
            let row = e.target.parentNode
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
        tiles[i].classList.add('main-menu__tile--active')
        sound.play()
    })

    // Mouseout events
    /* This event will be fired every time the target is a tile, several styles will be removed */
    tiles[i].addEventListener('mouseout', function(){
        tiles[i].classList.remove('main-menu__tile--active')
    })
}

// Logout Tile Events
/* This event will be fired every time a click occurs over the logoutTile, this event will show up the modal to confirm logout */
logoutTile.addEventListener('click', (e) => {
    modal.classList.add('modal--display')
})

// Modal Event Listeners
if (modal){

    // Click Events
    modal.addEventListener('click', (e) => {

        // This event will be fired every time the target is the modal, this event will close the modal.
        if (e.target === modal){
            modal.classList.remove('modal--display')
        }

        // This event will be fired every time the target is a button and its textContent is 'Yes', this event will show the loader.
        if (e.target.classList.contains('modal__button')){
            if (e.target.textContent === 'Yes'){
                document.querySelector('.modal__logout-loader').classList.add('modal__logout-loader--display')
            }else{
                modal.classList.remove('modal--display')
            }
        }

    })

    // Mouseover events
    modal.addEventListener('mouseover', (e) => {

        // This event will be fired every time the target is a button, the button-hover class will be added.
        if (e.target.classList.contains('modal__button')){
            e.target.classList.add('modal__button--active')
        }

    })

    // Mouse over events
    modal.addEventListener('mouseout', (e) => {

        // This event will be fired every time the target is a button, the button-hover class will be added.
        if (e.target.classList.contains('modal__button')){
            e.target.classList.remove('modal__button--active')
        }

    })

}