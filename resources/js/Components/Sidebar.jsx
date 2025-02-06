import React, { useState } from "react";
import { Link } from '@inertiajs/react';

export default function Sidebar({ className = '', children, ...props }) {
    const [openSubmenu, setOpenSubmenu] = useState(null); // Track the open submenu by ID

    const toggleSubmenu = (id) => {
        setOpenSubmenu((prev) => (prev === id ? null : id)); // Toggle submenu
    };
    var menuItems = props.menuItems;

    const handleLink = async (subItem) => {
        if (subItem.method === "post") {
            try {
                // Send POST request for logout (or any other action)
                await axios.post(route('logout'));  // Make sure 'logout' is the correct route name
                // Redirect to login page (or wherever you need)
                window.open(route('login'), '_parent');

            } catch (error) {
                console.error('Logout failed', error);
            }
        } else {
            // Handle other link types, e.g., simple navigation
            window.location.href = subItem.link;
        }
    };
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
                                    <Link onClick={() => handleLink(subItem)} className="submenu-item">
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

