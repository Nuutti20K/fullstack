import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Togglable from './components/Togglable'
import LogoutButton from './components/LogoutButton'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const match = useMatch('/notes/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginWith = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      setMessage({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      const formatedBlog = { ...blog, user: { username: user.username, name: user.name, id: blog.user } }
      setBlogs(blogs.concat(formatedBlog))
      setMessage({ text: `a new blog ${blog.title} by ${blog.author} added`, type: 'success' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      console.log('something went wrong')
    }
  }

  const handleLike = async (id) => {
    const oldBlog = blogs.find(blog => blog.id === id)
    const newLikes = oldBlog.likes + 1
    const updatedBlog = { ...oldBlog, likes: newLikes }
    try {
      await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog).sort((a, b) => b.likes - a.likes))
    } catch (error) {
      console.error('Failed to update likes:', error)
    }
  }

  const removeBlog = async id => {
    const title = blogs.find(blog => blog.id === id).title
    const author = blogs.find(blog => blog.id === id).author
    if (window.confirm(`remove blog ${title} by ${author}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (error) {
        console.error('Failed to remove blog:', error)
      }
    }
  }

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>blogs</Button>
          {!user && (
            <Button color="inherit" component={Link} to="/login" sx={style}>login</Button>
          )}
          {user && (
            <Button color="inherit" component={Link} to="/create" sx={style}>new blog</Button>
          )}
          {user && (
            <LogoutButton onLogout={handleLogout} />
          )}
        </Toolbar>
      </AppBar>
      <Notification message={message} />

      <Routes>
        <Route path="/notes/:id" element={
          <Blog blog={blog} onLike={handleLike} onRemove={removeBlog} user={user}/>
        } />
        <Route path="/login" element={
          <LoginForm onLogin={loginWith} user={user} />
        } />
        <Route path="/create" element={
          <BlogForm createBlog={createBlog} />
        } />
        <Route path="/" element={
          <BlogList blogs={blogs} createBlog={createBlog} user={user} />
        } />
      </Routes>
    </Container>
  )
}

export default App