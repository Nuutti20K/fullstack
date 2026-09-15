const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = ({ name }) => {
  return (
    <div>
      <h2>{name}</h2>
    </div>
  )
}

const Content = ({ parts }) => {
  console.log(parts)
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part}/>)}
    </div>
  )
}

const Part = ({ part }) => {
  return (
    <div>{part.name} {part.exercises}</div>
  )
}

const Total = ({ parts }) => {
  return (
    <div>
      <p>
        Number of exercises {parts.map(part => part.exercises).reduce((x, y) => x + y, 0)}
      </p>
    </div>
  )
}

export default Course