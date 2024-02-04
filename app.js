const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Connect to MongoDB (make sure your MongoDB server is running)
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

// Create a Mongoose schema
const postSchema = new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
})

// Create a Mongoose model
const Post = mongoose.model('Post', postSchema)

// Middleware to parse JSON
app.use(bodyParser.json())

// Middleware to parse form-urlencoded data
app.use(bodyParser.urlencoded({ extended: true }))

// Define routes

// Get all posts
app.get('/posts', async (req, res) => {
	try {
		const posts = await Post.find()
		return res.json(posts)
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
})

// Add a new post
app.post('/post', async (req, res) => {
	const { title, content } = req.body

	console.log(req.body)

	try {
		// Create a new post
		const newPost = new Post({ title, content })

		// Save the post to the database
		await newPost.save()

		return res.status(201).json(newPost)
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
