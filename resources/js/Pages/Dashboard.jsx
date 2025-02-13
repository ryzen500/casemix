import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Dashboard({ auth, total_tarif_rs }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April'],
                    datasets: [{
                        label: 'My First Dataset',
                        data: [65, 59, 80, 81],
                        borderColor: 'rgb(255, 99, 132)',
                        fill: false,
                    }],
                },
            });
        }
    }, []);
                            {console.log("nama User ", auth.user)}

    return (
        <AuthenticatedLayout
            user={auth.user}
            total_tarif_rs={total_tarif_rs.total_tarif_rs}
            count_total={total_tarif_rs.count_total}
        >
            <Head title="Dashboard" />
            <div className="col-sm-12">
                <div className="card mb-4">
                    <div className="card-header">
                        <h1 style={{fontSize:'22px'}}>
                            12 Januari 2025
                        </h1>
                    </div>
                    <hr />
                    <div className="card-body mt-6">
                        <p style={{fontSize:'38px'}}>Selamat Datang {auth.user.nama_pemakai}                        </p>
                        <div style={{color:'white',backgroundColor:'#0e83d2'}} className="alert alert-info mt-3">
                            <strong style={{fontSize:'20px'}}>Panduan:</strong>
                            <ol style={{ listStyleType: 'decimal',  paddingLeft: '20px' }}>
                                <li style={{fontSize:'20px'}}>Menu Transaksi: menu untuk mengelola Data yang perlu untuk dilakukan Transactional </li>
                                <li style={{fontSize:'20px'}}>Menu Laporan: menu untuk melihat laporan</li>
                                <li style={{fontSize:'20px'}}>Silahkan Klik Link Berikut untuk melakukan Grouping </li>

                            </ol>


                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
