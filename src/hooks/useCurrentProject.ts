import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import { useProjectContext } from '../contexts/ProjectContext';

export const useCurrentProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, loading, loadProjects } = useProjectContext();
  const currentProject = projects.find((p) => p.id === projectId) ?? null;

  useEffect(() => {
    if (projectId) {
      axios.defaults.headers.common['X-Project-Id'] = projectId;
    } else {
      delete axios.defaults.headers.common['X-Project-Id'];
    }
  }, [projectId]);

  return { projectId, currentProject, projects, loading, loadProjects };
};
