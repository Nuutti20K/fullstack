const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const likes = blogs.map(blog => blog.likes)

  const sum = likes.reduce((x, y) => {
    return x + y
  }, 0)
  return sum
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return undefined
  }
  const favorite = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  })
  return favorite
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return undefined
  }

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {});

  const most = Object.keys(counts).reduce((max, author) => {
    return counts[author] > counts[max] ? author : max
  })

  const result = {
    author: most,
    blogs: counts[most]
  }

  return result
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return undefined
  }

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {});

  const most = Object.keys(counts).reduce((max, author) => {
    return counts[author] > counts[max] ? author : max
  })

  const result = {
    author: most,
    likes: counts[most]
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}