import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

//const Login = ({ onSubmit, username, password, onNameChange, onPasswordChange }) => (
//  <form onSubmit={onSubmit}>
//    <div>
//      <label>
//        username
//        <input
//          type="text"
//          value={username}
//          onChange={onNameChange}
//        />
//      </label>
//    </div>
//    <div>
//      <label>
//        password
//        <input
//          type="password"
//          value={password}
//          onChange={onPasswordChange}
//        />
//      </label>
//    </div>
//    <button type="submit">login</button>
//  </form>
//)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setMessage({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject)
      const formatedBlog = { ...blog, user: {username: user.username, name: user.name, id: blog.user} }
      setBlogs(blogs.concat(formatedBlog))
      setMessage({ text: `a new blog ${blog.title} by ${blog.author} added`, type: 'info' })
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

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <div style={{ marginBottom: '20px' }}>
        {user.name} logged in
        <button onClick={() => handleLogout()}>logout</button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} onRemove={removeBlog} username={user.username}/>
      )}
    </div>
  )
}

export default App