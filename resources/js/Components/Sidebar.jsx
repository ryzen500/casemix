import React, { useState } from "react";
import { Link } from '@inertiajs/react';

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
                        <ul className={openSubmenu ? 'submenu active' : 'submenu'}>
                            {item.submenu.map((subItem, index) => (

                                <li key={index} className={"submenu-item " + (route().current(subItem.link) ? 'active' : '')}  > {subItem.method === "post" ?
                                    <Link href={subItem.link} method={subItem.method} className="submenu-item">
                                        {subItem.label}
                                    </Link> : <a href={subItem.link} className="submenu-item">{subItem.label} </a>}</li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </>
    );
}

