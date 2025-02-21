import Card from '@/Components/Card';
// import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { ChakraProvider } from "@chakra-ui/react";
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

// import jsPDF from "jspdf";

// import { FormatRupiah } from '@arismun/format-rupiah';
// import DateRangePicker from '@/Components/DateRangePicker';

export default function LaporanBukuRegister({ auth, pagination, data, CaraBayarM, PenjaminPasien, Instalasi, Ruangan, Dokter }) {
    const [users, setUsers] = useState([]);
    const [paginations, setPaginations] = useState([]);
    const dt = useRef(null);
    const [selectedDialog, setSelectedDialog] = useState(null);
    // 
    const [dateRange, setDateRange] = useState([new Date(), new Date()]); // initial date range
    const [isRange, setIsRange] = useState(true); // Toggle between Range and Daily view

    // Cara Bayar 

    const option1 = CaraBayarM.map((option) => ({
        value: option.carabayar_id,
        label: option.carabayar_nama,
    }));

    // Penjamin Pasien
    const options2 = Instalasi.map((option) => ({
        value: option.instalasi_id,
        label: option.instalasi_nama,
    }));


    // Ruangan
    const options3 = Ruangan.map((option) => ({
        value: option.ruangan_id,
        label: option.ruangan_nama,
    }));



    // Ruangan
    const options4 = Dokter.map((option) => ({
        value: option.pegawai_id,
        label: option.nmdpjp,
    }));


    // Status Periksa 
    const StatusOptions = [
        { value: 'ANTRIAN', label: 'ANTRIAN' },
        { value: 'SEDANG DIRAWAT INAP', label: 'SEDANG DIRAWAT INAP' },
        { value: 'SEDANG PERIKSA', label: 'SEDANG PERIKSA' },
        { value: 'SUDAH DI PERIKSA', label: 'SUDAH DI PERIKSA' },
        { value: 'MENUNGGU ADMISI PASIEN', label: 'MENUNGGU ADMISI PASIEN' },
        { value: 'SUDAH PULANG', label: 'SUDAH PULANG' },
        { value: 'BATAL PERIKSA', label: 'BATAL PERIKSA' },
    ];

    const Kunjungan = [
        { value: 'PENGUNJUNG LAMA', label: 'Kunjungan Lama' },
        { value: 'PENGUNJUNG BARU', label: 'Kunjungan Baru' },
    ];

    // Penjamin Pasien
    const options = PenjaminPasien.map((option) => ({
        value: option.penjamin_id,
        label: option.penjamin_nama,
    }));



    // Handle perubahan nilai
    const handleChangeRawat = (selectedOptions) => {

        console.log("Test ", selectedOptions);
        setFormData({
            ...formData,
            jenisRawat: selectedOptions ? selectedOptions.map(option => option.value) : ''
        });
    };

    // Handle perubahan nilai
    const handleChange = (selectedOptions) => {

        console.log("Test ", selectedOptions);
        setFormData({
            ...formData,
            jenisPenjamin: selectedOptions ? selectedOptions.map(option => option.value) : ''
        });
    };


    // Handle perubahan nilai
    const handleChangeInstalasi = (selectedOptions) => {

        console.log("Test ", selectedOptions);
        setFormData({
            ...formData,
            instalasi: selectedOptions ? selectedOptions.map(option => option.value) : ''
        });
    };


    // Handle perubahan nilai
    const handleChangeRuangan = (selectedOptions) => {

        console.log("Test ", selectedOptions);
        setFormData({
            ...formData,
            ruangan: selectedOptions ? selectedOptions.map(option => option.value) : ''
        });
    };

     // Handle perubahan nilai
     const handleChangeDokter = (selectedOptions) => {

        console.log("Test ", selectedOptions);
        setFormData({
            ...formData,
            dokter: selectedOptions ? selectedOptions.map(option => option.value) : ''
        });
    };

     // Handle perubahan nilai
     const handleChangeStatusPeriksa = (selectedOptions) => {

        console.log("Test ", selectedOptions);
        setFormData({
            ...formData,
            statusperiksa: selectedOptions ? selectedOptions.map(option => option.value) : ''
        });
    };



     // Handle perubahan nilai
     const handleChangeKunjungan = (selectedOptions) => {

        console.log("Test ", selectedOptions);
        setFormData({
            ...formData,
            kunjungan: selectedOptions ? selectedOptions.map(option => option.value) : ''
        });
    };


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


    const openDialog = (rowData) => {
        setSelectedDialog(rowData.sep_id);
    };

    const closeDialog = () => {
        setSelectedDialog(null);
    };
    // Function to toggle criteria card visibility
    const toggleCriteria = () => {
        setShowCriteria(!showCriteria);
    };

    const [formData, setFormData] = useState({
        _token: props.csrf_token,
        range: 1,
        tanggal_mulai: '',
        tanggal_selesai: '',
        nosep: '',
        periode: '',
        statusKlaim: '',
        kelasRawat: '',
        jenisRawat: '',
        jenisPenjamin: '',
        instalasi: '',
        ruangan: '',
        statusperiksa: '',
        kunjungan :'',
        nama_pasien: '',
        no_rekam_medik : '',
        no_pendaftaran : '',
        dokter:''
    });


    const formatDateTime = (dateString) => {
        // Convert the date string to a Date object
        const date = new Date(dateString.replace(" ", "T"));
        // Get the day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if day is < 10
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const year = date.getFullYear();

        // Return formatted date in dd-mm-yyyy format
        return `${year}-${month}-${day}`;

    };

    const formatTime = (dateString) => {
        // Convert the date string to a Date object
        const date = new Date(dateString.replace(" ", "T"));

        // Get the day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        // Get hours, minutes, and seconds
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Return formatted date in dd-mm-yyyy H:i:s format
        return `${hours}:${minutes}:${seconds}`;
    };


    const bodyGolonganNama = (rowData) => {
        let bodyGolonganNama;
        bodyGolonganNama = rowData.golonganumur_nama ? rowData.golonganumur_nama : '-';
        return bodyGolonganNama;
    }

    const bodyTanggalPendaftaran = (rowData) => {
        let tgl_pendaftaran;
        tgl_pendaftaran = rowData.tgl_pendaftaran ? formatDateTime(rowData.tgl_pendaftaran) : '-';
        return tgl_pendaftaran;
    }

    const bodyJamPendaftaran = (rowData) => {
        let jam_Pendaftaran;
        jam_Pendaftaran = rowData.tgl_pendaftaran ? formatTime(rowData.tgl_pendaftaran) : '-';
        return jam_Pendaftaran;
    }

    const bodyNoPendaftaran = (rowData) => {
        let no_Pendaftaran;
        no_Pendaftaran = rowData.no_pendaftaran ? (rowData.no_pendaftaran) : '-';
        return no_Pendaftaran;
    }

    const bodyNoRekamMedik = (rowData) => {
        let no_rekam_medik;
        no_rekam_medik = rowData.no_rekam_medik ? (rowData.no_rekam_medik) : '-';
        return no_rekam_medik;
    }


    const bodyNamaPasien = (rowData) => {
        let nama_pasien;
        nama_pasien = rowData.nama_pasien ? (rowData.nama_pasien) : '-';
        return nama_pasien;
    }


    const bodyJenisPenjamin = (rowData) => {
        let carabayar_nama;
        carabayar_nama = rowData.carabayar_nama ? (rowData.carabayar_nama) : '-';
        return carabayar_nama;
    }


    const bodyPenjaminNama = (rowData) => {
        let penjamin_nama;
        penjamin_nama = rowData.penjamin_nama ? (rowData.penjamin_nama) : '-';
        return penjamin_nama;
    }

    const bodyInstalasiNama = (rowData) => {
        let bodyInstalasiNama;
        bodyInstalasiNama = rowData.instalasi_nama ? (rowData.instalasi_nama) : '-';
        return bodyInstalasiNama;
    }


    const bodyRuanganNama = (rowData) => {
        let bodyRuanganNama;
        bodyRuanganNama = rowData.ruangan_nama ? (rowData.ruangan_nama) : '-';
        return bodyRuanganNama;
    }

    const bodyDokterNama = (rowData) => {
        let bodyDokterNama;
        bodyDokterNama = rowData.nama_pegawai ? (rowData.nama_pegawai) : '-';
        return bodyDokterNama;
    }


    const bodyStatusPerkawinan = (rowData) => {
        let bodyStatusPerkawinan;
        bodyStatusPerkawinan = rowData.statusperkawinan ? (rowData.statusperkawinan) : '-';
        return bodyStatusPerkawinan;
    }


    const bodyJenisKasusPenyakit = (rowData) => {
        let bodyJenisKasusPenyakit;
        bodyJenisKasusPenyakit = rowData.jeniskasuspenyakit_nama ? (rowData.jeniskasuspenyakit_nama) : "-";

        return bodyJenisKasusPenyakit;
    }



    const bodyAgama = (rowData) => {
        let bodyAgama;
        bodyAgama = rowData.agama ? (rowData.agama) : '-';
        return bodyAgama;
    }


    const bodyNoSep = (rowData) => {
        let bodyNoSep;
        bodyNoSep = rowData.nosep ? (rowData.nosep) : '-';
        return bodyNoSep;
    }


    const bodyTanggalPulang = (rowData) => {
        let bodyTanggalPulang;
        bodyTanggalPulang = rowData.tglpasienpulang ? formatDateTime(rowData.tglpasienpulang) : '-';

        return bodyTanggalPulang;

    }

    const bodyJamPulang = (rowData) => {
        let bodyJamPulang;

        bodyJamPulang = rowData.tglpasienpulang ? formatTime(rowData.tglpasienpulang) : '-';

        return bodyJamPulang;
    }

    const bodyPeriksa = (rowData) => {
        let bodyPeriksa;

        bodyPeriksa = rowData.statusperiksa ? (rowData.statusperiksa) : '-';
        return bodyPeriksa;
    }

    const cols = [
        { 
            field: 'tgl_pendaftaran', 
            header: 'Tanggal Pendaftaran', 
            body: (rowData) => formatDateTime(rowData.tgl_pendaftaran) 
        },
        
        { 
            header: 'Jam Pendaftaran', 
            body: (rowData) => bodyJamPendaftaran(rowData) 
        },

        { 
            field: 'no_pendaftaran', 
            header: 'No Pendaftaran', 
            body: (rowData) => bodyNoPendaftaran(rowData) 
        },

        { 
            field: 'nama_pasien', 
            header: 'Nama Pasien', 
            body: (rowData) => bodyNamaPasien(rowData) 
        },


        { 
            field: 'carabayar_nama', 
            header: 'Carabayar Nama', 
            body: (rowData) => bodyJenisPenjamin(rowData) 
        },


        { 
            field: 'penjamin_nama', 
            header: 'Penjamin', 
            body: (rowData) => bodyPenjaminNama(rowData) 
        },


        { 
            field: 'instalasi_nama', 
            header: 'Instalasi', 
            body: (rowData) => bodyInstalasiNama(rowData) 
        },



        { 
            field: 'ruangan_nama', 
            header: 'Ruangan', 
            body: (rowData) => bodyRuanganNama(rowData) 
        },



        { 
            field: 'nama_pegawai', 
            header: 'Dokter', 
            body: (rowData) => bodyDokterNama(rowData) 
        },


        { 
            field: 'nosep', 
            header: 'No SEP', 
            body: (rowData) => bodyNoSep(rowData) 
        },




        { 
            field: 'golonganumur_nama', 
            header: 'Golongan Umur', 
            body: (rowData) => bodyGolonganNama(rowData) 
        },



        { 
            field: 'agama', 
            header: 'Agama', 
            body: (rowData) => bodyAgama(rowData) 
        },


        { 
            field: 'statusperkawinan', 
            header: 'Status Perkawinan', 
            body: (rowData) => bodyStatusPerkawinan(rowData) 
        },



        { 
            field: 'jeniskasuspenyakit_nama', 
            header: 'Jenis Kasus Penyakit', 
            body: (rowData) => bodyJenisKasusPenyakit(rowData) 
        },




        { 
            field: 'tglpasienpulang', 
            header: 'Tanggal Pulang', 
            body: (rowData) => bodyTanggalPulang(rowData) 
        },
        


        { 
            header: 'Jam Pulang', 
            body: (rowData) => bodyJamPulang(rowData) 
        },



        { 
            field: 'statusperiksa', 
            header: 'Status Periksa', 
            body: (rowData) => bodyPeriksa(rowData) 
        },
        
    ];

    const exportColumns = cols.map((col) =>
        ({
        
        title: col.header, dataKey: col.field }));

    const exportData = users.map((row) => {
        let formattedRow = {};
        cols.forEach((col) => {
            formattedRow[col.field] = col.body ? col.body(row) : row[col.field];
        });
        return formattedRow;
    });
    
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
    
                // Pastikan menggunakan data yang sudah diformat
             // Styling tabel
            doc.autoTable({
                head: [exportColumns.map(col => col.title)],
                body: exportData.map(row => exportColumns.map(col => row[col.dataKey])),
                startY: 25, // Jarak dari atas
                theme: 'grid', // Grid untuk memberi garis border
                headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontSize: 12 }, // Warna header biru
                bodyStyles: { fontSize: 10, cellPadding: 5 }, // Ukuran teks lebih proporsional
                alternateRowStyles: { fillColor: [240, 240, 240] }, // Baris selang-seling warna abu-abu
                margin: { top: 20, left: 10, right: 10 }, // Margin kiri & kanan
                styles: { halign: 'center' }, // Teks rata tengah
            });
                doc.save('users.pdf');
            });
        });
    };
    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            // 1️⃣ Ambil header dari exportColumns
            const headers = exportColumns.map(col => col.title);

            // 2️⃣ Pastikan data diambil dari exportData yang sudah diformat
            const formattedData = exportData.map(row => {
                return exportColumns.reduce((acc, col) => {
                    acc[col.title] = row[col.dataKey]; // Gunakan header sebagai key
                    return acc;
                }, {});
            });
            

            // 3️⃣ Buat worksheet dengan header
            const worksheet = xlsx.utils.json_to_sheet(formattedData);

            // 4️⃣ Atur workbook
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

            // 5️⃣ Konversi workbook ke buffer
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            // 6️⃣ Simpan file
            saveAsExcelFile(excelBuffer, 'users');
        });
    };

    
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });
    
                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };
    
    

    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" label="Export ke Excel" />
            {/* <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" label="Export ke PDF" /> */}
        </div>
    );



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

            let fetchUrl = `${route('getLaporanBukuRegister')}/?page=${parseInt(lazyState.page + 1)}&per_page=${lazyState.rows}`;
            console.log(parseInt(lazyState.page + 1))
            axios.get(fetchUrl).then(
                (response) => {
                    console.log("response", response.data.data)
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
        let fetchUrl = `${route('getLaporanBukuRegister')}/?page=${parseInt(lazyState.page + 1)}&per_page=${lazyState.rows}&range=${dateRange.length}&tanggal_mulai=${formData.tanggal_mulai}&tanggal_selesai=${formData.tanggal_selesai}&jenisRawat=${formData.jenisRawat}&jenisPenjamin=${formData.jenisPenjamin}&instalasi=${formData.instalasi}&ruangan=${formData.ruangan}&dokter=${formData.dokter}&statusperiksa=${formData.statusperiksa}&kunjungan=${formData.kunjungan}&nama_pasien=${formData.nama_pasien}&no_rekam_medik=${formData.no_rekam_medik}&no_pendaftaran=${formData.no_pendaftaran}`;
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
            <Head title="Laporan Buku Register" />
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
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Periode:</label>
                                            <div className="d-flex justify-content-between mt-2">
                                                <input type="date" className="form-control" name='tanggal_mulai' onChange={handleInputChange} value={formData.tanggal_mulai} />
                                                <span className="mx-2 align-self-center">s/d</span>
                                                <input type="date" className="form-control" name='tanggal_selesai' onChange={handleInputChange} value={formData.tanggal_selesai} />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Nama Pasien :</label>
                                            <input type="text" className="form-control" name='nama_pasien' value={formData.nama_pasien} onChange={handleInputChange} />
                                        </div>

                                        <div className="form-group">
                                            <label>No Rekam Medik :</label>
                                            <input type="text" className="form-control" name='no_rekam_medik' value={formData.no_rekam_medik} onChange={handleInputChange} />
                                        </div>


                                        <div className="form-group">
                                            <label>No Pendaftaran :</label>
                                            <input type="text" className="form-control" name='no_pendaftaran' value={formData.no_pendaftaran} onChange={handleInputChange} />
                                        </div>


                                        <div className="form-group">
                                            <label>Cara Bayar:</label>
                                            {/* <select
                                                name='jenisRawat'
                                                className="form-control"
                                                onChange={handleInputChange}
                                                value={formData.jenisRawat}
                                            >

                                                <option value=''>Pilih Cara Bayar</option>
                                                {CaraBayarM.map((option, index) => (
                                                    <option key={index} value={option.carabayar_id}>{option.carabayar_nama}</option>
                                                ))}
                                            </select> */}

                                            <Select
                                                name="jenisRawat"
                                                options={option1}
                                                onChange={handleChangeRawat}
                                                value={option1.filter(option => formData.jenisRawat.includes(option.value))}
                                                placeholder="Pilih Cara Bayar"
                                                isClearable
                                                isSearchable
                                                isMulti  // Tambahkan ini untuk memungkinkan multiple select
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Penjamin:</label>
                                            <Select
                                                name="jenisPenjamin"
                                                options={options}
                                                onChange={handleChange}
                                                value={options.filter(option => formData.jenisPenjamin.includes(option.value))}
                                                placeholder="Pilih Penjamin"
                                                isClearable
                                                isSearchable
                                                isMulti  // Tambahkan ini untuk memungkinkan multiple select
                                            />
                                        </div>

                                    </div>
                                    {/* Status Klaim */}

                                    <div className="col-md-6">

                                        <div className="form-group">
                                            <label>Instalasi:</label>
                                            <Select
                                            
                                                name="instalasi"
                                                options={options2}
                                                onChange={handleChangeInstalasi}
                                                value={options2.filter(option => formData.instalasi.includes(option.value))}
                                                placeholder="Pilih Penjamin"
                                                isClearable
                                                isSearchable
                                                isMulti  // Tambahkan ini untuk memungkinkan multiple select
                                            />
                                        </div>


                                        <div className="form-group">
                                            <label>Ruangan :</label>
                                            <Select
                                                name="ruangan"
                                                options={options3}
                                                onChange={handleChangeRuangan}
                                                value={options3.filter(option => formData.ruangan.includes(option.value))}
                                                placeholder="Pilih Ruangan"
                                                isClearable
                                                isSearchable
                                                isMulti  // Tambahkan ini untuk memungkinkan multiple select
                                            />
                                        </div>



                                        <div className="form-group">
                                            <label>Dokter :</label>
                                            <Select
                                                name="dokter"
                                                options={options4}
                                                onChange={handleChangeDokter}
                                                value={options4.filter(option => formData.dokter.includes(option.value))}
                                                placeholder="Pilih Dokter"
                                                isClearable
                                                isSearchable
                                                isMulti  // Tambahkan ini untuk memungkinkan multiple select
                                            />
                                        </div>


                                        <div className="form-group">
                                            <label>Status Periksa :</label>
                                            <Select
                                                name="statusperiksa"
                                                options={StatusOptions}
                                                onChange={handleChangeStatusPeriksa}
                                                value={StatusOptions.filter(option => formData.statusperiksa.includes(option.value))}
                                                placeholder="Pilih Status Periksa"
                                                isClearable
                                                isSearchable
                                                isMulti  // Tambahkan ini untuk memungkinkan multiple select
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Kunjungan :</label>
                                            <Select
                                                name="ruangan"
                                                options={Kunjungan}
                                                onChange={handleChangeKunjungan}
                                                value={Kunjungan.filter(option => formData.kunjungan.includes(option.value))}
                                                placeholder="Pilih Kunjungan"
                                                isClearable
                                                isSearchable
                                                isMulti  // Tambahkan ini untuk memungkinkan multiple select
                                            />
                                        </div>


                                    </div>



                                    {/* <div className="col-sm-6">
                                    
                                    </div> */}
                                    {/* Jenis Rawat */}

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

            <section>
                <div className="col-sm-12">
                    {/* <DataTable url="/getLaporanSEP" columns={columns} /> */}
                    <Card>
                        <DataTable
                            paginator
                            dataKey="idq"
                            first={lazyState.first}
                            header={header}
                            rows={paginations.items_per_page}
                            totalRecords={paginations.total_items}
                            lazy
                            value={users}
                            stripedRows
                            rowsPerPageOptions={[10, 25, 50]}
                            onPage={onPage}
                        >
                            <Column body={rowNumberTemplate} header="No." />
                            <Column body={bodyTanggalPendaftaran} header="Tanggal Pendaftaran" ></Column>
                            <Column body={bodyJamPendaftaran} header="Jam Pendaftaran" ></Column>
                            <Column body={bodyNoPendaftaran} header="No Pendaftaran" ></Column>
                            <Column body={bodyNoRekamMedik} header="No Rekam Medik" ></Column>
                            <Column body={bodyNamaPasien} header="Nama Pasien" ></Column>
                            <Column body={bodyJenisPenjamin} header="Jenis Penjamin" ></Column>
                            <Column body={bodyPenjaminNama} header="Penjamin" ></Column>
                            <Column body={bodyInstalasiNama} header="Instalasi" ></Column>
                            <Column body={bodyRuanganNama} header="Ruangan" ></Column>
                            <Column body={bodyDokterNama} header="Dokter" ></Column>
                            <Column body={bodyNoSep} header="No SEP" ></Column>

                            <Column body={bodyGolonganNama} header="Golongan Umur " ></Column>
                            <Column body={bodyAgama} header="Agama" ></Column>
                            <Column body={bodyStatusPerkawinan} header="Status Perkawinan" ></Column>
                            <Column body={bodyJenisKasusPenyakit} header="Jenis Penyakit" ></Column>
                            <Column body={bodyTanggalPulang} header="Tanggal Pulang" ></Column>
                            <Column body={bodyJamPulang} header="Jam Pulang" ></Column>
                            <Column body={bodyPeriksa} header="Status Periksa" ></Column>

                        </DataTable>
                    </Card>
                </div>
            </section>

        </AuthenticatedLayout>
    );
}
