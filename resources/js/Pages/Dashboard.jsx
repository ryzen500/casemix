import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Dashboard({ auth,total_tarif_rs }) {
    const canvasRef = useRef(null);

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
            total_tarif_rs = {total_tarif_rs.total_tarif_rs}
            count_total = {total_tarif_rs.count_total}

        >
            <Head title="Dashboard" />
                <div className="col-sm-12 p-5">
                    <div className="row">
                        <div className="col-sm-4">
                            <Card>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="stats-icon purple">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="text-muted font-semibold">Jumlah Claim</h6>
                                        <h6 className="font-extrabold mb-0">{total_tarif_rs.count_total}</h6>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-sm-4">
                            <Card>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="stats-icon purple">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="text-muted font-semibold">Total Tarif RS</h6>
                                        <h6 className="font-extrabold mb-0">{total_tarif_rs.total_tarif_rs}</h6>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-sm-4">
                            <Card>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="stats-icon purple">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <h6 className="text-muted font-semibold">Total Tarif INA-CBG</h6>
                                        <h6 className="font-extrabold mb-0">{total_tarif_rs.tarifgruper}</h6>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <section className="section">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Bar Chart</h4>
                                    </div>
                                    <div className="card-body">
                                        <canvas ref={canvasRef} id="line"></canvas>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
        </AuthenticatedLayout>
    );
}
