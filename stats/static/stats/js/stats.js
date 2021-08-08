/* This JS file contains all the variable declarations, Async functions and functions, and event listeners needed for
the Reports main page to work properly. */

// ################################################ Variables ##########################################################

let container = document.querySelector('.container')
let visualizationSectionHeader = document.querySelector('.visualization-section-header')
let visualizationContainer = document.querySelector('.container__visualization__data')
let fullViewVisualizer = document.querySelector('.container__visualization__full-view')
let filterFormContainer = document.querySelector('.container__visualization-filter__form')

// Selected with D3 for future operations
let fullViewBody = d3.select('.full-view')

// Components

components = {
    'containers': {
        'addition': '.patient-addition',
        'age': '.age-distribution',
        'gender': '.gender-distribution',
        'consultGrowth': '.consult-growth',
        'consultTimeFrequency': '.consult-time-frequency',
        'medicalStatusDistribution': '.medical-status-distribution',
        'statusDistribution': '.status-distribution',
        'fullView': '.full-view',
    },
    'dimensions': {
        'small': {'bodyHeight': 225, 'bodyWidth': 350, 'translation': {'x': 40, 'y': 40}},
        'medium': {'bodyHeight': 300, 'bodyWidth': 700, 'translation': {'x': 90, 'y': 65}},
        'large': {'bodyHeight': 400, 'bodyWidth': 750, 'translation': {'x': 55, 'y': 65}}
    }

}

// Data
let patientsData = {}
let consultsData = {}

// Data loading and processing
let patientsDataUrl = document.querySelector('.patients-stats').getAttribute('data-url')
let consultsDataUrl = document.querySelector('.consults-stats').getAttribute('data-url')
processPatientData(patientsDataUrl)
processConsultsData(consultsDataUrl)

// ################################################ Functions ##########################################################

function cleanUpFullViewVisualizer(clean_filter=false){
    fullViewBody.html('')
    fullViewBody.append('text').attr('class', 'header large-widget-header').attr('font-weight', 'bolder')
    fullViewBody.append('g').attr('class', 'body')
    fullViewBody.select('.body').append('g').attr('class', 'x-axis')
    fullViewBody.select('.body').append('g').attr('class', 'y-axis')
    if (clean_filter){
        filterFormContainer.innerHTML = ''
    }
}

// ########################################## Async Functions ##########################################################

async function requestLayout(url){
    let response = await fetch(url)
    let data = await response.json()
    return data
}

async function requestFilterForm(url){
    let response = await fetch(url)
    let data = await response.json()
    return data
}

// ########################################## Event Listeners ##########################################################

// Container Event Listeners

if (container){

    // Mouseover events
    container.addEventListener('mouseover', (e) => {
        // This event will add the container__cc__tab--active class if the target or the target's parent contains the container__cc__tab class
        if (e.target.closest('.container__navigation__tab')){
           e.target.closest('.container__navigation__tab').classList.add('container__navigation__tab--hover')
        }

        if (e.target.closest('.container__visualization__s-widget') || e.target.closest('.container__visualization__m-widget')){
            e.target.classList.add('container__visualization--active')
        }

    })

    // Mouseout Events
    container.addEventListener('mouseout', (e) => {
        // This event will remove the container__cc__tab--active class if the target or the target's parent contains the container__cc__tab class
        if (e.target.closest('.container__navigation__tab')){
            e.target.closest('.container__navigation__tab').classList.remove('container__navigation__tab--hover')
        }

        if (e.target.closest('.container__visualization__s-widget') || e.target.closest('.container__visualization__m-widget')){
            e.target.classList.remove('container__visualization--active')
        }


    })

    // Click Events
    container.addEventListener('click', (e) => {

        // This event will request the desired information to the server and display the visualization in the graph container
        if (e.target.closest('.container__navigation__tab')){
            let target = e.target.closest('.container__navigation__tab')
            document.querySelectorAll('.container__navigation__tab').forEach((el) => {el.classList.remove('container__navigation__tab--active')})
            target.classList.add('container__navigation__tab--active')
            fullViewVisualizer.classList.remove('container__visualization__full-view--display')
            cleanUpFullViewVisualizer(clean_filter=true)
            visualizationContainer.classList.remove('container__visualization__data--hide')
            let layoutUrl = target.getAttribute('data-layout-url')
            requestLayout(layoutUrl)
            .then((data) => {

                if (target.classList.contains('patients-stats')){
                    visualizationSectionHeader.innerText = 'Patients Data Visualization'
                    visualizationContainer.innerHTML = data['html']
                    displayPatientsData()
                }

                if (e.target.classList.contains('consults-stats')){
                    visualizationSectionHeader.innerText = 'Consults Data Visualization'
                    visualizationContainer.innerHTML = data['html']
                    displayConsultsData()
                }

                if (e.target.classList.contains('incomes-stats')){
                    console.log('incomes')
                }

            })
            .catch((error) => {
                console.log(error)
            })
        }

        if (e.target.closest('.patient-addition') ||
            e.target.closest('.age-distribution') ||
            e.target.closest('.gender-distribution') ||
            e.target.closest('.status-distribution') ||
            e.target.closest('.medical-status-distribution') ||
            e.target.closest('.consult-growth') ||
            e.target.closest('.consult-time-frequency')){

            visualizationContainer.classList.add('container__visualization__data--hide')
            fullViewVisualizer.classList.add('container__visualization__full-view--display')
            container = components.containers.fullView
            dimensions = components.dimensions.large

            if (e.target.closest('.patient-addition')){
                visualizePatientCreationCount(patientsData.dateCreationCount, container, dimensions)
            }else if (e.target.closest('.age-distribution')){
                visualizePatientAgeData(patientsData.ageRanges, container, dimensions)
            }else if (e.target.closest('.gender-distribution')){
                visualizePatientGenData(patientsData.genderCount, container, dimensions)
            }else if (e.target.closest('.status-distribution')){
                visualizeStatusCount(consultsData.statusCount, container, dimensions)
            }else if (e.target.closest('.medical-status-distribution')){
                visualizeMedicalStatusCount(consultsData.medicalStatusCount, container, dimensions)
            }else if (e.target.closest('.consult-growth')){
                visualizeConsultsDateCount(consultsData.consultsDateCount, container, dimensions)
            }else if (e.target.closest('.consult-time-frequency')){
                visualizeConsultsAttendanceHourFrequency(consultsData.consultsAttendanceHourFrequency, container, dimensions)
            }

            let filter_request_url = e.target.getAttribute('data-url')
            requestFilterForm(filter_request_url)
            .then((data) => {
                filterFormContainer.innerHTML = data['html']
            })
            .catch((error) => {
                console.log(error)
            })

        }

    })

    container.addEventListener('change', (e) => {
        container = components.containers.fullView
        dimensions = components.dimensions.large
        if (e.target.closest('.creation-date-filter')){
            let year = parseInt(e.target.value)
            cleanUpFullViewVisualizer()
            visualizePatientCreationCount(patientsData.dateCreationCount, container, dimensions, year)
        }else if (e.target.closest('.gender-dist-filter')){
            let gender = e.target.value
            cleanUpFullViewVisualizer()
            visualizePatientGenData(patientsData.genderCount, container, dimensions, gender)
        }else if (e.target.closest('.age-dist-filter')){
            cleanUpFullViewVisualizer()
            let ageFromSelector = document.querySelector('#id_age_from')
            let ageToSelector = document.querySelector('#id_age_to')
            let ageRange = [parseInt(ageFromSelector.value), parseInt(ageToSelector.value)]
            visualizePatientAgeData(patientsData.ageRanges, container, dimensions, ageFrom = ageRange[0], ageTo=ageRange[1])
        }else if (e.target.closest('.status-dist-filter')){
            cleanUpFullViewVisualizer()
            let status = e.target.value
            visualizeStatusCount(consultsData.statusCount, container, dimensions, status)
        }else if (e.target.closest('.medical-status-dist-filter')){
            cleanUpFullViewVisualizer()
            let medicalStatus = e.target.value
            visualizeMedicalStatusCount(consultsData.medicalStatusCount, container, dimensions, medicalStatus)
        }else if (e.target.closest('.consult-count-filter')){
            let dateFromMonth = document.querySelector('#id_date_from_month').value
            let dateFromDay = document.querySelector('#id_date_from_day').value
            let dateFromYear = document.querySelector('#id_date_from_year').value
            let dateToMonth = document.querySelector('#id_date_to_month').value
            let dateToDay = document.querySelector('#id_date_to_day').value
            let dateToYear = document.querySelector('#id_date_to_year').value
            let dateFromDate = new Date(dateFromMonth + '/' + dateFromDay + '/' + dateFromYear)
            let dateToDate = new Date(dateToMonth + '/' + dateToDay + '/' + dateToYear)
            cleanUpFullViewVisualizer()
            visualizeConsultsDateCount(consultsData.consultsDateCount, container, dimensions, dateFromDate, dateToDate)
        }else if (e.target.closest('.consult-hour-frequency-filter')){
            let hourFrom = document.querySelector('#id_hour_from').value
            let hourTo = document.querySelector('#id_hour_to').value
            cleanUpFullViewVisualizer()
            visualizeConsultsAttendanceHourFrequency(consultsData.consultsAttendanceHourFrequency, container, dimensions, hourFrom, hourTo)
        }
    })

}