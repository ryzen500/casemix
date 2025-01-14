import React, { useState } from "react";

export default function Sidebar({ className = '', children, ...props }) {
    const [openSubmenu, setOpenSubmenu] = useState(null); // Track the open submenu by ID

    const toggleSubmenu = (id) => {
        setOpenSubmenu((prev) => (prev === id ? null : id)); // Toggle submenu
    };
    var menuItems = props.menuItems;

    return (
        <>
            {menuItems.map((item) => (
                <li className="sidebar-item  has-sub" key={item.id}>
                <a onClick={() => toggleSubmenu(item.id)} className='sidebar-link'>
                    {item.label}
                </a>
                {openSubmenu === item.id && (
                    <ul className={openSubmenu?'submenu active':'submenu'}>
                    {item.submenu.map((subItem, index) => (
                        <li key={index} className={"submenu-item "+(route().current(subItem.link)?'active':'')}  ><a  href={subItem.link} className="submenu-item">{subItem.label} </a></li>
                    ))}
                    </ul>
                )}
                </li>
            ))}
        </>
    );
}

