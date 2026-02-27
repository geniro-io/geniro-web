import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import { useProjectContext } from '../contexts/ProjectContext';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const useCurrentProject = () => {
  const { projectId: urlProjectId } = useParams<{ projectId: string }>();
  const {
    projects,
    loading,
    loadProjects,
    currentProjectId,
    setCurrentProjectId,
  } = useProjectContext();

  // Sync URL projectId to context/localStorage
  useEffect(() => {
    if (urlProjectId && urlProjectId !== currentProjectId) {
      setCurrentProjectId(urlProjectId);
    }
  }, [urlProjectId, currentProjectId, setCurrentProjectId]);

  // Effective project: URL wins, then localStorage context
  const projectId = urlProjectId ?? currentProjectId ?? undefined;
  const currentProject = projects.find((p) => p.id === projectId) ?? null;

  useEffect(() => {
    if (projectId && UUID_RE.test(projectId)) {
      axios.defaults.headers.common['X-Project-Id'] = projectId;
    } else {
      delete axios.defaults.headers.common['X-Project-Id'];
    }
  }, [projectId]);

  return { projectId, currentProject, projects, loading, loadProjects };
};
