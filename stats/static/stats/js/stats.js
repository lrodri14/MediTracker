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

// Data loading and processing
let url = document.querySelector('.patients-stats').getAttribute('data-url')
processPatientData(url)

// ################################################ Functions ##########################################################

function calculateAgeRanges(data){

    let ageRanges = {'0-10': 0,'11-20': 0,'21-30': 0,'31-40': 0,'41-50': 0,'51-60': 0,'61-70': 0,'71-80': 0,'81-90': 0,'91-100': 0,'101-': 0}

    for (let i = 0; i<data.length; i++){
        let age = data[i].age
        if (age >= 0 && age <= 10){
            ageRanges['0-10'] += 1
        }else if (age >= 11 && age <= 20){
            ageRanges['11-20'] += 1
        }else if (age >= 21 && age <= 30){
            ageRanges['21-30'] += 1
        }else if (age >= 31 && age <= 40){
            ageRanges['31-40'] += 1
        }else if (age >= 41 && age <= 50){
            ageRanges['41-50'] += 1
        }else if (age >= 51 && age <= 60){
            ageRanges['51-60'] += 1
        }else if (age >= 61 && age <= 70){
            ageRanges['61-70'] += 1
        }else if (age >= 71 && age <= 80){
            ageRanges['71-80'] += 1
        }else if (age >= 81 && age <= 90){
            ageRanges['81-90'] += 1
        }else if (age >= 91 && age <= 100){
            ageRanges['91-100'] += 1
        }else{
            ageRanges['101-'] += 1
        }
    }

    ageRanges = Object.entries(ageRanges).filter((d) => {return d[1] !== 0})
    return ageRanges
}


function calculateDateCreationCount(data){

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let dateCreationCount = d3.rollup(data, (d) => {return d.length}, (y) => {return y.dateCreated.getFullYear()}, (m) => {return months[m.dateCreated.getMonth()]})
    return dateCreationCount

}

function processPatientData(url){

    d3.json(url)
    .then((data) => {

         // Load and transform data
        let today = new Date()
        data = data.map((d) => {return {'pk': d.pk,'gender': d.fields.gender,'age': today.getYear() - new Date(d.fields.birthday).getYear(),'dateCreated': new Date(d.fields.date_created)}})
               .sort((d1, d2) => {return d3.ascending(d1.dateCreated, d2.dateCreated)})

        let genderCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.gender})).map((d) => {return {'gender': d[0], 'amount': d[1]}})
        let dateCreationCount = calculateDateCreationCount(data)
        let ageRanges = calculateAgeRanges(data)

        // ProcessedData
        patientsData = {'gender': {'data': genderCount}, 'age':{'data': ageRanges}, 'creationCount': {'data': dateCreationCount}}
    })
    .catch((error) => {
        console.log(error)
    })
}


function visualizePatientCreationCount(data, container, dimensions, requestedYear = new Date().getFullYear()){

    // Collect Data
    data = Array.from(data.data.get(requestedYear)).map((d) => {return {'month': d[0], 'amount': d[1]}})
    let max = d3.max(data, (d) => {return d.amount})
    let bodyWidth = dimensions.bodyWidth
    let bodyHeight = dimensions.bodyHeight
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let ticksLength = max < 10 ? max : 10

    // Map data to Image Space
    visContainer = d3.select(container)
    let containerBody = visContainer.select('.body')
    visContainer.select('.header').text('Patient Addition - ' + requestedYear)
    let join = visContainer.select('.body')
                            .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
                            .append('path')
                            .datum(data)

    let dataPoints = containerBody.selectAll('circle')
                                 .data(data)

    // Compute layout
    let xScale = d3.scaleBand(data.map((d) => {return d.month}), [0, bodyWidth]).padding(1)
    let yScale = d3.scaleLinear([0, max], [bodyHeight, 0])
    let xAxis = d3.axisBottom(xScale).tickSize(-bodyHeight).tickPadding(10)
    let yAxis = d3.axisLeft(yScale).tickSize(-bodyWidth).tickPadding(10).ticks(ticksLength)
    let lineGen = d3.line()
                  .x((d) => {return xScale(d.month)})
                  .y((d) => {return yScale(d.amount)})
                  .curve(d3.curveCatmullRom)


    // Draw Chart
    visContainer.select('.x-axis')
                 .call(xAxis)
                 .attr('transform', 'translate(0,' + bodyHeight + ')')
                 .selectAll('line')
                 .attr('opacity', 0.5)

    visContainer.select('.y-axis')
                 .call(yAxis)
                 .selectAll('line')
                 .attr('opacity', 0.5)

    join.attr('d', lineGen)
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', '3px')
        .attr('fill', 'none')

    dataPoints.enter()
              .append('circle')
              .attr('id', (d) => {return d.month})
              .attr('data-amount', (d) => {return d.amount})
              .attr('r', 5)
              .attr('cx', (d) => {return xScale(d.month)})
              .attr('cy', (d) => {return yScale(d.amount)})
              .attr('fill', '#FFFFFF')

    let paths = join.nodes().map((d) => {return d})
    let pathsTotalLength = paths.map((d) => {return d.getTotalLength()})

   d3.select(paths[0])
      .attr("stroke-dasharray", pathsTotalLength[0] + " " + pathsTotalLength[0] )
      .attr("stroke-dashoffset", pathsTotalLength[0])
      .transition()
      .duration(2500)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);

   if (container === '.full-view'){

        let containerBody = visContainer.select('.body')

        let tooltip = containerBody.append('g')
                                   .attr('class', 'tooltip')

        let bg = tooltip.append('rect')
                        .attr('height', '30px')
                        .attr('rx', '5px')
                        .attr('fill', 'rgba(0,0,0,0)')

        let message = tooltip.append('text')
                             .attr('fill', '#FFFFFF')
                             .attr('font-weight', 'bolder')
                             .attr('transform', 'translate(5, 20)')

        containerBody.selectAll('circle').on('mouseover', function(d){
            this.style.fill = '#1f77b4'
            this.style.transition = '0.5s'
            message.text(this.id + ' - ' + this.getAttribute('data-amount'))
            bg.attr('fill', 'rgba(0,0,0,0.5)').attr('width', this.getAttribute('data-amount') < 10 ? '60px' : '70px')
        })

        containerBody.selectAll('circle').on('mouseout', function(d){
            this.style.fill = ''
            this.style.transition = '0.5s'
            message.text('')
            bg.attr('fill', 'rgba(0,0,0,0)')
        })

        containerBody.on('mousemove', function(d){
            let x = d3.pointer(d)[0] - 20
            let y = d3.pointer(d)[1] + 20
            tooltip.attr('transform', 'translate(' + x + ',' + y + ')')
        })

   }
}


function visualizePatientAgeData(data, container, dimensions, ageFrom = null, ageTo = null){

    // Collect Data
    data = data.data
    if (ageFrom !== null && ageTo !== null){
        data = data.slice(ageFrom, (ageTo + 1))
        console.log(data, ageFrom, ageTo)
    }
    let max = d3.max(data, (d) => {return d[1]})
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let ticksLength = max < 10 ? max : 10

    // Map data to image space
    let visContainer = d3.select(container)
    visContainer.select('.header').text('Age Distribution')
    let join = visContainer
               .select('.body')
               .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
               .selectAll('rect')
               .data(data)

    // Compute layout
    let colorScale = d3.scaleOrdinal(data.map((d) => {return d[0]}), d3.schemeCategory10)
    let yScale = d3.scaleLinear([0, max], [bodyHeight, 0])
    let xScale = d3.scaleBand(data.map((d) => {return d[0]}), [0, bodyWidth]).padding(0.3)
    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale).ticks(ticksLength)

    // Draw Chart
    visContainer.select('.x-axis')
                 .call(xAxis)
                 .attr('transform', 'translate(0,' + bodyHeight + ')')

    visContainer.select('.y-axis')
                 .call(yAxis)

    join.enter()
        .append('rect')
        .attr('x', (d) => {return xScale(d[0])})
        .attr('y', bodyHeight)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', (d) => {return colorScale(d[0])})
        .attr('id', (d) => {return d[0]})
        .attr('data-amount', (d) => {return d[1]})

    visContainer.selectAll('rect')
                 .transition()
                 .duration(2500)
                 .attr('y', (d) => {return yScale(d[1])})
                 .attr('height', (d) => {return bodyHeight - yScale(d[1])})

    if (container === '.full-view'){

        let containerBody = visContainer.select('.body')

        let tooltip = containerBody.append('g')
                                   .attr('class', 'tooltip')
                                   .attr('transform', 'translate(0, 0)')

        let bg = tooltip.append('rect')
                        .attr('class', 'bg')
                        .attr('rx', '5px')
                        .attr('height', '50px')
                        .attr('width', '120px')
                        .attr('fill', 'rgba(0,0,0,0)')
                        .style('pointer-events', 'none')

        let rangeIndicatorMessage = tooltip.append('text')
                             .attr('font-weight', 'bolder')
                             .attr('fill', '#FFFFFF')
                             .attr('transform', 'translate(8, 17)')

         let amountMessage = tooltip.append('text')
                                    .attr('font-weight', 'bolder')
                                    .attr('fill','#FFFFFF')
                                    .attr('transform', 'translate(8, 40)')

        containerBody.selectAll('rect').on('mouseover', function(d){

            rangeIndicatorMessage.text('Range: ' + this.getAttribute('id'))
            amountMessage.text('Total: ' + this.getAttribute('data-amount'))
            bg.style('fill' , 'rgba(0,0,0,0.5)')
            this.style.fill = '#FFFFFF'

        })

        containerBody.selectAll('rect').on('mouseout', function(d){
           d3.selectAll('rect:not(.bg):not(.tooltip-arrow)').nodes().forEach((d) => {d.style.fill = ''
                                                                                     d.style.transition = '0.5s'})
           bg.style('fill', 'rgba(0,0,0,0)')
           rangeIndicatorMessage.text('')
           amountMessage.text('')
        })

        containerBody.selectAll('rect').on('mousemove', function(d){
            let y = d3.pointer(d)[1] - 28
            tooltip.attr('transform', 'translate(' + (xScale(this.id) + 55) + ',' + y + ')')
        })

    }

}

function visualizePatientGenData(data, container, dimensions, gender='all'){

    // Preparing Data
    data = gender === 'all' ? data.data : data.data.filter((d) => {return d.gender === gender})
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let total = d3.sum(data, (d) => {return d.amount})
    let masculineTotal = gender === 'all' || gender === 'M' ? data[0].gender === 'M' ? data[0].amount : data[1].amount : 0
    let femenineTotal = gender === 'all' || gender === 'F' ? data[0].gender === 'F' ? data[0].amount : data[1].amount : 0
    let percentages = {'masculine': masculineTotal ? Math.round((masculineTotal / total) * 100) : 0, 'femenine': femenineTotal ? Math.round((femenineTotal / total) * 100) : 0}
    let totalCentering

    if (total  < 10){
        totalCentering = ((bodyWidth / 2) - 5)
    }else if (total < 100){
        totalCentering = ((bodyWidth / 2) - 10)
    }else{
        totalCentering = ((bodyWidth / 2) - 19)
    }

    // Compute Layout
    let pie = d3.pie().value((d) => {return d.amount})
    let arc = d3.arc().innerRadius(container === '.full-view' ? 100 : 50).outerRadius(bodyHeight / 2)

    // Map data to image space
    let visContainer = d3.select(container)
    let containerBody = visContainer.select('.body')
    visContainer.select('.header').text('Gender Distribution')
    let join = visContainer
               .select('.body')
               .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
               .selectAll('.arc')
               .data(pie(data))

    // Draw Chart
    join.enter()
        .append('path')
        .attr('d', arc)
        .attr('id', (d) => {return d.data.gender})
        .attr('transform', 'translate(' + (bodyWidth / 2) + ',' + (bodyHeight / 2) + ')')
        .attr('fill', (d) => {return d.data.gender === 'M' ? '#1f77b4' : '#dd1c77'})

    let masculinePercentageText = container === '.full-view' ? 'Masculine - ' + percentages.masculine + '%' : percentages.masculine + '%'
    let femeninePercentageText = container === '.full-view' ? 'Femenine - ' + percentages.femenine + '%' : percentages.femenine + '%'
    visContainer.append('rect').attr('fill', '#1f77b4').attr('height', '10').attr('width', '10').attr('transform', 'translate(10,' + (bodyHeight - 21) + ')')
    visContainer.append('rect').attr('fill', '#dd1c77').attr('height', '10').attr('width', '10').attr('transform', 'translate(10,' + bodyHeight + ')')
    visContainer.append('text').text(masculinePercentageText).attr('transform', 'translate(25,' + (bodyHeight - 12) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')
    visContainer.append('text').text(femeninePercentageText).attr('transform', 'translate(25,' + (bodyHeight + 9) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')

    if (container === '.full-view'){

        containerBody.append('text').text(total).attr('transform', 'translate(' + totalCentering  + ',' + (bodyHeight / 2) + ')').attr('fill', '#FFFFFF')

        let tooltip = containerBody.append('g').attr('class', 'tooltip')

        let bg = tooltip.append('rect')
                        .attr('fill', 'rgba(255,255,255,0)')
                        .attr('width', '130px')
                        .attr('height', '25px')
                        .attr('rx', '10')

        let message = tooltip.append('text')
                             .attr('fill', '#FFFFFF')
                             .attr('font-weight', 'bolder')
                             .attr('transform', 'translate(10, 18)')

        d3.selectAll('path').on('mouseover', function(d){
            this.style.fill = '#FFFFFF'
            this.style.transition = '1s'
            this.id === 'M' ? bg.attr('fill', '#1f77b4') : bg.attr('fill', '#dd1c77')
            this.id === 'M' ? message.text('Masculine - ' + masculineTotal) : message.text('Femenine - ' + femenineTotal)
        })

        d3.selectAll('path').on('mouseout', function(d){
            this.style.fill = ''
            this.style.transition = '1s'
            bg.attr('fill', 'rgba(255,255,255,0)')
            message.text('')
        })

        containerBody.on('mousemove', function(d){
            let x = d3.pointer(d)[0] - 10
            let y = d3.pointer(d)[1] - 30
            tooltip.attr('transform', 'translate(' + x + ',' + y + ')')
        })
    }
}

function displayPatientsData(){
    visualizePatientCreationCount(patientsData.creationCount, components.containers.addition, components.dimensions.medium)
    visualizePatientAgeData(patientsData.age, components.containers.age, components.dimensions.small)
    visualizePatientGenData(patientsData.gender, components.containers.gender, components.dimensions.small)
}

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
            document.querySelectorAll('.container__navigation__tab').forEach((el) => {el.classList.remove('container__navigation__tab--active')})
            e.target.closest('.container__navigation__tab').classList.add('container__navigation__tab--active')
            fullViewVisualizer.classList.remove('container__visualization__full-view--display')
            cleanUpFullViewVisualizer(clean_filter=true)
            visualizationContainer.classList.remove('container__visualization__data--hide')
            let layoutUrl = e.target.closest('.container__navigation__tab').getAttribute('data-layout-url')
            requestLayout(layoutUrl)
            .then((data) => {
                visualizationSectionHeader.innerText = 'Patients Data Visualization'
                visualizationContainer.innerHTML = data['html']
                displayPatientsData()
            })
            .catch((error) => {
                console.log(error)
            })
        }

        if (e.target.closest('.patient-addition') || e.target.closest('.age-distribution') || e.target.closest('.gender-distribution')){

            visualizationContainer.classList.add('container__visualization__data--hide')
            fullViewVisualizer.classList.add('container__visualization__full-view--display')
            container = components.containers.fullView
            dimensions = components.dimensions.large

            if (e.target.closest('.patient-addition')){
                visualizePatientCreationCount(patientsData.creationCount, container, dimensions)
            }else if (e.target.closest('.age-distribution')){
                visualizePatientAgeData(patientsData.age, container, dimensions)
            }else{
                visualizePatientGenData(patientsData.gender, container, dimensions)
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
            visualizePatientCreationCount(patientsData.creationCount, container, dimensions, year)
        }else if (e.target.closest('.gender-dist-filter')){
            let gender = e.target.value
            cleanUpFullViewVisualizer()
            visualizePatientGenData(patientsData.gender, container, dimensions, gender)
        }else if (e.target.closest('.age-dist-filter')){
            cleanUpFullViewVisualizer()
            let ageFromSelector = document.querySelector('#id_age_from')
            let ageToSelector = document.querySelector('#id_age_to')
            let ageRange = [parseInt(ageFromSelector.value), parseInt(ageToSelector.value)]
            visualizePatientAgeData(patientsData.age, container, dimensions, ageFrom = ageRange[0], ageTo=ageRange[1])
        }
    })

}