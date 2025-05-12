import { Outlet } from 'react-router-dom';

function PublicRoute() {
  // Allow access to public routes regardless of authentication status
  return <Outlet />;
}

export default PublicRoute;