import { useEffect, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(true);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    // Toggle submenu
    const toggleSubmenu = () => {
        setIsSubmenuOpen(!isSubmenuOpen);
    };

     useEffect(() => {
        const handleResize = () => {
          const widthVal = window.innerWidth;
          if (widthVal <= 1500) {
            setShowingNavigationDropdown(false); // Remove 'active' class if width is less than 1200px
          } else {
            setShowingNavigationDropdown(true);  // Add 'active' class if width is 1200px or more
          }

        };
        
        // Set initial state based on window size
        handleResize();
    
        // Add event listener for resize
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener on component unmount
        return () => {
            
            window.removeEventListener('resize', handleResize);
            // Perfect Scrollbar Init
            if(typeof PerfectScrollbar == 'function') {
                const container = document.querySelector(".sidebar-wrapper");
                const ps = new PerfectScrollbar(container, {
                    wheelPropagation: false
                });
            }
            // Scroll into active sidebar
            document.querySelector('.sidebar-item.active').scrollIntoView(false)
        };
      }, []);
      var menuItems = []
    return (
        <div>
            <div id="sidebar" className={!showingNavigationDropdown ? '' : 'active'}>
                <div className="sidebar-wrapper active">
                    <div className="sidebar-header">
                        <div className="d-flex justify-content-between">
                            <div className="logo">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                    </Link>
                            </div>
                            <div className="toggler">
                                <button onClick={() => setShowingNavigationDropdown((previousState) => !previousState)} className="sidebar-hide  d-block"><i className="bi bi-x bi-middle"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-menu">
                        <ul className="menu">
                            <li className="sidebar-title">Menu</li>

                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                <span>Dashboard</span>
                            </NavLink>
                            <Sidebar menuItems=
                            {[
                                { id: 1, label: "Transaksi", submenu: [{label:"Coding / Group ",link:route('searchGroupper')},{label:"Kirim Data Online",link:"kirimDataOnline"},{label:"Pengajuan Klaim",link:"a2.html"}]}
                            ]}></Sidebar>
                            <Sidebar menuItems=
                            {[
                                { id: 2, label: "Laporan", submenu: [{label:"Laporan SEP Peserta (BPJS) ",link:route('laporanSEP')},{label:"Laporan detail pasien pulang",link:"a2.html"},{label:"Laporan Buku  Register",link:"a2.html"},{label:"Laporan Data Awal Klaim Piutang",link:"a2.html"}]}
                            ]}></Sidebar>
                            <Sidebar menuItems=
                            {[
                                { id: 3, label: user.nama_pemakai, submenu: [{label:"Profile ",link:route('profile.edit')},{label:"logout",link:route('logout'),method:'post'}]}
                            ]}></Sidebar>
                        </ul>
                        <button className="sidebar-toggler btn x"><i data-feather="x"></i></button>
                    </div>
                </div>
            </div>
            <div id="main">
                <header className="mb-3">
                    <div className="-me-2 flex items-center  burger-btn">
                        <div className="col-sm-12">
                            <div className="row">
                                <div className={showingNavigationDropdown ? 'col-sm-6 hidden' : 'col-sm-6 active'}>
                                    <button onClick={() => setShowingNavigationDropdown((previousState) => !previousState)} className="burger-btn d-block">
                                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                                <path
                                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />

                                        </svg>
                                    </button>
                                </div>
                                {/* <div className="col-sm-6" style={{ textAlign: 'right' }}>
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    
                                                >
                                                    {user.nama_pemakai}

                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div> */}
                            </div>
                        </div>
                        
                    </div>
                    
                </header>
                {children}
            </div>
        </div>
    );
}
