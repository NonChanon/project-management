import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import styles from "./PopupModal.module.css";

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

const CREATE_PROJECT = gql`
  mutation Mutation($input: CreateProjectInput!) {
    createProject(input: $input) {
      name
      description
    }
  }
`;

const UPDATE_PROJECT = gql`
  mutation Mutation($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      name
      description
    }
  }
`;

const PopupModal = ({ isOpen, mode, projectDetail, onClose }) => {
  if (!isOpen) return null;

  const [input, setInput] = useState(() => {
    return mode === "edit"
      ? {
          id: projectDetail.id,
          name: projectDetail.name,
          description: projectDetail.description || "",
        }
      : { name: "", description: "" };
  });

  useEffect(() => {
    setInput(
      mode === "edit"
        ? {
            id: projectDetail.id,
            name: projectDetail.name,
            description: projectDetail.description || "",
          }
        : { name: "", description: "" }
    );
  }, [mode, projectDetail]);

  const [mutateProject, { loading, error }] = useMutation(
    mode === "edit" ? UPDATE_PROJECT : CREATE_PROJECT,
    {
      onCompleted: () => {
        onClose();
      },
      refetchQueries: [{ query: GET_ALL_PROJECTS }],
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutateProject({
      variables: { input },
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalStyles}>
        <div className={styles.topic}>
          {mode === "edit" ? "Edit Project" : "Create Project"}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            name="name"
            value={input.name}
            onChange={handleInputChange}
            placeholder="Enter project name"
            required
          />
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            value={input.description}
            onChange={handleInputChange}
            rows={15}
            placeholder="Enter project description"
            required
          />
          <div className={styles.btnFormat}>
            <button className="secondaryBtn" onClick={onClose}>
              Cancel
            </button>
            <button className="primaryBtn" type="submit" disabled={loading}>
              {loading ? "Processing..." : mode === "edit" ? "Save" : "Create"}
            </button>
          </div>

          {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default PopupModal;
