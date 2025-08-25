document.getElementById('registration_form').addEventListener('submit',async ()=>{
    const name_or_email = document.getElementById('input_name').value
    const password = document.getElementById('input_password').value

    const request = await fetch('/auth/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name_or_email,
            password,
        })
    })

})