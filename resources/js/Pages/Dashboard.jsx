import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth,total_tarif_rs }) {
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
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-header"><center>Jumlah Claim</center></div>
                            <div className="card-body">
                                <p className="card-text"><center>{total_tarif_rs.count_total}</center></p>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-header"><center>Total Tarif RS</center></div>
                            <div className="card-body">
                                <p className="card-text"><center>{total_tarif_rs.total_tarif_rs}</center></p>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-header"><center>Total Tarif INA-CBG </center></div>
                            <div className="card-body">
                                <p className="card-text"><center>{total_tarif_rs.tarifgruper}</center></p>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
