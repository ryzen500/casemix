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
import { FormatRupiah } from '@arismun/format-rupiah';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

export default function Dashboard({ auth, model, pasien, caraMasuk }) {
    const [datas, setDatas] = useState([]);
    const [pendaftarans, setPendaftarans] = useState([]);
    const [dataDiagnosa, setDiagnosa] = useState([]);
    const [dataGrouper, setDataGrouper] = useState([]);

    const [dataFinalisasi, setDataFinalisasi] = useState([]);

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
    const onRowEditComplete = (e) => {
        console.log(e);
        // let _products = [...products];
        // let { newData, index } = e;

        // _products[index] = newData;

        // setProducts(_products);
    };
    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

 
const format_rupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Diagnosa (ICD X)</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" placeholder="Search..." />
            </IconField>
        </div>
    );
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
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
                    diagnosa: expandedProduct.diagnosa
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
                    setDiagnosa(response.data.dataDiagnosa);
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
                                        <input type="text" className="form-control" name='nomor_kartu' value={datas.peserta.noKartu} />
                                        <input type="hidden" className="form-control" name='nomer_rekam_medik' value={datas.peserta.noMr} />
                                        <input type="hidden" className="form-control" name='gender' value={datas.peserta.kelamin} />
                                        <input type="hidden" className="form-control" name='nama_pasien' value={datas.peserta.nama} />
                                        <input type="hidden" className="form-control" name='tgl_lahir' value={datas.peserta.tglLahir} />
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
                                                <input type="text" className="ml-2" name='total_tarif_rs' value={ format_rupiah(parseFloat(tarifs.total) + parseFloat(obats.total))} />

                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>
                                                        Prosedur Non Bedah
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <input type="text" className="m-2 form-control" name='tarif_prosedur_nonbedah' value={format_rupiah(tarifs.prosedurenonbedah)} />
                                                    </div>
                                                </div>
                                            </div>

                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>
                                                        Prosedur Bedah
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <input type="text" className="m-2 form-control" name='tarif_prosedur_bedah' value={format_rupiah(tarifs.prosedurebedah)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>
                                                        Konsultasi
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <input type="text" className="m-2 form-control" name='tarif_konsultasi' value={format_rupiah(tarifs.konsultasi)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Tenaga Ahli</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_tenaga_ahli' value={format_rupiah(tarifs.tenagaahli)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Keperawatan</div>
                                                    <div className="col-sm-7"> <input type="text" className="m-2 form-control" name='tarif_keperawatan' value={format_rupiah(tarifs.keperawatan)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Penunjang</div>
                                                    <div className="col-sm-7">  <input type="text" className="m-2 form-control" name='tarif_penunjang' value={format_rupiah(tarifs.penunjang)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Radiologi</div>
                                                    <div className="col-sm-7"> <input type="text" className="m-2 form-control" name='tarif_radiologi' value={ format_rupiah(tarifs.radiologi)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Laboratorium</div>
                                                    <div className="col-sm-7"> <input type="text" className="m-2 form-control" name='tarif_laboratorium' value={format_rupiah(tarifs.laboratorium)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Pelayanan Darah</div>
                                                    <div className="col-sm-7"> <input type="text" className="m-2 form-control" name='tarif_pelayanan_darah' value={ format_rupiah(tarifs.pelayanandarah)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Rehabilitasi</div>
                                                    <div className="col-sm-7"> <input type="text" className="m-2 form-control" name='tarif_rehabilitasi' value={format_rupiah(tarifs.rehabilitasi)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Kamar / Akomodasi</div>
                                                    <div className="col-sm-7"> <input type="text" className="m-2 form-control" name='tarif_akomodasi' value={format_rupiah(tarifs.kamar_akomodasi)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Rawat Intensif</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_rawat_integerensif' value={format_rupiah(tarifs.rawatintensif)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Obat</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_obat' value={format_rupiah(obats.obat)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Obat Kronis</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_obat_kronis' value={ format_rupiah(obats.obatkronis)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Obat Kemoterapi</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_obat_kemoterapi' value={format_rupiah(obats.obatkemoterapi)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Alkes</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_alkes' value={ format_rupiah(obats.alkes)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>BMHP</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_bhp' value={ format_rupiah(obats.bmhp)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Sewa Alat</div>
                                                    <div className="col-sm-7"><input type="text" className="m-2 form-control" name='tarif_sewa_alat' value={ format_rupiah(obats.sewaalat || 0)} /></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <div className='text-center'><Checkbox></Checkbox> Menyatakan benar bahwa data tarif yang tersebut di atas adalah benar sesuai dengan kondisi yang sesungguhnya.</div>
                                <TabView>
                                    <TabPanel header="Coding UNU Grouper">
                                        <DataTable value={dataDiagnosa}
                                            dataKey="diagnosa_kode" header={header}>
                                            <Column field="diagnosa_kode" header="Kode Diagnosa" style={{ minWidth: '12rem' }}></Column>
                                            <Column field="diagnosa_nama" header="Nama Diagnosa" style={{ minWidth: '16rem' }}></Column>
                                            <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>

                                        </DataTable>
                                        <DataTable value={dataDiagnosa} rowGroupMode="subheader" groupRowsBy="jenis_diagnosa" sortMode="single" sortField="jenis_diagnosa"
                                            sortOrder={1} scrollable scrollHeight="400px" rowGroupHeaderTemplate={headerTemplate} tableStyle={{ minWidth: '50rem' }}
                                            editMode="row" dataKey="diagnosa_id" onRowEditComplete={onRowEditComplete}
                                        >
                                            <Column field="diagnosa_kode" header="Kode Diagnosa" style={{ minWidth: '200px' }} editor={(options) => textEditor(options)} ></Column>
                                            <Column field="diagnosa_nama" header="Nama Diagnosa" style={{ minWidth: '200px' }} editor={(options) => textEditor(options)}></Column>
                                            <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                                        </DataTable>
                                    </TabPanel>
                                    <TabPanel header="Coding INA Grouper">
                                        <DataTable value={dataDiagnosa} rowGroupMode="subheader" groupRowsBy="jenis_diagnosa" sortMode="single" sortField="jenis_diagnosa"
                                            sortOrder={1} scrollable scrollHeight="400px" rowGroupHeaderTemplate={headerTemplate} tableStyle={{ minWidth: '50rem' }}
                                            editMode="row" dataKey="diagnosa_id" onRowEditComplete={onRowEditComplete}
                                        >
                                            <Column field="diagnosa_kode" header="Kode Diagnosa" style={{ minWidth: '200px' }} editor={(options) => textEditor(options)} ></Column>
                                            <Column field="diagnosa_nama" header="Nama Diagnosa" style={{ minWidth: '200px' }} editor={(options) => textEditor(options)}></Column>
                                            <Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                                        </DataTable>
                                    </TabPanel>

                                </TabView>
                                <div className="col-md-6 d-flex mb-3">
                                    <button className="btn btn-primary" style={{ float: 'right' }} onClick={handleSimpanKlaim}>Simpan</button>
                                    <button className="btn btn-secondary ml-2" style={{ float: 'right' }} onClick={handleSimpanGroupingStage1}>Groupper</button>

                                    <button className="btn btn-secondary ml-2" style={{ float: 'right' }} >Hapus Klaim</button>
                                </div>

                                {/*  Hasil Grouping */}

                                <div>
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
                                            <td width="35%" style={{ textAlign: 'left' }}>
                                                {dataGrouper.cbg?.description || '-'}
                                            </td>
                                            <td width="30%" style={{ textAlign: 'center' }}>
                                                {dataGrouper.cbg?.code || '-'}
                                            </td>
                                            <td width="30%" style={{ textAlign: 'right' }}>
                                                <FormatRupiah value={dataGrouper.cbg?.base_tariff || 0} />
                                            </td>
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

                                    {/* Button Finalisasi */}
                                    <div className="col-md-6 d-flex mb-3">
                                        <button className="btn btn-primary" style={{ float: 'right' }} onClick={handleSimpanFinalisasi}>Finalisasi</button>
                                    </div>


                                </div>

                            </div>
                        </div>
                    )
                )}
            </div>

        );
    };
    const headerTemplate = (data) => {
        return (
            <div className="flex align-items-center gap-2">
                <span className="font-bold">{data.jenis_diagnosa} </span>
            </div>
        );
    };

    /**Simpan Klaim */
    const handleSimpanKlaim = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        const payload = {

            no_rekam_medik: datas.peserta.noMr,
            nama_pasien: datas.peserta.nama,
            nomor_kartu: datas.peserta.noKartu,
            noSep: datas.noSep,
            tgl_lahir: datas.peserta.tglLahir,
            gender: datas.peserta.tglLahir
        };
        axios.post(route('newClaim'), payload)
            .then((response) => {
                console.log('Response:', response.data);
                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    /**Simpan Grouping */
    const handleSimpanGroupingStage1 = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        const payload = {
            nomor_sep: datas.noSep
        };
        axios.post(route('groupingStageSatu'), payload)
            .then((response) => {
                console.log('Response:', response.data);
                setDataGrouper(response.data.data);
                toast.current.show({ severity: 'success', summary: `Data  Berhasil Di Grouping`, detail: datas.noSep, life: 3000 });

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    /**Simpan Grouping */
    const handleSimpanFinalisasi = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log("Auth", auth);
        console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        const payload = {
            nomor_sep: datas.noSep,
            coder_nik:auth.user.coder_nik
        };
        axios.post(route('Finalisasi'), payload)
            .then((response) => {
                console.log('Response:', response.data);
                setDataFinalisasi(response.data.data);
                toast.current.show({ severity: 'success', summary: `Data  Berhasil Di Grouping`, detail: datas.noSep, life: 3000 });

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const items = [
        { label: pasien ? pasien['no_rekam_medik'] : null },
        { label: pasien ? pasien['nama_pasien'] : null },
        { label: pasien ? pasien['jeniskelamin'] : null },
        { label: pasien ? pasien['tanggal_lahir'] : null },

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
