export function InputValidation(firstName, lastName, userName, mobileNumOrEmail, password, passwordAuth, pic) {

        // check the input is valid
        // switch case
        // one big function that includes all input types

        if (firstName == "" || lastName == "" || userName == "" || mobileNumOrEmail == "" || password == "" || passwordAuth == "") {
            alert("All fields must be filled out");
            return false;
        }
        if (password != null && password.length < 8) {
            alert("password should contain at least 8 chars!")
            return false;
        }
        if (password != null && password.localeCompare(passwordAuth) != 0) {
            alert("password authentication failed!")
            return false;
        }
        if (password != null && password.length > 20) {
            alert("password should contain less than 20 chars!")
            return false;
        }
        if (/^\d+$/.test(password) || /^[a-zA-Z]+$/.test(password)) {
            alert("password should contain both letters and digits!")
            return false;
        }
        if (!/^[a-zA-Z]+$/.test(firstName)) {
            alert("first name should contain letters only!")
            return false;
        }
        if (!/^[a-zA-Z]+$/.test(lastName)) {
            alert("last name should contain letters only!")
            return false;
        }
        if (!/^[a-zA-Z]+$/.test(userName)) {
            alert("user name should contain letters only!")
            return false;
        }
        if (pic == null) {
            alert("please upload picture")
            return false;
        }
        return true;
    
    }
