const Person = ({person, onDeleteClick}) => (



    <li>{person.name} ({person.number}) <button onClick={() => onDeleteClick(person._id)}>X</button></li>
)

export default Person