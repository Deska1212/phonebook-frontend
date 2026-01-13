const Course = ({course}) => {
    const total = course.parts.reduce((acc, curr) => acc + curr.exercises, 0)

    return(
        <div>
            <h1>{course.name}</h1>

            <ul>
                {course.parts.map(part => (
                    <li key={part.id}>{part.name} {part.exercises}</li>
                ))}
            </ul>

            
            
            <p> Total of {total} exercises</p>
        </div>
    );
}

export default Course