import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from "../../public/logo.png"
import { MdSpaceDashboard ,MdAddCircle,MdDashboardCustomize,MdDashboard,MdContactSupport} from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaShoppingBag,FaEdit,FaUser,FaShoppingCart,FaLocationArrow} from "react-icons/fa";
import Login from '../components/Login'
import useAdmin from '../hooks/useAdmin';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
  const sharedLinks = (
    <>
      <li ><Link to="/dashboard"><MdDashboard />Home</Link></li>
      <li ><Link to="/menu"><FaShoppingCart />Menu</Link></li>
      <li ><Link to="/dashboard"><FaLocationArrow />Orders Tracking</Link></li>
      <li><Link to="/dashboard"><MdContactSupport />Customers Support</Link></li>
    </>
  )
  const {loading} = useAuth();
  const [isAdmin, isAdminLoading]=useAdmin();
  return (
    <div>
      {
        isAdmin ? (<div>
          <div className="drawer sm:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
                <div className='flex items-center justify-between mx-4 sm:hidden'>
                  {/* Page content here */}
                <label htmlFor="my-drawer-2" 
                className="btn btn-primary drawer-button lg:hidden">
                <MdDashboardCustomize />
                </label>
                <button className='btn rounded-full px-6 bg-green text-white '><FaUser />Logout</button> 
                </div>
                <div className='mt-5 md:mt-2 mx-4'>
                  <Outlet/>
                </div>               
            </div>
            
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                {/* Sidebar content here */}
                <li><Link to="/dashboard" className='flex justify-start mb-3'>
                    <img src={logo} alt='' className='w-20'/>
                    <div className="badge badge-primary">admin</div>
                    </Link>
                </li>
                <li className='mt-3'><Link to="/dashboard"><MdSpaceDashboard />Dashboard</Link></li>
                <li><Link to="/dashboard"><FaShoppingBag />Manage Bookings</Link></li>
                <li><Link to="/dashboard/add-menu"><MdAddCircle />Add Menu</Link></li>
                <li><Link to="/dashboard/manage-items"><FaEdit />Manage Items</Link></li>
                <li><Link to="/dashboard/users"><PiUsersThreeFill/>All Users</Link></li>
                <hr/>
                {
                  sharedLinks
                }
                </ul>
            </div>
          </div>
      </div>):(<Login/>)
      }
    </div>
  )
}

export default DashboardLayout