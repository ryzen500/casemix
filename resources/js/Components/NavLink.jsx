import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <li className={'sidebar-item '+ (active?'active':'')}>
            <Link
                {...props}
                className={
                    'sidebar-link ' 
                }
            >
                {children}
            </Link>
        </li>
    );
}
