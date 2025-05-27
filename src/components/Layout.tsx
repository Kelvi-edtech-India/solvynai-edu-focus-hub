
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNavbar from './BottomNavbar';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className={`flex-1 h-full w-full overflow-auto bg-gray-50 dark:bg-gray-900 ${
        isMobile ? 'pb-20' : 'ml-64'
      }`}>
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
};

export default Layout;
