import Card from '@/Components/Card';
// import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function LaporanSEP({ auth, pagination, data }) {
    const columns = ['No', 'Nama Pasien', 'No. RM', 'No. Pendaftaran', 'No. SEP'];
    const [users, setUsers] = useState([]);
    const [paginations, setPaginations] = useState([]);

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,

    });
    let networkTimeout = null;

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);
    const loadLazyData = () => {
        setLoading(true);

        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        // let fetchUrl = `${route('getLaporanSEP')}/?page=${this.state.current_page}&column=${this.state.sorted_column}&order=${this.state.order}&per_page=${this.state.entities.meta.per_page}`;

        //imitate delay of a backend call
        networkTimeout = setTimeout(() => {

            let fetchUrl = `${route('getLaporanSEP')}/?page=${parseInt(lazyState.page + 1)}&per_page=${lazyState.rows}`;
            console.log(parseInt(lazyState.page + 1))
            axios.get(fetchUrl).then(
                (response) => {
                    console.log(response.data.pagination)
                    console.log(lazyState)
                    setUsers(response.data.data); // The actual data from the API
                    setPaginations(response.data.pagination);
                    setTotalRecords(response.data.totalRecords);
                    setLoading(false);
                }
            );
        }, Math.random() * 1000 + 250);
    };
    const onPage = (event) => {
        setLazyState(event);
    };
    // Row number template to show row numbers
    const rowNumberTemplate = (rowData, { rowIndex }) => {
        console.log(rowIndex)
        return <>{rowIndex + 1}</>; // rowIndex is 0-based, so we add 1 to start from 1
    };
    // Fetch data from the server (Laravel Controller)
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await fetch(route('getLaporanSEP')); // This calls the Laravel route
    //         const data = await response.json();
    //         console.log(data)
    //         setUsers(data.data); // The actual data from the API
    //         setPaginations(data.pagination); // The actual data from the API

    //         setLoading(false);
    //     };

    //     fetchData();
    //     console.log(users)

    // }, []);
    return (
        <AuthenticatedLayout
            user={auth.user}
            pagination={pagination}
            data={data}
        >
            <Head title="Dashboard" />
            <div className="col-sm-12 p-5">
                {/* <DataTable url="/getLaporanSEP" columns={columns} /> */}
                <Card>
                    <DataTable
                        paginator
                        dataKey="idq"
                        first={lazyState.first}
                        rows={paginations.items_per_page}
                        totalRecords={paginations.total_items}
                        lazy
                        value={users}
                        stripedRows
                        rowsPerPageOptions={[10, 25, 50]}
                        onPage={onPage}
                    >
                        <Column body={rowNumberTemplate} header="No." style={{ width: '50px' }} />
                        <Column field="sep_id" header="Name" ></Column>
                    </DataTable>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
