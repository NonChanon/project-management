import React from "react";
import styles from "./ProjectsTable.module.css";
import { Icon } from "@iconify/react";

const ProjectsTable = ({ projects, onEdit, onDelete }) => {
  return (
    <table className={styles.tableContent}>
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td className={styles.name}>{project.name}</td>
            <td className={styles.description}>{project.description}</td>
            <td className={styles.action}>
              <Icon
                icon="bxs:edit"
                onClick={() => onEdit(project)}
                width={24}
                cursor="pointer"
              />

              <Icon
                icon="material-symbols:delete"
                color="red"
                onClick={() => onDelete(project.id)}
                width={24}
                cursor="pointer"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;
