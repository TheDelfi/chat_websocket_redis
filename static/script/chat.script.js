const params = new URLSearchParams(window.location.search);

const socket = new io('http://localhost:3000/chat',{
    query:{
        chatID: params.get('chatID')
    }
});


socket.on('connect',()=>{
    console.log('true')
})


socket.on('disconnect',()=>{
    console.log('false')
})