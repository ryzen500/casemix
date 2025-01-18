import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';  // Loading indicator
import { BreadCrumb } from 'primereact/breadcrumb';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { InputMask } from "primereact/inputmask";
import Checkbox from '@/Components/Checkbox';

export default function Dashboard({ auth, model, pasien }) {
    const [datas, setdatas] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state for expanded row
    const toast = useRef(null);
    useEffect(() => {

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowExpand1 = (event) => {
        toast.current.show({ severity: 'info', summary: event.data.nosep, detail: event.data.nosep, life: 3000 });
    };
    const onRowExpand = async (event) => {
        const expandedProduct = event.data;
        // Set loading to true when starting the API request
        setLoading(true);
        if (expandedProduct.pendaftaran_id == null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No SEP belum di sinkron!', life: 3000 });
            setExpandedRows(null);
        } else {
            try {
                // Fetch detailed data (e.g., reviews) for the expanded row
                const response = await axios.post('/getGroupperPasien', {
                    noSep: expandedProduct.noSep, // Send the expandedProduct.noSep data
                    pendaftaran_id: expandedProduct.pendaftaran_id, // Example of additional data
                });
                // const response = await axios.get(`/getGroupperPasien/${expandedProduct.noSep}`);
                // setExpandedRowData(response.data); // Store the data

                if (response.data.model.metaData.code == 200) {
                    toast.current.show({ severity: 'info', summary: event.data.noSep, detail: event.data.noSep, life: 3000 });
                    console.log(response.data.model.response)
                    setdatas(response.data.model.response);
                } else {
                    setExpandedRows(null);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.model.metaData.message, life: 3000 });
                }


            } catch (error) {
                console.error('Error fetching expanded row data:', error);
                setExpandedRows(null); // Optionally, handle error state
            } finally {
                // Set loading to false when the API request finishes
                setLoading(false);
            }

        }
    };
    const onRowCollapse = (event) => {
        // toast.current.show({ severity: 'success', summary: event.data.name, detail: event.data.name, life: 3000 });
    };
    const rowExpansionTemplate = (data) => {
        return (

            <div className="p-3">
                {/* Show loading spinner while fetching expanded row data */}
                {loading ? (
                    <div className="p-d-flex p-jc-center">
                        <ProgressSpinner />
                    </div>
                ) : (
                    // Show additional data (reviews, etc.) once it is loaded
                    expandedRows && (
                        <div>
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-sm-5 ">
                                        <div className="float-end">

                                            <label htmlFor="ssn" className="font-bold block mb-2">Jaminan / Cara Bayar</label>
                                            JKN
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <label htmlFor="ssn" className="font-bold block mb-2">No. Peserta</label>
                                        <InputText />
                                    </div>
                                    <div className="col-sm-5">
                                        <div className="float-start">
                                            <label htmlFor="ssn" className="font-bold block mb-2">No. SEP</label>
                                            <InputText />
                                        </div>
                                    </div>

                                </div>
                                <table className='table table-bordered' style={{ border: ' 1px solid black' }}>
                                    <tr>
                                        <td width={"15%"}>
                                            Jenis Rawat
                                        </td>
                                        <td width={"60%"}>
                                            isian
                                        </td>
                                        <td width={"10%"}>Kelas Hak</td>
                                        <td width={"15%"}>Isian</td>
                                    </tr>
                                    <tr>
                                        <td width={"15%"}>
                                            Tanggal Rawat
                                        </td>
                                        <td width={"60%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        Masuk :
                                                    </div>
                                                    <div className="col-sm-6">
                                                        Pulang :
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"10%"}>Umur</td>
                                        <td width={"15%"}>tes Tahun</td>
                                    </tr>
                                    <tr>
                                        <td>Cara Masuk</td>
                                        <td colSpan={3}>ISIAN</td>
                                    </tr>
                                    <tr>
                                        <td>LOS</td>
                                        <td>dev hari</td>
                                        <td>Berat Lahir(gram)</td>
                                        <td>isian</td>
                                    </tr>
                                    <tr>
                                        <td>ADL Score</td>
                                        <td>isian</td>
                                        <td>Cara Pulang</td>
                                        <td>dev</td>
                                    </tr>
                                    <tr>
                                        <td>DPJP</td>
                                        <td>isian</td>
                                        <td>Jenis Tarif</td>
                                        <td>dev</td>
                                    </tr>
                                    <tr>
                                        <td>Pasien TB</td>
                                        <td colSpan={3}>isian</td>
                                    </tr>
                                </table>
                                <table className='table table-bordered' style={{ border: ' 1px solid black', width: '100%' }}>
                                    <tr>
                                        <td colSpan={3}><p className='text-center'>Tarif Rumah Sakit</p></td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"30%"}>ddd</td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"30%"}>ddd</td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"30%"}>ddd</td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"30%"}>ddd</td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"30%"}>ddd</td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"35%"}>ddd</td>
                                        <td width={"30%"}>ddd</td>
                                    </tr>
                                </table>
                                <div className='text-center'><Checkbox></Checkbox> Menyatakan benar bahwa data tarif yang tersebut di atas adalah benar sesuai dengan kondisi yang sesungguhnya.</div>

                                {/*  Hasil Grouping */}
                                <table className='table table-bordered' style={{ border: ' 1px solid black', width: '100%' }}>
                                    <tr>
                                        <td colSpan={4}><p className='text-center'>Hasil Grouper E-Klaim v5 </p></td>
                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Info</td>
                                        <td width={"35%"} style={{textAlign:'left'}} >-</td>
                                        <td width={"30%"}></td>
                                        <td width={"30%"}></td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Jenis Rawat</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>Rawat Jalan Regular </td>
                                        <td width={"30%"}></td>
                                        <td width={"30%"}></td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Group</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>PENYAKIT KRONIS KECIL LAIN-LAIN</td>
                                        <td width={"30%"} style={{textAlign:'center'}}>Q-5-44-0</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Sub Acute</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'center'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Chronic</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'center'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Special Procedure</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'center'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>

                                    <tr>
                                        <td width={"15%"}>Special Prosthesis</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'center'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>


                                    <tr>
                                        <td width={"15%"}>Special Investigation</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'center'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>


                                    <tr>
                                        <td width={"15%"}>Special Drug</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'center'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>

                                    <tr>
                                        <td width={"15%"}>Status DC Kemkes</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>Klaim belum terkirim ke Pusat Data Kementerian Kesehatan</td>
                                        <td width={"30%"} style={{textAlign:'center'}}></td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>

                                    <tr>
                                        <td width={"15%"}>Status Klaim</td>
                                        <td width={"35%"} style={{textAlign:'left'}}>-</td>
                                        <td width={"30%"} style={{textAlign:'center'}}></td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>


                                    <tr>
                                        <td width={"15%"}></td>
                                        <td width={"35%"} style={{textAlign:'left'}}></td>
                                        <td width={"30%"} style={{textAlign:'center'}}>Total</td>
                                        <td width={"30%"} style={{textAlign:'right'}}>Rp 0 </td>

                                    </tr>


                                </table>
                            </div>
                        </div>
                    )
                )}
            </div>

        );
    };
    const allowExpansion = (rowData) => {
        // return rowData.orders.length > 0;
    };

    const items = [
        { label: pasien['no_rekam_medik'] },
        { label: pasien['nama_pasien'] },
        { label: pasien['jeniskelamin'] },
        { label: pasien['tanggal_lahir'] },

    ];
    const noSepBody = (rowData) => {
        return (
            <div>
                {rowData.pendaftaran_id == null ? (
                    <div>{rowData.noSep}<br />No SEP belum di sinkron</div> // Show message if pendaftaran_id is null
                ) : (
                    <div>
                        {rowData.noSep}
                    </div>
                )}
            </div>
        );
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <>
                <div className="card">
                    <BreadCrumb model={items} separatorIcon={'pi pi-ellipsis-h'} />
                </div>
                <Card>
                    <Toast ref={toast} />
                    <DataTable value={model} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                        onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="noSep" tableStyle={{ minWidth: '60rem' }}>
                        <Column expander style={{ width: '5rem' }} />

                        <Column field="tglSep" header="Tanggal Masuk" ></Column>
                        <Column field="tglPlgSep" header="Tanggal Pulang" ></Column>
                        <Column field="jaminan" header="Jaminan" body={"JKN"} ></Column>
                        <Column field="noSep" header="No. SEP" body={noSepBody} ></Column>
                        <Column field="tipe" header="Tipe" ></Column>
                        <Column field="cbg" header="CBG" ></Column>
                        <Column field="status" header="Status" ></Column>
                        <Column field="nama_pegawai" header="Petugas" ></Column>
                    </DataTable>
                </Card>
            </>

        </AuthenticatedLayout>
    );
}
