const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')
const Validator = require('validatorjs')

const rules = {
    name: 'required|string',
    last_name: 'required|string',
    user: 'required|string',
    password: 'required|string'
}

const createUser = async (event) => {

    try {
        
        const data = JSON.parse(event.body)

        const validation = new Validator(data, rules)

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

        const {name, last_name, user, password} = data
        
        const dynamodb = new AWS.DynamoDB.DocumentClient()
    
        //validar que el usuario no exista en la tabla
        const result = await dynamodb.scan({
            TableName: 'UserTable',
            ScanFilter: {
                user:{
                    AttributeValueList: [user],
                    ComparisonOperator: 'EQ'
                }
            }
        }).promise()       
        
        if (result.Count) {
            return {
                statusCode: 400,
                body: JSON.stringify(
                    {
                        message: 'Este usuario ya existe.',
                        payload: null
                    }
                )
            }        
        }
    
        const id = v4()
    
        const created_at = (new Date()).toISOString()
    
        const saltRounds = 10
    
        const salt = await bcrypt.genSalt(saltRounds)
    
        const hash = await bcrypt.hash(password, salt)
    
        const newUser = {
            id,
            name,
            last_name,
            user,
            created_at
        }
    
        await dynamodb.put({
            TableName: 'UserTable',
            Item: {...newUser, password: hash}
        }).promise()
    
        return {
            statusCode: 201,
            body: JSON.stringify(
                {
                    payload: newUser
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
    createUser
}