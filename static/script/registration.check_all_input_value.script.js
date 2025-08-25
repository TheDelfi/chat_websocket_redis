function check_all_input_value(){
    const name = document.getElementById('input_name').value
    const email = document.getElementById('input_email').value
    const password = document.getElementById('input_password').value
    const checkbox = document.querySelector('.custom-checkbox');

    if(name.length >= 2 && name.length <= 16 && email.length >= 2 && email.length <= 48 && password.length >= 6 && password.length <= 24 && checkbox.checked == true){
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
