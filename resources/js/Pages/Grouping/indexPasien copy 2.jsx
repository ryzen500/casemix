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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flatpickr from "react-flatpickr";
import { Dialog } from 'primereact/dialog';
import { faUser, faHome, faCog, faEllipsis, faQuestionCircle, faArrowLeft, faTrashCan, faFile, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from 'primereact/tooltip';

export default function Dashboard({ auth, model, pasien, caraMasuk, Jaminan, DPJP, jenisKasus, pegawai, kelompokDiagnosa, COB, caraPulang }) {
    const [datas, setDatas] = useState([]);
    const [dataGrouping, setDataGrouping] = useState({
        los: 0,
        grouper: null
    });
    const [models, setModels] = useState(model);
    const [beratLahir, setBeratLahir] = useState('');
    const [sistole, setSistole] = useState('');
    const [total_simrs, setTotalSimrs] = useState('');

    const [diastole, setDiastole] = useState('');

    const [pendaftarans, setPendaftarans] = useState([]);
    const [pembayaranPelayanans, setPembayaranPelayanans] = useState([]);

    const [dataDiagnosa, setDiagnosa] = useState([]);
    const [dataIcd9cm, setDataIcd9cm] = useState([]);
    const [dataIcd9cmINA, setDataIcd9cmINA] = useState([]);

    const [dataDiagnosaINA, setDiagnosaINA] = useState([]);
    const [selectedDialog, setSelectedDialog] = useState(null);

    let emptyDiagnosa = {
        diagnosa_id: null,
        diagnosa_kode: null,
        diagnosa_nama: null,
        kelompokdiagnosa_nama: null,
        kelompokdiagnosa_id: null
    };
    let emptyDiagnosaIx = {
        pasienicd9cm_id: null,
        diagnosa_kode: null,
        diagnosa_nama: null,
        kelompokdiagnosa_nama: null,
        kelompokdiagnosa_id: null
    };
    const [diagnosaTemp, setDiagnosaTemp] = useState(emptyDiagnosa);
    const [diagnosaixTemp, setDiagnosaixTemp] = useState(emptyDiagnosaIx);
    const [dataGrouper2, setDataGrouper2] = useState([]);

    const [dataGrouper, setDataGrouper] = useState({
        group_description: '-',
        group_code: '-',
        group_tarif: 0,
        sub_acute_description: '-',
        sub_acute_code: '-',
        sub_acute_tarif: 0,
        chronic_description: '-',
        chronic_code: '-',
        chronic_tarif: 0,
        special_procedure_description: '-',
        special_procedure_code: '-',
        special_procedure_tarif: 0,
        special_prosthesis_description: '-',
        special_prosthesis_code: '-',
        special_prosthesis_tarif: 0,
        special_investigation_description: '-',
        special_investigation_code: '-',
        special_investigation_tarif: 0,
        special_drug_description: '-',
        special_drug_code: '-',
        special_drug_tarif: 0,
        kemenkes_dc_status_cd: '',
        klaim_status_cd: '',
        total: 0
    });

    const [dataGrouperv6, setDataGrouperv6] = useState({
        mdc_number: '-',
        mdc_description: '-',
        drg_code: '-',
        drg_description: '-',

        total: 0
    });
    const [dataFinalisasi, setDataFinalisasi] = useState([]);

    const [visible, setVisible] = useState(false);
    const [showSimpli, setShowSimpli] = useState(false);
    
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
        tarif_poli_eks: 0
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
    const [total, setTotal] = useState(0);
    const [totalGrouper, setTotalGrouper] = useState(0);

    const handleBackClick = () => {
        window.open(route('searchGroupper'), '_parent');

    };
    const [profils, setProfil] = useState([]);
    const [selectedCaraMasuk, setCaraMasuk] = useState({});
    const [selectedCaraPulang, setCaraPulang] = useState({});

    const [selectedJaminan, setJaminan] = useState({});
    const [selectedCOB, setCOB] = useState({});

    const [selectedDPJP, setDPJP] = useState({});
    const [expandedRows, setExpandedRows] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state for expanded row
    const [hide, setHide] = useState(false); // Loading state for expanded row
    // const [hid, setHide] = useState(false); // Loading state for expanded row

    const toast = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchTextIX, setSearchTextIX] = useState('');

    const [pasienTB, setPasienTB] = useState(false); // Track the checkbox state
    const [kelasEksekutif, setKelasEksekutif] = useState(false); // Track the checkbox state

    const [nomorRegister, setNomorRegister] = useState(''); // Track the nomor register
    const openDialog = (rowData) => {
        setSelectedDialog(rowData.sep_id);
    };
    
    const closeDialog = () => {
        setSelectedDialog(null);
    };
    const handleCheckboxChange = () => {
        setPasienTB(!pasienTB);
    };

    const handleCheckboxKelasEksekutifChange = () => {
        setKelasEksekutif(!kelasEksekutif);
    };

    const handleValidate = () => {
        // Handle validation logic here
        e.preventDefault(); // Prevent page reload


        // Perform API request with axios
        const payload = {

            nomor_sep: datas.noSep,
            nomor_register_sitb: nomorRegister,
        };
        axios.post(route('validateSITB'), payload)
            .then((response) => {
                // Handle the response from the backend

                console.log("Responses ", typeof response.data.success);
                if (Boolean(response.data.success) === false) {
                    toast.current.show({ severity: 'error', summary: response.data.message, detail: datas.noSep, life: 3000 });

                } else {
                    toast.current.show({ severity: 'success', summary: `Data  Berhasil Di simpan`, detail: datas.noSep, life: 3000 });

                }
                // {console.log("Display 2", hide)}

            })
            .catch((error) => {
                console.error('Error:', error);
            });

    };


    useEffect(() => {
        calculate_total();

        setCaraMasuk("gp");
        setCaraPulang("1");
        calculate_total_grouper();
    }, [tarifs, obats, dataGrouper]);

    // Function to fetch data from API
    const fetchSuggestions = async (query) => {
        try {
            // Replace with your API 
            const response = await axios.post(route('searchDiagnosa'), {
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
            const response = await axios.post(route('searchDiagnosaIX'), {
                keyword: query, // Send the expandedProduct.noSep data
            });
            const res = response.data;
            // let query = event.query;
            let _filteredItems = [];
            for (let i = 0; i < res.length; i++) {
                _filteredItems.push({ 'label': res[i].diagnosaicdix_nama, 'value': res[i].diagnosaicdix_kode, 'id': res[i].diagnosaicdix_id })
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
            if (query.query.length > 2) {
                const response = await axios.post(route('searchDiagnosaCode'), {
                    keyword: query.query, // Send the expandedProduct.noSep data
                });
                const res = response.data;
                // let query = event.query;
                let _filteredItems = [];
                for (let i = 0; i < res.length; i++) {
                    _filteredItems.push({ 'label': res[i].diagnosa_nama, 'value': res[i].diagnosa_kode, 'id': res[i].diagnosa_id })
                }
                // const data = await response.json();
                setSuggestions(_filteredItems);  // Set your data here
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // Function to fetch data from API search diagnosa_kode
    const fetchSuggestionsCodeIX = async (query) => {
        try {
            if (query.query.length > 2) {
                // Replace with your API
                const response = await axios.post(route('searchDiagnosaCodeIX'), {
                    keyword: query.query, // Send the expandedProduct.noSep data
                });
                const res = response.data;
                // let query = event.query;
                let _filteredItems = [];
                for (let i = 0; i < res.length; i++) {
                    _filteredItems.push({ 'label': res[i].diagnosaicdix_nama, 'value': res[i].diagnosaicdix_kode, 'id': res[i].diagnosaicdix_id })
                }
                // const data = await response.json();
                setSuggestions(_filteredItems);  // Set your data here
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // Handle input changes
    const handleInputChangeAutocompleteRow = (index, field, value, type) => {
        if (type === 'unu') {
            const updatedRows = dataDiagnosa.map(row => ({ ...row }));

            updatedRows[index][field] = value;
            updatedRows[index]['loginpemakai_id'] = auth.user.loginpemakai_id;
            setDiagnosa(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }
        } else if (type == 'ina') {
            const updatedRows = dataDiagnosaINA.map(row => ({ ...row }));
            updatedRows[index][field] = value;
            setDiagnosaINA(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }

        }
    };
    // Handle input changes
    const handleInputChangeAutocompleteIXRow = (index, field, value, type) => {
        if (type == 'icdixunu') {
            const updatedRows = dataIcd9cm.map(row => ({ ...row }));
            updatedRows[index][field] = value;
            setDataIcd9cm(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsIX(value);  // Fetch suggestions based on the input
            }
        } else if (type == 'icdixina') {
            const updatedRows = dataIcd9cmINA.map(row => ({ ...row }));
            updatedRows[index][field] = value;
            setDataIcd9cmINA(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsIX(value);  // Fetch suggestions based on the input
            }
        }
    };
    const handleInputChangeRow = async (index, field, value, type) => {
        if (type === 'unu') {
            const updatedRows = dataDiagnosa.map(row => ({ ...row }));

            // Update the selected row
            updatedRows[index][field] = value;
            updatedRows[index]['loginpemakai_id'] = auth.user.loginpemakai_id;
            let temp = [];
            temp.push({ ...updatedRows[index] });

            // If 'kelompokdiagnosa_id' is set to 2, update all others to 3
            if (field === 'kelompokdiagnosa_id' && value === 2) {
                updatedRows.forEach((row, i) => {
                    if (i !== index && row.kelompokdiagnosa_id === 2) {
                        updatedRows[i].kelompokdiagnosa_id = 3;
                        updatedRows[i]['loginpemakai_id'] = auth.user.loginpemakai_id;

                        temp.push({ ...updatedRows[i] });

                    }
                });
            }
            try {
                const response = await axios.post(route('updateMorbiditasT'), {
                    payload: temp, // Send the expandedProduct.noSep data
                });
                if (response.data.success) {
                    // Sort the updated array
                    updatedRows.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);

                    // Update state
                    setDiagnosa(updatedRows);
                    toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });

                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
            }


            // If field is 'diagnosa_kode' and length > 2, fetch suggestions
            if (field === 'diagnosa_kode' && value.length > 2) {
                fetchSuggestionsCode(value);
            }
        } else if (type == 'ina') {
            const updatedRows = dataDiagnosaINA.map(row => ({ ...row }));

            // Update the selected row
            updatedRows[index][field] = value;

            // If 'kelompokdiagnosa_id' is set to 2, update all others to 3
            if (field === 'kelompokdiagnosa_id' && value === 2) {
                updatedRows.forEach((row, i) => {
                    if (i !== index && row.kelompokdiagnosa_id === 2) {
                        updatedRows[i].kelompokdiagnosa_id = 3;
                    }
                });
            }

            // Sort the updated array
            updatedRows.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);

            // Update state
            setDiagnosaINA(updatedRows);

            // If field is 'diagnosa_kode' and length > 2, fetch suggestions
            if (field === 'diagnosa_kode' && value.length > 2) {
                fetchSuggestionsCode(value);
            }
        } else if (type == 'icdixunu') {
            const updatedRows = dataIcd9cm.map(row => ({ ...row }));

            // Update the selected row
            updatedRows[index][field] = value;
            updatedRows[index]['loginpemakai_id'] = auth.user.loginpemakai_id;
            let temp = [];
            temp.push({ ...updatedRows[index] });
            await axios.post(route('updatePasienicd9T'), { payload: temp })
                .then((response) => {
                    if (Boolean(response.data.success) !== false) {
                        setDataIcd9cm(updatedRows);

                        toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });

                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });

                    }

                    // Handle the response from the backend
                })
            // Update state
            setDataIcd9cm(updatedRows);

            // If field is 'diagnosa_kode' and length > 2, fetch suggestions
            if (field === 'diagnosaicdix_kode' && value.length > 2) {
                fetchSuggestionsCodeIX(value);  // Fetch suggestions based on the input
            }
        } else if (type == 'icdixina') {
            const updatedRows = dataDiagnosaINA.map(row => ({ ...row }));

            // Update the selected row
            updatedRows[index][field] = value;

            // If 'kelompokdiagnosa_id' is set to 2, update all others to 3
            if (field === 'kelompokdiagnosa_id' && value === 2) {
                updatedRows.forEach((row, i) => {
                    if (i !== index && row.kelompokdiagnosa_id === 2) {
                        updatedRows[i].kelompokdiagnosa_id = 3;
                    }
                });
            }

            // Sort the updated array
            updatedRows.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);
            // Update state
            setDiagnosaINA(updatedRows);

            // If field is 'diagnosa_kode' and length > 2, fetch suggestions
            if (field === 'diagnosaicdix_kode' && value.length > 2) {
                fetchSuggestionsCodeIX(value);  // Fetch suggestions based on the input
            }
        }
    };
    const updateRow = async (index, value, type) => {
        if (type === 'unu') {
            const updatedRows = dataDiagnosa.map(row => ({ ...row }));
            updatedRows[index]['diagnosa_id'] = value.id;
            updatedRows[index]['diagnosa_kode'] = value.value;
            updatedRows[index]['diagnosa_nama'] = value.label;
            updatedRows[index]['loginpemakai_id'] = auth.user.loginpemakai_id;

            let temp = [];
            temp.push({ ...updatedRows[index] });
            try {
                const response = await axios.post(route('updateMorbiditasT'), {
                    payload: temp, // Send the expandedProduct.noSep data
                });
                if (response.data.success) {
                    // Sort the updated array
                    updatedRows.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);

                    // Update state
                    setDiagnosa(updatedRows);
                    toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });

                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
            }
            setDiagnosa(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }
        } else if (type == 'ina') {
            const updatedRows = dataDiagnosaINA.map(row => ({ ...row }));
            updatedRows[index]['diagnosa_id'] = value.id;
            updatedRows[index]['diagnosa_kode'] = value.value;
            updatedRows[index]['diagnosa_nama'] = value.label;
            setDiagnosaINA(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }

        }
    };
    const updateIXRow = async (index, value, type) => {
        if (type == 'icdixunu') {
            const updatedRows = dataIcd9cm.map(row => ({ ...row }));
            updatedRows[index]['diagnosaicdix_id'] = value.id;
            updatedRows[index]['diagnosaicdix_kode'] = value.value;
            updatedRows[index]['diagnosaicdix_nama'] = value.label;
            updatedRows[index]['loginpemakai_id'] = auth.user.loginpemakai_id;
            let temp = [];
            temp.push({ ...updatedRows[index] });
            await axios.post(route('updatePasienicd9T'), { payload: temp })
                .then((response) => {
                    if (Boolean(response.data.success) !== false) {
                        setDataIcd9cm(updatedRows);

                        toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });

                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });

                    }

                    // Handle the response from the backend
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                });
        } else if (type = 'icdixina') {
            const updatedRows = dataIcd9cmINA.map(row => ({ ...row }));
            updatedRows[index]['diagnosaicdix_id'] = value.id;
            updatedRows[index]['diagnosaicdix_kode'] = value.value;
            updatedRows[index]['diagnosaicdix_nama'] = value.label;
            updatedRows[index]['pendaftaran_id'] = pendaftarans.pendaftaran_id;

            setDataIcd9cmINA(updatedRows);
            let length = value.length;
            if (length > 2) {
                fetchSuggestionsCode(value);  // Fetch suggestions based on the input
            }
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

    const formatDateGroup = (dateString) => {
        if (dateString !== undefined) {
            console.log("Date String", dateString);
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('id-ID', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(date).replace(/\./g, ':');
        }

    };

    // const formattedDate = formatDateTime(dataFinalisasi.create_time);
    // console.log(formattedDate); // Output: "2024-02-07 14:30"


    const formatDateTime = (dateString) => {
        // Convert the date string to a Date object
        const formattedDate = new Date(dateString.replace(" ", "T"));
        return isNaN(formattedDate) ? null : formattedDate;
    };

    // const formatDate = (dateString) => {
    //     // Convert the date string to a Date object
    //     const date = new Date(dateString.replace(" ", "T"));
    //       // Get the day, month, and year
    //     const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if day is < 10
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    //     const year = date.getFullYear();

    //     // Return formatted date in dd-mm-yyyy format
    //     return `${day}-${month}-${year}`;

    // };
    const addRowDiagnosaIX = async (rowData, type) => {
        if (type == 'unu') {
            let _dataDiagnosa = dataIcd9cm.map(row => ({ ...row }));
            let _diagnosa = { ...diagnosaixTemp };

            _diagnosa.diagnosaicdix_id = rowData.id;
            _diagnosa.diagnosaicdix_nama = rowData.label;
            _diagnosa.diagnosaicdix_kode = rowData.value;
            _diagnosa.loginpemakai_id = auth.user.loginpemakai_id;
            _diagnosa.pendaftaran_id = pendaftarans.pendaftaran_id;
            _diagnosa.tgl_pendaftaran = pendaftarans.tgl_pendaftaran;
            _diagnosa.pegawai_id = pendaftarans.pegawai_id;
            const hasKelompokDiagnosaId2 = dataIcd9cm.some((row) => row.kelompokdiagnosa_id === 2);
            if (hasKelompokDiagnosaId2) {
                _diagnosa.kelompokdiagnosa_id = 3;
            } else {
                // If no row has kelompokdiagnosa_id === 2, set it to 2
                _diagnosa.kelompokdiagnosa_id = 2;
            }
            _dataDiagnosa.push(_diagnosa);
            _dataDiagnosa.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);
            await axios.post(route('insertPasienicd9T'), { payload: _diagnosa })
                .then((response) => {
                    if (Boolean(response.data.success) !== false) {
                        _diagnosa.pasienicd9cm_id = response.data.Pasienicd9cmT.pasienicd9cm_id;

                        setDataIcd9cm(_dataDiagnosa);
                        setDiagnosaixTemp(emptyDiagnosa);
                        setSearchTextIX(null);
                        toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });

                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });

                    }

                    // Handle the response from the backend
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                });
        } else if (type == 'ina') {
            let _dataDiagnosa = dataIcd9cmINA.map(row => ({ ...row }));
            let _diagnosa = { ...diagnosaixTemp };

            _diagnosa.diagnosaicdix_id = rowData.id;
            _diagnosa.diagnosaicdix_nama = rowData.label;
            _diagnosa.diagnosaicdix_kode = rowData.value;
            _diagnosa.pendaftaran_id = pendaftarans.pendaftaran_id;
            const hasKelompokDiagnosaId2 = dataIcd9cmINA.some((row) => row.kelompokdiagnosa_id === 2);
            if (hasKelompokDiagnosaId2) {
                _diagnosa.kelompokdiagnosa_id = 3;
            } else {
                // If no row has kelompokdiagnosa_id === 2, set it to 2
                _diagnosa.kelompokdiagnosa_id = 2;
            }
            _dataDiagnosa.push(_diagnosa);
            _dataDiagnosa.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);

            setDataIcd9cmINA(_dataDiagnosa);
            setDiagnosaixTemp(emptyDiagnosa);
            setSearchTextIX(null);
            // setDiagnosa(response.data.dataDiagnosa);
        }
    }

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };
    const addRowDiagnosaX = async (rowData) => {
        const _dataDiagnosa = dataDiagnosa.map(row => ({ ...row })); // Deep copy

        let _diagnosa = { ...diagnosaTemp };

        _diagnosa.diagnosa_id = rowData.id;
        _diagnosa.tgl_pendaftaran = pendaftarans.tgl_pendaftaran;
        _diagnosa.pegawai_id = pendaftarans.pegawai_id;
        _diagnosa.diagnosa_nama = rowData.label;
        _diagnosa.diagnosa_kode = rowData.value;
        _diagnosa.kasusdiagnosa = 'KASUS LAMA';
        _diagnosa.loginpemakai_id = auth.user.loginpemakai_id;
        _diagnosa.pendaftaran_id = pendaftarans.pendaftaran_id;
        const hasKelompokDiagnosaId2 = dataDiagnosa.some((row) => row.kelompokdiagnosa_id === 2);
        if (hasKelompokDiagnosaId2) {
            _diagnosa.kelompokdiagnosa_id = 3;
        } else {
            // If no row has kelompokdiagnosa_id === 2, set it to 2
            _diagnosa.kelompokdiagnosa_id = 2;
        }
        try {
            const response = await axios.post(route('insertMorbiditasT'), {
                payload: _diagnosa, // Send the expandedProduct.noSep data
            });
            if (response.data.success) {
                _diagnosa.pasienmorbiditas_id = response.data.pasienmorbiditasT.pasienmorbiditas_id;
                _dataDiagnosa.push(_diagnosa);
                _dataDiagnosa.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);
                setDiagnosa(_dataDiagnosa);
                setDiagnosaTemp(emptyDiagnosa);
                setSearchText(null);
                toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });

            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });

        }
        // setDiagnosa(response.data.dataDiagnosa);

    }
    const addRowDiagnosaINAX = (rowData) => {
        const _dataDiagnosa = dataDiagnosaINA.map(row => ({ ...row })); // Deep copy

        let _diagnosa = { ...diagnosaTemp };

        _diagnosa.diagnosa_id = rowData.id;
        _diagnosa.tgl_pendaftaran = pendaftarans.tgl_pendaftaran;
        _diagnosa.pegawai_id = pendaftarans.pegawai_id;
        _diagnosa.diagnosa_nama = rowData.label;
        _diagnosa.diagnosa_kode = rowData.value;
        _diagnosa.kasusdiagnosa = 'KASUS LAMA';

        const hasKelompokDiagnosaId2 = dataDiagnosaINA.some((row) => row.kelompokdiagnosa_id === 2);
        if (hasKelompokDiagnosaId2) {
            _diagnosa.kelompokdiagnosa_id = 3;
        } else {
            // If no row has kelompokdiagnosa_id === 2, set it to 2
            _diagnosa.kelompokdiagnosa_id = 2;
        }
        _dataDiagnosa.push(_diagnosa);
        _dataDiagnosa.sort((a, b) => a.kelompokdiagnosa_id - b.kelompokdiagnosa_id);
        setDiagnosaINA(_dataDiagnosa);
        setDiagnosaTemp(emptyDiagnosa);
        setSearchText(null);
        // setDiagnosa(response.data.dataDiagnosa);

    }
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0" style={{ fontSize: '1rem' }}>Diagnosa (ICD X)</h4>
            <IconField iconPosition="left">

                <AutoComplete
                    value={searchText}
                    suggestions={suggestions}
                    completeMethod={onSearchChange}  // Trigger search on typing
                    field="search-icdx"  // Field to display in the suggestion (adjust based on your API response)
                    onSelect={(e) => addRowDiagnosaX(e.value)}  // Update input field
                    itemTemplate={(item) => (
                        <div>
                            <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                        </div>
                    )}
                />
            </IconField>
        </div>
    );
    const headerINA = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0" style={{ fontSize: '1rem' }}>Diagnosa (ICD X)</h4>
            <IconField iconPosition="left">

                <AutoComplete
                    value={searchText}
                    suggestions={suggestions}
                    completeMethod={onSearchChange}  // Trigger search on typing
                    field="search-icdx"  // Field to display in the suggestion (adjust based on your API response)
                    onSelect={(e) => addRowDiagnosaINAX(e.value)}  // Update input field
                    itemTemplate={(item) => (
                        <div>
                            <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                        </div>
                    )}
                />
            </IconField>
        </div>
    );
    const headerUnuICDIX = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0" style={{ fontSize: '1rem' }}>Diagnosa (ICD IX)</h4>
            <IconField iconPosition="left">

                <AutoComplete
                    value={searchTextIX}
                    suggestions={suggestions}
                    completeMethod={onSearchChangeIX}  // Trigger search on typing
                    field="search-icdix"  // Field to display in the suggestion (adjust based on your API response)
                    onSelect={(e) => addRowDiagnosaIX(e.value, 'unu')}  // Update input field
                    itemTemplate={(item) => (
                        <div>
                            <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                        </div>
                    )}
                />
            </IconField>
        </div>
    );
    const headerInaICDIX = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0" style={{ fontSize: '1rem' }}>Diagnosa (ICD IX)</h4>
            <IconField iconPosition="left">

                <AutoComplete
                    value={searchTextIX}
                    suggestions={suggestions}
                    completeMethod={onSearchChangeIX}  // Trigger search on typing
                    field="search-icdix"  // Field to display in the suggestion (adjust based on your API response)
                    onSelect={(e) => addRowDiagnosaIX(e.value, 'ina')}  // Update input field
                    itemTemplate={(item) => (
                        <div>
                            <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
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
        // Check if dateString exists and is not empty
        if (!dateString) return '';

        // Split the date string into day, month, and year
        const [day, month, year] = dateString.split('/');

        // Create a new date object from the parsed values
        const date = new Date(`${year}-${month}-${day}`);

        // Check if the date is valid
        if (isNaN(date)) return '';

        // Return the formatted date as YYYY-MM-DD
        return date.toISOString().split('T')[0];
    };

    const onRowExpand = async (event) => {
        const expandedProduct = event.data;
        // Set loading to true when starting the API request
        setLoading(true);
        console.log("expanded Product ", expandedProduct.pendaftaran_id);
        // setExpandedRows(null);

        if (expandedProduct.pendaftaran_id == null) {
            console.log("<<>>");

            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No SEP belum di sinkron!', life: 3000 });
            setExpandedRows(null);
            console.log("expanded ", expandedRows)
        }

        // if (!expandedProduct.pendaftaran_id) { 
        //     toast.current.show({
        //         severity: 'error', 
        //         summary: 'Error', 
        //         detail: 'No SEP belum di sinkron!', 
        //         life: 3000
        //     });
        //     setLoading(false);
        //     setExpandedRows(null);
        //     return;
        // }

        else {
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
                    console.log("Sub 2")

                    toast.current.show({ severity: 'info', summary: event.data.noSep, detail: event.data.noSep, life: 3000 });
                    setDatas(response.data.model.response);
                    handleNewClaim(response.data.model.response);
                    setCOB(response.data.model.response.cob);
                    const defaultCaraMasuk = caraMasuk.find(
                        (caramasuk) => caramasuk.code === "gp"
                    );

                    console.log("Default cara masuk ", defaultCaraMasuk);
                    setCaraMasuk(defaultCaraMasuk || null);

                    setTotalSimrs(response.data.total_simrs);

                    const defaultDPJP = DPJP.find(
                        (dpjp) => dpjp.kdDPJP === response.data.model.response.dpjp.kdDPJP
                    );

                    setDPJP(defaultDPJP || null);

                    setJaminan(response.data.pendaftaran.carabayar_id);

                    setPembayaranPelayanans(response.data.pembayaranpelayanan || null);
                    if (response.data.getGrouping.success !== false) {
                        setDataGrouping(response.data.getGrouping.data.data);

                    }
                    const defaultCaraPulang = caraPulang.find(
                        (carapulang) => carapulang.value === "1"
                    );

                    setDataGrouperv6(response.data.Inasismdc || false);
                    // console.log("Default cara pulang ", defaultCaraPulang);
                    setCaraPulang(defaultCaraPulang || null);
                    // setDataFinalisasi(response.data.inacbg || false)
                    setPendaftarans(response.data.pendaftaran);
                    setProfil(response.data.profil);
                    setDiagnosa(response.data.dataDiagnosa);
                    setDiagnosaINA(response.data.dataDiagnosa);
                    setDataIcd9cm(response.data.dataIcd9cm);
                    setDataIcd9cmINA(response.data.dataIcd9cm);
                    // setDataFinalisasi((prevDataFinal) => {
                    //     return {
                    //         ...prevDataFinal,
                    //         is_finalisasi: response.data.getGrouping.data.dataklaim_status_cd
                    //     };
                    // });
                    // console.log("Hasil Final ", response.data.getGrouping.data.data.klaim_status_cd);

                    if (response.data.inacbg !== null) {
                        let setTarifInacbg = {
                            total: 0,
                            prosedurenonbedah: response.data.inacbg.tarif_prosedur_nonbedah || 0,
                            prosedurebedah: response.data.inacbg.tarif_prosedur_bedah || 0,
                            konsultasi: response.data.inacbg.tarif_konsultasi || 0,
                            tenagaahli: response.data.inacbg.tarif_tenaga_ahli || 0,
                            keperawatan: response.data.inacbg.tarif_keperawatan || 0,
                            penunjang: response.data.inacbg.tarif_penunjang || 0,
                            radiologi: response.data.inacbg.tarif_radiologi || 0,
                            laboratorium: response.data.inacbg.tarif_laboratorium || 0,
                            pelayanandarah: response.data.inacbg.tarif_pelayanan_darah || 0,
                            rehabilitasi: response.data.inacbg.tarif_rehabilitasi || 0,
                            kamar_akomodasi: response.data.inacbg.tarif_akomodasi || 0,
                            rawatintensif: response.data.inacbg.tarif_rawat_intensif || 0,
                        };
                        let setObatInacbg = {
                            total: 0,
                            obat: response.data.inacbg.tarif_obat || 0,
                            obatkronis: response.data.inacbg.tarif_obat_kronis || 0,
                            obatkemoterapi: response.data.inacbg.tarif_obat_kemoterapi || 0,
                            alkes: response.data.inacbg.tarif_alkes || 0,
                            bmhp: response.data.inacbg.tarif_bhp || 0,
                            sewaalat: response.data.inacbg.tarif_sewa_alat || 0,
                        };
                        let setKlinis = {
                            sistole: response.data.inacbg.sistole,
                            diastole: response.data.inacbg.diastole,
                        };
                        let pendaftaran_data = {
                            tanggal_masuk: response.data.inacbg.tglrawat_masuk,
                            tanggal_pulang: response.data.inacbg.tglrawat_masuk,
                            umur: response.data.inacbg.umur_pasien,
                            pendaftaran_id: response.data.inacbg.pendaftaran_id,

                        }
                        setCaraMasuk(response.data.inacbg.hak_kelasrawat_inacbg);
                        // setCOB(response.data.inacbg.cob_id);
                        // setPendaftarans(setPendaftaran)


                        setPendaftarans((prevTotal) => ({
                            ...prevTotal,
                            tanggal_masuk: response.data.inacbg.tglrawat_masuk,
                            tanggal_pulang: response.data.inacbg.tglrawat_masuk,
                            umur: response.data.inacbg.umur_pasien,
                            pendaftaran_id: response.data.inacbg.pendaftaran_id,// Update the specific field dynamically
                        }));
                        setTarifs(setTarifInacbg);
                        setObats(setObatInacbg);
                        setSistole(setKlinis.sistole);
                        setDiastole(setKlinis.diastole);
                        setBeratLahir(response.data.inacbg.berat_lahir);
                        setCaraPulang(response.data.inacbg.cara_pulang);
                        // setDPJP(response.data.inacbg.nama_dpjp);
                        setDataFinalisasi((prevDataFinal) => {
                            console.log("Data FInal sat", response.data);

                            return {
                                ...({}), // Jika response.data.inacbg ada, gunakan sebagai basis, jika tidak, gunakan objek kosong
                                // is_finalisasi: (response.data[1].data.data.klaim_status_cd === "final") ? response.data[1].data.data.klaim_status_cd : false// Perbarui is_finalisasi
                                is_finalisasi: (response.data.getGrouping.success !== false) ? (
                                    (response.data.getGrouping.data.data.klaim_status_cd == "final") ? response.data.getGrouping.data.data.klaim_status_cd : false) : false// Perbarui is_finalisasi
                            };
                        });

                    } else {
                        let setKlinis = {
                            sistole: 0,
                            diastole: 0,
                        };
                        setTarifs(response.data.tarif);
                        if (response.data.obat !== null) {
                            setObats(response.data.obat);
                        }
                        setSistole(setKlinis);
                        setSistole(setKlinis.sistole);
                        setDiastole(setKlinis.diastole);
                        setBeratLahir(0)
                    }
                    if (Boolean(response.data.getGrouping.success) === false || response.data.getGrouping.data.data.grouper.response === null) {
                        console.log("Sub 3");
                        //   if(response.data.inacbg !== null) { 
                        setHide(true);

                        //   }
                    }
                    else {
                        console.log("Sub 4")

                        setHide(false);
                        setDataGrouping(response.data.getGrouping.data.data);
                        let setTarifGrouping = {
                            total: 0,
                            prosedurenonbedah: response.data.getGrouping.data.data.tarif_rs.prosedur_non_bedah,
                            prosedurebedah: response.data.getGrouping.data.data.tarif_rs.prosedur_bedah,
                            konsultasi: response.data.getGrouping.data.data.tarif_rs.konsultasi,
                            tenagaahli: response.data.getGrouping.data.data.tarif_rs.tenaga_ahli,
                            keperawatan: response.data.getGrouping.data.data.tarif_rs.keperawatan,
                            penunjang: response.data.getGrouping.data.data.tarif_rs.penunjang,
                            radiologi: response.data.getGrouping.data.data.tarif_rs.radiologi,
                            laboratorium: response.data.getGrouping.data.data.tarif_rs.laboratorium,
                            pelayanandarah: response.data.getGrouping.data.data.tarif_rs.pelayanan_darah,
                            rehabilitasi: response.data.getGrouping.data.data.tarif_rs.rehabilitasi,
                            kamar_akomodasi: response.data.getGrouping.data.data.tarif_rs.kamar,
                            rawatintensif: response.data.getGrouping.data.data.tarif_rs.rawat_intensif,
                        };
                        let setObatGrouping = {
                            total: 0,
                            obat: response.data.getGrouping.data.data.tarif_rs.obat,
                            obatkronis: response.data.getGrouping.data.data.tarif_rs.obat_kronis,
                            obatkemoterapi: response.data.getGrouping.data.data.tarif_rs.obat_kemoterapi,
                            alkes: response.data.getGrouping.data.data.tarif_rs.alkes,
                            bmhp: response.data.getGrouping.data.data.tarif_rs.bmhp,
                            sewaalat: response.data.getGrouping.data.data.tarif_rs.sewa_alat,
                        };

                        setTarifs(setTarifGrouping);
                        setObats(setObatGrouping);
                        setDataFinalisasi((prevDataFinal) => {
                            console.log("Data FInal sat", response.data);

                            return {
                                ...({}), // Jika response.data.inacbg ada, gunakan sebagai basis, jika tidak, gunakan objek kosong
                                // is_finalisasi: (response.data[1].data.data.klaim_status_cd === "final") ? response.data[1].data.data.klaim_status_cd : false// Perbarui is_finalisasi
                                is_finalisasi: (response.data.getGrouping.success !== false) ? (
                                    (response.data.getGrouping.data.data.klaim_status_cd == "final") ? response.data.getGrouping.data.data.klaim_status_cd : false) : false// Perbarui is_finalisasi
                            };
                        });

                    }
                    calculate_total();


                    // setInterval(() => {

                    // }, 3000);

                    // console.log(response.data,tarifs.total);
                } else {
                    console.log("Kick 1")
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.model.metaData.message, life: 3000 });
                    setExpandedRows(null);
                }


            } catch (error) {
                console.log("Kick 2")
                console.log("Error", error)
                if (error.response && error.response.status === 401) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Session Expired',
                        detail: 'Your session has expired. Redirecting to login...',
                        life: 3000
                    });
                    window.open(route('login'), '_parent');
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
                }
                // setExpandedRows(null); // Optionally, handle error state

            } finally {
                // Set loading to false when the API request finishes
                setLoading(false);
            }

        }
    };

    const openRow = async (event) => {
        // Get the keys of the object
        const keys = Object.keys(event);

        // Get the last key
        const lastKey = keys[keys.length - 1];

        // Get the last key's value
        const lastObject = { [lastKey]: [lastKey] };
        setExpandedRows(lastObject);
    }
    const handleNewClaim = async (data) => {

        console.log("handle new klaim", data);
        const payload = {
            no_rekam_medik: data.peserta.noMr,
            nama_pasien: data.peserta.nama,
            nomor_kartu: data.peserta.noKartu,
            noSep: data.noSep,
            tgl_lahir: data.peserta.tglLahir,
            gender: data.peserta.kelamin,
        };

        // console.log("Payload ", payload);

        await axios.post(route('newClaim'), payload)
            .then((response) => {
                console.log('Response:', response.data);
                // setHide(false);
                if (Boolean(response.data.success) === false) {
                    // toast.current.show({ severity: 'error', summary: response.data.message, detail: datas.noSep, life: 3000 });

                } else {
                    toast.current.show({ severity: 'success', summary: `Data  Berhasil Di simpan`, detail: datas.noSep, life: 3000 });

                }

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        // try {
        //     const response = axios.post(route('newClaim'), payload);

        //     if (Boolean(response.data.success) === false) {
        //         toast.current.show({ severity: 'error', summary: response.data.message || 'Gagal menyimpan data', detail: datas.noSep, life: 3000 });
        //     } else {
        //         toast.current.show({ severity: 'success', summary: 'Data Berhasil Disimpan', detail: datas.noSep, life: 3000 });
        //     }

        // } catch (error) {
        //     toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'Terjadi kesalahan saat menyimpan data.', life: 3000 });
        // }
    }
    const calculate_total = () => {
        const total_all = (
            parseFloat(tarifs.prosedurenonbedah || 0) + parseFloat(tarifs.prosedurebedah || 0) + parseFloat(tarifs.konsultasi || 0) +
            parseFloat(tarifs.tenagaahli || 0) + parseFloat(tarifs.keperawatan || 0) + parseFloat(tarifs.penunjang || 0) +
            parseFloat(tarifs.radiologi || 0) + parseFloat(tarifs.laboratorium || 0) + parseFloat(tarifs.pelayanandarah || 0) +
            parseFloat(tarifs.rehabilitasi || 0) + parseFloat(tarifs.kamar_akomodasi || 0) + parseFloat(tarifs.rawatintensif || 0) +
            parseFloat(obats.obat || 0) + parseFloat(obats.obatkronis || 0) + parseFloat(obats.obatkemoterapi || 0) +
            parseFloat(obats.alkes || 0) + parseFloat(obats.bmhp || 0) + parseFloat(obats.sewaalat || 0));
        const name = 'total'; // Get name and value from the event
        // return total_all;
        setTotal((prevTotal) => ({
            ...prevTotal,
            [name]: (total_all), // Update the specific field dynamically
        }));
    }
    const calculate_total_grouper = () => {
        const total_all = (
            parseFloat(dataGrouper.group_tarif || 0) + parseFloat(dataGrouper.sub_acute_tarif || 0) + parseFloat(dataGrouper.chronic_tarif || 0)
            + parseFloat(dataGrouper.special_procedure_tarif || 0) + parseFloat(dataGrouper.special_prosthesis_tarif || 0)
            + parseFloat(dataGrouper.special_investigation_tarif || 0) + parseFloat(dataGrouper.special_drug_tarif || 0));
        const name = 'total'; // Get name and value from the event
        // return total_all;
        setTotalGrouper((prevTotal) => ({
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


    const handleChange = (e) => {
        setPendaftarans({
            ...pendaftarans,
            [e.target.name]: e.target.value, // Memastikan input bisa diubah oleh user
        });
    };
    const removeRow = async (index, type) => {
        if (type === 'unu') {
            let updatedRows = dataDiagnosa.filter((_, i) => i === index);
            updatedRows[0].update_loginpemakai_id = auth.user.loginpemakai_id;

            // console.log(updateRows)
            try {
                const response = await axios.post(route('removeMorbiditasT'), {
                    payload: updatedRows, // Send the expandedProduct.noSep data
                });
                if (response.data.success) {
                    toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });
                    const updatedRowDelete = dataDiagnosa.filter((_, i) => i !== index);
                    setDiagnosa(updatedRowDelete);

                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });

            }
            // setDiagnosa(updatedRows); // Remove row and update state
        } else if (type === 'ina') {
            const updatedRows = dataDiagnosaINA.filter((_, i) => i !== index);
            setDiagnosaINA(updatedRows); // Remove row and update state
        }
    };
    const removeRowIX = async (index, type) => {
        if (type === 'icdixunu') {
            let updatedRows = dataIcd9cm.filter((_, i) => i === index);
            updatedRows[0].update_loginpemakai_id = auth.user.loginpemakai_id;
            await axios.post(route('removePasienicd9T'), { payload: updatedRows })
                .then((response) => {
                    if (Boolean(response.data.success) !== false) {
                        const updatedRowDelete = dataIcd9cm.filter((_, i) => i !== index);
                        setDataIcd9cm(updatedRowDelete);
                        toast.current.show({ severity: 'success', summary: `Success`, detail: response.data.message, life: 3000 });

                    } else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });

                    }

                    // Handle the response from the backend
                })
                .catch((error) => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: response.data.message, life: 3000 });
                });

        } else if (type === 'icdixina') {
            const updatedRows = dataIcd9cmINA.filter((_, i) => i !== index);
            setDataIcd9cmINA(updatedRows); // Remove row and update state
        }
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
                                            <Dropdown value={selectedJaminan} onChange={(e) => setJaminan(e.value)} options={Jaminan} optionLabel="name"
                                                placeholder="Pilih Jaminan / Cara Bayar" className='ml-2'
                                                style={{ width: '250px' }} />

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
                                <table className='table  mt-3' style={{ border: ' 1px solid black' }}>
                                    <tr>
                                        <td width={"15%"} className='pl-2' style={{ fontSize: '1rem' }}>
                                            Jenis Rawat
                                        </td>
                                        <td width={"60%"} style={{ fontSize: '1rem' }}>
                                            <div className="ml-2" >
                                                {datas.jnsPelayanan}

                                            </div>
                                        </td>
                                        <td width={"10%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-1">
                                                <Checkbox
                                                    value="true"
                                                    name="kelas_eksekutif"
                                                    checked={kelasEksekutif}
                                                    onChange={handleCheckboxKelasEksekutifChange} />
                                                <label htmlFor="ingredient1" className="ml-2">Kelas Eksekutif</label>
                                            </div>
                                        </td>

                                        <td width={"10%"} style={{ textAlign: 'right', paddingRight: '15px', fontSize: '1rem' }}>Kelas Hak</td>
                                        <td width={"15%"} style={{ fontSize: '1rem' }}>
                                            <input type="text" className="col-sm-11 ml-2 " name='hakKelas' value={datas.peserta.hakKelas} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"15%"} className='pl-2' style={{ fontSize: '1rem' }}>
                                            Tanggal Rawat
                                        </td>
                                        <td width={"60%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12 ml-2">
                                                <div className="row">


                                                    {/* Flatpci */}

                                                    <div className="col-sm-6">
                                                        Masuk :
                                                        <Flatpickr
                                                            options={{
                                                                enableTime: true,
                                                                dateFormat: "Y-m-d H:i",
                                                                time_24hr: true,
                                                                locale: "id", // Bahasa Indonesia
                                                            }}
                                                            value={pendaftarans.tanggal_masuk ? new Date(pendaftarans.tanggal_masuk) : null}
                                                            onChange={(selectedDates) =>
                                                                handleChange({
                                                                    target: {
                                                                        name: "tanggal_masuk",
                                                                        value: selectedDates[0],
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        Pulang :
                                                        <Flatpickr
                                                            options={{
                                                                enableTime: true,
                                                                dateFormat: "Y-m-d H:i",
                                                                time_24hr: true,
                                                                locale: "id",
                                                                minDate: pendaftarans.tanggal_masuk || null,
                                                            }}
                                                            value={pendaftarans.tanggal_pulang ? new Date(pendaftarans.tanggal_pulang) : null}
                                                            onChange={(selectedDates) =>
                                                                handleChange({
                                                                    target: {
                                                                        name: "tanggal_pulang",
                                                                        value: selectedDates[0],
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </td>
                                        <td width={"10%"} style={{ textAlign: 'center', fontSize: '1rem' }}></td>

                                        <td width={"10%"} style={{ textAlign: 'right', paddingRight: '15px', fontSize: '1rem' }}>Umur</td>
                                        <td width={"20%"} style={{ fontSize: '1rem' }}>
                                            <InputText name='umur'
                                                value={pendaftarans.umur} className='ml-2 col-sm-3' /> Tahun
                                        </td>
                                    </tr>
                                    <tr>
                                        {console.log("Masuk ", selectedCaraMasuk)}
                                        <td className='pl-2' style={{ fontSize: '1rem' }}>Cara Masuk</td>
                                        <td style={{ maxHeight: '60px', fontSize: '1rem' }}>
                                            <div className="col-sm-12" style={{ borderBottomColor: 'white', height: '60px' }}>
                                                <Dropdown
                                                    value={selectedCaraMasuk}
                                                    onChange={(e) => setCaraMasuk(e.value)}
                                                    options={caraMasuk}
                                                    optionLabel="name"
                                                    placeholder="Pilih Cara Masuk"
                                                    className="ml-2 custom-dropdown"
                                                    style={{ width: '250px' }}
                                                />
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className='pl-2' style={{ fontSize: '1rem' }}>COB</td>
                                        <td style={{ fontSize: '1rem' }} >
                                            <div className="col-sm-12" style={{ borderBottomColor: 'white', height: '60px' }}>
                                                <Dropdown
                                                    value={selectedCOB}
                                                    onChange={(e) => setCOB(e.value)}
                                                    options={COB}
                                                    optionLabel="name"
                                                    placeholder="Pilih COB"
                                                    className="ml-2 custom-dropdown"
                                                    style={{ width: '250px' }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='pl-2' style={{ fontSize: '1rem' }}>LOS</td>
                                        <td colSpan={2} style={{ fontSize: '1rem' }}>
                                            <InputNumber
                                                value={pendaftarans && dataGrouping ?
                                                    (dataGrouping.tanggal_masuk === dataGrouping.tanggal_pulang ? 1 : (dataGrouping.los ? parseFloat(dataGrouping.los) : Math.ceil((new Date(dataGrouping.tanggal_pulang) - new Date(dataGrouping.tanggal_masuk)) / (1000 * 3600 * 24))))
                                                    : Math.ceil((new Date(dataGrouping.tanggal_pulang) - new Date(dataGrouping.tanggal_masuk)) / (1000 * 3600 * 24))}

                                                onValueChange={handleValueChange}
                                                locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                showSymbol
                                                prefix="" // Adds the Rp prefix to the input value
                                                min={0} // Optional: Set a minimum value
                                                max={100000000} // Optional: Set a maximum value
                                                name='los'
                                                inputClassName='col-sm-3 ml-2'
                                                readOnly
                                            />  </td>
                                        <td style={{ textAlign: 'right', paddingRight: '15px', fontSize: '1rem' }}>Berat Lahir(gram)</td>
                                        <td style={{ fontSize: '1rem' }}>
                                            <InputText
                                                name="beratLahir"
                                                value={beratLahir}
                                                onChange={(e) => setBeratLahir(e.target.value)}
                                                className='ml-2 col-sm-3'
                                            />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='pl-2' style={{ fontSize: '1rem' }}>ADL Score</td>
                                        <td colSpan="2" style={{ fontSize: '1rem' }}>
                                            <table style={{ border: 'none', width: '100%' }} className='ml-2'>
                                                <tr>
                                                    <td style={{ fontSize: '1rem' }}>
                                                        Sub Acute : {dataGrouping ? (dataGrouping.adl_sub_acute ? parseFloat(dataGrouping.adl_sub_acute) : '-') : '-'}
                                                    </td>
                                                    <td style={{ fontSize: '1rem' }}>
                                                        Chronic : {dataGrouping ? (dataGrouping.adl_chronic ? parseFloat(dataGrouping.adl_chronic) : '-') : '-'}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '15px', fontSize: '1rem' }}>Cara Pulang</td>
                                        <td style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12" style={{ paddingRight: '20px', borderBottomColor: 'white', height: '60px' }}>
                                                <Dropdown
                                                    value={selectedCaraPulang}
                                                    onChange={(e) => setCaraPulang(e.value)}
                                                    options={caraPulang}
                                                    optionLabel="name"
                                                    placeholder="Pilih Cara Pulang"
                                                    className="custom-dropdown"
                                                    style={{ width: '250px' }}
                                                />
                                            </div>
                                            {/* <Dropdown value={selectedCaraPulang} onChange={(e) => setCaraPulang(e.value)} options={caraPulang} optionLabel="name"
                                                placeholder="Pilih Cara Pulang" className="ml-2 custom-dropdown"
                                                /> */}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='pl-2' style={{ fontSize: '1rem' }}>DPJP</td>
                                        <td colSpan={2} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12" style={{ borderBottomColor: 'white', height: '60px' }}>
                                                <Dropdown
                                                    value={selectedDPJP}
                                                    onChange={(e) => setDPJP(e.value)}
                                                    options={DPJP}
                                                    optionLabel="nmdpjp"
                                                    placeholder="Pilih DPJP"
                                                    className="ml-2 custom-dropdown"
                                                    style={{ width: '250px' }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '15px', fontSize: '1rem' }}>Jenis Tarif</td>
                                        <td style={{ fontSize: '1rem' }}><input type="text" className="col-sm-11 ml-2 " name='nama_tarifinacbgs_1' value={profils.nama_tarifinacbgs_1} /></td>
                                    </tr>
                                    <tr>
                                        <td className='pl-2' style={{ fontSize: '1rem' }}>Pasien TB</td>
                                        <td colSpan={3} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-1">
                                                        <Checkbox
                                                            value="true"
                                                            name="pasien_tb"
                                                            checked={pasienTB}
                                                            onChange={handleCheckboxChange} />
                                                        <label htmlFor="ingredient1" className="ml-2" style={{ fontSize: '1rem' }}>Ya</label>
                                                    </div>
                                                    <div className="col-sm-11">
                                                        {pasienTB && (
                                                            <>
                                                                <div className='col-sm-12' style={{ fontSize: '1rem' }}>
                                                                    <input
                                                                        type="text"
                                                                        name="nomorRegister"
                                                                        value={nomorRegister}
                                                                        onChange={(e) => setNomorRegister(e.target.value)}
                                                                        placeholder="Nomor Register"
                                                                    />
                                                                    <button className='ml-1 btn btn-primary' onClick={handleValidate}>Validasi</button>

                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>



                                        </td>
                                    </tr>
                                </table>
                                {/* Tarif Rumah Sakit */}
                                <table className='table table-borderless' style={{ border: ' 1px solid black', width: '100%' }}>
                                    <tr style={{ border: ' 1px solid black' }}>
                                        <td colSpan={3} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12 text-center">
                                                <span className="mr-2 font-bold" style={{ fontSize: '1rem' }}>Tarif Rumah Sakit :</span>
                                                <span style={{ fontSize: "20px", color: total.total == total_simrs ? 'black' : 'red' }}
                                                    className='font-bold'
                                                    data-pr-tooltip={total.total == total_simrs ? "Tarif Sudah Sesuai" : "Tarif Rumah Sakit Tidak Sesuai"}

                                                >
                                                    <FormatRupiah value={total.total}

                                                    />
                                                </span>

                                                {/* Question Icon with Tooltip */}
                                                <FontAwesomeIcon
                                                    icon={faQuestionCircle}
                                                    style={{ fontSize: "20px", color: total.total == total_simrs ? 'black' : 'red', cursor: 'pointer', marginLeft: '10px' }}
                                                    className="question-icon" // Menambahkan kelas khusus untuk target Tooltip
                                                    data-pr-tooltip={total.total == total_simrs ? "Tarif Sudah Sesuai" : "Tarif Rumah Sakit Tidak Sesuai"}
                                                />

                                                {/* <InputNumber
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
                                                 */}
                                                <span className='ml-3 font-bold' style={{ fontSize: '1rem' }}>
                                                    Tarif SIMRS :

                                                </span>
                                                {/* <span
                                                    style={{ fontSize: "20px", color: 'blue', textDecoration: 'underline' }}
                                                    className='ml-3 font-bold'
                                                    onClick={() => setVisible(true)}
                                                    title="Klik untuk melihat Rincian Tagihan SIMRS"
                                                >
                                                    <FormatRupiah value={total_simrs} />
                                                </span> */}

                                                {/* Text with FormatRupiah */}
                                                <span
                                                    style={{ fontSize: "20px", color: 'blue', textDecoration: 'underline' }}
                                                    className='ml-3 font-bold'
                                                    onClick={() => setVisible(true)}
                                                    data-pr-tooltip="Klik untuk melihat Rincian Tagihan SIMRS"
                                                >
                                                    <FormatRupiah value={total_simrs} />
                                                </span>

                                                {/* Question Icon with Tooltip */}
                                                <FontAwesomeIcon
                                                    icon={faQuestionCircle}
                                                    style={{ fontSize: "20px", color: 'blue', cursor: 'pointer', marginLeft: '10px' }}
                                                    className="question-icon" // Menambahkan kelas khusus untuk target Tooltip
                                                    data-pr-tooltip="Klik untuk melihat Rincian Tagihan SIMRS"
                                                />


                                                {/* Tooltip component */}
                                                <Tooltip target=".font-bold" />
                                                <Tooltip target=".question-icon" />
                                                {/* Dialog */}
                                                <Dialog header="Rincian Tagihan SIMRS" visible={visible} maximizable style={{ width: '50vw', height: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                                                    {console.log("pembayaranpelayanan", pembayaranPelayanans)}
                                                    <iframe
                                                        src={pembayaranPelayanans !== null ? `http://192.168.214.229/rswb/rswb_new/index.php?r=billingKasir/pembayaranTagihanPasien/cetakGabung&pembayaranpelayanan_id=${pembayaranPelayanans.pembayaranpelayanan_id}` : `http://192.168.214.229/rswb/rswb_new/index.php?r=billingKasir/PembayaranTagihanPasien/PrintRincianBelumBayar&instalasi_id=2&pendaftaran_id=${pendaftarans.pendaftaran_id}&pasienadmisi_id=&caraPrint=PRINT`}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: "none" }}
                                                    ></iframe>
                                                </Dialog>
                                            </div>

                                        </td>
                                    </tr>
                                    {kelasEksekutif && (
                                        <tr>
                                            <td width={"35%"} style={{ fontSize: '1rem' }}>
                                                <div className="col-sm-12">
                                                    <div className="row">
                                                        <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>
                                                            Poli Eksekutif
                                                        </div>
                                                        <div className="col-sm-7" style={{ fontSize: '1rem' }}>
                                                            <InputNumber
                                                                value={parseFloat(tarifs.tarif_poli_eks) || 0}
                                                                onValueChange={handleValueChange}
                                                                mode="currency"
                                                                currency="IDR"
                                                                locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                                showSymbol
                                                                prefix="" // Adds the Rp prefix to the input value
                                                                min={0} // Optional: Set a minimum value
                                                                max={100000000} // Optional: Set a maximum value
                                                                name='tarif_poli_eks'
                                                                inputClassName='ml-2 form-control'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </td>
                                            <td width={"35%"}>

                                            </td>
                                            <td width={"30%"}>

                                            </td>
                                        </tr>
                                    )}
                                    {/* Procedur Non Bedah */}


                                    <tr>
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>
                                                        Prosedur Non Bedah
                                                    </div>
                                                    <div className="col-sm-7" style={{ fontSize: '1rem' }}>
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
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>
                                                        Prosedur Bedah
                                                    </div>
                                                    <div className="col-sm-7" style={{ fontSize: '1rem' }}>
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
                                        <td width={"30%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>
                                                        Konsultasi
                                                    </div>
                                                    <div className="col-sm-7" style={{ fontSize: '1rem' }}>
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
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Tenaga Ahli</div>
                                                    <div className="col-sm-7" style={{ fontSize: '1rem' }}>
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
                                                            style={{ fontSize: '1rem' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Keperawatan</div>
                                                    <div className="col-sm-7" style={{ fontSize: '1rem' }}>
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
                                                            style={{ fontSize: '1rem' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Penunjang</div>
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
                                                            style={{ fontSize: '1rem' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Radiologi</div>
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
                                                            style={{ fontSize: '1rem' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Laboratorium</div>
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
                                                            style={{ fontSize: '1rem' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Pelayanan Darah</div>
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
                                                            style={{ fontSize: '1rem' }}
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
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Rehabilitasi</div>
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
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Kamar / Akomodasi</div>
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
                                                            style={{ fontSize: '1rem' }}
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"30%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Rawat Intensif</div>
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
                                                            style={{ fontSize: '1rem' }}
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
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Obat</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.obat)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            style={{ fontSize: '1rem' }}
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
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Obat Kronis</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.obatkronis)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            style={{ fontSize: '1rem' }}
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
                                        <td width={"30%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Obat Kemoterapi</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.obatkemoterapi)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            style={{ fontSize: '1rem' }}
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
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Alkes</div>
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
                                                            style={{ fontSize: '1rem' }}
                                                            inputClassName='ml-2 form-control'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td width={"35%"} style={{ fontSize: '1rem' }}>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>BMHP</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.bmhp)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            style={{ fontSize: '1rem' }}
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
                                                    <div className="col-sm-5 font-bold" style={{ alignContent: 'center', fontSize: '1rem' }}>Sewa Alat</div>
                                                    <div className="col-sm-7">
                                                        <InputNumber
                                                            value={parseFloat(obats.sewaalat | 0)}
                                                            onValueChange={handleValueChange}
                                                            mode="currency"
                                                            currency="IDR"
                                                            locale="id-ID" // Set the locale for Indonesia (Rupiah)
                                                            showSymbol
                                                            style={{ fontSize: '1rem' }}
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
                                <div className='text-center' style={{ fontSize: '1rem' }}><Checkbox defaultChecked></Checkbox> Menyatakan benar bahwa data tarif yang tersebut di atas adalah benar sesuai dengan kondisi yang sesungguhnya.</div>
                                <TabView>
                                    <TabPanel header="Coding UNU Grouper">
                                        <div className="p-datatable-header">
                                            {
                                                header
                                            }
                                        </div>
                                        <table className="table table-border"  >
                                            <thead className='p-datatable-thead' style={{ fontSize: '1rem' }}>
                                                <tr>
                                                    <th width={'1%'}>No</th>
                                                    {/* <th>Tgl. Diagnosa <br />/ Dokter<br /> / Jenis Kasus</th> */}
                                                    <th width={'70%'}>Diagnosa Nama</th>
                                                    <th width={'10%'}>Diagnosa Kode</th>
                                                    <th>Kelompok Diagnosa</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataDiagnosa.map((row, index) => (
                                                    <tr key={index}>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            {index + 1}
                                                        </td>
                                                        <td style={{ display: 'none', fontSize: '1rem' }}>
                                                            {console.log(row.tgl_pendaftaran)}
                                                            <Calendar
                                                                value={formatDateTime(row.tgl_pendaftaran)} // Pass a valid Date object
                                                                //  value={row.tgl_pendaftaran} 
                                                                onChange={(e) => handleInputChangeRow(index, 'tgl_pendaftaran', e.target.value, 'unu')}
                                                                showTime
                                                                name={`[PasienmorbiditasT][${index}][tglmorbiditas]`}
                                                                id={`tglmorbiditas_${index}`}
                                                            />
                                                            <br />
                                                            <Dropdown
                                                                value={row.pegawai_id} onChange={(e) => handleInputChangeRow(index, 'pegawai_id', e.target.value, 'unu')}
                                                                options={pegawai} optionLabel="nmdpjp"
                                                                optionValue="pegawai_id"
                                                                placeholder="Pilih DPJP"
                                                                filter={true} // Enables the search filter
                                                                filterBy="nmdpjp"
                                                                name={`[PasienmorbiditasT][${index}][pegawai_id]`}
                                                                id={`pegawai_id_${index}`}
                                                                style={{ width: '250px', fontSize: '1rem' }}
                                                            />
                                                            <br />
                                                            <Dropdown
                                                                value={row.kasusdiagnosa} onChange={(e) => handleInputChangeRow(index, 'kasusdiagnosa', e.target.value, 'unu')}
                                                                options={jenisKasus} optionLabel="name"
                                                                style={{ fontSize: '1rem' }}
                                                                placeholder="Pilih Jenis Kasus Penyakit"
                                                                filter={true} // Enables the search filter
                                                                filterBy="name"
                                                                name={`[PasienmorbiditasT][${index}][kasusdiagnosa]`}
                                                                id={`kasusdiagnosa_${index}`}
                                                            />
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <AutoComplete
                                                                value={row.diagnosa_nama}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsCode}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteRow(index, 'diagnosa_nama', e.value, 'unu')}
                                                                name={`[PasienmorbiditasT][${index}][diagnosa_nama]`}
                                                                id={`diagnosa_nama_${index}`}
                                                                onSelect={(e) => updateRow(index, e.value, 'unu')}  // Update input field
                                                                // loading={loading}
                                                                minLength={3}
                                                                inputClassName='full-width-autocomplete'
                                                                placeholder="Enter Diagnosa Nama"
                                                                itemTemplate={(item) => (
                                                                    <div>
                                                                        <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                    </div>
                                                                )}
                                                            />
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <input
                                                                type="hidden"
                                                                value={row.diagnosa_id}
                                                                onChange={(e) => handleInputChange(index, 'diagnosa_id', e.target.value, 'unu')}
                                                                name={`[PasienmorbiditasT][${index}][diagnosa_id]`}
                                                                id={`diagnosa_id_${index}`}
                                                            />
                                                            <input
                                                                type="hidden"
                                                                value={row.pasienmorbiditas_id}
                                                                onChange={(e) => handleInputChange(index, 'pasienmorbiditas_id', e.target.value, 'unu')}
                                                                name={`[PasienmorbiditasT][${index}][pasienmorbiditas_id]`}
                                                                id={`pasienmorbiditas_id_${index}`}
                                                            />
                                                            <AutoComplete
                                                                value={row.diagnosa_kode}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsCode}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteRow(index, 'diagnosa_kode', e.value, 'unu')}
                                                                name={`[PasienmorbiditasT][${index}][diagnosa_kode]`}
                                                                id={`diagnosa_kode_${index}`}
                                                                onSelect={(e) => updateRow(index, e.value, 'unu')}  // Update input field
                                                                // loading={loading}
                                                                minLength={3}
                                                                placeholder="Enter Diagnosa Kode"
                                                                itemTemplate={(item) => (
                                                                    <div>
                                                                        <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                    </div>
                                                                )}
                                                            />

                                                        </td>

                                                        <td style={{ fontSize: '1rem' }}>
                                                            <Dropdown
                                                                value={row.kelompokdiagnosa_id}
                                                                onChange={(e) => handleInputChangeRow(index, 'kelompokdiagnosa_id', e.target.value, 'unu')}
                                                                options={kelompokDiagnosa} optionLabel="name"
                                                                optionValue="value"
                                                                placeholder="Pilih Kelompok Diagnosa"
                                                                name={`[PasienmorbiditasT][${index}][kelompokdiagnosa_id]`}
                                                                id={`kelompokdiagnosa_id_${index}`}
                                                            />
                                                        </td>
                                                        <td style={{ textAlign: 'center', fontSize: '1rem' }}>
                                                            <button type="button" onClick={() => removeRow(index, 'unu')} >
                                                                <FontAwesomeIcon icon={faTrashCan} />
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
                                            <thead className='p-datatable-thead' style={{ fontSize: '1rem' }}>
                                                <tr>
                                                    <th>No</th>
                                                    <th width={'80%'}>Diagnosa Nama</th>
                                                    <th>Diagnosa Kode</th>
                                                    {/* <th>Kelompok Diagnosa</th> */}
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataIcd9cm.map((row, index) => (
                                                    <tr key={index}>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            {index + 1}
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <AutoComplete
                                                                value={row.diagnosaicdix_nama}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsIX}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteIXRow(index, 'diagnosaicdix_nama', e.value, 'icdixunu')}
                                                                name={`[Pasienicd9cmT][${index}][diagnosaicdix_nama]`}
                                                                id={`diagnosaicdix_nama_${index}`}
                                                                onSelect={(e) => updateIXRow(index, e.value, 'icdixunu')}  // Update input field
                                                                // loading={loading}
                                                                minLength={3}
                                                                inputClassName='full-width-autocomplete'

                                                                placeholder="Enter Diagnosa Nama"
                                                                itemTemplate={(item) => (
                                                                    <div>
                                                                        <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                    </div>
                                                                )}
                                                            />
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <input
                                                                type="hidden"
                                                                value={row.diagnosaicdix_id}
                                                                onChange={(e) => handleInputChange(index, 'diagnosaicdix_id', e.target.value)}
                                                                name={`[Pasienicd9cmT][${index}][diagnosaicdix_id]`}
                                                                id={`diagnosaicdix_id_${index}`}
                                                            />
                                                            <input
                                                                type="hidden"
                                                                value={row.pasienicd9cm_id}
                                                                onChange={(e) => handleInputChange(index, 'pasienicd9cm_id', e.target.value)}
                                                                name={`[Pasienicd9cmT][${index}][pasienicd9cm_id]`}
                                                                id={`pasienicd9cm_id_${index}`}
                                                            />
                                                            <AutoComplete
                                                                value={row.diagnosaicdix_kode}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsCodeIX}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteIXRow(index, 'diagnosaicdix_kode', e.value, 'icdixunu')}
                                                                name={`[Pasienicd9cmT][${index}][diagnosaicdix_kode]`}
                                                                id={`diagnosaicdix_kode_${index}`}
                                                                onSelect={(e) => updateIXRow(index, e.value, 'icdixunu')}  // Update input field
                                                                // loading={loading}
                                                                minLength={3}
                                                                placeholder="Enter Diagnosa Kode"
                                                                itemTemplate={(item) => (
                                                                    <div>
                                                                        <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                    </div>
                                                                )}
                                                            />

                                                        </td>

                                                        {/* <td>
                                                            <Dropdown
                                                                value={row.kelompokdiagnosa_id}
                                                                onChange={(e) => handleInputChangeRow(index, 'kelompokdiagnosa_id', e.target.value, 'icdix')}
                                                                options={kelompokDiagnosa} optionLabel="name"
                                                                optionValue="value"
                                                                placeholder="Pilih Kelompok Diagnosa"
                                                                name={`[Pasienicd9cmT][${index}][kelompokdiagnosa_id]`}
                                                                id={`kelompokdiagnosa_id_${index}`}
                                                            />

                                                        </td> */}
                                                        <td style={{ textAlign: 'center', fontSize: '1rem' }}>
                                                            <button type="button" onClick={() => removeRowIX(index, 'icdixunu')}>
                                                                <FontAwesomeIcon icon={faTrashCan} />
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
                                                headerINA
                                            }
                                        </div>
                                        <table className="p-datatable-table">
                                            <thead className='p-datatable-thead' style={{ fontSize: '1rem' }}>
                                                <tr>
                                                    <th width={'1%'}>No</th>
                                                    {/* <th>Tgl. Diagnosa <br />/ Dokter<br /> / Jenis Kasus</th> */}
                                                    <th width={'70%'}>Diagnosa Nama</th>
                                                    <th width={'10%'}>Diagnosa Kode</th>
                                                    <th>Kelompok Diagnosa</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataDiagnosaINA.map((row, index) => (
                                                    <tr key={index}>
                                                        <td style={{ textAlign: 'center', fontSize: '1rem' }}>
                                                            {index + 1}
                                                        </td>
                                                        <td style={{ display: 'none' }}>
                                                            <Calendar
                                                                value={formatDateTime(row.tgl_pendaftaran)} // Pass a valid Date object
                                                                //  value={row.tgl_pendaftaran} 
                                                                onChange={(e) => handleInputChangeRow(index, 'tgl_pendaftaran', e.target.value, 'ina')}
                                                                showTime
                                                                name={`[PasienmorbiditasTINA][${index}][tglmorbiditas]`}
                                                                id={`tglmorbiditas_${index}`}
                                                            />
                                                            <br />
                                                            <Dropdown
                                                                value={row.pegawai_id} onChange={(e) => handleInputChangeRow(index, 'pegawai_id', e.target.value, 'ina')}
                                                                options={pegawai} optionLabel="nmdpjp"
                                                                optionValue="pegawai_id"
                                                                placeholder="Pilih DPJP"
                                                                filter={true} // Enables the search filter
                                                                filterBy="nmdpjp"
                                                                name={`[PasienmorbiditasTINA][${index}][pegawai_id]`}
                                                                id={`pegawai_id_${index}`}
                                                                style={{ width: '250px' }}
                                                            />
                                                            <br />
                                                            <Dropdown
                                                                value={row.kasusdiagnosa} onChange={(e) => handleInputChangeRow(index, 'kasusdiagnosa', e.target.value, 'ina')}
                                                                options={jenisKasus} optionLabel="name"
                                                                placeholder="Pilih Jenis Kasus Penyakit"
                                                                filter={true} // Enables the search filter
                                                                filterBy="name"
                                                                name={`[PasienmorbiditasTINA][${index}][kasusdiagnosa]`}
                                                                id={`kasusdiagnosa_${index}`}
                                                            />
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <AutoComplete
                                                                value={row.diagnosa_nama}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsCode}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteRow(index, 'diagnosa_nama', e.value, 'ina')}
                                                                name={`[PasienmorbiditasTINA][${index}][diagnosa_nama]`}
                                                                id={`diagnosa_nama_${index}`}
                                                                onSelect={(e) => updateRow(index, e.value, 'ina')}  // Update input field
                                                                // loading={loading}
                                                                minLength={3}
                                                                placeholder="Enter Diagnosa Nama"
                                                                inputClassName='full-width-autocomplete'

                                                                itemTemplate={(item) => (
                                                                    <div>
                                                                        <span>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                    </div>
                                                                )}
                                                            />
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <input
                                                                type="hidden"
                                                                value={row.diagnosa_id}
                                                                onChange={(e) => handleInputChangeRow(index, 'diagnosa_id', e.target.value, 'ina')}
                                                                name={`[PasienmorbiditasTINA][${index}][diagnosa_id]`}
                                                                id={`diagnosa_id_${index}`}
                                                            />
                                                            <AutoComplete
                                                                value={row.diagnosa_kode}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsCode}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteRow(index, 'diagnosa_kode', e.value, 'ina')}
                                                                name={`[PasienmorbiditasTINA][${index}][diagnosa_kode]`}
                                                                id={`diagnosa_kode_${index}`}
                                                                onSelect={(e) => updateRow(index, e.value, 'ina')}  // Update input field
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

                                                        <td style={{ fontSize: '1rem' }}>
                                                            <Dropdown
                                                                value={row.kelompokdiagnosa_id}
                                                                onChange={(e) => handleInputChangeRow(index, 'kelompokdiagnosa_id', e.target.value, 'ina')}
                                                                options={kelompokDiagnosa} optionLabel="name"
                                                                optionValue="value"
                                                                placeholder="Pilih Kelompok Diagnosa"
                                                                name={`[PasienmorbiditasTINA][${index}][kelompokdiagnosa_id]`}
                                                                id={`kelompokdiagnosa_id_${index}`}
                                                            />
                                                        </td>
                                                        <td style={{ textAlign: 'center', fontSize: '1rem' }}>
                                                            <button type="button" onClick={() => removeRow(index, 'ina')}>
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="p-datatable-header mt-5">
                                            {
                                                headerInaICDIX
                                            }
                                        </div>
                                        <table className="p-datatable-table ">
                                            <thead className='p-datatable-thead' style={{ fontSize: '1rem' }}>
                                                <tr>
                                                    <th>No</th>
                                                    <th width={'80%'}>Diagnosa Nama</th>
                                                    <th>Diagnosa Kode</th>
                                                    {/* <th>Kelompok Diagnosa</th> */}
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataIcd9cmINA.map((row, index) => (
                                                    <tr key={index}>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            {index + 1}
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <AutoComplete
                                                                value={row.diagnosaicdix_nama}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsIX}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteIXRow(index, 'diagnosaicdix_nama', e.value, 'icdixina')}
                                                                name={`[Pasienicd9cmTINA][${index}][diagnosaicdix_nama]`}
                                                                id={`diagnosaicdix_nama_${index}`}
                                                                onSelect={(e) => updateIXRow(index, e.value, 'icdixina')}  // Update input field
                                                                // loading={loading}
                                                                inputClassName='full-width-autocomplete'
                                                                minLength={3}
                                                                placeholder="Enter Diagnosa Nama"
                                                                itemTemplate={(item) => (
                                                                    <div>
                                                                        <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                    </div>
                                                                )}
                                                            />
                                                        </td>
                                                        <td style={{ fontSize: '1rem' }}>
                                                            <input
                                                                type="hidden"
                                                                value={row.diagnosaicdix_id}
                                                                onChange={(e) => handleInputChange(index, 'diagnosaicdix_id', e.target.value)}
                                                                name={`[Pasienicd9cmTINA][${index}][diagnosaicdix_id]`}
                                                                id={`diagnosaicdix_id_${index}`}
                                                            />
                                                            <input
                                                                type="hidden"
                                                                value={row.pasienicd9cm_id}
                                                                onChange={(e) => handleInputChange(index, 'pasienicd9cm_id', e.target.value)}
                                                                name={`[Pasienicd9cmTINA][${index}][pasienicd9cm_id]`}
                                                                id={`pasienicd9cm_id_${index}`}
                                                            />
                                                            <AutoComplete
                                                                value={row.diagnosaicdix_kode}
                                                                suggestions={suggestions}
                                                                completeMethod={fetchSuggestionsCodeIX}
                                                                field="name"
                                                                onChange={(e) => handleInputChangeAutocompleteIXRow(index, 'diagnosaicdix_kode', e.value, 'icdixina')}
                                                                name={`[Pasienicd9cmTINA][${index}][diagnosaicdix_kode]`}
                                                                id={`diagnosaicdix_kode_${index}`}
                                                                onSelect={(e) => updateIXRow(index, e.value, 'icdixina')}  // Update input field
                                                                // loading={loading}
                                                                minLength={3}
                                                                placeholder="Enter Diagnosa Kode"
                                                                itemTemplate={(item) => (
                                                                    <div>
                                                                        <span style={{ fontSize: '1rem' }}>{item.label} ({item.value})</span>  {/* Custom template to display both label and value */}
                                                                    </div>
                                                                )}
                                                            />

                                                        </td>

                                                        {/* <td>
                                                            <Dropdown
                                                                value={row.kelompokdiagnosa_id}
                                                                onChange={(e) => handleInputChangeRow(index, 'kelompokdiagnosa_id', e.target.value, 'icdix')}
                                                                options={kelompokDiagnosa} optionLabel="name"
                                                                optionValue="value"
                                                                placeholder="Pilih Kelompok Diagnosa"
                                                                name={`[Pasienicd9cmT][${index}][kelompokdiagnosa_id]`}
                                                                id={`kelompokdiagnosa_id_${index}`}
                                                            />

                                                        </td> */}
                                                        <td style={{ textAlign: 'center', fontSize: '1rem' }}>
                                                            <button type="button" onClick={() => removeRowIX(index, 'icdixina')}>
                                                                <FontAwesomeIcon icon={faTrashCan} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </TabPanel>
                                </TabView>
                                <div className="row mt-5">
                                    <hr />
                                    <div className="col-sm-12" style={{ textAlign: 'center', fontSize: '1rem' }}>
                                        <div>Data Klinis</div>
                                    </div>
                                    <hr />
                                    <div className="col-sm-12 mb-3" style={{ textAlign: 'center', fontSize: '1rem' }}>
                                        <div>Tekanan Darah (mmHg) :</div>
                                    </div>
                                    <div className="col-sm-6" style={{ textAlign: 'right', fontSize: '1rem' }}>
                                        <InputText
                                            id="sistole"
                                            name="sistole"
                                            value={sistole}
                                            onChange={(e) => setSistole(e.target.value)}
                                            style={{ width: '150px', textAlign: 'center' }}
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <InputText

                                            id="diastole"
                                            name="diastole"
                                            value={diastole}
                                            onChange={(e) => setDiastole(e.target.value)}
                                            style={{ width: '150px', textAlign: 'center', fontSize: '1rem' }}
                                        />
                                    </div>
                                    <div className="col-sm-6" style={{ textAlign: 'right' }}>
                                        <div style={{ float: 'right', width: '150px', textAlign: 'center', fontSize: '1rem' }}>
                                            <label>Sistole</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div style={{ float: 'left', width: '150px', textAlign: 'center', fontSize: '1rem' }}>
                                            <label>Diastole</label>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-md-6 d-flex mb-3 mt-5">
                                {!dataFinalisasi.is_finalisasi  && (
                                        <>
                                            <button className="btn btn-primary" style={{ float: 'right' }} onClick={handleSimpanKlaim}>
                                                Simpan
                                            </button>
                                            <button className="btn btn-primary ml-2" style={{ float: 'right' }} onClick={handleSimpanGroupingStage1}>
                                                Groupper
                                            </button>
                                            <button className="btn btn-danger ml-2" style={{ float: 'right' }} onClick={handleHapusKlaim}>
                                                Hapus Klaim
                                            </button>
                                        </>
                                    )}

                                </div>

                                {/*  Hasil Grouping */}

                                {console.log("Data Finalisasi", dataFinalisasi.is_finalisasi)}
                                <div style={{ display: hide === true ? 'none' : 'block' }}>
                                    <table className='table table-bordered' style={{ border: ' 1px solid black', width: '100%' }}>
                                        <tbody>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fb9002' : '#ffff' }}>
                                                <td colSpan={4}><p className='text-center font-bold' style={{ color: 'black', fontSize: '19px' }}>Hasil Grouper E-Klaim v5 </p></td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }}  >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Info</td>
                                                <td width={"35%"} style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }} colSpan={3}>{dataGrouping.coder_nm} @ {dataFinalisasi.is_finalisasi ? formatDateGroup(dataFinalisasi.create_time) : "-"} <FontAwesomeIcon icon={faEllipsis} /> Kelas {dataGrouping.kelas_rs}  <FontAwesomeIcon icon={faEllipsis} /> Tarif : {dataGrouping.kode_tarif === 'CS' ? 'TARIF RS KELAS C SWASTA' : ''}</td>


                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Jenis Rawat</td>
                                                <td width={"35%"} style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }} colSpan={3}>Rawat Jalan Regular </td>

                                            </tr >
                                            {/* <tr>
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
                                            </tr> */}
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Group</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {console.log("Yest", dataGrouper)}
                                                    {dataGrouper.group_description !== "-" ? dataGrouper.group_description : (dataGrouping.grouper !== null) ? ((dataGrouping.grouper.response !== null) ? dataGrouping.grouper.response.cbg.description : '-') : '-'}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'center', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.group_code !== "-" ? dataGrouper.group_code : (dataGrouping.grouper !== null) ? ((dataGrouping.grouper.response !== null) ? dataGrouping.grouper.response.cbg.code : '-') : '-'}

                                                    {/* {dataGrouper.group_code} */}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}>
                                                    <FormatRupiah
                                                        value={dataGrouper.group_tarif
                                                            ? dataGrouper.group_tarif
                                                            : dataGrouping.grouper && dataGrouping.grouper.response && dataGrouping.grouper.response.cbg.base_tariff !== undefined
                                                                ? dataGrouping.grouper.response.cbg.base_tariff
                                                                : 0
                                                        }
                                                    />

                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Sub Acute</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.sub_acute_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'center', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.sub_acute_code}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}>
                                                    <FormatRupiah value={dataGrouper.sub_acute_tarif} />
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Chronic</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.chronic_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'center', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.chronic_code}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}>
                                                    <FormatRupiah value={dataGrouper.chronic_tarif} />
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Special Procedure</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_procedure_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'center', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_procedure_code}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}>
                                                    <FormatRupiah value={dataGrouper.special_procedure_tarif} />
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Special Prosthesis</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_prosthesis_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'center', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_prosthesis_code}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}>
                                                    <FormatRupiah value={dataGrouper.special_prosthesis_tarif} />
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Special Investigation</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_investigation_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'center', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_investigation_code}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}>
                                                    <FormatRupiah value={dataGrouper.special_investigation_tarif} />
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Special Drug</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_drug_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'center', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouper.special_drug_code}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}>
                                                    <FormatRupiah value={dataGrouper.special_drug_tarif} />
                                                </td>
                                            </tr>
                                            {dataFinalisasi.is_finalisasi && (
                                                <>
                                                    <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                        <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Status DC Kemkes</td>
                                                        <td colSpan={3} style={{ fontSize: '1rem', color: (dataGrouping.kemenkes_dc_status_cd === "unsent" || dataGrouper.kemenkes_dc_status_cd === "unset") ? "#b70404" : "black" }}>
                                                            <b>

                                                                {dataGrouper.kemenkes_dc_status_cd ? dataGrouper.kemenkes_dc_status_cd :
                                                                    (dataGrouping.kemenkes_dc_status_cd === "unsent") ?
                                                                        "Klaim belum terkirim ke Pusat Data Kementerian Kesehatan" : "Terkirim"}

                                                            </b>
                                                        </td>
                                                    </tr>
                                                </>
                                            )}


                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Status Klaim</td>
                                                <td colSpan={3} style={{ textAlign: 'left', color: 'black' }}>
                                                    {(dataGrouper.klaim_status_cd) ? dataGrouper.klaim_status_cd : dataGrouping.klaim_status_cd}</td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >

                                                <td width={"30%"} style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }} colSpan={3}>Total</td>
                                                {/* {console.log("Data ",dataGrouping.grouper.tarif_alt.filter(item => item.kelas.includes(`kelas_${datas.klsRawat.klsRawatHak}`))[0].tarif_inacbg)} */}
                                                <td width={"30%"} style={{ textAlign: 'right', color: 'black', fontSize: '1rem' }}><FormatRupiah value={(totalGrouper.total) ? totalGrouper.total : (dataGrouping.grouper !== null) ? ((dataGrouping.grouper.tarif_alt !== null) ? dataGrouping.grouper.tarif_alt.filter(item => item.kelas.includes(`kelas_${datas.klsRawat.klsRawatHak}`))[0].tarif_inacbg : 0) : 0} /> </td>

                                            </tr>

                                        </tbody>

                                    </table>
                                    <table className='table table-bordered' style={{ border: ' 1px solid black', width: '100%', backgroundColor: dataFinalisasi.is_finalisasi ? '#fb9002' : '#ffff' }}>
                                        <tbody>
                                            <tr>
                                                <td colSpan={4}><p className='text-center font-bold' style={{ color: 'black', fontSize: '19px' }}>Hasil Grouper E-Klaim v6 </p></td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>Info</td>
                                                <td width={"35%"} style={{ textAlign: 'left', color: 'black', fontSize: '1rem' }} colSpan={3} >{dataGrouping.coder_nm} @ {formatDateGroup(dataFinalisasi.create_time)}  <FontAwesomeIcon icon={faEllipsis} /> Kelas {dataGrouping.kelas_rs}  <FontAwesomeIcon icon={faEllipsis} /> Tarif : {dataGrouping.kode_tarif === 'CS' ? 'TARIF RS KELAS C SWASTA' : ''} </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', color: 'black', paddingLeft: '10px;', fontSize: '1rem' }}>Jenis Rawat</td>
                                                <td width={"35%"} style={{ textAlign: 'left', color: 'black', fontSize: '1rem' }} colSpan={3}>Rawat Jalan Regular </td>
                                            </tr>
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>MDC</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }} colSpan={2}>
                                                    {dataGrouperv6.mdc_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouperv6.mdc_number}
                                                </td>
                                            </tr >
                                            <tr style={{ backgroundColor: dataFinalisasi.is_finalisasi ? '#fde1a8' : '#ffff' }} >
                                                <td width={"15%"} style={{ textAlign: 'right', paddingLeft: '10px;', color: 'black', fontSize: '1rem' }}>DRG</td>
                                                <td width="35%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }} colSpan={2}>
                                                    {dataGrouperv6.drg_description}
                                                </td>
                                                <td width="30%" style={{ textAlign: 'left', paddingRight: '10px;', color: 'black', fontSize: '1rem' }}>
                                                    {dataGrouperv6.drg_code}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/* Button Finalisasi */}
                                    <div className="col-md-12 d-flex mb-3">
                                        {!dataFinalisasi.is_finalisasi && (
                                            <>
                                                <button className="btn btn-primary ml-2" onClick={handleSimpanFinalisasi}>
                                                    Finalisasi
                                                </button>
                                            </>
                                        )}

                                        {dataFinalisasi.is_finalisasi && (
                                            <>
                                                <button className="btn btn-secondary ml-2" onClick={handleCetak}>
                                                    Cetak Klaim
                                                </button>
                                                <button className="btn btn-secondary ml-2 " onClick={handleKirimOnlineKlaim}>
                                                    Kirim Online
                                                </button>

                                                <button className="btn btn-secondary ml-2 ms-auto" onClick={handleEditUlangKlaim}>
                                                    Edit Ulang Klaim
                                                </button>
                                            </>
                                        )}

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


        // Perform API request with axios
        const payload = {

            no_rekam_medik: datas.peserta.noMr,
            nama_pasien: datas.peserta.nama,
            nomor_kartu: datas.peserta.noKartu,
            noSep: datas.noSep,
            tgl_pulang: pendaftarans.tanggal_pulang,
            tgl_masuk: pendaftarans.tanggal_masuk,
            jenis_rawat: pendaftarans.jnspelayanan,
            kelas_rawat: datas.klsRawat.klsRawatHak,
            gender: datas.peserta.tglLahir,
            coder_nik: auth.user.coder_nik,
            nama_dokter: datas.dpjp.nmDPJP,
            kode_tarif: profils.kode_tarifinacbgs_1,
            kamar: tarifs.kamar_akomodasi,
            tenaga_ahli: tarifs.tenagaahli,
            prosedur_non_bedah: tarifs.prosedurenonbedah,
            prosedur_bedah: tarifs.prosedurebedah,
            konsultasi: tarifs.konsultasi,
            keperawatan: tarifs.keperawatan,
            penunjang: tarifs.penunjang,
            radiologi: tarifs.radiologi,
            laboratorium: tarifs.laboratorium,
            pelayanan_darah: tarifs.pelayanandarah,
            rehabilitasi: tarifs.rehabilitasi,
            rawat_intensif: tarifs.rawatintensif,
            obat: obats.obat,
            obat_kronis: obats.obatkronis,
            obat_kemoterapi: obats.obatkemoterapi,
            alkes: obats.alkes,
            bmhp: obats.bmhp,
            sewa_alat: obats.sewaalat,
            payor_id: 3,
            diagnosa: `${dataDiagnosa.map(item => item.diagnosa_kode).join('#')}`,
            procedure: `${dataIcd9cm.map(item => item.diagnosaicdix_kode).join('#')}`,
            procedure_ix: JSON.stringify(dataIcd9cm),
            procedureina_ix: JSON.stringify(dataIcd9cmINA),

            diagnosa_array: JSON.stringify(dataDiagnosa),
            diagnosa_inagrouper: `${dataDiagnosaINA.map(item => item.diagnosa_kode).join('#')}`,
            procedure_inagrouper: `${dataIcd9cmINA.map(item => item.diagnosaicdix_kode).join('#')}`,
            diagnosaina_array: JSON.stringify(dataDiagnosaINA),
            carabayar_id: pendaftarans.carabayar_id,
            carabayar_nama: pendaftarans.carabayar_nama,
            carakeluar_id: selectedCaraPulang ? selectedCaraPulang : null,
            caramasuk_id: selectedCaraMasuk ? selectedCaraMasuk : null,
            pendaftaran_id: pendaftarans.pendaftaran_id,
            umur_pasien: pendaftarans.umur ? pendaftarans.umur : null,
            cob_cd: selectedCOB.code ? selectedCOB.code : null,
            berat_lahir: beratLahir,
            loginpemakai_id: auth.user.loginpemakai_id,
            total_tarif_rs: total.total,
            sistole: sistole,
            diastole: diastole,
            is_tb: pasienTB,
            nomor_register_sitb: nomorRegister,
            tarif_poli_eks: tarifs.tarif_poli_eks,
            adl_sub_acute: dataGrouping.adl_sub_acute ? dataGrouping.adl_sub_acute : 0,
            adl_chronic: dataGrouping.adl_chronic ? dataGrouping.adl_chronic : 0,
            los: dataGrouping.los ? dataGrouping.los : 0,
            jaminan_id: selectedJaminan
        };
        axios.post(route('updateNewKlaim'), payload)
            .then((response) => {
                // Handle the response from the backend

                console.log("Responses ", typeof response.data.success);
                if (Boolean(response.data.success) === false) {
                    toast.current.show({ severity: 'error', summary: response.data.message, detail: datas.noSep, life: 3000 });

                    // setInterval(() => {
                    //     handleNewClaim();
                    // }, 2000);

                } else {
                    toast.current.show({ severity: 'success', summary: `Data  Berhasil Di simpan`, detail: datas.noSep, life: 3000 });

                }
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
            loginpemakai_id: auth.user.loginpemakai_id,

        };
        axios.post(route('groupingStageSatu'), payload)
            .then((response) => {
                // console.log('Response:', response.data);
                setHide(false);
                if (Boolean(response.data[0].success) === false) {
                    toast.current.show({ severity: 'error', summary: response.data.message, detail: datas.noSep, life: 3000 });

                } else {
                    toast.current.show({ severity: 'success', summary: `Data  Berhasil Di Grouping`, detail: datas.noSep, life: 3000 });
                    // let grouping_res = {
                    //     group_description: response.data.data.cbg?.description || '-',
                    //     group_code : response.data.data.cbg?.code || '-',
                    //     group_tarif : response.data.data.cbg?.base_tariff || 0
                    // };
                    // setDataGrouper(grouping_res);
                    setDataGrouper((prevTotal) => ({
                        ...prevTotal,
                        group_description: response.data[0].data.response.cbg?.description || '-',
                        group_code: response.data[0].data.response.cbg?.code || '-',
                        group_tarif: response.data[0].data.response.cbg?.base_tariff || 0
                    }));
                    setDataGrouperv6(response.data[0].data.response_inagrouper);
                    // klaim_status_cd
                    setDataGrouping(response.data[1].data.data)
                    updateRowData(datas.noSep, response.data[1].data.data.tgl_masuk, response.data[1].data.data.tgl_pulang, response.data[1].data.data.jenis_rawat, response.data[0].data.response.cbg.code, response.data[1].data.data.klaim_status_cd, response.data[1].data.data.coder_nm)
                }

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // Function to filter by noSep and update tglSep
    const updateRowData = async (noSep, tglSep, tglPlgSep, tipe, cbg, status, petugas) => {
        console.log("Kicik")
        // Map through the model and update the tglSep where noSep matches
        const updatedModel = await models.map((item) => {
            if (item.noSep === noSep) {
                return { ...item, tglSep, tglPlgSep: tglPlgSep, tipe: tipe == "2" ? "RJ" : tipe, cbg: cbg, status: status, nama_pegawai: petugas }; // Update the tglSep for the matching row
            }
            return item; // Leave the rest unchanged
        });

        // Update the model state with the modified array
        setModels(updatedModel);
        // Show a success toast
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

                if (Boolean(response.data[0].success) === false) {
                    toast.current.show({ severity: 'error', summary: response.data[0].message, detail: datas.noSep, life: 3000 });

                } else {
                    toast.current.show({ severity: 'success', summary: `Data  Berhasil Di Hapus`, detail: datas.noSep, life: 3000 });
                    setExpandedRows(null);
                    resetRowData(datas.noSep);
                }

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // Function to filter by noSep and update tglSep
    const resetRowData = async (noSep) => {
        // Map through the model and update the tglSep where noSep matches
        const updatedModel = await models.map((item) => {
            if (item.noSep === noSep) {
                return { ...item,tipe:'',cbg: '', status: '', nama_pegawai: '' }; // Update the tglSep for the matching row
            }
            return item; // Leave the rest unchanged
        });

        // Update the model state with the modified array
        setModels(updatedModel);
        // Show a success toast
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


                toast.current.show({ severity: 'success', summary: `Data Berhasil Diunduh`, detail: datas.noSep, life: 3000 });

                // Mendapatkan file PDF yang diunduh
                const file = new Blob([response.data], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(file);
                link.download = `klaim_${datas.noSep}.pdf`; // Nama file PDF yang akan diunduh
                link.click(); // Memulai proses unduhan



            })
            .catch((error) => {
                console.error('Error:', error);
                toast.current.show({ severity: 'error', summary: 'Gagal Mengunduh', detail: 'Terjadi kesalahan saat mengunduh file PDF.', life: 3000 });
            });
    };

    const handleKirimOnlineKlaim = (e) => {
        e.preventDefault(); // Prevent page reload

        // console.log("Auth", auth);
        // console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        toast.current.show({ severity: 'success', summary: 'Comming Soon', detail: 'Silahkan Menunggu Fitur Ini Release', life: 3000 });

        // const payload = {
        //     nomor_sep: datas.noSep,
        //     coder_nik: auth.user.coder_nik
        // };
        // axios.post(route('kirimIndividualKlaim'), payload)
        //     .then((response) => {
        //         // setDataFinalisasi(response.data.data);
        //         if (Boolean(response.data.success) === false) {
        //             toast.current.show({ severity: 'error', summary: response.data.message, detail: datas.noSep, life: 3000 });

        //         } else {
        //             toast.current.show({ severity: 'success', summary: `Data  Berhasil Di edit ulang`, detail: datas.noSep, life: 3000 });

        //         }
        //         // Handle the response from the backend
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
    }

    const handleEditUlangKlaim = (e) => {
        e.preventDefault(); // Prevent page reload

        // console.log("Auth", auth);
        // console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        const payload = {
            nomor_sep: datas.noSep,
            coder_nik: auth.user.coder_nik
        };
        axios.post(route('editUlangKlaim'), payload)
            .then((response) => {
                // setDataFinalisasi(response.data.data);
                if (Boolean(response.data[0].success) === false) {
                    toast.current.show({ severity: 'error', summary: response.data[0].message, detail: datas.noSep, life: 3000 });

                } else {
                    toast.current.show({ severity: 'success', summary: `Data  Berhasil Di edit ulang`, detail: datas.noSep, life: 3000 });
                    updateRowData(datas.noSep, response.data[1].data.data.tgl_masuk, response.data[1].data.data.tgl_pulang, response.data[1].data.data.jenis_rawat, response.data[1].data.data.grouper.response.cbg.code, response.data[1].data.data.klaim_status_cd, response.data[1].data.data.coder_nm);
                    //    console.log("Edit Ulang Klaim ", response.data[1].data.data.klaim_status_cd);
                    setDataFinalisasi((prevDataFinal) => {
                        return {
                            ...(response.data.inacbg || {}), // Jika response.data.inacbg ada, gunakan sebagai basis, jika tidak, gunakan objek kosong
                            is_finalisasi: (response.data[1].data.data.klaim_status_cd == "final") ? response.data.getGrouping.data.data.klaim_status_cd : false// Perbarui is_finalisasi
                        };
                    });

                    // setExpandedRows(null);
                    // 
                    // console.log("dataGrouping", dataGrouping)

                }
                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const tglSepBody = (rowData) => {
        // console.log("Waktus masuk ", formatDate(rowData.tglSep));
        return (
            <>
                {rowData.tglSep ? formatDate(rowData.tglSep) : '-'}

            </>);

    };

    const tglPlgSepBody = (rowData) => {
        // console.log("Waktus masuk ", formatDate(rowData));
        return (
            <>
                {rowData.tglPlgSep ? formatDate(rowData.tglPlgSep) : '-'}
            </>);

    };
    /**Simpan Finalisasi */
    const handleSimpanFinalisasi = (e) => {
        e.preventDefault(); // Prevent page reload

        // console.log("Auth", auth);
        // console.log('Form Data Submitted:', datas);

        // Perform API request with axios
        const payload = {
            nomor_sep: datas.noSep,
            coder_nik: auth.user.coder_nik
        };
        axios.post(route('Finalisasi'), payload)
            .then((response) => {
                // setDataFinalisasi(response.data.data);
                if (Boolean(response.data[0].success) === false) {
                    toast.current.show({ severity: 'error', summary: response.data[0].message, detail: datas.noSep, life: 3000 });

                } else {
                    toast.current.show({ severity: 'success', summary: `Data  Berhasil Di Finalisasi`, detail: datas.noSep, life: 3000 });
                    console.log("Kick 23");
                    updateRowData(datas.noSep, response.data[1].data.data.tgl_masuk, response.data[1].data.data.tgl_pulang, response.data[1].data.data.jenis_rawat, response.data[1].data.data.grouper.response.cbg.code, response.data[1].data.data.klaim_status_cd, response.data[1].data.data.coder_nm);
                    // setExpandedRows(null);
                    setDataFinalisasi((prevDataFinal) => {
                        return {
                            ...(response.data.inacbg || {}), // Jika response.data.inacbg ada, gunakan sebagai basis, jika tidak, gunakan objek kosong
                            is_finalisasi: (response.data[1].data.data.klaim_status_cd === "final") ? response.data[1].data.data.klaim_status_cd : false// Perbarui is_finalisasi
                        };
                    });


                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 500); // 500 ms delay
                }

                // Handle the response from the backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const allowExpansion = (rowData) => {
        return rowData.pendaftaran_id !== null;
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
                        <span data-pr-tooltip="Klik Untuk Melihat File Simplifikasi" data-pr-position="bottom" id="info-icon" onClick={() => openDialog(rowData)}>
                            
                            <FontAwesomeIcon icon={faFile} style={{ color: (rowData.status === "final" || rowData.status === "Final") ? "#43A047" : "#D13232" }} />
                                {/* Dialog */}
                        </span>
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
                        {"\u00A0"}|{"\u00A0"}
                        {rowData.noSep}
                        <br />


                        {/* PrimeReact Tooltip */}
                        <Tooltip target="#info-icon" />
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
                <div className="card ">


                    <div className="flex items-center space-x-3">
                        {/* Button with fa-arrow-left */}
                        <button
                            onClick={handleBackClick}
                            className="flex items-center justify-center p-3 rounded hover:bg-gray-300 transition">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>

                        {/* BreadCrumb Component */}
                        <BreadCrumb model={items} separatorIcon={<FontAwesomeIcon icon={faEllipsis} />} />
                    </div>

                    {/* Breadcrumb Component */}
                </div>


                <Card>
                    <Toast ref={toast} />
                    <DataTable value={models} expandedRows={expandedRows} onRowToggle={(e) => openRow(e.data)}
                        onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="noSep" tableStyle={{ minWidth: '60rem' }}>
                        <Column expander style={{ width: '5rem' }} />

                        <Column body={tglSepBody} header="Tanggal Masuk" align={'center'} alignHeader={'center'}></Column>
                        <Column body={tglPlgSepBody} header="Tanggal Pulang" align={'center'} alignHeader={'center'}></Column>
                        <Column field="jaminan" header="Jaminan" body={"JKN"} align={'center'} alignHeader={'center'}></Column>
                        <Column field="noSep" header="No. SEP" body={noSepBody} align={'center'} alignHeader={'center'}></Column>
                        <Column field="tipe" header="Tipe" align={'center'} alignHeader={'center'}></Column>
                        <Column field="cbg" header="CBG" align={'center'} alignHeader={'center'}></Column>
                        <Column field="status" header="Status" align={'center'} alignHeader={'center'}></Column>
                        <Column field="nama_pegawai" header="Petugas" align={'center'} alignHeader={'center'}></Column>
                    </DataTable>
                </Card>
            </>

        </AuthenticatedLayout>
    );
}
