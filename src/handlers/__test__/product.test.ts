import request from 'supertest'
import server from '../../server'
import { body } from 'express-validator'
import { response } from 'express'

describe('Post /api/products', () => {

    it('should display validation erros', async () => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.error).not.toHaveLength(2)

    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor plano',
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.error).not.toHaveLength(2)

    })

    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor plano',
            price: 'hola'
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')

        expect(response.status).not.toBe(404)

    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 400
        })


        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('GET /api/products', () => {

    it('should check if api/products url exist', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)

    })

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('error')

    })
})

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {
        const _PRODUCT_ID = 2000
        const response = await request(server).get(`/api/products/${_PRODUCT_ID}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')
    })

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-URL')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toHaveLength(1)
        expect(response.body.error[0].msg).toBe('ID no válido')
    })

    it('GET a JSON response for a single product ', async () => {
        const response = await request(server).get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('should check a valid ID in the URL', async () => {
        const response = await request(server)
            .put('/api/products/not-valid-URL')
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: 300
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toHaveLength(1)
        expect(response.body.error[0].msg).toBe('ID no válido')
    })

    it('should display validation error message when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toBeTruthy()
        expect(response.body.error).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server)
            .put('/api/products/1')
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: -300
            })

        expect(response.status).toBe(400)
        expect(response.body).toBeTruthy()
        expect(response.body.error).toHaveLength(1)
        expect(response.body.error[0].msg).toBe('Precio no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return 404 response for a non-existent product', async () => {
        const _PRODUCT_ID = 2000
        const response = await request(server)
            .put(`/api/products/${_PRODUCT_ID}`)
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: 300
            })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const response = await request(server)
            .put('/api/products/1')
            .send({
                name: "Monitor Curvo",
                availability: true,
                price: 300
            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })

})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing produnct', async () => {
        const _PRODUCT_ID = 2000
        const response = await request(server).patch(`/api/products/${_PRODUCT_ID}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(true)

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')
    })

})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID ', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error[0].msg).toBe('ID no válido')

    })

    it('should return 404 response for a non-existent product ', async () => {
        const _PRODUCT_ID = 2000
        const response = await request(server).delete(`/api/products/${_PRODUCT_ID}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
    })

    it('should delete product ', async () => {
        const response = await request(server).delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto eliminado')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})
