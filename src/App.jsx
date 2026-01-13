import { useEffect, useState } from 'react'
import Filter from './Components/Filter'
import PersonList from './Components/PersonList'
import noteService from './Services/phonebookService'
import Notification from './Components/Notification'
import axios from 'axios'

// Make it possible for users to delete entries from the phonebook

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({message: '', isError: false})

  useEffect(() => {
    console.log('Use effect called')


    // Retrieve the initial DB state from the server
    noteService.getAll().then(response => {
      console.log('Retrieved initial records from server')
      setPersons(response.data)
    }
    ).catch(error => console.error(`Unable to get initial server state`, error))

    // Test get persons from our own API
    axios.get(`http://localhost:3001/api/persons`).then(response => {
      console.log('Response from server: ', response)
    }).catch(error => console.log(`Error from server: `, error))
  }, [])

  const addName = (event) => {
    event.preventDefault()

    // Validate inputs
    if (newName.trim() === "")
    {
      alert('Name cannot be empty')
      return
    }

    if(newNumber.trim() === '')
    {
      alert('Number cannot be empty')
      return
    }

    // Check if name already exists and update number if different
    const exists = persons.find(p => p.name === newName);
    if(exists)
    {
      const oldPerson = exists
      console.log(`Found existing person of name ${oldPerson.name}`)
      
      const newPerson = {
        name: oldPerson.name,
        number: newNumber
      }

      
      noteService.update(oldPerson.id, newPerson)
        .then(response => {
          const updatedPerson = response.data
          setPersons(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p))
          setNewName('')
          setNewNumber('')
          setNotification({message: `${updatedPerson.name}'s number has been updated`, isError: false})
          setTimeout(() => setNotification({message: '', isError: false}), 5000)
          console.log(`Updated number of ${updatedPerson.name} on client`)
        })
        .catch(error => {
         console.error('Update failed', error)
         setNotification({message: `${newPerson.name} no longer exists on server`, isError: true})
      })

      return
    }


    // Add record to server - One doesn't already exist

    // Create person object (Without ID, recieves ID from server)
    const newPerson = {
      name: newName,
      number: newNumber,
    }
    
    
    // Create the user on the server and update clientside
    noteService.create(newPerson).then(response => {
      const person = response.data
      setPersons(prev => prev.concat(person))
      setNewName('')
      setNewNumber('')
      setNotification({message: `${person.name} added to Phonebook`, isError: false})
      setTimeout(() => setNotification({message: '', isError: false}), 5000)
      console.log(`Created user: ${person.name} (${person.number})`)
    })
    .catch(error => {
        console.log('Create failed', error)
        setNotification({message: `${newPerson.name} could not be created on the server`, isError: true})
        setTimeout(() => setNotification({message: '', isError: false}), 5000)
      }
    )
  }



  const removeName = (id) => {
    // Guard clause if we hit cancel on the prompt
    if(!window.confirm("Delete person from Phonebook?"))
    {
      console.log(`Phonebook record of ID ${id} has not been deleted`)
      return
    }

    const removedUser = persons.find(p => p.id === id)

    // Delete user from server
    noteService.remove(id).then(response => {
      setPersons(prev => prev.filter(p => p.id !== removedUser.id))
      console.log(`User ${removedUser.name} of ID ${removedUser.id} has been removed from server`)
      setNotification({message: `${removedUser.name} removed from Phonebook`, isError: false})
      setTimeout(() => setNotification({message: '', iserror: false}), 5000)
    })
    .catch(error => {
        console.error('Failed to delete user from server', error)
        setNotification({message: `${removedUser.name} could not be found on the server`, isError: true})
        setTimeout(() => setNotification({message: '', isError: false}), 5000)
      }
    )

    

    
  }

  const handleNewNameChange = (event) =>
  {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) =>
  {
    const textToFilterBy = event.target.value
    console.log(textToFilterBy)
    setFilter(textToFilterBy)
  }



  const normalizedFilter = filter.trim().toLowerCase()
  const personsToShow = normalizedFilter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(normalizedFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification {...notification}/>
      <h3>Search</h3>
      <div>
        <Filter value={filter} onChange={handleFilterChange} />
      </div>

      <h3>Add</h3>
      <form>
        <div>
          name: <input value={newName} onChange={handleNewNameChange}/>
        </div>
        <div>
          number : <input value={newNumber} onChange={handleNewNumberChange}/>
        </div>
        <div>debug: {`${newName} (${newNumber})`}</div>
        <div>
          <button type="submit" onClick={addName}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        <PersonList persons={personsToShow} removePerson={removeName}/>
    </div>
  )
}

export default App