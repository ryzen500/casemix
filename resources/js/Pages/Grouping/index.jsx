import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Import axios
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Toast } from 'primereact/toast';
import { FormatRupiah } from '@arismun/format-rupiah';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';

export default function CodingGrouping({ auth }) {

    // State to handle criteria card visibility
    const [showCriteria, setShowCriteria] = useState(false);
    const [datas, setDatas] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedDialog, setSelectedDialog] = useState(null);

    const openDialog = (rowData) => {
        setSelectedDialog(rowData.sep_id);
    };
    
    const closeDialog = () => {
        setSelectedDialog(null);
    };
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
        page: 0,
        sortField: null,
        sortOrder: null,

    });
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 100,
        page: 0,
        sortField: null,
        sortOrder: null,
    });
    const [showSimpli, setShowSimpli] = useState(false);

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
    useEffect(() => {
        isMounted.current = true;
        loadLazyData();
        // ProductService.getProductsSmall().then((data) => setProducts(data));
    }, [lazyState]);
    const onProductSelect = (e) => {
        setSelectedProduct(e.value);
    };
    const formatDateTime = (dateString) => {
        // Convert the date string to a Date object
        const date = new Date(dateString.replace(" ", "T"));
          // Get the day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if day is < 10
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const year = date.getFullYear();

        // Return formatted date in dd-mm-yyyy format
        return `${day}-${month}-${year}`;

    };
    const [users, setUsers] = useState([]);
    const [paginations, setPaginations] = useState([]);
    const headerGroup = (
        <ColumnGroup>


            <Row>

                <Column header="No" rowSpan={2} style={{ border:'1px solid #e5e7eb'}}/>
                <Column header="Tanggal Masuk" rowSpan={2}  style={{ border:'1px solid #e5e7eb'}} />
                <Column header="Tanggal Pulang" rowSpan={2}   style={{ border:'1px solid #e5e7eb'}}/>
                <Column header="No SEP" rowSpan={2}  style={{ border:'1px solid #e5e7eb'}}  align={'center'}  alignHeader={'center'}/>
                <Column header="Nama Pasien" rowSpan={2}  style={{ border:'1px solid #e5e7eb'}} />
                <Column header="INACBG" colSpan={2} align='center' style={{ textAlign: "center",border:'1px solid #e5e7eb' }} />
                <Column header="Billing RS" rowSpan={2}  style={{ border:'1px solid #e5e7eb'}}/>
                <Column header="Rawat" rowSpan={2}  style={{ border:'1px solid #e5e7eb'}}/>
                <Column header="Status Klaim" rowSpan={2}  style={{ border:'1px solid #e5e7eb'}}/>
                <Column header="Petugas" rowSpan={2}  style={{ border:'1px solid #e5e7eb'}}/>

            </Row>
            <Row>
                <Column header="Kode"  style={{ border:'1px solid #e5e7eb'}} />
                <Column header="Tarif Total"  style={{ border:'1px solid #e5e7eb'}} />
            </Row>
        </ColumnGroup>
    );
    let networkTimeout = null;

    const tglMasukBody = (rowData) => {
        console.log("Waktus masuk ", formatDateTime(rowData.tgl_masuk));
        return (
        <>
            <a   style={{ textDecoration: 'underline',color :'blue' }}  href={route('searchGroupperPasien',rowData.nokartuasuransi)} className="submenu-item">{rowData.tgl_masuk?formatDateTime(rowData.tgl_masuk):''} </a>
        </>);

    };

    const tglPulangBody = (rowData) => {

        console.log("waktu ", formatDateTime(rowData.tgl_pulang));
        return rowData.tgl_pulang?formatDateTime(rowData.tgl_pulang):'';
    };
    
    const jnspelayananBody = (rowData) => {
        if(rowData.jnspelayanan == 1){
            return 'Rawat Inap';
        }else if(rowData.jnspelayanan == 2){
            return 'Rawat Jalan';
        }
    };
    // Fetch lazy data
    const loadLazyData = () => {

        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }

        networkTimeout = setTimeout(() => {
            setLoading(true);
            // const fetchUrl = `${route("/getSearchGroupper")}/?page=${lazyState.page + 1}&per_page=${lazyState.rows}`;            
            const fetchUrl = route("getSearchGroupper"); // Just the URL without query parameters

            axios.post(fetchUrl, {
                page: lazyState.page + 1,
                per_page: lazyState.rows,
                ...formData // If you need to send more data
            })
            axios.post(fetchUrl, formData)
                .then((response) => {
                    setUsers(response.data.data); // The actual data from the API
                    setPaginations(response.data.pagination);
                    // setTotalRecords(response.data.totalRecords);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }, Math.random() * 1000 + 250); // Simulate a delay
    };
    const onPageTable = (event) => {
        setLazyState(event);
    };
    const rowNumberTemplate = (rowData, { rowIndex }) => {
        return <>{rowIndex + 1}</>; // rowIndex is 0-based, so we add 1 to start from 1
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
        setLoading(true);
        // Perform API request with axios
        axios.post(route('getSearchGroupperData'), {
            ...formData,
            page: lazyParams.page,
        })
            .then((response) => {
                
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
    // Handle pagination event
    const onPage2 = (event) => {
        event.page = event.page;
        setLazyState(event);
    };
    const props = usePage().props;
    // set default date now
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    // State to handle form data
    const [formData, setFormData] = useState({
        _token: props.csrf_token, 
        query: '',
        tanggal_mulai: formattedDate,
        tanggal_selesai: formattedDate,
        periode: 'tanggal_pulang',
        jenisRawat: '',
        statusKlaim: '',
        kelasRawat: 'Semua Kelas',
        metodePembayaran: '',
        nosep: '',
        nama_pasien:''
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

        setLoading(true);

        // Perform API request with axios
        // const fetchUrl = `${route("/getSearchGroupper")}/?page=${1}&per_page=${lazyState.rows}`;            
        const fetchUrl = route("getSearchGroupper"); // Just the URL without query parameters

        axios.post(fetchUrl, {
            page: 1,
            per_page: lazyState.rows,
            ...formData // If you need to send more data
        })
            .then((response) => {
                setUsers(response.data.data); // The actual data from the API
                setPaginations(response.data.pagination);
                // setTotalRecords(response.data.totalRecords);
                setLoading(false);
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
                Tanggal Lahir: {rowData.tanggal_lahir} ({rowData.jeniskelamin})
                {/* ({rowData.usia}) */}
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
                                                    {/* <button className="btn btn-primary ml-2">Pasien Baru</button> */}
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
                                                    name='jenisRawat'
                                                    className="form-control"
                                                    onChange={handleInputChange}
                                                    value={formData.jenisRawat}
                                                >
                                                    <option value='semua'>Semua</option>
                                                    <option value='RI'>Rawat Inap</option>
                                                    <option value='RJ'>Rawat Jalan</option>
                                                </select>
                                            </div>

                                            {/* Status Klaim */}

                                            <div className="form-group">
                                                <label>Status Klaim:</label>
                                                <select name='statusKlaim' onChange={handleInputChange}
                                                    value={formData.statusKlaim} className="form-control">
                                                    <option value='semua'>Semua</option>
                                                    <option value='belum_grouping'>Belum Grouping</option>
                                                    <option value='normal'>Normal</option>
                                                    <option value='final'>Final</option>
                                                    <option value='terkirim'>Terkirim</option>
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
                                                            checked={formData.kelasRawat === "1"}
                                                            onChange={handleInputChange} />
                                                        <label className="form-check-label">Kelas 1</label>
                                                    </div>
                                                    <div className="form-check mr-2">
                                                        <input type="radio" name="kelasRawat" className="form-check-input"
                                                            value={formData.kelasRawat}
                                                            checked={formData.kelasRawat === "2"}
                                                            onChange={handleInputChange} />
                                                        <label className="form-check-label">Kelas 2</label>
                                                    </div>
                                                    <div className="form-check mr-2">
                                                        <input type="radio" name="kelasRawat" className="form-check-input"
                                                            value={formData.kelasRawat}
                                                            checked={formData.kelasRawat === "3"}

                                                            onChange={handleInputChange} />
                                                        <label className="form-check-label">Kelas 3</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input type="radio" name="kelasRawat" className="form-check-input"
                                                            value={formData.kelasRawat}
                                                            checked={formData.kelasRawat === "Semua Kelas"}

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
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>No SEP:</label>
                                                <input type="text" className="form-control" name='nosep' value={formData.nosep} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label>Nama:</label>
                                                <input type="text" className="form-control" name='nama_pasien' value={formData.nama_pasien}  onChange={handleInputChange}/>
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
                                    {/* <DataTable url="/getSearchGroupper" columns={columns} /> */}
                                    <DataTable
                                        paginator
                                        dataKey="nosep"
                                        first={lazyState.first}
                                        rows={parseInt(paginations.items_per_page)}
                                        totalRecords={paginations.total_items}
                                        headerColumnGroup={headerGroup}
                                        lazy
                                        showGridlines 
                                        value={users}
                                        loading={loading}
                                        stripedRows
                                        rowsPerPageOptions={[100, 200, 300]}
                                        onPage={onPage2}
                                    >
                                        <Column body={rowNumberTemplate} header="No." style={{ width: '50px', alignItems: 'center' , border:'1px solid #e5e7eb'}} />
                                        <Column header="Tanggal Masuk" body={tglMasukBody} style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
                                        <Column header="Tanggal Pulang" body={tglPulangBody} style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
                                        <Column field="nosep"    body={(rowData) => (
                                                <>
                                                {rowData.nosep} <br /> 
                                                    <span data-pr-tooltip="Klik Untuk Melihat File Simplifikasi" data-pr-position="bottom" id="info-icon" onClick={() => openDialog(rowData)}> 
                                                        <FontAwesomeIcon icon={faFile} style={{ color: (rowData.status === "final" || rowData.status === "Final") ? "#43A047" : "#D13232" }} />
                                                    </span>  {"\u00A0"}|{"\u00A0"}
                                                    <Dialog 
                                                            header="File Simplifikasi" 
                                                            visible={selectedDialog === rowData.sep_id} 
                                                            maximizable 
                                                            style={{ width: '50vw', height: '50vw' }} 
                                                            onHide={closeDialog}
                                                            >
                                                        {/* <Dialog header="File Simplifikasi" visible={showSimpli} maximizable style={{ width: '50vw', height: '50vw' }} onHide={() => { if (!showSimpli) return; setShowSimpli(false); }}> */}
                                                        <iframe
                                                            src={`http://192.168.214.229/rswb-e/index.php?r=sepGlobal/printSep&sep_id=${rowData.sep_id}`}
                                                            width="100%"
                                                            height="100%"
                                                            style={{ border: "none" }}
                                                        ></iframe>
                                                    </Dialog>
                                                    {/* PrimeReact Tooltip */}
                                                <span style={{fontSize:"13px",color:'#888'}}>{rowData.nokartuasuransi}</span>
                                                <Tooltip target="#info-icon" />
                                                    
                                                </>
                                            )}  header="No SEP" style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} align={'center'}  alignHeader={'center'}></Column>
                                        <Column field="nama_pasien"    body={(rowData) => (
                                                <>
                                                {rowData.nama_pasien} <br /> <span style={{fontSize:"13px",color:'#888'}}>{rowData.no_rekam_medik}</span>
                                                </>
                                            )}  header="Pasien" style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
                                        <Column field="kodeprosedur" header="Kode"  body={(rowData)=>(<>{rowData.kodeprosedur || '-'}</>)} style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
                                        <Column field="plafonprosedur" header="Tarif Total"  body={(rowData)=>(<><FormatRupiah value={rowData.plafonprosedur || 0} /></>)} style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
                                        <Column field="total_tarif_rs" body={(rowData)=>(<><FormatRupiah value={rowData.total_tarif_rs || 0} /></>)} header="Billing RS" style={{ alignItems: 'center', textAlign:'right',border:'1px solid #e5e7eb' }} ></Column>
                                        <Column field="jnspelayanan" header="Rawat" body={jnspelayananBody}  style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
                                        <Column field="status" header="Status Klaim" body={(rowData)=>(<>{rowData.status || '-'}</>)}  style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
                                        <Column field="nama_pegawai" header="Petugas" body={(rowData)=>(<>{rowData.nama_pegawai || '-'}</>)} style={{ alignItems: 'center', border:'1px solid #e5e7eb' }} ></Column>
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