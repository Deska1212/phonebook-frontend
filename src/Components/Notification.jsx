const Notification = ({message, isError}) => {
    const notifcationStyle = {
        color: isError ? 'red' : 'green',
        background: 'lightGrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 2,
        padding: 10,
        marginBottom: 10,
    }

    if(message === null || message === '')
    {
        return null;
    }

    return(
        <div style={notifcationStyle}>
            {message}
        </div>
    )

}

export default Notification