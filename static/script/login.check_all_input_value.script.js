function check_all_input_value(){
    const name = document.getElementById('input_name').value
    const password = document.getElementById('input_password').value

    if(name.length >= 2 && name.length <= 64 && password.length >= 6 && password.length <= 24){
        document.getElementsByClassName('submit_registration')[0].disabled = false
        document.getElementsByClassName('submit_registration')[0].style.opacity = 1
    }
    else{
        document.getElementsByClassName('submit_registration')[0].disabled = true
        document.getElementsByClassName('submit_registration')[0].style.opacity = 0.4
    }  
}

document.getElementsByClassName('registration_body')[0].addEventListener('input',check_all_input_value)
document.querySelector('.custom-checkbox').addEventListener('change', check_all_input_value);
