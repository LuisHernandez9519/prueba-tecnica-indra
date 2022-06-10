
const fetch = require('node-fetch')
const Planet = require('./models/planet')
const Validator = require('validatorjs')

const rules = {
    page: 'integer',
    search: 'string'
}

const getPlanets = async (event) => {

    const queryParameter = event.queryStringParameters
    console.log('param', queryParameter)

    if (queryParameter) {
        const validation = new Validator(queryParameter, rules)
        if (!validation.passes()) {
            const errors = validation.errors.errors
            return {
                statusCode: 400,
                body: JSON.stringify(
                    {
                        errors
                    }
                )

            }
        }
    }

    let url = 'https://swapi.py4e.com/api/planets'

    let parameter = []

    if (queryParameter) {
        console.log('netro')
        if (queryParameter.page) {
            parameter.push(`page=${queryParameter.page}`)
        }
        if (queryParameter.search) {
            parameter.push(`search=${queryParameter.search}`)
        }

        if (parameter.length > 0) {
            url = `${url}?${parameter.join('&')}`
        }
    }

    console.log({url})

    const response = await fetch(url)
    
    const status = response.status
    
    const data = await response.json()
    
    let planets = []
    
    if (status === 200) {
        planets = data.results.map(planet => {
            return new Planet(planet)
        })
    }

    const {siguiente, anterior} = getNextAndPrevious(event, data)

    return {
        statusCode: status,
        body: JSON.stringify(
            {
                cantidad: data.count,
                siguiente,
                anterior,
                payload: planets
            }
        )
    }
}

const getNextAndPrevious = (event, data) => {
    let {next: siguiente, previous: anterior} = data
    let urlReturn = event.headers.host+event.rawPath
    if (siguiente) {
        //obtenemos los parametros de la url devuelta
        const dataUrl = new URL(data.next)
        siguiente = urlReturn+dataUrl.search
    }
    if (anterior) {
        const dataUrl = new URL(data.previous)
        anterior = urlReturn+dataUrl.search
    }
    
    return {siguiente, anterior}

}

module.exports = {
    getPlanets
}