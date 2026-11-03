import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove, username }) => {
  const [visibleDetails, setVisibleDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisibleDetails(!visibleDetails)
  }

  return (
    <div className='blog' style={blogStyle} >
      {!visibleDetails && (
        <div>
          {blog.title} {blog.author}
          <button onClick={() => toggleVisibility()}>view</button>
        </div>
      )}
      {visibleDetails && (
        <div>
          <div>
            {blog.title} {blog.author}
            <button onClick={() => toggleVisibility()}>hide</button>
          </div>
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes}
            <button onClick ={() => onLike(blog.id)}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          {username === blog.user.username && (
            <button onClick ={() => onRemove(blog.id)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
