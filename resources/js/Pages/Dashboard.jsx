import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Dashboard({ auth, total_tarif_rs }) {
    const canvasRef = useRef(null);
    // Function to get icon color based on response time
    const getIconColor = (time) => {
        if (time < 5) return "text-success"; // Green
        if (time >= 5 && time <= 7) return "text-warning"; // Yellow
        return "text-danger"; // Red
    };

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            // Assuming 'ui-chartjs.js' initializes Chart.js or similar code
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
    }, []);  // Empty dependency array ensures this runs after the component is mounted

    return (
        <AuthenticatedLayout
            user={auth.user}
            total_tarif_rs={total_tarif_rs.total_tarif_rs}
            count_total={total_tarif_rs.count_total}

        >
            <Head title="Dashboard" />
            <div className="col-sm-12">
                <div className="card">
                    Selamat Datang {auth.user.nama_pemakai}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
