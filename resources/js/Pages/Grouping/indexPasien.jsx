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
import { Dropdown } from 'primereact/dropdown';
import { TabPanel, TabView } from 'primereact/tabview';
export default function Dashboard({ auth, model, pasien, caraMasuk }) {
    const [datas, setDatas] = useState([]);
    const [pendaftarans, setPendaftarans] = useState([]);
    const [tarifs, setTarifs] = useState([]);
    const [obats, setObats] = useState([]);
    const [profils, setProfil] = useState([]);
    const [selectedCaraMasuk, setCaraMasuk] = useState(null);
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
                    setDatas(response.data.model.response);
                    setPendaftarans(response.data.pendaftaran);
                    setTarifs(response.data.tarif);
                    setObats(response.data.obat);
                    setProfil(response.data.profil);

                    // console.log(response.data,tarifs.total);
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.model.metaData.message, life: 3000 });
                    setExpandedRows(null);
                }


            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
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
                                        <input type="text" className="form-control" name='nokartuasuransi' value={datas.peserta.noKartu} />
                                    </div>
                                    <div className="col-sm-5">
                                        <div className="float-start">
                                            <label htmlFor="ssn" className="font-bold block mb-2">No. SEP</label>
                                            <input type="text" className="form-control" name='nosep' value={datas.noSep} />
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
                                        <td width={"15%"}>
                                            <input type="text" className="form-control" name='hakKelas' value={datas.peserta.hakKelas} />
                                        </td>
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
                                        <td width={"15%"}>{pendaftarans.umur}</td>
                                    </tr>
                                    <tr>
                                        <td>Cara Masuk</td>
                                        <td colSpan={3}>
                                            <Dropdown value={selectedCaraMasuk} onChange={(e) => setCaraMasuk(e.value)} options={caraMasuk} optionLabel="name"
                                                placeholder="Pilih Cara Masuk" className="w-full md:w-14rem" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>LOS</td>
                                        <td>- hari</td>
                                        <td>Berat Lahir(gram)</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>ADL Score</td>
                                        <td></td>
                                        <td>Cara Pulang</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>DPJP</td>
                                        <td></td>
                                        <td>Jenis Tarif</td>
                                        <td><input type="text" className="form-control" name='nama_tarifinacbgs_1' value={profils.nama_tarifinacbgs_1} /></td>
                                    </tr>
                                    <tr>
                                        <td>Pasien TB</td>
                                        <td colSpan={3}>
                                            <Checkbox name="pasien_tb" value="true" />
                                            <label htmlFor="ingredient1" className="ml-2">Ya</label>
                                        </td>
                                    </tr>
                                </table>
                                <table className='table table-bordered' style={{ border: ' 1px solid black', width: '100%' }}>
                                    <tr>
                                        <td colSpan={3}>
                                            <div className="col-sm-12 text-center">
                                                Tarif Rumah Sakit :
                                                <input type="text" className="ml-2" name='total_tarif_rs' value={(parseFloat(tarifs.total) + parseFloat(obats.total))} />

                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>Prosedur Non Bedah  <input type="text" className="m-2" name='tarif_prosedur_nonbedah' value={tarifs.prosedurenonbedah} /></td>
                                        <td width={"35%"}>Prosedur Bedah  <input type="text" className="m-2" name='tarif_prosedur_bedah' value={tarifs.prosedurebedah} /> </td>
                                        <td width={"30%"}>Konsultasi   <input type="text" className="m-2" name='tarif_konsultasi' value={tarifs.konsultasi} /></td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>Tenaga Ahli <input type="text" className="m-2" name='tarif_tenaga_ahli' value={tarifs.tenagaahli} /></td>
                                        <td width={"35%"}>Keperawatan <input type="text" className="m-2" name='tarif_keperawatan' value={tarifs.keperawatan} /></td>
                                        <td width={"30%"}>Penunjang <input type="text" className="m-2" name='tarif_penunjang' value={tarifs.penunjang} /></td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>Radiologi <input type="text" className="m-2" name='tarif_radiologi' value={tarifs.radiologi} /></td>
                                        <td width={"35%"}>Laboratorium <input type="text" className="m-2" name='tarif_laboratorium' value={tarifs.laboratorium} /></td>
                                        <td width={"30%"}>Pelayanan Darah	<input type="text" className="m-2" name='tarif_pelayanan_darah' value={tarifs.pelayanandarah} /></td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>Rehabilitasi <input type="text" className="m-2" name='tarif_rehabilitasi' value={tarifs.rehabilitasi} /></td>
                                        <td width={"35%"}> Kamar / Akomodasi
                                            <input type="text" className="m-2" name='tarif_akomodasi' value={tarifs.kamar_akomodasi} /></td>
                                        <td width={"30%"}>Rawat Intensif <input type="text" className="m-2" name='tarif_rawat_integerensif' value={tarifs.rawatintensif} /></td>
                                    </tr>

                                    <tr>
                                        <td width={"35%"}>Obat <input type="text" className="m-2" name='tarif_obat' value={obats.obat} /></td>
                                        <td width={"35%"}>Obat Kronis <input type="text" className="m-2" name='tarif_obat_kronis' value={obats.obatkronis} /></td>
                                        <td width={"30%"}>Obat Kemoterapi <input type="text" className="m-2" name='tarif_obat_kemoterapi' value={obats.obatkemoterapi} /></td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>Alkes <input type="text" className="m-2" name='tarif_alkes' value={obats.alkes} /></td>
                                        <td width={"35%"}>BMHP <input type="text" className="m-2" name='tarif_bhp' value={obats.bmhp} /></td>
                                        <td width={"30%"}>Sewa Alat <input type="text" className="m-2" name='tarif_sewa_alat' value={obats.sewaalat} /></td>
                                    </tr>
                                </table>
                                <div className='text-center'><Checkbox></Checkbox> Menyatakan benar bahwa data tarif yang tersebut di atas adalah benar sesuai dengan kondisi yang sesungguhnya.</div>
                                <TabView>
                                    <TabPanel header="Coding UNU Grouper">
                                        <p className="m-0">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </p>
                                    </TabPanel>
                                    <TabPanel header="Coding INA Grouper">
                                        <p className="m-0">
                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                                            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
                                            ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                                        </p>
                                    </TabPanel>

                                </TabView>
                                <div className="col-md-6 d-flex mb-3">
                                    <button className="btn btn-primary" style={{float:'right'}} onClick={handleSimpanKlaim}>Simpan</button>
                                    <button className="btn btn-secondary ml-2" style={{float:'right'}} >Groupper</button>

                                    <button className="btn btn-secondary ml-2" style={{float:'right'}} >Hapus Klaim</button>
                                </div>

                                {/*  Hasil Grouping */}
                                <table className='table table-bordered' style={{ border: ' 1px solid black', width: '100%' }}>
                                    <tr>
                                        <td colSpan={4}><p className='text-center'>Hasil Grouper E-Klaim v5 </p></td>
                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Info</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }} >-</td>
                                        <td width={"30%"}></td>
                                        <td width={"30%"}></td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Jenis Rawat</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>Rawat Jalan Regular </td>
                                        <td width={"30%"}></td>
                                        <td width={"30%"}></td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Group</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>PENYAKIT KRONIS KECIL LAIN-LAIN</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>Q-5-44-0</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Sub Acute</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Chronic</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>
                                    <tr>
                                        <td width={"15%"}>Special Procedure</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>

                                    <tr>
                                        <td width={"15%"}>Special Prosthesis</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>


                                    <tr>
                                        <td width={"15%"}>Special Investigation</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>


                                    <tr>
                                        <td width={"15%"}>Special Drug</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>

                                    <tr>
                                        <td width={"15%"}>Status DC Kemkes</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>Klaim belum terkirim ke Pusat Data Kementerian Kesehatan</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}></td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>

                                    <tr>
                                        <td width={"15%"}>Status Klaim</td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}>-</td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}></td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>


                                    <tr>
                                        <td width={"15%"}></td>
                                        <td width={"35%"} style={{ textAlign: 'left' }}></td>
                                        <td width={"30%"} style={{ textAlign: 'center' }}>Total</td>
                                        <td width={"30%"} style={{ textAlign: 'right' }}>Rp 0 </td>

                                    </tr>


                                </table>
                            </div>
                        </div>
                    )
                )}
            </div>

        );
    };
    const handleSimpanKlaim = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        axios.post(route('newClaim'), datas)
            .then((response) => {
                console.log('Response:', response.data);
                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
