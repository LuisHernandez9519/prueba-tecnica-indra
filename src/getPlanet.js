const fetch = require('node-fetch')
const Planet = require('./models/planet')
const Validator = require('validatorjs')

const rules = {
    id: 'required|integer'
}

const getPlanet = async (event) => {

    try {
        const parameters = event.pathParameters

        const validation = new Validator(parameters, rules)
        
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

        const { id } = parameters
    
        const response = await fetch(`https://swapi.py4e.com/api/planets/${id}`)
    
        const status = response.status
    
        const data = await response.json()
    
        let planet = null
    
        if (status === 200) {
            planet = new Planet(data)
        }    
    
        return {
            statusCode: status,
            body: JSON.stringify(
                {
                    payload: planet
                }
            )
        }
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(
                {
                    payload: error
                }
            )
        }         
    }

}

module.exports = {
    getPlanet
}