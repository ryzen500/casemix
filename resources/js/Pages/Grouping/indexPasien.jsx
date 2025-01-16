import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';

export default function Dashboard({ auth,model }) {
    const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    useEffect(() => {
        
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowExpand = (event) => {
        console.log(expandedRows)
        console.log(event.data.nosep)
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.nosep, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };
    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-3">
                <h5>Orders for {data.name}</h5>
            </div>
        );
    };
    const allowExpansion = (rowData) => {
        console.log(rowData);
        // return rowData.orders.length > 0;
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Card>
            <Toast ref={toast} />
                <DataTable value={model} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                        onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="pendaftaran_id" tableStyle={{ minWidth: '60rem' }}>
                    <Column expander style={{ width: '5rem' }} />
                    <Column field="nama_pasien" header="Name" ></Column>

                    <Column field="no_rekam_medik" header="No. Rekam Medik" ></Column>

                    <Column field="nosep" header="No. SEP" ></Column>
                    <Column field="status" header="Status" ></Column>

                </DataTable>
            </Card>
        </AuthenticatedLayout>
    );
}
