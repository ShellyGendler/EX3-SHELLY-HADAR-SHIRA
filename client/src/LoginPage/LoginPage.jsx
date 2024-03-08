import { React, useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import SignUp from "../SignUp/SignUp";
import { InputValidation } from "../SignUp/utils";
import { Modal, Button } from "react-bootstrap";

function LoginPage() {
  // the modal which is signup page should be shown only by clicking sign up
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const navigate = useNavigate();
  // show the sign up modal clicking "creating new account"
  const clickCreateNewAccount = () => {
    handleShow();
  };

  const [loginInput, setLoginInputs] = useState({
    email: "",
    password: "",
  });

  // set the image chosen by the user
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    passwordAuth: "",
  });

  // image should be shown as soon as the user uploads it
  const [pic, setPic] = useState(null);
  const [finalPic, setFinalPic] = useState(null);

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    // Accessing input values from the state
    const { firstName, lastName, userName, email, password, passwordAuth } =
      inputs;
    // access pic
    // Performing input validation
    const isValid = InputValidation(
      firstName,
      lastName,
      userName,
      email,
      password,
      passwordAuth,
      pic
    );
    // If input is valid, proceed with form submission
    if (isValid) {
      setFinalPic(pic);
      // Close modal when navigating to login page
      handleClose();
      navigate("/login"); // Navigate to the LoginPage
    }
  };

  // when user changes the input in sign up page
  const handleSignUpInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
      // set picture
    }));
  };

  // user filling the two fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (event) => {
    // check if email and password are equal to email and password in signin page
    event.preventDefault();
    const signUpEmail = inputs.email;
    const signUpPassword = inputs.password;
    const loginEmail = loginInput.email;
    const loginPassword = loginInput.password;

    // Accessing input values from the state
    // compare login details to signup details
    if (loginEmail == signUpEmail && loginPassword == signUpPassword) {
      localStorage.setItem("authenticated", true);
      navigate("/feed");
      
    } else {
      alert("login details are incorrect!");
      localStorage.setItem("authenticated", false);
    }
  };

  return (
    <div className="login">
      <div className="faceapp-header-wrapper">
        <div className="faceapp-text">faceapp</div>
        <div className="connect-with-friends-title">
          Connect with friends and the world <br></br> around you on Faceapp.
        </div>
      </div>
      <div className="login-container">
        <div className="login-detail">
          <form onSubmit={handleLoginSubmit} id="form">
            <label>
              {" "}
              Password should contain both letters and digits - at least 8 and
              no more than 20
              <input
                class="form-label"
                style={{ borderRadius: "5px" }}
                type="email"
                placeholder="Email"
                name="email"
                value={loginInput.email || ""}
                onChange={handleInputChange}
                required
              />
            </label>
            <br></br>
            <label>
              <input
                type="password"
                placeholder="Password"
                style={{ borderRadius: "5px" }}
                name="password"
                value={loginInput.password || ""}
                onChange={handleInputChange}
                required
              />
            </label>
            <button
              type="submit"
              className="action-button"
              style={{ backgroundColor: "#007FFF", width: "400px" }}
            >
              Log in
            </button>
          </form>


        </div>
        <a href="#" className="text-decoration-none text-decoration-center">
          Forgot password?
        </a>
        <br></br>
        <hr />
        <div className="new-account-wrapper">
          <button
            class="btn btn-success btn-lg"
            onClick={clickCreateNewAccount}
          >
            Create new account
          </button>
        </div>
        <br></br>
        <div class="text-center my-5 pb-5">
          <p class="fw-bold">
            <a href="#" class="text-decoration-none text-dark">
              Create a Page for
            </a>
            <span class="fw-normal"> a celebrity, brand or business.</span>
          </p>
        </div>
      </div>

      {/* create modal */}
      <div className="d-flex align-items-center justify-content-center h-100">
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header style={{ display: "flex", flexDirection: "column" }}>
              <h2
                class="modal-title p-5 m-2"
                id="exampleModalLabel"
                className=""
              >
                Create a new account
              </h2>
              <p class="fs-7" className="text-center">
                It's quick and easy.
              </p>
          </Modal.Header>
          <Modal.Body className="text-center">
            <SignUp
              inputs={inputs}
              handleSignUpSubmit={handleSignUpSubmit}
              handleSignUpInputChange={handleSignUpInputChange}
              pic={pic}
              setPic={setPic}
              finalPic={finalPic}
            />
            {/* Your modal content goes here */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondsary" onClick={handleClose}>
              Close
            </Button>
            {/* Add additional buttons or actions as needed */}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
export default LoginPage;