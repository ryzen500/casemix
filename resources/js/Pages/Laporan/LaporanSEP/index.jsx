import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LaporanSEP({ auth,pagination,data }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            pagination = {pagination}
            data = {data}

        >
            <Head title="Dashboard" />

            <div className="col-sm-12 p-5">
                {pagination.current_page}
            </div>
        </AuthenticatedLayout>
    );
}
