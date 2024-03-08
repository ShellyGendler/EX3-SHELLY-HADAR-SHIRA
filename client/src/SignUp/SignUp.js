import { React, useState } from 'react';
import "../LoginPage/LoginPage.jsx"
import { useNavigate } from 'react-router-dom';

import { InputValidation } from './utils.js';

// p at the end of the word for prop
function SignUp({ inputs, handleSignUpSubmit, handleSignUpInputChange, finalPic, pic, setPic }) {

  // navigate to LoginPage
  const navigate = useNavigate();

  return (
    // When the form is submitted, the handleSubmit function will be called
    <form onSubmit={handleSignUpSubmit} id="form">
      <div>
        <label> First name, last name and user name should contain letters only
          <br></br>
          <input
            class="form-label"
            style={{ borderRadius: '5px', width: '300px', height: '50px', textAlign: 'center', fontSize: '20px' }}
            id="fname"
            type="text"
            name="firstName"
            placeholder='First name'
            // binds the value of the input field to inputs.username from the component's state
            //  If inputs.username is null or undefined, it defaults to an empty string.
            value={inputs.firstName || ""}
            onChange={handleSignUpInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <br></br>
          <input
            class="form-label"
            style={{ borderRadius: '5px', width: '300px', height: '50px', textAlign: 'center', fontSize: '20px' }}
            id="lname"
            type="text"
            name="lastName"
            placeholder='Last name'
            value={inputs.lastName || ""}
            onChange={handleSignUpInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <br></br>
          <input
            class="form-label"
            style={{ borderRadius: '5px', width: '300px', height: '50px', textAlign: 'center', fontSize: '20px' }}
            id="uname"
            type="text"
            name="userName"
            placeholder='User name'
            value={inputs.userName || ""}
            onChange={handleSignUpInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <br></br>
          <input
            class="form-label"
            style={{ borderRadius: '5px', width: '300px', height: '50px', textAlign: 'center', fontSize: '20px' }}
            id="email"
            type="email"
            name="email"
            placeholder='Email'
            value={inputs.email || ""}
            onChange={handleSignUpInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label> Password should contain both letters and digits -
          at least 8 and no more than 20
          <br></br>
          <input
            class="form-label"
            style={{ borderRadius: '5px', width: '300px', height: '50px', textAlign: 'center', fontSize: '20px' }}
            id="password"
            type="text"
            name="password"
            placeholder='Password'
            value={inputs.password || ""}
            onChange={handleSignUpInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <br></br>
          <input
            class="form-label"
            style={{ borderRadius: '5px', width: '300px', height: '50px', textAlign: 'center', fontSize: '20px' }}
            id="passwordAuth"
            type="text"
            name="passwordAuth"
            placeholder='Password authentification'
            value={inputs.passwordAuth || ""}
            onChange={handleSignUpInputChange}
            required
          />
        </label>
      </div>


      <div className="center">
        <label>
          <div style={{display:"flex", flexDirection:"column"}}>
            <label for="files" style={{ color: "grey", textAlign: "center", }}>Select an Image</label>
            <input
              id="files"
              style={{ visibility: "hidden" }}
              type="file"
              onChange={(event) => {
                // Check if files are selected
                if (event.target.files.length > 0) {
                  // Get the first selected file
                  const selectedFile = event.target.files[0];

                  // Create a URL for the selected file
                  const fileUrl = URL.createObjectURL(selectedFile);

                  // Call your setPic function with the created URL
                  setPic(fileUrl);
                }
              }}
            ></input>
          </div>
          {pic && (
            <>
              <div></div>
              <img
                src={pic}
                alt="Selected Preview"
                style={{ width: '200px', height: '200px' }}
              />
            </>

          )}
        </label>

      </div>
      <br></br>
      <button type="submit" class="btn btn-success">Sign in</button>
      {/* <input type="submit" value="Sign in" class="btn btn-success"/> */}
    </form>
  )
}
export default SignUp;