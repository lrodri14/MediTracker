function visualizePatientGenData(components){
//    console.log(components)
}

function displayConsultsStatistics(data){
    // Load and transform data
    // Map data to the image space
    // Compute layout
    // Draw visualization
}

function displayIncomeStatistics(data){
    // Load and transform data
    // Map data to the image space
    // Compute layout
    // Draw visualization
}

function processPatientData(url){

    d3.json(url)
    .then((data) => {
         // Load and transform data
        let today = new Date()

        data = data.map((d) => {return {
            'pk': d.pk,
            'gender': d.fields.gender,
            'age': today.getYear() - new Date(d.fields.birthday).getYear(),
            'origin': d.fields.origin,
            'residence': d.fields.residence,
            'dateCreated': new Date(d.fields.date_created)
        }})

        let genderCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.gender})).map((d) => {return {'gender': d[0], 'amount': d[1]}})
        let ageCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.age})).map((d) => {return {'age': d[0], 'amount': d[1]}})
        let originCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.origin})).map((d) => {return {'origin': d[0], 'amount': d[1]}})
        let residenceCount = Array.from(d3.rollup(data, (d) => {return d.length}, (d) => {return d.residence})).map((d) => {return {'residence': d[0], 'amount': d[1]}})

        let genderAmountMax = d3.max(genderCount, (d) => {return d.amount})
        let originAmountMax = d3.max(originCount, (d) => {return d.amount})
        let residenceAmountMax = d3.max(residenceCount, (d) => {return d.amount})

        // Map data to the image space
        let gendersJoin = d3.select('#body').selectAll('rect').data(genderCount)
        let ageJoin = d3.select('#body').selectAll('rect').data(ageCount)
        let originJoin = d3.select('#body').selectAll('rect').data(originCount)
        let residenceJoin = d3.select('#body').selectAll('rect').data(residenceCount)

        // Compute layout
        let genderColorScale = d3.scaleOrdinal(data.map((d) => {return d.gender}), d3.schemeCategory10)
        let originColorScale = d3.scaleOrdinal(data.map((d) => {return d.origin}), d3.schemeCategory10)
        let residenceColorScale = d3.scaleOrdinal(data.map((d) => {return d.residence}), d3.schemeCategory10)

        let genderXScale = d3.scaleBand(genderCount.map((d) => {return d.gender}), [0, 300])
        let originXScale = d3.scaleBand(originCount.map((d) => {return d.origin}), [0, 300])
        let residenceXScale = d3.scaleBand(residenceCount.map((d) => {return d.residence}), [0, 300])

        let genderYScale = d3.scaleLinear([genderAmountMax, 0], [0, 300])
        let originYScale = d3.scaleLinear([0, originAmountMax], [0, 300])
        let residenceYScale = d3.scaleLinear([0, residenceAmountMax], [0, 300])

        let genderXAxis = d3.axisBottom(genderXScale)
        let genderYAxis = d3.axisLeft(genderYScale)
        let originXAxis = d3.axisBottom(originXScale)
        let originYAxis = d3.axisLeft(originYScale)
        let residenceXAxis = d3.axisBottom(residenceXScale)
        let residenceYAxis = d3.axisLeft(residenceYScale)

        // Components
        patientVisComponents = {
            'pt-gen': {
                'transformedData': genderCount,
                'genderAmountMax': genderAmountMax,
                'join': gendersJoin,
                'colorScale': genderColorScale,
                'axesScales': [genderXScale, genderYScale],
                'axes': [genderXAxis, genderYAxis]
            },
            'pt-orig': {
                'transformedData': originCount,
                'genderAmountMax': originAmountMax,
                'join': originJoin,
                'colorScale': originColorScale,
                'axesScales': [originXScale, originYScale],
                'axes': [originXAxis, originYAxis]
            },
            'pt-res': {
                'transformedData': residenceCount,
                'genderAmountMax': residenceAmountMax,
                'join': residenceJoin,
                'colorScale': residenceColorScale,
                'axesScales': [residenceXScale, residenceYScale],
                'axes': [residenceXAxis, residenceYAxis]
            }
        }
    })
    .catch((error) => {
        console.log(error)
    })
}