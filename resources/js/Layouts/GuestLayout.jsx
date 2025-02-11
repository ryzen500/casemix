import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div
            style={{ backgroundImage: `url('assets/images/bg/bg-lock-screen.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0"
        >


            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>

                </div>

                <div style={{ textAlign: 'center' }} className="mt-3">
                    <span ><b>Aplikasi Casemix</b></span>
                </div>

                <div className='mt-3'>
                    {children}

                </div>
            </div>
        </div>
    );
}
