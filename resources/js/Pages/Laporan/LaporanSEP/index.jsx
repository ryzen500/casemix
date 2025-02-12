import Card from '@/Components/Card';
// import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { ChakraProvider } from "@chakra-ui/react";
import { Column } from 'primereact/column';
import { FormatRupiah } from '@arismun/format-rupiah';
import DateRangePicker from '@/Components/DateRangePicker';

export default function LaporanSEP({ auth, pagination, data }) {
    const [users, setUsers] = useState([]);
    const [paginations, setPaginations] = useState([]);

    // 
    const [dateRange, setDateRange] = useState([new Date(), new Date()]); // initial date range
    const [isRange, setIsRange] = useState(true); // Toggle between Range and Daily view

    const handleToggle = () => {
        setIsRange((prev) => !prev); // Toggle between range and daily
        if (isRange) {
            setDateRange([new Date(), new Date()]); // Set default to today's date for Daily
        } else {
            setDateRange([new Date(), new Date()]); // Reset to range view with today's date
        }
    };
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const props = usePage().props;

    const [formData, setFormData] = useState({
        _token: props.csrf_token,
        range:1,
        tanggal_mulai: '',
        tanggal_selesai: '',
    });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission using axios
    const handleSave = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log(dateRange.length);
        console.log('Form Data Submitted:', formData);
        let fetchUrl = `${route('getLaporanSEP')}/?page=${parseInt(lazyState.page + 1)}&per_page=${lazyState.rows}&range=${dateRange.length}&tanggal_mulai=${formData.tanggal_mulai}&tanggal_selesai=${formData.tanggal_selesai}`;
        // Perform API request with axios
        axios.get(fetchUrl, formData)
            .then((response) => {
                console.log('Response:', response.data.data);
                setUsers(response.data.data); // The actual data from the API
                setPaginations(response.data.pagination);
                setTotalRecords(response.data.totalRecords);
                setLoading(false);
                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const bodyBiayaTarifGrouper = (rowData) => {
        return <FormatRupiah value={rowData.tarifgruper} />

    }
    const bodyTarifRS = (rowData) => {

        // console.log(rowData.total_tarif_rs);
        return <FormatRupiah value={rowData.total_tarif_rs} />

    }

    const bodyBiayaTagihan = (rowData) => {
        let biayaTagihan;

        biayaTagihan = parseInt(rowData.tindakan) + parseInt(rowData.obat);

        return <FormatRupiah value={biayaTagihan} />
    }
    const bodyTanggalPulang = (rowData) => {
        let tanggalPulang;
        tanggalPulang = rowData.tglpulang ? rowData.tglpulang : '-';
        return tanggalPulang;
    }

    // Row number template to show row numbers
    const rowNumberTemplate = (rowData, { rowIndex }) => {
        console.log(rowIndex)
        return <>{rowIndex + 1}</>; // rowIndex is 0-based, so we add 1 to start from 1
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            pagination={pagination}
            data={data}
        >
            <Head title="Laporan SEP" />
            <section className="section col-sm-12">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Pencarian Laporan:</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {/* Periode */}
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            {/* <label>Tanggal SEP</label>

                                           
                                            <div className="d-flex justify-content-between mt-2">
                                                <input type="date" className="form-control" name='tanggal_mulai' onChange={handleInputChange} value={formData.tanggal_mulai} />
                                                <span className="mx-2 align-self-center">s/d</span>
                                                <input type="date" className="form-control" name='tanggal_selesai' onChange={handleInputChange} value={formData.tanggal_selesai} />
                                            </div> */}

                                            <div>
                                                <DateRangePicker
                                                    dateRange={dateRange}
                                                    label={"Periode Tanggal SEP"}
                                                    setDateRange={(newRange) => {
                                                        setDateRange(newRange);
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            range:dateRange.length,
                                                            tanggal_mulai: newRange[0]?.toISOString().split("T")[0] || "",
                                                            tanggal_selesai: newRange[1]?.toISOString().split("T")[0] || "",
                                                        }));
                                                    }}
                                                    isRange={isRange}
                                                    handleToggle={handleToggle}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                </div>


                                <div className="row">
                                    {/* Buttons */}
                                    <div className="col-md-12 d-flex align-items-end">
                                        <button className="btn btn-primary" onClick={handleSave}>Cari</button>
                                        <button className="btn btn-secondary ml-2">Tutup</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>

            <section>
                <div className="col-sm-12">
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
                            <Column body={rowNumberTemplate} header="No." />
                            <Column field="tglsep" header="Tanggal SEP" ></Column>
                            <Column body={bodyTanggalPulang} header="Tanggal Pulang" ></Column>
                            <Column field="nosep" header="No SEP" ></Column>
                            <Column field="nokartuasuransi" header="No Kartu" ></Column>
                            <Column field="kodeinacbg" header="Kode inacbg" ></Column>
                            <Column field="no_rekam_medik" header="No Rekam Medik" ></Column>
                            <Column field="nama_pasien" header="Nama Pasien" ></Column>
                            <Column body={bodyBiayaTagihan} header="Biaya Tagihan" ></Column>
                            <Column body={bodyBiayaTarifGrouper} header="Biaya Tarif Gruper" ></Column>
                            <Column body={bodyTarifRS} header="Biaya Tarif RS" ></Column>
                        </DataTable>
                    </Card>
                </div>
            </section>

        </AuthenticatedLayout>
    );
}
