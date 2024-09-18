import React, {useState} from 'react';

import { Button, Menu } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons';

const Sidebar = ({ chapters }) => {

    const [collapsed, setCollapsed] = useState(false);

    const handleClick = ({item, key}) => {
        document.querySelector(`#chapter${key}`).scrollIntoView(true)
    }

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
      };
  return (
    <nav className="sidebar">
      <div style={{ width: 256 }}>
      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        onClick={handleClick}
        items={chapters.map((chapter, index) => (
            {
                key: index,
                label: chapter.title
            }
        ))}
      />
    </div>
    </nav>
  );
};

export default Sidebar;