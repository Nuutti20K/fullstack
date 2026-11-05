import { Link } from 'react-router-dom'
import Blog from './Blog'
import Notification from './Notification'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogList = ({ blogs }) => {

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <li key={blog.id}>
          <Link to={`/notes/${blog.id}`}>{blog.title}</Link>
        </li>
      )}
    </div>
  )
}

export default BlogList