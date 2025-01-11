import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LaporanSEP({ auth,pagination,data }) {
    const columns = ['No', 'Nama Pasien', 'No. RM', 'No. Pendaftaran', 'No. SEP'];
    return (
        <AuthenticatedLayout
            user={auth.user}
            pagination = {pagination}
            data = {data}

        >
            <Head title="Dashboard" />

            <div className="col-sm-12 p-5">
                <DataTable url="/getLaporanSEP" columns={columns} />
            </div>
        </AuthenticatedLayout>
    );
}
