import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    label: 'Profile',
    icon: 'fa fa-list',
    subItems: [
      { path: '/register', label: 'Register' },
      { path: '/login', label: 'Login' },
      { path: '/logout', label: 'Logout' },
      { path: '/profile', label: 'Profile' },
    ],
  },
  {
    label: 'Employee',
    icon: 'fa fa-list',
    subItems: [
      { path: '/employee-create', label: 'Create Employee' },
      { path: '/employee-list', label: 'Employee List' },
    ],
  },

  // {
  //   label: 'Holidays',
  //   icon: 'fa fa-list',
  //   subItems: [
  //     { path: '/holiday', label: 'Create Holiday' },
  //     { path: '/holidaylist', label: 'Holiday List' },
  //   ],
  // },
  {
    label: 'Employee Tasks',
    icon: 'fa fa-list',
    subItems: [
      { path: '/EmployeeTask', label: 'Create Employee Task' },
      { path: '/EmployeeTaskList', label: 'Employee Task List' },
    ],
  },
  {
    label: 'Attendance',
    icon: 'fa fa-list',
    subItems: [
      { path: '/attendancereport', label: 'Attendance Report' },
      { path: '/attendancelist', label: 'Attendance List' },
      { path: '/reportsum', label: 'Attendance Summary' },
      { path: '/updateemployeeid', label: 'Activate Attendance' },
      { path: '/manual-atendance', label: 'Update Attendance' },
    ],
  },
];

const renderDropdownItems = (items) => (

  <ul className="dropdown-menu">
    {items.map((item, index) => (
      <li key={index}>
        <Link to={item.path} className="dropdown-item">
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const [isEmployee, setIsEmployee] = useState(false);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
          const userObject = JSON.parse(userString);
          setUser(userObject);
          setIsEmployee(userObject && userObject.role === 'employee');
        }
      }, []);
  return (
    <>
      {/* App Sidebar */}
      <div className="modal fade panelbox panelbox-left" id="sidebarPanel" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              {/* profile box */}
              <div className="profileBox pt-2 pb-2">
                <Link to="#" className="btn btn-link btn-icon sidebar-close " data-bs-dismiss="modal">
                <i className="fa fa-times " aria-hidden="true"></i>
           </Link>
              </div>
              {/* menu */}
              <div className="listview-title mt-1">Menu</div>
              {!isEmployee &&  (
              <ul className="listview simple-listview inset">
             
                {menuItems.map((menuItem, index) => (
                  <li key={index} className={menuItem.subItems ? 'nav-item dropdown ' : ''}>
                    <Link to="#" className={menuItem.subItems ? 'nav-link dropdown-toggle' : 'item'} data-bs-toggle="dropdown">
                      <i className={menuItem.icon} aria-hidden="true"></i>
                      <span style={{ marginLeft: '20px' }}>{menuItem.label}</span>
                    </Link>
                    {menuItem.subItems && renderDropdownItems(menuItem.subItems)}
                  </li>
                ))}
               
              </ul>
               )}
              {/* * menu */}
            </div>
          </div>
        </div>
      </div>
      {/* * App Sidebar */}
    </>
  );
};

export default Sidebar;
