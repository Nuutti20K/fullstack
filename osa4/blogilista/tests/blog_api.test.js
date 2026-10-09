const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('returned blogs have a field named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].hasOwnProperty('id'), true)
  })

  describe('adding a blog', () => {
    test('succeeds with status code 201 if data is valid', async () => {
      const newBlog = {
        title: 'can this be added?',
        author: 'supertest',
        url: 'http://supertest.super.test',
        likes: 100
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('sets likes to zero when blog has no likes field', async () => {
      const newBlog = {
        title: 'can this be added?',
        author: 'supertest',
        url: 'http://supertest.super.test',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with status code 400 if title is invalid', async () => {
      const newBlog = {
        author: 'supertest',
        url: 'http://supertest.super.test',
        likes: 100
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('fails with status code 400 if url is invalid', async () => {
      const newBlog = {
        title: 'can this be added?',
        author: 'supertest',
        likes: 100
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('edition of a blog', () => {
    test('succeeds with status code 200 if id and data is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]

      const newBlog = {
        title: 'is this edited?',
        author: 'supertest',
        url: 'http://supertest.super.test',
        likes: 100
      }
      await api.put(`/api/blogs/${blogToEdit.id}`)
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd[0].title, 'is this edited?')
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.put(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.put(`/api/blogs/${invalidId}`).expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})