import { DataTable } from 'primereact/datatable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

export default function CodingGrouping({ auth, pagination, data }) {
    const columns = ['No', 'Tgl Masuk', 'Tgl Pulang', 'No. SEP', 'Nama Pasien', 'Billing RS', 'Rawat', 'Status Klaim'];

    // State to handle criteria card visibility
    const [showCriteria, setShowCriteria] = useState(false);

    const props = usePage().props;
    // State to handle form data
    const [formData, setFormData] = useState({
        _token: props.csrf_token,
        query: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        periode: '',
        jenisRawat: '',
        statusKlaim: '',
        kelasRawat: '',
        metodePembayaran: ''
    });

    // Function to toggle criteria card visibility
    // const toggleCriteria = () => {
    //     setShowCriteria(!showCriteria);
    // };

    // // Handle input change
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value
    //     }));
    // };


    // Header Group
    const headerGroup = (
        <ColumnGroup>


            <Row>

                <Column header="No" rowSpan={2} />
                <Column header="Tanggal Masuk" rowSpan={2} />
                <Column header="Tanggal Pulang" rowSpan={2} />
                <Column header="No SEP" rowSpan={2} />
                <Column header="Nama Pasien" rowSpan={2} />
                <Column header="INACBG" colSpan={2} style={{ textAlign: "center" }} />
                <Column header="Billing RS" rowSpan={2} />
                <Column header="Rawat" rowSpan={2} />
                <Column header="Status Klaim" rowSpan={2} />

            </Row>
            <Row>
                <Column header="Kode" />
                <Column header="Tarif Total" />
            </Row>
        </ColumnGroup>
    );
    // State for lazy loading and data management
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

    // Toggle criteria card visibility
    const toggleCriteria = () => setShowCriteria((prev) => !prev);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const tglMasukBody = (rowData) => {
        console.log("Row Data", rowData);

        if (rowData.tanggalmasuk_inacbg) {
            return rowData.tanggalmasuk_inacbg;
        } else {
            return rowData.tglmasuk;

        }
    };


    const tglPulangBody = (rowData) => {
        console.log("Row Data", rowData);

        if (rowData.tanggalpulang_inacbg) {
            return rowData.tanggalpulang_inacbg;
        } else {
            return rowData.tglpulang;

        }
    };

    // Fetch lazy data
    const loadLazyData = () => {
        setLoading(true);

        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }



        networkTimeout = setTimeout(() => {
            const fetchUrl = `${route("getSearchGroupper")}/?page=${lazyState.page + 1
                }&per_page=${lazyState.rows}`;

            axios
                .post(fetchUrl, formData)
                .then((response) => {
                    setUsers(response.data.data); // The actual data from the API
                    setPaginations(response.data.pagination);
                    setTotalRecords(response.data.totalRecords);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }, Math.random() * 1000 + 250); // Simulate a delay
    };

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);



    const onPage = (event) => {
        setLazyState(event);
    };
    const rowNumberTemplate = (rowData, { rowIndex }) => {
        console.log(rowIndex)
        return <>{rowIndex + 1}</>; // rowIndex is 0-based, so we add 1 to start from 1
    };
    // Handle form submission using axios
    const handleSave = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log('Form Data Submitted:', formData);

        // Perform API request with axios
        axios.post(route('getSearchGroupper'), formData)
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            pagination={pagination}
            data={data}
        >
            <Head title="Search Coding / Grouping" />

            {/* Section for Search Bar */}
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Pencarian Data</h4>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                                    {/* Search Input */}
                                    <input
                                        type="text"
                                        name='query'
                                        value={formData.query}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Cari No. RM / No. SEP / Nama"
                                        style={{
                                            width: '100%',
                                            maxWidth: '700px', // Limits the width on larger screens
                                            border: 'none',
                                            backgroundColor: '#FFFBCC'
                                        }}
                                    />
                                    <button className="btn btn-light mr-5" onClick={toggleCriteria}>
                                        <i className="fas fa-calendar-alt"></i>
                                    </button>
                                    {/* Action Buttons */}
                                    <div>
                                        <button className="btn btn-secondary ml-2">Cari</button>
                                        <button className="btn btn-primary ml-2">Pasien Baru</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Criteria Card - Hidden/Visible based on state */}
            {showCriteria && (
                <section className="section">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Pencarian klaim dengan kriteria:</h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {/* Periode */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Periode:</label>

                                                <select name="periode"
                                                    onChange={handleInputChange} // Menambahkan onChange
                                                    className="form-control" value={formData.periode}>
                                                    <option value='pilih'>Pilih</option>
                                                    <option value="tanggal_pulang">Tanggal Pulang</option>
                                                    <option value="tanggal_masuk">Tanggal Masuk</option>
                                                    <option value="tanggal_grouping">Tanggal Grouping</option>
                                                </select>
                                                <div className="d-flex justify-content-between mt-2">
                                                    <input type="date" className="form-control" name='tanggal_mulai' onChange={handleInputChange} value={formData.tanggal_mulai} />
                                                    <span className="mx-2 align-self-center">s/d</span>
                                                    <input type="date" className="form-control" name='tanggal_selesai' onChange={handleInputChange} value={formData.tanggal_selesai} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Jenis Rawat */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Jenis Rawat:</label>
                                                <select
                                                    name='jenisrawat'
                                                    className="form-control"
                                                    onChange={handleInputChange}
                                                    value={formData.jenisrawat}
                                                >
                                                    <option value='pilih'>Pilih</option>
                                                    <option value='semua'>Semua</option>
                                                    <option value='KELAS 1'>Kelas 1</option>
                                                    <option value='KELAS 2'>Kelas 2</option>
                                                </select>
                                            </div>

                                            {/* Status Klaim */}

                                            <div className="form-group">
                                                <label>Status Klaim:</label>
                                                <select name='statusKlaim' onChange={handleInputChange}
                                                    value={formData.statusKlaim} className="form-control">
                                                    <option value='pilih'>Pilih</option>

                                                    <option value='semua'>Semua</option>
                                                    <option value='Terkirim'>Terkirim</option>
                                                    <option value='Final'>Final</option>
                                                    <option value='-'>Belum Final</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="row">
                                        {/* Kelas Rawat */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Kelas Rawat:</label>
                                                <div className="d-flex">
                                                    <div className="form-check mr-2">
                                                        <input type="radio" name="kelasRawat" className="form-check-input"
                                                            value={formData.kelasRawat}
                                                            onChange={handleInputChange} />
                                                        <label className="form-check-label">Kelas 1</label>
                                                    </div>
                                                    <div className="form-check mr-2">
                                                        <input type="radio" name="kelasRawat" className="form-check-input"
                                                            value={formData.kelasRawat}

                                                            onChange={handleInputChange} />
                                                        <label className="form-check-label">Kelas 2</label>
                                                    </div>
                                                    <div className="form-check mr-2">
                                                        <input type="radio" name="kelasRawat" className="form-check-input"
                                                            value={formData.kelasRawat}

                                                            onChange={handleInputChange} />
                                                        <label className="form-check-label">Kelas 3</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input type="radio" name="kelasRawat" className="form-check-input"
                                                            value={formData.kelasRawat}

                                                            onChange={handleInputChange} />
                                                        <label className="form-check-label">Semua Kelas</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Metode Pembayaran */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Metode Pembayaran:</label>
                                                <select
                                                    name='metodePembayaran' onChange={handleInputChange}
                                                    value={formData.metodePembayaran} className="form-control">
                                                    <option value='pilih'>Pilih</option>
                                                    <option value='semua'>Semua</option>
                                                    <option value='jkn'>JKN</option>
                                                    <option value='jaminan_covid'>JAMINAN COVID-19</option>
                                                    <option value='pasien_bayar'>Pasien Bayar</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        {/* Buttons */}
                                        <div className="col-md-6 d-flex align-items-end">
                                            <button className="btn btn-primary" onClick={handleSave}>Cari</button>
                                            <button className="btn btn-secondary ml-2" onClick={toggleCriteria}>Tutup</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section for Data Table */}
            <section className="section">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">List Data</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <DataTable
                                        paginator
                                        dataKey="idq"
                                        first={lazyState.first}
                                        rows={paginations.items_per_page}
                                        totalRecords={paginations.total_items}
                                        headerColumnGroup={headerGroup}
                                        lazy
                                        value={users}
                                        loading={loading}
                                        stripedRows
                                        rowsPerPageOptions={[10, 25, 50]}
                                        onPage={onPage}
                                    >
                                        <Column body={rowNumberTemplate} header="No." style={{ width: '50px', alignItems: 'center' }} />
                                        <Column header="Tanggal Masuk" body={tglMasukBody} style={{ alignItems: 'center' }} ></Column>
                                        <Column header="Tanggal Pulang" body={tglPulangBody} style={{ alignItems: 'center' }} ></Column>
                                        <Column field="nosep" header="No SEP" style={{ alignItems: 'center' }} ></Column>
                                        <Column field="nama_pasien" header="Pasien" style={{ alignItems: 'center' }} ></Column>
                                        <Column field="-" header="Rawat" style={{ alignItems: 'center' }} ></Column>
                                        <Column field="-" header="Status Klaim" style={{ alignItems: 'center' }} ></Column>
                                        <Column field="-" header="Status Klaim" style={{ alignItems: 'center' }} ></Column>

                                        <Column field="tipe" header="Rawat" style={{ alignItems: 'center' }} ></Column>
                                        <Column field="status" header="Status Klaim" style={{ alignItems: 'center' }} ></Column>

                                    </DataTable>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
