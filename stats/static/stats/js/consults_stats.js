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

function visualizeStatusCount(data, container, dimensions, status='all'){

    // Collect Data
    data = data.data
    if (status !== 'all'){
        data = data.filter((d) => {return d.status === status})
    }
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
        'open': totalOpen === 0 ? 0 : Math.round((totalOpen / total) * 100),
        'confirmed': totalConfirmed === 0 ? 0 : Math.round((totalConfirmed / total) * 100),
        'cancelled': totalCancelled === 0 ? 0 : Math.round((totalCancelled / total) * 100),
        'closed': totalClosed === 0 ? 0 : Math.round((totalClosed / total) * 100),
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
    if (medicalStatus !== 'all'){
        medicalStatus = medicalStatus === 'true' ? true : false
        data = data.filter((d) => {return d.medicalStatus === medicalStatus})
    }
    let bodyHeight = dimensions.bodyHeight
    let bodyWidth = dimensions.bodyWidth
    let translateX = dimensions.translation.x
    let translateY = dimensions.translation.y
    let total = d3.sum(data, (d) => {return d.amount})

    let attendedTotal = 0
    let unattendedTotal = 0
    data.forEach((d) => {d.medicalStatus === true ? attendedTotal = d.amount : unattendedTotal = d.amount})
    let percentages = {'attended': attendedTotal === 0 ? 0 : Math.round((attendedTotal / total) * 100),
                       'unattended': unattendedTotal === 0 ? 0 : Math.round((unattendedTotal / total) * 100)}

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

function visualizeConsultsDateCount(data, container, dimensions, dateFrom=null, dateTo=null){

    // Collect Data
    data = data.data
    if (dateFrom !== null && dateTo !== null){
        data = data.filter((d) => {return d.date >= dateFrom && d.date <= dateTo})
    }
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

function visualizeConsultsAttendanceHourFrequency(data, container, dimensions, hourFrom=null, hourTo=null){

    // Collect Data
    data = data.data
    if (hourFrom !== null && hourTo !== null){
        data = data.filter((d) => {return d.hour >= hourFrom && d.hour <= hourTo})
    }
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