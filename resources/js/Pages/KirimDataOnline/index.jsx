import Card from '@/Components/Card';
// import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { ChakraProvider } from "@chakra-ui/react";
import { Column } from 'primereact/column';
import { FormatRupiah } from '@arismun/format-rupiah';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';

export default function kirimDataOnline({ auth}) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [result, setResult] = useState(0);
    const props = usePage().props;
    const [datas, setDatas] = useState([]);
    const [paginations, setPaginations] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        _token: props.csrf_token,
        date_type:1,
        jenisRawat:3,
        tanggal: new Date(),
    });
    // Run handleSearch whenever formData changes
    useEffect(() => {
        handleSearch();
    }, [formData]);
    const onPage2 = (event) => {
        event.page = event.page;
        setLazyState(event);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 5,
        page: 0,
        sortField: null,
        sortOrder: null,

    });
    const rowNumberTemplate = (rowData, { rowIndex }) => {
        return <>{rowIndex + 1}</>; // rowIndex is 0-based, so we add 1 to start from 1
    };

    // Handle form submission using axios
    const handleSave= () => {
        // setLoading(true);
        // // Perform API request with axios
        // axios.post(route('kirimDataOnlineKolektif'), {
        //     ...formData,
        //     page: lazyParams.page,
        // })
        //     .then((response) => {
                
        //         setDatas(response.data.data); // The actual data from the API
        //         setTotalRecords(response.data.pagination); // The actual data from the API

        //         setLoading(false);
        //         // Handle the response from the backend
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
    };
    const handleSearch= () => {
        setLoading(true);
        // Perform API request with axios
        axios.post(route('kirimDataOnlineSearch'), {
            ...formData,
            page: lazyState.page,
        })
            .then((response) => {
                
                setDatas(response.data.data); // The actual data from the API
                setTotalRecords(response.data.pagination); // The actual data from the API
                setResult(response.data.pagination.total_items)
                setLoading(false);
                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
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
    return (
        <AuthenticatedLayout
            user={auth.user}

        >
            <Head title="Kirim Data Online" />
            <section className="section col-sm-12">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Filter:</h4>
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
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <div className="form-group">
                                                        <select
                                                            name='jenisRawat'
                                                            className="form-control"
                                                            onChange={handleInputChange}
                                                            value={formData.jenisRawat}
                                                        >
                                                            <option value='1'>Rawat Inap</option>
                                                            <option value='2'>Rawat Jalan</option>
                                                            <option value='3'>Semua</option>

                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-2">
                                                    <div className="form-group">
                                                        <select
                                                            name='date_type'
                                                            className="form-control"
                                                            onChange={handleInputChange}
                                                            value={formData.date_type}
                                                        >
                                                            <option value='1'>Tanggal Pulang</option>
                                                            <option value='2'>Tanggal Grouping</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-2">
                                                    <div className="form-group">
                                                        <Calendar value={formData.tanggal} name='tanggal' onChange={handleInputChange} dateFormat="dd/mm/yy" />

                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <span style={{color:"black"}}>( {result} Klaim)</span>

                                                </div>
                                                <div className="col-sm-3">
                                                    <button className="btn btn-primary" style={{ float: 'right' }} onClick={handleSave} >
                                                        Kirim Klaim (Online)
                                                    </button>
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
                                        lazy
                                        showGridlines 
                                        value={datas}
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
                                                    <span data-pr-tooltip="Klik Untuk Melihat File Simplifikasi" data-pr-position="bottom" id="info-icon" onClick={() => setShowSimpli(true)}> 
                                                        <FontAwesomeIcon icon={faFile} style={{ color: (rowData.status === "final" || rowData.status === "Final") ? "#43A047" : "#D13232" }} />
                                                    </span>  {"\u00A0"}|{"\u00A0"}
                                                    <Dialog 
                                                            header="File Simplifikasi" 
                                                            visible={showSimpli} 
                                                            maximizable 
                                                            style={{ width: '50vw', height: '50vw' }} 
                                                            onHide={() => { if (!showSimpli) return; setShowSimpli(false); }}
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
