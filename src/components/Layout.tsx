
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-full w-full bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 h-full w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
