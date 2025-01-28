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
import { AutoComplete } from 'primereact/autocomplete';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
export default function Dashboard({ auth, model, pasien, caraMasuk, DPJP, jenisKasus, pegawai, kelompokDiagnosa, COB }) {
    const [datas, setDatas] = useState([]);
    const [pendaftarans, setPendaftarans] = useState([]);
    const [dataDiagnosa, setDiagnosa] = useState([]);
    const [dataIcd9cm, setDataIcd9cm] = useState([]);
    const [dataDiagnosaINA, setDiagnosaINA] = useState([]);

    let emptyDiagnosa = {
        diagnosa_id: null,
        diagnosa_kode: null,
        diagnosa_nama: null,
        kelompokdiagnosa_nama: null,
        kelompokdiagnosa_id: null
    };
    const [diagnosaTemp, setDiagnosaTemp] = useState(emptyDiagnosa);
    const [dataGrouper, setDataGrouper] = useState([]);

    const [dataFinalisasi, setDataFinalisasi] = useState([]);

    // const [tarifs, setTarifs] = useState([]);
    // const [obats, setObats] = useState([]);

    const [tarifs, setTarifs] = useState({
        total: 0,
        prosedurenonbedah: '',
        prosedurebedah: 0,
        konsultasi: 0,
        tenagaahli: 0,
        keperawatan: 0,
        penunjang: 0,
        radiologi: 0,
        laboratorium: 0,
        pelayanandarah: 0,
        rehabilitasi: 0,
        kamar_akomodasi: 0,
        rawatintensif: 0,
    });

    const [obats, setObats] = useState({
        total: 0,
        obat: 0,
        obatkronis: 0,
        obatkemoterapi: 0,
        alkes: 0,
        bmhp: 0,
        sewaalat: 0,
    });
    const [total, setTotal]=useState(0);
    const [profils, setProfil] = useState([]);
    const [selectedCaraMasuk, setCaraMasuk] = useState(null);
    const [selectedCOB, setCOB] = useState(null);

    const [selectedDPJP, setDPJP] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state for expanded row
    const [hide, setHide] = useState(false); // Loading state for expanded row

    const toast = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchTextIX, setSearchTextIX] = useState('');


    useEffect(() => {
        calculate_total();
      }, [tarifs, obats]);

    // Function to fetch data from API
    const fetchSuggestions = async (query) => {
        try {
            // Replace with your API 
            const response = await axios.post('/searchDiagnosa', {
                keyword: query, // Send the expandedProduct.noSep data
            });
            const res = response.data;
            // let query = event.query;
            let _filteredItems = [];

            for (let i = 0; i < res.length; i++) {

                _filteredItems.push({ 'label': res[i].diagnosa_nama, 'value': res[i].diagnosa_kode, 'id': res[i].diagnosa_id })
            }

            // const data = await response.json();
            setSuggestions(_filteredItems);  // Set your data here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

        // Function to fetch data from API search diagnosa_kode
        const fetchSuggestionsIX = async (query) => {
            try {
            // Replace with your API 
            const response = await axios.post('/searchDiagnosaIX', {
                keyword: query, // Send the expandedProduct.noSep data
            });
            const res = response.data;
            // let query = event.query;
            let _filteredItems = [];
            for (let i = 0; i < res.length; i++) {
                _filteredItems.push({ 'label': res[i].diagnosaicdix_nama, 'value': res[i].diagnosaicdix_kode	, 'id': res[i].diagnosaicdix_id })
            }
            // const data = await response.json();
            setSuggestions(_filteredItems);  // Set your data here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
        // Function to fetch data from API search diagnosa_kode
    const fetchSuggestionsCode = async (query) => {
        try {
            // Replace with your API 
            const response = await axios.post('/searchDiagnosaCode', {
                keyword: query, // Send the expandedProduct.noSep data
            });
            const res = response.data;
            // let query = event.query;
            let _filteredItems = [];
            for (let i = 0; i < res.length; i++) {
                _filteredItems.push({ 'label': res[i].diagnosa_nama, 'value': res[i].diagnosa_kode, 'id': res[i].diagnosa_id })
            }
            // const data = await response.json();
            setSuggestions(_filteredItems);  // Set your data here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
        // Function to fetch data from API search diagnosa_kode
        const fetchSuggestionsCodeIX = async (query) => {
            try {
                // Replace with your API 
                const response = await axios.post('/searchDiagnosaCodeIX', {
                    keyword: query, // Send the expandedProduct.noSep data
                });
                const res = response.data;
                // let query = event.query;
                let _filteredItems = [];
                for (let i = 0; i < res.length; i++) {
                    _filteredItems.push({ 'label': res[i].diagnosaicdix_nama, 'value': res[i].diagnosaicdix_kode	, 'id': res[i].diagnosaicdix_id })
                }
                // const data = await response.json();
                setSuggestions(_filteredItems);  // Set your data here
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
          // Handle input changes
        const handleInputChangeAutocompleteRow = (index, field, value) => {
            const updatedRows = [...dataDiagnosa];
            updatedRows[index][field] = value;
            setDiagnosa(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }
        };
        // Handle input changes
        const handleInputChangeAutocompleteIXRow = (index, field, value) => {
            const updatedRows = [...dataIcd9cm];
            updatedRows[index][field] = value;
            setDataIcd9cm(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCodeIX(value);  // Fetch suggestions based on the input
            }
        };
        const handleInputChangeRow = (index, field, value) => {
            const updatedRows = [...dataDiagnosa];
            updatedRows[index][field] = value;
            if (field == 'kelompokdiagnosa_id' && value == 2) {
                dataDiagnosa.some((row, i) => {
                    if(i !== index && row.kelompokdiagnosa_id === 2){
                        console.log(row)
                        const updatedRowstemp = [...dataDiagnosa];

                        updatedRowstemp[i][field] = 3;
                        setDiagnosa(updatedRowstemp);

                        return i !== index && row.kelompokdiagnosa_id === 2;
                    }
                });
            }
            updatedRows.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);
            setDiagnosa(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }
        };
        const updateRow = (index, value) => {
            const updatedRows = [...dataDiagnosa];
            updatedRows[index]['diagnosa_id'] = value.id;
            updatedRows[index]['diagnosa_kode'] = value.value;
            updatedRows[index]['diagnosa_nama'] = value.label;
            setDiagnosa(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }
        };
        const updateIXRow = (index, value) => {
            const updatedRows = [...dataIcd9cm];
            updatedRows[index]['pasienicd9cm_id'] = value.id;
            updatedRows[index]['diagnosaicdix_kode'] = value.value;
            updatedRows[index]['diagnosaicdix_nama'] = value.label;
            setDataIcd9cm(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }
        }; 
    // Handle change in input field
    const onSearchChange = (e) => {
        let length = e.query.length;
        // setSearchText(null);
        setSearchText(e.query);

        if (length > 2) {
            fetchSuggestions(e.query);  // Fetch suggestions based on the input
        }
    }


    const onSearchChangeIX = (e) => {
        let length = e.query.length;
        // setSearchText(null);
        setSearchTextIX(e.query);

        if (length > 2) {
            fetchSuggestionsIX(e.query);  // Fetch suggestions based on the input
        }
    }

    const formatDateTime = (dateString) => {
        // Convert the date string to a Date object
        const formattedDate = new Date(dateString.replace(" ", "T"));
        return isNaN(formattedDate) ? null : formattedDate;
      };

    const addRowDiagnosaIX = (rowData) => {
        let _dataDiagnosa = [...dataIcd9cm];
        let _diagnosa = { ...diagnosaTemp };
        _diagnosa.pasienicd9cm_id = rowData.id;
        _diagnosa.diagnosaicdix_nama = rowData.label;
        _diagnosa.diagnosaicdix_kode = rowData.value;
        _dataDiagnosa.push(_diagnosa);
        setDataIcd9cm(_dataDiagnosa);
        setDiagnosaTemp(emptyDiagnosa);
        setSearchTextIX(null);
        // setDiagnosa(response.data.dataDiagnosa);
    }
    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };
    const addRowDiagnosaX = (rowData) => {
        let _dataDiagnosa = [...dataDiagnosa];
        let _diagnosa = { ...diagnosaTemp };
        _diagnosa.diagnosa_id = rowData.id;
        _diagnosa.tgl_pendaftaran = pendaftarans.tgl_pendaftaran;
        _diagnosa.pegawai_id = pendaftarans.pegawai_id;
        _diagnosa.diagnosa_nama = rowData.label;
        _diagnosa.diagnosa_kode = rowData.value;
        const hasKelompokDiagnosaId2 = dataDiagnosa.some((row) => row.kelompokdiagnosa_id === 2);
        if (hasKelompokDiagnosaId2) {
            _diagnosa.kelompokdiagnosa_id = 3;
        } else {
            // If no row has kelompokdiagnosa_id === 2, set it to 2
            _diagnosa.kelompokdiagnosa_id = 2;
        }
        _dataDiagnosa.push(_diagnosa);
        _dataDiagnosa.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);
        setDiagnosa(_dataDiagnosa);
        setDiagnosaTemp(emptyDiagnosa);
        setSearchText(null);
        // setDiagnosa(response.data.dataDiagnosa);

    }
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Diagnosa (ICD X)</h4>
            <IconField iconPosition="left">

                <AutoComplete
                    value={searchText}
                    suggestions={suggestions}
                    completeMethod={onSearchChange}  // Trigger search on typing
                    field="search-icdx"  // Field to display in the suggestion (adjust based on your API response)
                    onSelect={(e) => addRowDiagnosaX(e.value)}  // Update input field
                    itemTemplate={(item) => (
                        <div>
                            <span>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                        </div>
                    )}
                />
            </IconField>
        </div>
    );
    const headerUnuICDIX = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Diagnosa (ICD IX)</h4>
            <IconField iconPosition="left">

                <AutoComplete
                    value={searchTextIX}
                    suggestions={suggestions}
                    completeMethod={onSearchChangeIX}  // Trigger search on typing
                    field="search-icdix"  // Field to display in the suggestion (adjust based on your API response)
                    onSelect={(e) => addRowDiagnosaIX(e.value)}  // Update input field
                    itemTemplate={(item) => (
                        <div>
                            <span>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                        </div>
                    )}
                />
            </IconField>
        </div>
    );

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };


    const formatDate = (dateString) => {
        // Check if dateString exists and is valid
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) return ''; // Handle invalid date
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
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
                const response = await axios.post(route('getGroupperPasien'), {
                    noSep: expandedProduct.noSep, // Send the expandedProduct.noSep data
                    pendaftaran_id: expandedProduct.pendaftaran_id, // Example of additional data
                    diagnosa: expandedProduct.diagnosa
                });
                // const response = await axios.get(`/getGroupperPasien/${expandedProduct.noSep}`);
                // setExpandedRowData(response.data); // Store the data

                if (response.data.model.metaData.code == 200) {
                    toast.current.show({ severity: 'info', summary: event.data.noSep, detail: event.data.noSep, life: 3000 });
                    setDatas(response.data.model.response);

                    // console.log("Responsess ", response.data.getGrouping.data.data.grouper.response);
                    if (response.data.getGrouping.data.data.grouper.response === null) {
                        setHide(true);
                        
                    }else{
                        setHide(false);

                    }
                    const defaultCaraMasuk = caraMasuk.find(
                        (caramasuk) => caramasuk.code === "gp"
                    );

                    setCaraMasuk(defaultCaraMasuk || null);



                    const defaultDPJP = DPJP.find(
                        (dpjp) => dpjp.kdDPJP === response.data.model.response.dpjp.kdDPJP
                    );

                    setDPJP(defaultDPJP || null);

                    setPendaftarans(response.data.pendaftaran);
                    setTarifs(response.data.tarif);
                    setObats(response.data.obat);
                    setProfil(response.data.profil);
                    setDiagnosa(response.data.dataDiagnosa);
                    setDataIcd9cm(response.data.dataIcd9cm);
                    setDiagnosaINA(response.data.dataDiagnosa);
                    calculate_total();
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
    const calculate_total=()=>{
        const total_all= (
            parseFloat(tarifs.prosedurenonbedah || 0)+parseFloat(tarifs.prosedurebedah || 0)+parseFloat(tarifs.konsultasi || 0)+
            parseFloat(tarifs.tenagaahli || 0)+parseFloat(tarifs.keperawatan || 0)+parseFloat(tarifs.penunjang || 0)+
            parseFloat(tarifs.radiologi || 0)+parseFloat(tarifs.laboratorium || 0)+parseFloat(tarifs.pelayanandarah || 0)+
            parseFloat(tarifs.rehabilitasi || 0)+parseFloat(tarifs.kamar_akomodasi || 0)+parseFloat(tarifs.rawatintensif || 0)+
            parseFloat(obats.obat || 0)+parseFloat(obats.obatkronis || 0)+parseFloat(obats.obatkemoterapi || 0)+
            parseFloat(obats.alkes || 0)+parseFloat(obats.bmhp ||0)+parseFloat(obats.sewaalat || 0));
        const name = 'total'; // Get name and value from the event
        // return total_all;
        setTotal((prevTotal) => ({
            ...prevTotal,
            [name]: (total_all), // Update the specific field dynamically
        }));
    }
    // Custom input renderer for hidden input
    const unuICDX = (rowData) => {
        return (
            <>
                <input type="hidden" value={rowData.pasienmorbiditas_id} />
                <input type="hidden" value={rowData.diagnosa_id} />
                {/* <input readOnly value={rowData.kelompokdiagnosa_nama} /> */}
                {rowData.kelompokdiagnosa_nama}

            </>
        );
    };
    // Custom input renderer for hidden input
    const unuICDIX = (rowData) => {
        return (
            <>
                <input type="hidden" value={rowData.pasienicd9cm_id} />
                <input type="hidden" value={rowData.diagnosaicdix_id} />
                {/* <input readOnly value={rowData.kelompokdiagnosa_nama} /> */}
                {rowData.kelompokdiagnosa_nama}

            </>
        );
    };
    // Custom input renderer for hidden input
    const inaICDX = (rowData) => {
        return (
            <>
                <input type="hidden" value={rowData.pasienmorbiditas_id} />
                <input type="hidden" value={rowData.diagnosa_id} />
                {/* <input readOnly value={rowData.kelompokdiagnosa_nama} /> */}
                {rowData.kelompokdiagnosa_nama}

            </>
        );
    };
    const onRowCollapse = (event) => {
        // toast.current.show({ severity: 'success', summary: event.data.name, detail: event.data.name, life: 3000 });
    };
    // onchange tarif
    const [value, setValue] = useState(null);

    const handleValueChange = (e) => {

        const { value, name } = e.target; // Get name and value from the event
        setTarifs((prevTarifs) => ({
            ...prevTarifs,
            [name]: (value), // Update the specific field dynamically
        }));

        setObats((prevObats) => ({
            ...prevObats,
            [name]: (value), // Update the specific field dynamically
        }));
        calculate_total();
    };

    const removeRow = (index) => {
        const updatedRows = dataDiagnosa.filter((_, i) => i !== index);
        setDiagnosa(updatedRows); // Remove row and update state
    };
    const removeRowIX = (index) => {
        const updatedRows = dataIcd9cm.filter((_, i) => i !== index);
        setDataIcd9cm(updatedRows); // Remove row and update state
    };
    // end onchange tarif
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
                                            <input type="hidden" className="form-control" name='carabayar_id' value={pendaftarans.carabayar_id} />
                                            <input type="hidden" className="form-control" name='carabayar_nama' value={pendaftarans.carabayar_nama} />

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
                                            {datas.jnsPelayanan}
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
                                                        <input type="date" name="tanggal_masuk" class="form-control" value={formatDate(pendaftarans.tglsep)} />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        Pulang :
                                                        <input type="date" name="tanggal_pulang" class="form-control" value={formatDate(pendaftarans.tglpulang)} />

                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"10%"}>Umur</td>
                                        <td width={"15%"}>{pendaftarans.umur}</td>
                                    </tr>
                                    <tr>
                                        <td>Cara Masuk</td>
                                        <td >
                                            <Dropdown value={selectedCaraMasuk} onChange={(e) => setCaraMasuk(e.value)} options={caraMasuk} optionLabel="name"
                                                placeholder="Pilih Cara Masuk" className="w-full md:w-14rem" />
                                        </td>
                                    </tr>

                                    <tr>
                                        {console.log("COB",selectedCOB)}
                                        <td>COB</td>
                                        <td >

                                            <Dropdown value={selectedCOB} onChange={(e) => setCOB(e.value)} options={COB} optionLabel="name"
                                                placeholder="Pilih COB" className="w-full md:w-14rem" />
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
                                        <td >
                                            <Dropdown value={selectedDPJP} onChange={(e) => setDPJP(e.value)} options={DPJP} optionLabel="nmdpjp"
                                                placeholder="Pilih DPJP" className="w-full md:w-14rem" />
                                        </td>
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
                                {/* Tarif Rumah Sakit */}
                                <table className='table table-bordered' style={{ border: ' 1px solid black', width: '100%' }}>
                                    <tr>
                                        <td colSpan={3}>
                                            <div className="col-sm-12 text-center">
                                                Tarif Rumah Sakit :
                                                
                                                <InputNumber
                                                    value={parseFloat(total.total)}
                                                    onValueChange={handleValueChange}
                                                    mode="currency"
                                                    currency="IDR"
                                                    locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                    showSymbol
                                                    prefix="" // Adds the Rp prefix to the input value
                                                    min={0} // Optional: Set a minimum value
                                                    max={100000000} // Optional: Set a maximum value
                                                    name='total_tarif_rs'
                                                    inputClassName='ml-2 form-control'
                                                    readOnly
                                                />

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
                                                        <InputNumber
                                                            value={parseFloat(tarifs.prosedurenonbedah)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='prosedurenonbedah'
                                                            inputClassName='ml-2 form-control'
                                                        />
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
                                                        <InputNumber
                                                            value={parseFloat(tarifs.prosedurebedah)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='prosedurebedah'
                                                            inputClassName='ml-2 form-control'
                                                        />
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
                                                        <InputNumber
                                                            value={parseFloat(tarifs.konsultasi)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='konsultasi'
                                                            inputClassName='ml-2 form-control'
                                                        />
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
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.tenagaahli)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='tenagaahli'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Keperawatan</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.keperawatan)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='keperawatan'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Penunjang</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.penunjang)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='penunjang'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Radiologi</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.radiologi)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='radiologi'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Laboratorium</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.laboratorium)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='laboratorium'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Pelayanan Darah</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.pelayanandarah)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='pelayanandarah'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Rehabilitasi</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.rehabilitasi)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='rehabilitasi'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Kamar / Akomodasi</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.kamar_akomodasi)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='kamar_akomodasi'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Rawat Intensif</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(tarifs.rawatintensif)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='rawatintensif'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Obat</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.obat)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='obat'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Obat Kronis</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.obatkronis)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='obatkronis'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Obat Kemoterapi</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.obatkemoterapi)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='obatkemoterapi'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Alkes</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.alkes)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='alkes'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>BMHP</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.bmhp)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='bmhp'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5" style={{ alignContent: 'center' }}>Sewa Alat</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.sewaalat | 0)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            prefix="" // Adds the Rp prefix to the input value
                                                            min={0} // Optional: Set a minimum value
                                                            max={100000000} // Optional: Set a maximum value
                                                            name='sewaalat'
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                {/* Checkbox Tarif */}
                                <div className='text-center'><Checkbox></Checkbox> Menyatakan benar bahwa data tarif yang tersebut di atas adalah benar sesuai dengan kondisi yang sesungguhnya.</div>
                                <TabView>
                                    <TabPanel header="Coding UNU Grouper">
                                        <div className="p-datatable-header">
                                            {
                                                header
                                            }
                                        </div>
                                        <table className="p-datatable-table">
                                            <thead className='p-datatable-thead'>
                                                <tr>
                                                <th>No</th>
                                                <th>Tgl. Diagnosa</th>
                                                <th>Dokter</th>
                                                <th>Jenis Kasus</th>
                                                <th>Diagnosa Kode</th>
                                                <th>Diagnosa Nama</th>
                                                <th>Kelompok Diagnosa</th>
                                                <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataDiagnosa.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        {console.log(row.tgl_pendaftaran)}
                                                        <Calendar 
                                                        value={formatDateTime(row.tgl_pendaftaran)} // Pass a valid Date object
                                                        //  value={row.tgl_pendaftaran} 
                                                        onChange={(e) =>  handleInputChangeRow(index, 'tgl_pendaftaran', e.target.value)} 
                                                        showTime 
                                                        name={`[PasienmorbiditasT][${index}][tglmorbiditas]`}
                                                        id={`tglmorbiditas_${index}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Dropdown 
                                                            value={row.pegawai_id} onChange={(e) =>  handleInputChangeRow(index, 'pegawai_id', e.target.value)} 
                                                            options={pegawai} optionLabel="nmdpjp"
                                                            optionValue = "pegawai_id"
                                                         placeholder="Pilih DPJP"  
                                                         filter={true} // Enables the search filter
                                                            filterBy="nmdpjp"
                                                         name={`[PasienmorbiditasT][${index}][pegawai_id]`}
                                                            id={`pegawai_id_${index}`}
                                                            style={{ width: '250px' }}
                                                         />
                                                    </td>
                                                    <td>
                                                        <Dropdown 
                                                            value={row.kasusdiagnosa} onChange={(e) =>  handleInputChangeRow(index, 'kasusdiagnosa', e.target.value)} 
                                                            options={jenisKasus} optionLabel="name" 
                                                         placeholder="Pilih Jenis Kasus Penyakit"  
                                                         filter={true} // Enables the search filter
                                                            filterBy="name"
                                                         name={`[PasienmorbiditasT][${index}][kasusdiagnosa]`}
                                                            id={`kasusdiagnosa_${index}`}
                                                         />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="hidden"
                                                            value={row.diagnosa_id}
                                                            onChange={(e) => handleInputChange(index, 'diagnosa_id', e.target.value)}
                                                            name={`[PasienmorbiditasT][${index}][diagnosa_id]`}
                                                            id={`diagnosa_id_${index}`}
                                                        />
                                                        <AutoComplete
                                                            value={row.diagnosa_kode}
                                                            suggestions={suggestions}
                                                            completeMethod={fetchSuggestionsCode}
                                                            field="name"
                                                            onChange={(e) => handleInputChangeAutocompleteRow(index, 'diagnosa_kode', e.value)}
                                                            name={`[PasienmorbiditasT][${index}][diagnosa_kode]`}
                                                            id={`diagnosa_kode_${index}`}
                                                            onSelect={(e) => updateRow(index,e.value)}  // Update input field
                                                            // loading={loading}
                                                            minLength={3}
                                                            placeholder="Enter Diagnosa Kode"
                                                            itemTemplate={(item) => (
                                                                <div>
                                                                    <span>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                </div>
                                                            )}
                                                        />
        
                                                    </td>
                                                    <td>
                                                    <input
                                                        type="text"
                                                        value={row.diagnosa_nama}
                                                        onChange={(e) => handleInputChangeRow(index, 'diagnosa_nama', e.target.value)}
                                                        name={`[PasienmorbiditasT][${index}][diagnosa_nama]`}
                                                        id={`diagnosa_nama_${index}`}
                                                    />
                                                    </td>
                                                    <td>
                                                        <Dropdown 
                                                                value={row.kelompokdiagnosa_id} 
                                                                onChange={(e) =>  handleInputChangeRow(index, 'kelompokdiagnosa_id', e.target.value)} 
                                                                options={kelompokDiagnosa} optionLabel="name" 
                                                                optionValue = "value"
                                                                placeholder="Pilih Kelompok Diagnosa"  
                                                                name={`[PasienmorbiditasT][${index}][kelompokdiagnosa_id]`}
                                                                id={`kelompokdiagnosa_id_${index}`}
                                                        />
                                                    </td>
                                                    <td style={{textAlign:'center'}}>
                                                    <button type="button" onClick={() => removeRow(index)} >
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        <div className="p-datatable-header mt-5">
                                            {
                                                headerUnuICDIX
                                            }
                                        </div>
                                        <table className="p-datatable-table ">
                                            <thead className='p-datatable-thead'>
                                                <tr>
                                                <th>No</th>
                                                <th>Diagnosa Kode</th>
                                                <th>Diagnosa Nama</th>
                                                <th>Kelompok Diagnosa</th>
                                                <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataIcd9cm.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="hidden"
                                                            value={row.diagnosaicdix_id}
                                                            onChange={(e) => handleInputChange(index, 'diagnosaicdix_id', e.target.value)}
                                                            name={`[Pasienicd9cmT][${index}][diagnosaicdix_id]`}
                                                            id={`diagnosaicdix_id_${index}`}
                                                        />
                                                        <AutoComplete
                                                            value={row.diagnosaicdix_kode}
                                                            suggestions={suggestions}
                                                            completeMethod={fetchSuggestionsCodeIX}
                                                            field="name"
                                                            onChange={(e) => handleInputChangeAutocompleteIXRow(index, 'diagnosaicdix_kode', e.value)}
                                                            name={`[Pasienicd9cmT][${index}][diagnosaicdix_kode]`}
                                                            id={`diagnosaicdix_kode_${index}`}
                                                            onSelect={(e) => updateIXRow(index,e.value)}  // Update input field
                                                            // loading={loading}
                                                            minLength={3}
                                                            placeholder="Enter Diagnosa Kode"
                                                            itemTemplate={(item) => (
                                                                <div>
                                                                    <span>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                </div>
                                                            )}
                                                        />
        
                                                    </td>
                                                    <td>
                                                    <input
                                                        type="text"
                                                        value={row.diagnosaicdix_nama}
                                                        onChange={(e) => handleInputChangeRow(index, 'diagnosaicdix_nama', e.target.value)}
                                                        name={`[Pasienicd9cmT][${index}][diagnosaicdix_nama]`}
                                                        id={`diagnosaicdix_nama_${index}`}
                                                    />
                                                    </td>
                                                    <td>
                                                    <input
                                                        type="text"
                                                        value={row.kelompokdiagnosa_nama}
                                                        onChange={(e) => handleInputChangeRow(index, 'kelompokdiagnosa_nama', e.target.value)}
                                                        name={`[Pasienicd9cmT][${index}][kelompokdiagnosa_nama]`}
                                                        id={`kelompokdiagnosa_nama_${index}`}
                                                    />
                                                    </td>
                                                    <td style={{textAlign:'center'}}>
                                                    <button type="button" onClick={() => removeRowIX(index)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </TabPanel>
                                    <TabPanel header="Coding INA Grouper">
                                        <div className="p-datatable-header">
                                            {
                                                header
                                            }
                                        </div>
                                        <table className="p-datatable-table">
                                            <thead className='p-datatable-thead'>
                                                <tr>
                                                <th>No</th>
                                                <th>Tgl. Diagnosa</th>
                                                <th>Dokter</th>
                                                <th>Jenis Kasus</th>
                                                <th>Diagnosa Kode</th>
                                                <th>Diagnosa Nama</th>
                                                <th>Kelompok Diagnosa</th>
                                                <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataDiagnosaINA.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <Calendar 
                                                        value={formatDateTime(row.tgl_pendaftaran)} // Pass a valid Date object
                                                        //  value={row.tgl_pendaftaran} 
                                                        onChange={(e) =>  handleInputChangeRow(index, 'tgl_pendaftaran', e.target.value)} 
                                                        showTime 
                                                        name={`[PasienmorbiditasTINA][${index}][tglmorbiditas]`}
                                                        id={`tglmorbiditas_${index}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Dropdown 
                                                            value={row.pegawai_id} onChange={(e) =>  handleInputChangeRow(index, 'pegawai_id', e.target.value)} 
                                                            options={pegawai} optionLabel="nmdpjp"
                                                            optionValue = "pegawai_id"
                                                         placeholder="Pilih DPJP"  
                                                         filter={true} // Enables the search filter
                                                            filterBy="nmdpjp"
                                                         name={`[PasienmorbiditasTINA][${index}][pegawai_id]`}
                                                            id={`pegawai_id_${index}`}
                                                            style={{ width: '250px' }}
                                                         />
                                                    </td>
                                                    <td>
                                                        <Dropdown 
                                                            value={row.kasusdiagnosa} onChange={(e) =>  handleInputChangeRow(index, 'kasusdiagnosa', e.target.value)} 
                                                            options={jenisKasus} optionLabel="name" 
                                                         placeholder="Pilih Jenis Kasus Penyakit"  
                                                         filter={true} // Enables the search filter
                                                            filterBy="name"
                                                         name={`[PasienmorbiditasTINA][${index}][kasusdiagnosa]`}
                                                            id={`kasusdiagnosa_${index}`}
                                                         />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="hidden"
                                                            value={row.diagnosa_id}
                                                            onChange={(e) => handleInputChange(index, 'diagnosa_id', e.target.value)}
                                                            name={`[PasienmorbiditasTINA][${index}][diagnosa_id]`}
                                                            id={`diagnosa_id_${index}`}
                                                        />
                                                        <AutoComplete
                                                            value={row.diagnosa_kode}
                                                            suggestions={suggestions}
                                                            completeMethod={fetchSuggestionsCode}
                                                            field="name"
                                                            onChange={(e) => handleInputChangeAutocompleteRow(index, 'diagnosa_kode', e.value)}
                                                            name={`[PasienmorbiditasTINA][${index}][diagnosa_kode]`}
                                                            id={`diagnosa_kode_${index}`}
                                                            onSelect={(e) => updateRow(index,e.value)}  // Update input field
                                                            // loading={loading}
                                                            minLength={3}
                                                            placeholder="Enter Diagnosa Kode"
                                                            itemTemplate={(item) => (
                                                                <div>
                                                                    <span>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                </div>
                                                            )}
                                                        />
        
                                                    </td>
                                                    <td>
                                                    <input
                                                        type="text"
                                                        value={row.diagnosa_nama}
                                                        onChange={(e) => handleInputChangeRow(index, 'diagnosa_nama', e.target.value)}
                                                        name={`[PasienmorbiditasTINA][${index}][diagnosa_nama]`}
                                                        id={`diagnosa_nama_${index}`}
                                                    />
                                                    </td>
                                                    <td>
                                                        <Dropdown 
                                                                value={row.kelompokdiagnosa_id} 
                                                                onChange={(e) =>  handleInputChangeRow(index, 'kelompokdiagnosa_id', e.target.value)} 
                                                                options={kelompokDiagnosa} optionLabel="name" 
                                                                optionValue = "value"
                                                                placeholder="Pilih Kelompok Diagnosa"  
                                                                name={`[PasienmorbiditasTINA][${index}][kelompokdiagnosa_id]`}
                                                                id={`kelompokdiagnosa_id_${index}`}
                                                        />
                                                    </td>
                                                    <td style={{textAlign:'center'}}>
                                                    <button type="button" onClick={() => removeRow(index)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="p-datatable-header mt-5">
                                            {
                                                headerUnuICDIX
                                            }
                                        </div>
                                        <table className="p-datatable-table ">
                                            <thead className='p-datatable-thead'>
                                                <tr>
                                                <th>No</th>
                                                <th>Diagnosa Kode</th>
                                                <th>Diagnosa Nama</th>
                                                <th>Kelompok Diagnosa</th>
                                                <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { dataIcd9cm.map((row, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="hidden"
                                                            value={row.diagnosaicdix_id}
                                                            onChange={(e) => handleInputChange(index, 'diagnosaicdix_id', e.target.value)}
                                                            name={`[Pasienicd9cmT][${index}][diagnosaicdix_id]`}
                                                            id={`diagnosaicdix_id_${index}`}
                                                        />
                                                        <AutoComplete
                                                            value={row.diagnosaicdix_kode}
                                                            suggestions={suggestions}
                                                            completeMethod={fetchSuggestionsCodeIX}
                                                            field="name"
                                                            onChange={(e) => handleInputChangeAutocompleteIXRow(index, 'diagnosaicdix_kode', e.value)}
                                                            name={`[Pasienicd9cmT][${index}][diagnosaicdix_kode]`}
                                                            id={`diagnosaicdix_kode_${index}`}
                                                            onSelect={(e) => updateIXRow(index,e.value)}  // Update input field
                                                            // loading={loading}
                                                            minLength={3}
                                                            placeholder="Enter Diagnosa Kode"
                                                            itemTemplate={(item) => (
                                                                <div>
                                                                    <span>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                </div>
                                                            )}
                                                        />
                                                    </td>
                                                    <td>
                                                    <input
                                                        type="text"
                                                        value={row.diagnosaicdix_nama}
                                                        onChange={(e) => handleInputChangeRow(index, 'diagnosaicdix_nama', e.target.value)}
                                                        name={`[Pasienicd9cmT][${index}][diagnosaicdix_nama]`}
                                                        id={`diagnosaicdix_nama_${index}`}
                                                    />
                                                    </td>
                                                    <td>
                                                    <input
                                                        type="text"
                                                        value={row.kelompokdiagnosa_nama}
                                                        onChange={(e) => handleInputChangeRow(index, 'kelompokdiagnosa_nama', e.target.value)}
                                                        name={`[Pasienicd9cmT][${index}][kelompokdiagnosa_nama]`}
                                                        id={`kelompokdiagnosa_nama_${index}`}
                                                    />
                                                    </td>
                                                    <td style={{textAlign:'center'}}>
                                                    <button type="button" onClick={() => removeRowIX(index)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </TabPanel>


                                </TabView>
                                <div className="col-md-6 d-flex mb-3">
                                    <button className="btn btn-primary" style={{ float: 'right' }} onClick={handleSimpanKlaim}>Simpan</button>
                                    <button className="btn btn-secondary ml-2" style={{ float: 'right' }} onClick={handleSimpanGroupingStage1}>Groupper</button>

                                    <button className="btn btn-secondary ml-2" style={{ float: 'right' }} onClick={handleHapusKlaim} >Hapus Klaim</button>
                                </div>

                                {/*  Hasil Grouping */}

                                {console.log("Display", hide)}
                                <div style={{ display: hide === true ? 'none' : 'block' }}>
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
                                        <button className="btn btn-primary ml-2" style={{ float: 'right' }} onClick={handleSimpanFinalisasi}>Finalisasi</button>
                                        <button className="btn btn-secondary ml-2" style={{ float: 'left' }} onClick={handleCetak}>Cetak Klaim</button>

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

        // console.log('Form Data Submitted:', dataDiagnosa);

        console.log('Total All', total.total);

        console.log('Data inA', dataIcd9cm);

        // Perform API request with axios
        const payload = {

            no_rekam_medik: datas.peserta.noMr,
            nama_pasien: datas.peserta.nama,
            nomor_kartu: datas.peserta.noKartu,
            noSep: datas.noSep,
            tgl_pulang: pendaftarans.tglpulang,
            tgl_masuk: pendaftarans.tglsep,
            jenis_rawat: pendaftarans.jnspelayanan,
            kelas_rawat: datas.klsRawat.klsRawatHak,
            gender: datas.peserta.tglLahir,
            coder_nik: auth.user.coder_nik,
            nama_dokter: datas.dpjp.nmDPJP,
            kode_tarif: profils.kode_tarifinacbgs_1,
            kamar: tarifs.kamar_akomodasi,
            tenaga_ahli: tarifs.tenagaahli,
            prosedur_non_bedah : tarifs.prosedurenonbedah,
            prosedur_bedah : tarifs.prosedurebedah,
            konsultasi : tarifs.konsultasi,
            keperawatan : tarifs.keperawatan,
            penunjang : tarifs.penunjang,
            radiologi : tarifs.radiologi,
            laboratorium: tarifs.laboratorium,
            pelayanan_darah: tarifs.pelayanandarah,
            rehabilitasi: tarifs.rehabilitasi,
            rawat_intensif : tarifs.rawatintensif,
            obat:obats.obat,
            obat_kronis:obats.obatkronis,
            obat_kemoterapi:obats.obatkemoterapi,
            alkes : obats.alkes,
            bmhp : obats.bmhp,
            sewa_alat:obats.sewaalat,
            payor_id: 3,
            diagnosa: `${dataDiagnosa.map(item => item.diagnosa_kode).join('#')}`,
            procedure: `${dataIcd9cm.map(item => item.diagnosa_kode).join('#')}`,
            procedure_ix : JSON.stringify(dataIcd9cm),

            diagnosa_array: JSON.stringify(dataDiagnosa),
            diagnosa_inagrouper: `${dataDiagnosaINA.map(item => item.diagnosa_kode).join('#')}`,
            diagnosaina_array: JSON.stringify(dataDiagnosaINA),
            carabayar_id: pendaftarans.carabayar_id,
            carabayar_nama: pendaftarans.carabayar_nama,
            pendaftaran_id: pendaftarans.pendaftaran_id,
            umur_pasien : pendaftarans.umur,
            cob_cd: selectedCOB.code,
            loginpemakai_id : auth.user.loginpemakai_id,
            total_tarif_rs : total.total
        };
        axios.post(route('updateNewKlaim'), payload)
            .then((response) => {
                // Handle the response from the backend
                toast.current.show({ severity: 'success', summary: `Data  Berhasil Di simpan`, detail: datas.noSep, life: 3000 });
                // {console.log("Display 2", hide)}

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
            nomor_sep: datas.noSep,
            loginpemakai_id : auth.user.loginpemakai_id,

        };
        axios.post(route('groupingStageSatu'), payload)
            .then((response) => {
                // console.log('Response:', response.data);
                setHide(false);
                setDataGrouper(response.data.data);
                toast.current.show({ severity: 'success', summary: `Data  Berhasil Di Grouping`, detail: datas.noSep, life: 3000 });

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    /**Hapus Klaim */
    const handleHapusKlaim = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        const payload = {
            nomor_sep: datas.noSep,
            coder_nik: auth.user.coder_nik,
        };
        axios.post(route('deleteKlaim'), payload)
            .then((response) => {
                // console.log('Response:', response.data);
                setHide(false);
                setDataGrouper(response.data.data);
                toast.current.show({ severity: 'success', summary: `Data  Berhasil Di Hapus`, detail: datas.noSep, life: 3000 });

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    /**handleCetak */
    const handleCetak = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log("Auth", auth);

        // Buat payload dengan noSep
        const payload = {
            noSep: datas.noSep,
        };

        // Lakukan request ke backend untuk mendapatkan file PDF
        axios.post(route('printKlaim'), payload, { responseType: 'blob' })
            .then((response) => {
                console.log('response', response);
                // Mendapatkan file PDF yang diunduh
                const file = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(file);
                link.download = `klaim_${datas.noSep}.pdf`; // Nama file PDF yang akan diunduh
                link.click(); // Memulai proses unduhan

                toast.current.show({ severity: 'success', summary: `Data Berhasil Diunduh`, detail: datas.noSep, life: 3000 });
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.current.show({ severity: 'error', summary: 'Gagal Mengunduh', detail: 'Terjadi kesalahan saat mengunduh file PDF.', life: 3000 });
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
            coder_nik: auth.user.coder_nik
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
                    <div>{rowData.noSep}<br /> <span style={{ color: 'red' }}> ( No SEP belum di sinkron )</span> </div> // Show message if pendaftaran_id is null
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
