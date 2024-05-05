import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import styles from "./App.module.css";
import { Icon } from "@iconify/react";
import ConfirmDelete from "./component/ConfirmDelete/ConfirmDelete";
import PopupModal from "./component/PopupModal/PopupModal";
import ProjectsTable from "./component/ProjectsTable/ProjectsTable";

const GET_ALL_PROJECTS = gql`
  query Query {
    listProjects {
      items {
        id
        name
        description
      }
    }
  }
`;

export default function App() {
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  const { loading, error, data } = useQuery(GET_ALL_PROJECTS);

  if (loading)
    return (
      <div className={styles.loading}>
        <Icon icon="line-md:loading-loop" width={32} />
      </div>
    );
  if (error) return <p>Error : {error.message}</p>;

  const handleEditClick = (project) => {
    setCurrentProject(project);
    setOpenEditPopup(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteProjectId(id);
    setOpenDeletePopup(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topic}>Project Management</div>
      <button className="primaryBtn" onClick={() => setOpenCreatePopup(true)}>
        <Icon icon="simple-line-icons:plus" width={14} />
        Create Project
      </button>
      <ProjectsTable
        projects={data.listProjects.items}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      {openEditPopup && (
        <PopupModal
          isOpen={openEditPopup}
          onClose={() => setOpenEditPopup(false)}
          projectDetail={currentProject}
          mode="edit"
        />
      )}
      {openCreatePopup && (
        <PopupModal
          isOpen={openCreatePopup}
          onClose={() => setOpenCreatePopup(false)}
          mode="create"
        />
      )}
      {openDeletePopup && (
        <ConfirmDelete
          isOpen={openDeletePopup}
          onClose={() => setOpenDeletePopup(false)}
          id={deleteProjectId}
        />
      )}
    </div>
  );
}
