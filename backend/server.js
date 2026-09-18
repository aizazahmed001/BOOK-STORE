import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 5000

const products = [
	{ id: 1, title: 'The Midnight Library', author: 'Matt Haig', price: 1895, category: 'Fiction', stock: 12 },
	{ id: 2, title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', price: 2295, category: 'Fiction', stock: 8 },
	{ id: 3, title: 'Atomic Habits', author: 'James Clear', price: 1695, category: 'Self Help', stock: 18 },
	{ id: 4, title: 'The Creative Act', author: 'Rick Rubin', price: 2495, category: 'Art & Design', stock: 6 },
	{ id: 5, title: 'Ikigai', author: 'Héctor García', price: 1295, category: 'Self Help', stock: 20 },
	{ id: 6, title: 'A Brief History of Time', author: 'Stephen Hawking', price: 1995, category: 'Science', stock: 9 }
]
const categories = ['Fiction', 'Self Help', 'Art & Design', 'Children', 'Science', 'Business']
const carts = new Map()
const orders = []

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Liberty Books API is ready' }))
app.get('/api/products', (req, res) => {
	const query = String(req.query.q || '').toLowerCase()
	const category = String(req.query.category || '').toLowerCase()
	const page = Math.max(Number(req.query.page) || 1, 1)
	const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50)
	const filtered = products.filter(product => (!query || `${product.title} ${product.author}`.toLowerCase().includes(query)) && (!category || product.category.toLowerCase() === category))
	const start = (page - 1) * limit
	res.json({ success: true, data: filtered.slice(start, start + limit), pagination: { page, limit, total: filtered.length, pages: Math.ceil(filtered.length / limit) } })
})
app.get('/api/products/:id', (req, res) => {
	const product = products.find(item => String(item.id) === req.params.id)
	if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
	res.json({ success: true, data: product })
})
app.get('/api/categories', (_req, res) => res.json({ success: true, data: categories.map(name => ({ name, slug: name.toLowerCase().replaceAll(' ', '-') })) }))
app.get('/api/search', (req, res) => {
	const query = String(req.query.q || '').toLowerCase()
	res.json({ success: true, data: products.filter(product => `${product.title} ${product.author}`.toLowerCase().includes(query)).slice(0, 5) })
})
app.post('/api/auth/register', (req, res) => res.status(201).json({ success: true, data: { name: req.body.name || 'Reader', email: req.body.email || '' }, token: 'demo-token' }))
app.post('/api/auth/login', (_req, res) => res.json({ success: true, data: { name: 'Demo Reader', email: 'reader@example.com' }, token: 'demo-token' }))
app.get('/api/cart', (req, res) => res.json({ success: true, data: carts.get(req.header('x-session-id') || 'guest') || [] }))
app.post('/api/cart/items', (req, res) => {
	const session = req.header('x-session-id') || 'guest'
	const product = products.find(item => item.id === Number(req.body.productId))
	if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
	const cart = carts.get(session) || []
	const existing = cart.find(item => item.productId === product.id)
	existing ? existing.qty += Number(req.body.qty) || 1 : cart.push({ productId: product.id, qty: Number(req.body.qty) || 1 })
	carts.set(session, cart)
	res.status(201).json({ success: true, data: cart })
})
app.post('/api/orders', (req, res) => {
	const order = { id: `LB-${Date.now()}`, status: 'pending', ...req.body, createdAt: new Date().toISOString() }
	orders.push(order)
	res.status(201).json({ success: true, data: order })
})
app.get('/api/orders/:id', (req, res) => {
	const order = orders.find(item => item.id === req.params.id)
	order ? res.json({ success: true, data: order }) : res.status(404).json({ success: false, message: 'Order not found' })
})

app.listen(port, () => console.log(`Liberty Books API listening on http://localhost:${port}`))
