import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap"; // Using Bootstrap for modals
import { InputEditValidation } from "../SignUp/utils";

const EditUserModal = ({ userDetails, onEditSubmit, onClose, isEditModalOpen }) => {
    const [firstName, setFirstName] = useState(userDetails.first_name);
    const [lastName, setLastName] = useState(userDetails.last_name);
    const [pic, setPic] = useState(userDetails.profile_picture);

    const inputRef = useRef(null); // Optional: Ref for focusing the input on open

    const handleSubmit = (event) => {
        event.preventDefault();
        // Check if edited content is empty before submitting (optional)
        const isValid = InputEditValidation(firstName, lastName, pic);
        if (!isValid) {
            alert("User details are not valid");
            return; // Prevent empty content submission
        }
        onEditSubmit({ firstName, lastName, pic }); // Submit edited content to parent component
        onClose();
    };

    // Optional: Focus the input field when the modal opens
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditModalOpen]); // Run only when isEditModalOpen changes

    return (
        <Modal show={isEditModalOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit user details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            as="input"
                            rows={5}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            ref={inputRef} // Optional: Assign ref to the input field
                            name="firstName"
                        />
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            as="input"
                            rows={5}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            ref={inputRef} // Optional: Assign ref to the input field
                            name="lastName"
                        />
                        <Form.Label>Picture</Form.Label>
                        <Form.Control
                            as="input"
                            type="file"
                            rows={5}
                            onChange={(event) => {
                                // Check if files are selected
                                if (event.target.files.length > 0) {
                                    const selectedFile = event.target.files[0];
                                    const reader = new FileReader();
                                    reader.readAsDataURL(selectedFile);
                                    reader.onload = () => {
                                        setPic(reader.result);
                                    };
                                }
                            }}
                            ref={inputRef} // Optional: Assign ref to the input field
                            name="pic"
                        />
                        <Image src={pic} alt="Selected Preview" style={{ width: "200px", height: "200px" }} />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;
