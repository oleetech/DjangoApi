import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { path: '/', icon: 'fa fa-pie-chart', label: 'Home' },
  { path: '/login', icon: 'fa fa-file-text-o', label: 'Login' },
  { path: '/attendance', icon: 'fa fa-file-text-o', label: 'In-Out' },
  { path: '/attendancereport', icon: 'fa fa-file-text-o', label: 'Report' },
  { path: '/EmployeeTask', icon: 'fa fa-file-text-o', label: 'Task' },


];

const DynamicMenu = () => {
  return (
    <div className="appBottomMenu">
      {menuItems.map((menuItem, index) => (
        <Link to={menuItem.path} className={`item ${index === 0 ? 'active' : ''}`} key={index}>
          <div className="col">
            <i className={menuItem.icon} aria-hidden="true"></i>
            <strong>{menuItem.label}</strong>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DynamicMenu;
