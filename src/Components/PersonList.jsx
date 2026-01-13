import Person from "./Person"

const PersonList = ({persons, removePerson}) => (
    <ul>
        {
            persons.map((person) => (
                // Note: key needs to be in scope of the map that is creating the element
                <Person key={person.name} person={person} onDeleteClick={() => removePerson(person.id)}/>
            ))
        }
    </ul>
)

export default PersonList