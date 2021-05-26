/* This records_list.js file contains all the variable declarations, async function and event listeners for the
   records main page to work properly, this file is divided into three sections: variable declarations, async functions
   and event listeners.*/

/*############################################# Variable Declarations ####################################*/

let container = document.querySelector('.data')
let tbody = document.querySelector('tbody')
let form = document.querySelector('.filter-container__filter-form')


/*#################################################### Functions #########################################*/

async function filterResultsAW(url){
    /* This async function will be used to collect the data from the server through a GET request and some parameters
    declared, this content will be received as a promise, so we need to return it in JSON format so we can process it,
    this content will be set to the dataTable dynamically.*/
    const result = await fetch(url)
    const data = result.json()
    return data
}

/*#################################################### Event Listeners ###################################*/

// Container Event Listeners
if (container){

    //Container mouse over
    container.addEventListener('mouseover', (e) => {

        /* This event will be fired if the classList contains the 'filter-container__filter-display-button' class and it
           will add the 'filter-container__filter-display-button--active' class.
        */
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.add('filter-container__filter-display-button--active')
        }

        // This event will be fired if nodeName is 'BUTTON' and it will add the 'button--active' class.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.add('button--active')
        }

        /*This event will be fired every time a mouse over occurs over a row, This will make changes inside this row.*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = '#FFFFFF'
            row.style.color = '#000000'
        }

    })

    //Container mouse out
    container.addEventListener('mouseout', (e) => {

        /* This event will be fired if the classList contains the 'filter-container__filter-display-button' class and it
           will remove the 'filter-container__filter-display-button--active' class.
        */
        if (e.target.classList.contains('filter-container__filter-display-button')){
            e.target.classList.remove('filter-container__filter-display-button--active')
        }

        // This event will be fired if nodeName is 'BUTTON' and it will remove the 'button--active' class.
        if (e.target.nodeName === 'BUTTON'){
            e.target.classList.remove('button--active')
        }

        /*This event will be fired every time a mouse out occurs over a row, This will make changes inside this row.*/
        if (e.target.closest('.data-table__item')){
            let row = e.target.closest('.data-table__item')
            row.style.backgroundColor = ''
            row.style.color = ''
        }

    })

    //Container Click
    container.addEventListener('click', (e) => {

        /* This event will be fired every time the target's classList contains the 'filter-container__filter-display-button' class, this event will either
            show or hide the filter form depending on the current state*/
        if (e.target.classList.contains('filter-container__filter-display-button')){
            form.classList.contains('filter-container__filter-form--display') ? form.classList.remove('filter-container__filter-form--display') : form.classList.add('filter-container__filter-form--display')
        }

    })

    //Container Submit
    container.addEventListener('submit', (e) => {

        e.preventDefault()

        /*This event will be fired every time a submit occurs and the target is the filter results form
        this event will stop the itself, and collect the data needed to filter the records, this consists of
        the url , once this data is collected from the form, we proceed to call our asynchronous function, the
        response is dynamically displayed in our table.*/
        if (e.target.classList.contains('filter-container__filter-form')){
            let fromDay = document.querySelector('#id_date_from_day').value
            let fromMonth = document.querySelector('#id_date_from_month').value
            let fromYear = document.querySelector('#id_date_from_year').value
            let toDay = document.querySelector('#id_date_to_day').value
            let toMonth = document.querySelector('#id_date_to_month').value
            let toYear = document.querySelector('#id_date_to_year').value
            let fromDate = fromYear + "-" + fromMonth + "-" + fromDay
            let toDate = toYear + "-" + toMonth + "-" + toDay
            const url = e.target.action + '?date_from=' + fromDate + '&date_to=' + toDate
            filterResultsAW(url)
            .then(data => {
                tbody.innerHTML = data['html']
            })
        }
    })

}