import React from "react";
import { useMutation, gql } from "@apollo/client";
import styles from "./ConfirmDelete.module.css";

const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    listProjects {
      items {
        id
        name
        description
      }
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation Mutation($input: DeleteProjectInput!) {
    deleteProject(input: $input) {
      name
    }
  }
`;

const ConfirmDelete = ({ isOpen, onClose, id }) => {
  if (!isOpen) return null;
  console.log(id);
  const [deleteProject, { loading, error }] = useMutation(DELETE_PROJECT, {
    variables: { input: { id } },
    onCompleted: () => onClose(),
    refetchQueries: [{ query: GET_ALL_PROJECTS }],
    onError: (error) => {
      console.error("Error deleting project:", error);
    },
  });

  const handleDelete = () => {
    deleteProject();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalStyles}>
        <div className={styles.topic}>
          Are you sure you want to delete this project ?
        </div>
        {error && <p>Error: {error.message}</p>}
        <div className={styles.btnFormat}>
          <button className="delOutlineBtn" onClick={onClose}>
            Cancel
          </button>
          <button className="delBtn" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
