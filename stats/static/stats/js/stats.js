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

// ################################################ Patients ##########################################################


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
        patientsData = {'genderCount': {'data': genderCount}, 'ageRanges':{'data': ageRanges}, 'dateCreationCount': {'data': dateCreationCount}}
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
    visContainer.select('.header').text('Patient Addition - ' + requestedYear).attr('transform', 'translate(350, 35)')

    visContainer.select('.x-axis')
                 .call(xAxis)
                 .attr('transform', 'translate(0,' + bodyHeight + ')')
                 .selectAll('line')
                 .style('opacity', 0.5)

    visContainer.select('.y-axis')
                 .call(yAxis)
                 .selectAll('line')
                 .style('opacity', 0.5)

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

        visContainer.select('.header').attr('transform', 'translate(350, 40)')

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
    }
    let max = d3.max(data, (d) => {return d[1]})
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let ticksLength = max < 10 ? max : 10

    // Map data to image space
    let visContainer = d3.select(container)
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
    visContainer.select('.header').text('Age Distribution').attr('transform', 'translate(160, 25)')

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

        visContainer.select('.header').attr('transform', 'translate(370, 40)')

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
           bg.style('fill', 'rgba(0,0,0,0)')
           rangeIndicatorMessage.text('')
           amountMessage.text('')
           this.style.fill = ''
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

    let masculineTotal = 0
    let femenineTotal = 0
    data.forEach((d) => {d.gender === 'M' ? masculineTotal = d.amount : femenineTotal = d.amount})

    let percentages = {'masculine': Math.round((masculineTotal / total) * 100), 'femenine': Math.round((femenineTotal / total) * 100)}
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
    let join = visContainer
               .select('.body')
               .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
               .selectAll('.arc')
               .data(pie(data))

    // Draw Chart
    visContainer.select('.header').text('Gender Distribution').attr('transform', 'translate(140, 25)')

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

        visContainer.select('.header').attr('transform', 'translate(370, 30)')

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
    visualizePatientCreationCount(patientsData.dateCreationCount, components.containers.addition, components.dimensions.medium)
    visualizePatientAgeData(patientsData.ageRanges, components.containers.age, components.dimensions.small)
    visualizePatientGenData(patientsData.genderCount, components.containers.gender, components.dimensions.small)
}

// ################################################ Consults ##########################################################

function processConsultsData(url){
    d3.json(url).
    then((data) => {

        data = data.map((d) => {return {'charge': parseInt(d.fields.charge),
                                        'createdBy': d.fields.created_by,
                                        'datetime': new Date(d.fields.datetime),
                                        'status': d.fields.status,
                                        'medicalStatus': d.fields.medical_status}})
                                        .sort((d1,d2) => {return d3.ascending(d1.datetime, d2.datetime)})

        consultsDateCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return new Date(d.datetime.getFullYear() + '/' + (d.datetime.getMonth() + 1) + '/' + d.datetime.getDate())})).map((d) => {return {'date': d[0], 'amount': d[1]}})
        consultsHourAttendanceFrequency = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.datetime.getHours()})).map((d) => {return {'hour': d[0], 'amount':d[1]}}).sort((d1, d2) => {return d3.ascending(d1.hour, d2.hour)})
        createdByCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.createdBy}))
        statusCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.status})).map((d) => {return {'status': d[0], 'amount': d[1]}})
        medicalStatusCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.medicalStatus})).map((d) => {return {'medicalStatus': d[0], 'amount': d[1]}})

        consultsData = {
            'consultsDateCount': {'data': consultsDateCount},
            'consultsAttendanceHourFrequency': {'data': consultsHourAttendanceFrequency},
            'createdByCount': {'data': createdByCount},
            'statusCount': {'data': statusCount},
            'medicalStatusCount': {'data': medicalStatusCount}
        }

    })
    .catch((error) => {
        console.log(error)
    })
}

function visualizeStatusCount(data, container, dimensions, status = 'all'){

    // Collect Data
    data = data.data
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let total = d3.sum(data, (d) => {return d.amount})
    let totalOpen = 0
    let totalConfirmed = 0
    let totalCancelled = 0
    let totalClosed = 0

    for (let i = 0; i < data.length; i++){
        switch(data[i].status){
            case 'OPEN':
                totalOpen = data[i].amount
                break
            case 'CONFIRMED':
                totalConfirmed = data[i].amount
                break
            case 'CANCELLED':
                totalCancelled = data[i].amount
                break
            case 'CLOSED':
                totalClosed = data[i].amount
                break
        }
    }

    let percentages = {
        'open': Math.round((totalOpen / total) * 100),
        'confirmed': Math.round((totalConfirmed / total) * 100),
        'cancelled': Math.round((totalCancelled / total) * 100),
        'closed': Math.round((totalClosed / total) * 100),
    }

    let totalCentering
    if (total  < 10){
        totalCentering = ((bodyWidth / 2) - 5)
    }else if (total < 100){
        totalCentering = ((bodyWidth / 2) - 10)
    }else{
        totalCentering = ((bodyWidth / 2) - 12)
    }

    // Compute Layout
    let pie = d3.pie().value((d) => {return d.amount})
    let arc = d3.arc().innerRadius(container === '.full-view' ? 100 : 50).outerRadius(bodyHeight / 2)

    // Map data to image space
    let visContainer = d3.select(container)
    let containerBody = visContainer.select('.body')
    let join = visContainer.select('.body')
                           .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
                           .selectAll('.arc')
                           .data(pie(data))

    // Draw Chart
    visContainer.select('.header').text('Status Distribution').attr('transform', 'translate(150, 30)')
    join.enter()
        .append('path')
        .attr('transform', 'translate(' + (bodyWidth / 2) + ',' + (bodyHeight / 2) + ')')
        .attr('id', (d) => {return d.data.status})
        .attr('data-amount', (d) => {return d.data.amount})
        .attr('d', arc)
        .attr('fill', (d) => {
            if (d.data.status === 'OPEN'){
                return '#fec44f'
            }else if (d.data.status === 'CONFIRMED'){
                return '#238b45'
            }else if (d.data.status === 'CANCELLED'){
                return '#969696'
            }else{
                return '#e31a1c'
            }
        })

    let openConsultsText = container === '.full-view' ? 'Open - ' + percentages.open + '%' : percentages.open + '%'
    let confirmedConsultsText = container === '.full-view' ? 'Confirmed - ' + percentages.confirmed + '%' : percentages.confirmed + '%'
    let cancelledConsultsText = container === '.full-view' ? 'Cancelled - ' + percentages.cancelled + '%' : percentages.cancelled + '%'
    let closedConsultsText = container === '.full-view' ? 'Closed - ' + percentages.closed + '%' : percentages.closed + '%'
    visContainer.append('rect').attr('width', '10').attr('height', '10').attr('fill', '#fec44f').attr('transform', 'translate(10,' + (bodyHeight - 63) + ')')
    visContainer.append('rect').attr('width', '10').attr('height', '10').attr('fill', '#238b45').attr('transform', 'translate(10,' + (bodyHeight - 42) + ')')
    visContainer.append('rect').attr('width', '10').attr('height', '10').attr('fill', '#969696').attr('transform', 'translate(10,' + (bodyHeight - 21) + ')')
    visContainer.append('rect').attr('width', '10').attr('height', '10').attr('fill', '#e31a1c').attr('transform', 'translate(10,' + bodyHeight + ')')
    visContainer.append('text').text(openConsultsText).attr('transform', 'translate(25,' + (bodyHeight - 54) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')
    visContainer.append('text').text(confirmedConsultsText).attr('transform', 'translate(25,' + (bodyHeight - 32) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')
    visContainer.append('text').text(cancelledConsultsText).attr('transform', 'translate(25,' + (bodyHeight - 12) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')
    visContainer.append('text').text(closedConsultsText).attr('transform', 'translate(25,' + (bodyHeight + 9) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')

    if (container === '.full-view'){

        visContainer.select('.header').attr('transform', 'translate(370, 30)')

        containerBody.append('text').text(total).attr('transform', 'translate(' + totalCentering + ',' + (bodyHeight / 2) + ')').attr('fill', '#FFFFFF')

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

        d3.selectAll('path')
           .on('mouseover', function(d){
                this.style.fill = '#FFFFFF'
                this.style.transition = '0.5s'
                switch(this.id){
                    case 'OPEN':
                        bg.attr('fill', '#fec44f')
                        message.text('Open - ' + this.getAttribute('data-amount'))
                        break
                 case 'CONFIRMED':
                        bg.attr('fill', '#238b45')
                        message.text('Confirmed - ' + this.getAttribute('data-amount'))
                        break
                 case 'CANCELLED':
                        bg.attr('fill', '#969696')
                        message.text('Cancelled - ' + this.getAttribute('data-amount'))
                        break
                 case 'CLOSED':
                        bg.attr('fill', '#e31a1c')
                        message.text('Closed - ' + this.getAttribute('data-amount'))
                        break
                }
           })

        d3.selectAll('path')
          .on('mouseout', function(d){
                this.style.fill = ''
                this.style.transition = '0.5s'
                bg.attr('fill', 'rgba(255,255,255,0)')
                message.text('')
          })

        d3.selectAll(containerBody)
          .on('mousemove', function(d){
               let x = d3.pointer(d)[0] - 60
               let y = d3.pointer(d)[1] - 30
               tooltip.attr('transform', 'translate(' + x + ',' + y + ')')
          })
    }

}

function visualizeMedicalStatusCount(data, container, dimensions, medicalStatus='all'){

    // Collect Data
    data = data.data
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let total = d3.sum(data, (d) => {return d.amount})

    let attendedTotal = 0
    let unattendedTotal = 0
    data.forEach((d) => {d.medicalStatus === true ? attendedTotal = d.amount : unattendedTotal = d.amount})
    let percentages = {'attended': Math.round((attendedTotal / total) * 100), 'unattended': Math.round((unattendedTotal / total) * 100)}

    let totalCentering
    if (total  < 10){
        totalCentering = ((bodyWidth / 2) - 5)
    }else if (total < 100){
        totalCentering = ((bodyWidth / 2) - 10)
    }else{
        totalCentering = ((bodyWidth / 2) - 12)
    }

    // Compute Layout
    let pie = d3.pie().value((d) => {return d.amount})
    let arc = d3.arc().innerRadius(container === '.full-view' ? 100 : 50).outerRadius(bodyHeight / 2)

    // Map data to image space
    let visContainer = d3.select(container)
    let containerBody = visContainer.select('.body')
    let join = visContainer.select('.body')
                           .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
                           .selectAll('.arc')
                           .data(pie(data))

    // Draw Chart
    visContainer.select('.header').text('Medical Status Distribution').attr('transform', 'translate(120, 30)')

    join.enter()
        .append('path')
        .attr('transform', 'translate(' + (bodyWidth / 2) + ',' + (bodyHeight / 2) + ')')
        .attr('id', (d) => {return d.data.medicalStatus})
        .attr('data-amount', (d) => {return d.data.amount})
        .attr('d', arc)
        .attr('fill', (d) => {return d.data.medicalStatus === true ? '#2ca25f' : '#de2d26'})

    let attendedConsultsText = container === '.full-view' ? 'Attended - ' + percentages.attended + '%' : percentages.attended + '%'
    let unattendedConsultsText = container === '.full-view' ? 'Unattended - ' + percentages.unattended + '%' : percentages.unattended + '%'
    visContainer.append('rect').attr('width', '10').attr('height', '10').attr('fill', '#2ca25f').attr('transform', 'translate(10,' + (bodyHeight - 21) + ')')
    visContainer.append('rect').attr('width', '10').attr('height', '10').attr('fill', '#de2d26').attr('transform', 'translate(10,' + bodyHeight + ')')
    visContainer.append('text').text(attendedConsultsText).attr('transform', 'translate(25,' + (bodyHeight - 12) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')
    visContainer.append('text').text(unattendedConsultsText).attr('transform', 'translate(25,' + (bodyHeight + 9) + ')').attr('font-size', '12').attr('fill', '#FFFFFF')

    if (container === '.full-view'){

        visContainer.select('.header').attr('transform', 'translate(340, 30)')

        containerBody.append('text').text(total).attr('transform', 'translate(' + totalCentering + ',' + (bodyHeight / 2) + ')').attr('fill', '#FFFFFF')

        let tooltip = containerBody.append('g').attr('class', 'tooltip')

        let bg = tooltip.append('rect')
                        .attr('fill', 'rgba(255,255,255,0)')
                        .attr('width', '145px')
                        .attr('height', '25px')
                        .attr('rx', '10')

        let message = tooltip.append('text')
                             .attr('fill', '#FFFFFF')
                             .attr('font-weight', 'bolder')
                             .attr('transform', 'translate(10, 18)')

        d3.selectAll('path')
           .on('mouseover', function(d){
                this.style.fill = '#FFFFFF'
                this.style.transition = '0.5s'
                this.id === 'true' ? bg.attr('fill' , '#2ca25f') : bg.attr('fill', '#de2d26')
                message.text((this.id === 'true' ? 'Attended - ' : 'Unattended - ') + this.getAttribute('data-amount'))
           })

        d3.selectAll('path')
          .on('mouseout', function(d){
                this.style.fill = ''
                this.style.transition = '0.5s'
                bg.attr('fill', 'rgba(255,255,255,0)')
                message.text('')
          })

        d3.selectAll(containerBody)
          .on('mousemove', function(d){
            let x = d3.pointer(d)[0] - 60
            let y = d3.pointer(d)[1] - 30
            tooltip.attr('transform', 'translate(' + x + ',' + y + ')')
          })
    }
}

function visualizeConsultsDateCount(data, container, dimensions){

    // Collect Data
    data = data.data
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let max = d3.max(data, (d) => {return d.amount})
    let ticksLength = max < 10 ? max : 10

    // Map data to image space
    let visContainer = d3.select(container)
    let join = visContainer
               .select('.body')
               .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
               .append('path')
               .datum(data)

    // Compute Layout
    let xScale = d3.scaleTime(d3.extent(data, (d) => {return d.date}), [0, bodyWidth])
    let yScale = d3.scaleLinear([0, max], [bodyHeight, 0])
    let xAxis = d3.axisBottom(xScale).tickSize(-bodyHeight)
    let yAxis = d3.axisLeft(yScale).tickSize(-bodyWidth).ticks(ticksLength)
    let lineGen = d3.line()
               .x((d) => {return xScale(d.date)})
               .y((d) => {return yScale(d.amount)})
               .curve(d3.curveCatmullRom)

    // Draw Chart
    visContainer.select('.header').text('Consult Growth').attr('transform', 'translate(370, 35)')

    visContainer.select('.x-axis')
                .call(xAxis)
                .attr('transform', 'translate(0,' + bodyHeight + ')')
                .selectAll('line')
                .style('opacity', '0.5')

    visContainer.select('.y-axis')
                .call(yAxis)
                .selectAll('line')
                .style('opacity', '0.5')

    join.attr('d', lineGen)
        .attr('fill', 'none')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', '3px')

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

        visContainer.select('.header').attr('transform', 'translate(370, 30)')

    }

}

function visualizeConsultsAttendanceHourFrequency(data, container, dimensions){

    // Collect Data
    data = data.data
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let max = d3.max(data, (d) => {return d.amount})
    let ticksLength = max < 10 ? max : 10

    // Map data to image space
    let visContainer = d3.select(container)
    let containerBody = visContainer.select('.body')
    let join = visContainer.select('.body')
                           .attr('transform', 'translate(' + translateX + ',' + translateY + ')')
                           .selectAll('rect')
                           .data(data)

    // Compute Layout
    let xScale = d3.scaleBand(data.map((d) => {return d.hour}), [0, bodyWidth]).padding(0.1)
    let yScale = d3.scaleLinear([0, max], [bodyHeight, 0])
    let colorScale = d3.scaleOrdinal(data.map((d) => {return d.hour}), d3.schemeCategory10)
    let xAxis = d3.axisBottom(xScale).tickFormat((d) => {return d + ':00'})
    let yAxis = d3.axisLeft(yScale).ticks(ticksLength)

    // Draw Chart
    visContainer.select('.header').text('Attendance Hour Frequency').attr('transform', 'translate(330, 35)')
    visContainer.select('.x-axis').call(xAxis).attr('transform', 'translate(0, ' + bodyHeight + ')')
    visContainer.select('.y-axis').call(yAxis)

    join.enter()
        .append('rect')
        .attr('id', (d) => {return d.hour + ':00 - ' + d.hour + ':59'})
        .attr('data-amount', (d) => {return d.amount})
        .attr('x', (d) => {return xScale(d.hour)})
        .attr('y', bodyHeight)
        .attr('width', (d) => {return xScale.bandwidth()})
        .attr('height', 0)
        .attr('fill', (d) => {return colorScale(d.hour)})

    visContainer.selectAll('rect')
                .transition()
                .duration(2500)
                .attr('y', (d) => {return yScale(d.amount)})
                .attr('height', (d) => {return bodyHeight - yScale(d.amount)})

    if (container === '.full-view'){

        visContainer.select('.header').attr('transform', 'translate(340, 30)')

        let tooltip = containerBody.append('g')
                                   .attr('class', 'tooltip')

        let bg = tooltip.append('rect')
                        .attr('fill', '')
                        .attr('width', '210')
                        .attr('height', '50')
                        .attr('rx', '10')
                        .attr('fill', 'rgba(0,0,0,0)')

        let hourRangeMsg = tooltip.append('text')
                                  .attr('class', 'hour-range')
                                  .attr('transform', 'translate(10, 20)')
                                  .attr('fill', '#FFFFFF')

        let amountMsg = tooltip.append('text')
                               .attr('class', 'amount')
                               .attr('transform', 'translate(10, 40)')
                               .attr('fill', '#FFFFFF')

        d3.selectAll('rect')
          .on('mouseover', function(d){
            this.style.fill = '#FFFFFF'
            hourRangeMsg.text('Hour Range: ' + this.id)
            amountMsg.text('Consults Attended: ' + this.getAttribute('data-amount'))
            bg.attr('fill', 'rgba(0,0,0,0.5)')
          })

        d3.selectAll('rect')
          .on('mouseout', function(d){
            hourRangeMsg.text('')
            amountMsg.text('')
            this.style.fill = ''
            bg.attr('fill', 'rgba(0,0,0,0)')
          })

        d3.selectAll('rect')
          .on('mousemove', function(d){
              let x = d3.pointer(d)[0] + 20
              let y = d3.pointer(d)[1] - 20
              tooltip.attr('transform', 'translate(' + x + ',' + y + ')')
          })
    }
}


function visualizeCreatedByCount(data, container, dimensions){

}

function displayConsultsData(){
    visualizeMedicalStatusCount(consultsData.medicalStatusCount, components.containers.medicalStatusDistribution, components.dimensions.small)
    visualizeStatusCount(consultsData.statusCount, components.containers.statusDistribution, components.dimensions.small)
    visualizeConsultsDateCount(consultsData.consultsDateCount, components.containers.consultGrowth, components.dimensions.medium)
    visualizeConsultsAttendanceHourFrequency(consultsData.consultsAttendanceHourFrequency, components.containers.consultTimeFrequency, components.dimensions.medium)
//    visualizeCreatedByCount(consultsData.createdByCount)
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
        }
    })

}