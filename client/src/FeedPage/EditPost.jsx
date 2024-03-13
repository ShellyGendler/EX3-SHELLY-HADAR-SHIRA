import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Using Bootstrap for modals

const EditPostModal = ({ postBody, onEditSubmit, onClose, isEditModalOpen }) => {
  const [editedPostBody, setEditedPostBody] = useState(postBody); // Store edited post content
  const inputRef = useRef(null); // Optional: Ref for focusing the input on open

  const handleClose = () => {
    onClose(); // Call the provided onClose function
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if edited content is empty before submitting (optional)
    if (!editedPostBody.trim()) {
      alert('Please enter some content for your post.');
      return; // Prevent empty content submission
    }
    onEditSubmit(editedPostBody); // Submit edited content to parent component
    handleClose();
  };

  // Optional: Focus the input field when the modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditModalOpen]); // Run only when isEditModalOpen changes

  return (
    <Modal show={isEditModalOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Post Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={editedPostBody}
              onChange={(e) => setEditedPostBody(e.target.value)}
              ref={inputRef} // Optional: Assign ref to the input field
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostModal;
