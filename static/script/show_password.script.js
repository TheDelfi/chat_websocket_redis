document.getElementById('show_password').addEventListener('click',()=>{
    const input_type = document.getElementById('input_password').type
    if(input_type == 'password'){
        document.getElementById('input_password').type = 'text'
        document.getElementsByClassName('eye_img')[0].src = '/static/image/eye-off 1.png'
    }
    else if(input_type == 'text'){
        document.getElementById('input_password').type = 'password'
        document.getElementsByClassName('eye_img')[0].src = '/static/image/222w1.png'
    }
})