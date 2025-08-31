const params = new URLSearchParams(window.location.search);

const socket = new io('http://localhost:3000/chat',{
    query:{
        chatID: params.get('chatID'),
    }
});


socket.on('connect',()=>{
    socket.emit('get_userID')
})


socket.on('disconnect',()=>{
    console.log('false')
})



socket.on('get_userID', (user_id) => {
    console.log('User ID received:', user_id);
    // Сохраняем user_id в переменную
    window.currentUserId = user_id;
});


document.getElementById('send_message_form').addEventListener('submit',async (e)=>{
    e.preventDefault()

    socket.emit('send_message_server',{
        message_text: document.getElementsByClassName('input_message')[0].value
    })
    
    document.getElementsByClassName('input_message')[0].value = ''
})

socket.on('get_all_message',async (message_info)=>{
    

    for(let i of message_info.all_message){
        const parsed_message = JSON.parse(i)
        const message = document.createElement('div')
        if(message_info.user_id == parsed_message.sender){
            message.className = 'your_message'
        }
        else{
            message.className = 'other_message'
        }
        message.textContent = parsed_message.message
        document.getElementsByClassName('body_container')[0].appendChild(message)
    }
})

socket.on('send_message', async (message_info)=>{
    console.log(message_info)
    
    const message = document.createElement('div')
    if(message_info.sender == window.currentUserId){
        message.className = 'your_message'
    }
    else{
        message.className = 'other_message'
    }
    message.textContent = message_info.message
    document.getElementsByClassName('body_container')[0].prepend(message)


})