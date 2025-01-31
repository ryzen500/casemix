import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Import axios
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';

export default function CodingGrouping({ auth, pagination, data }) {

    // State to handle criteria card visibility
    const [showCriteria, setShowCriteria] = useState(false);
    const [datas, setDatas] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
        page: 0,
        sortField: null,
        sortOrder: null,

    });
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
    });

    const op = useRef(null);
    const toast = useRef(null);
    const isMounted = useRef(false);
    const productSelect = (e) => {
        op.current.hide();
        const id = e.data.nopeserta;
        window.open(route('searchGroupperPasien',id), '_parent');

        toast.current.show({ severity: 'info', summary: 'Data Sudah Dipilih', detail:e.data.name, life: 3000 }); 
    };
    useEffect(() => {
        isMounted.current = true;
        handleSearch();
        // ProductService.getProductsSmall().then((data) => setProducts(data));
    }, [lazyParams]);
    const onProductSelect = (e) => {
        setSelectedProduct(e.value);
    };

    const handleClick = (event) => {
        // Show the overlay relative to the clicked element
        op.current.toggle(event, event.currentTarget);
        setLazyParams((prevData) => ({
            ...prevData,
            ['page']: 1,
            ['first']:1
        }));
        handleSearch();
    };
    // Handle form submission using axios
    const handleSearch = () => {
        // console.log('Form Data Submitted:', formData);
        setLoading(true);
        // Perform API request with axios
        axios.post(route('getSearchGroupperData'), {
            ...formData,
            page: lazyParams.page,
        })
            .then((response) => {
                console.log('Response:', response.data,'>>>>>',lazyParams.page);
                
                setDatas(response.data.data); // The actual data from the API
                setTotalRecords(response.data.pagination); // The actual data from the API

                setLoading(false);
                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    // Handle pagination event
    const onPage = (event) => {
        event.page = event.page+1;
        setLazyParams(event);
    };
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
    const toggleCriteria = () => {
        setShowCriteria(!showCriteria);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {

            op.current.toggle(event, event.currentTarget);
            setLazyParams((prevData) => ({
                ...prevData,
                ['page']: 1,
                ['first']:1
            }));
            handleSearch();
        }
      };
    // Handle form submission using axios
    const handleSave = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log('Form Data Submitted:', formData);

        // Perform API request with axios
        axios.post(route('getSearchGroupper'), formData)
            .then((response) => {
                console.log('Response:', response.data);
                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const customBodyTemplate = (rowData) => {
        return (
            <div>
                
                <div>
                    {rowData.nama_pasien}
                </div>
            
                <small style={{ display: 'block', color: '#6c757d' }}>
                Kartu: {rowData.nopeserta}
                </small>

                <small style={{ display: 'block', color: '#6c757d' }}>
                Tanggal Lahir: {rowData.tanggal_lahir} ({rowData.usia})
                </small>
                <small style={{ display: 'block', color: '#6c757d',marginBottom:'15px' , textAlign:'right' }}>
                    Rekam Medik: {rowData.no_rekam_medik} 
                </small>
             
            </div>
        );
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
                                    <div className="col-sm-12">
                                        <div className="row">
                                            <div className="col-sm-10">
                                                {/* Search Input */}
                                                <div className="row">
                                                    <div className="col-sm-11">
                                                        <input
                                                            type="text"
                                                            name='query'
                                                            value={formData.query}
                                                            onChange={handleInputChange}
                                                            onKeyDown={handleKeyDown}
                                                            className="form-control"
                                                            placeholder="Cari No. RM / No. SEP / Nama"
                                                            style={{
                                                                // width: '90%',
                                                                // maxWidth: '700px', // Limits the width on larger screens
                                                                border: 'none',
                                                                backgroundColor: '#FFFBCC'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-sm-1">
                                                        <button className="btn btn-light " onClick={toggleCriteria}>
                                                            <i className="fas fa-calendar-alt"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                            </div>
                                            <div className="col-sm-2">
                                                <div>
                                                <Toast ref={toast} />

                                                    <Button type="button" label="Cari" onClick={handleClick} className="btn btn-secondary ml-2"  />
                                                    <button className="btn btn-primary ml-2">Pasien Baru</button>
                                                    <OverlayPanel ref={op} showCloseIcon closeOnEscape dismissable={false} style={{ width: '70%' }}>
                                                        <DataTable 
                                                            value={datas} 
                                                            selectionMode="single" 
                                                            paginator 
                                                            rows={5} 
                                                            first={lazyParams.first}
                                                            totalRecords={totalRecords.total_items}
                                                            selection={selectedProduct}
                                                            onSelectionChange={(e) => setSelectedProduct(e.value)} 
                                                            onRowClick={productSelect}
                                                            lazy 
                                                            loading={loading}
                                                            onPage={onPage}
                                                        >
                                                            <Column field="nama_pasien" header="Name" body={customBodyTemplate}  style={{ minWidth: '12rem' }} />

                                                        </DataTable>
                                                    </OverlayPanel>
                                                </div>
                                            </div>
                                        </div>
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
                                                    <option value='semua'>Semua</option>
                                                    <option value='kelas_1'>Kelas 1</option>
                                                    <option value='kelas_2'>Kelas 2</option>
                                                </select>
                                            </div>

                                            {/* Status Klaim */}

                                            <div className="form-group">
                                                <label>Status Klaim:</label>
                                                <select name='statusKlaim' onChange={handleInputChange}
                                                    value={formData.statusKlaim} className="form-control">
                                                    <option value='semua'>Semua</option>
                                                    <option value='pending'>Pending</option>
                                                    <option value='disetujui'>Disetujui</option>
                                                    <option value='ditolak'>Ditolak</option>
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
                                            <button className="btn btn-primary">Cari</button>
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
                                    {/* <DataTable url="/getSearchGroupper" columns={columns} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
