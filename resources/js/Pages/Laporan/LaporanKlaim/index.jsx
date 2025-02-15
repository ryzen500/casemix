import Card from '@/Components/Card';
// import DataTable from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState , useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { ChakraProvider } from "@chakra-ui/react";
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Tooltip } from 'primereact/tooltip';
import jsPDF from "jspdf";

import { FormatRupiah } from '@arismun/format-rupiah';
import DateRangePicker from '@/Components/DateRangePicker';

export default function LaporanKlaim({ auth, pagination, data }) {
    const [users, setUsers] = useState([]);
    const [paginations, setPaginations] = useState([]);
    const dt = useRef(null);

    // 
    const [dateRange, setDateRange] = useState([new Date(), new Date()]); // initial date range
    const [isRange, setIsRange] = useState(true); // Toggle between Range and Daily view

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
        nama_pasien: ''
    });

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, users);
                doc.save('users.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(users);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

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
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF"  label="Export ke PDF"/>
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

    
    const cols = [
        { field: 'tglsep', header: 'Tanggal Masuk' },
        { field: 'tglpulang', header: 'Tanggal Pulang' },
        { field: 'nama_pasien', header: 'Nama Pasien' },
        { field: 'nosep', header: 'No SEP' },
        { field: 'jnspelayanan', header: 'Tipe'},
        { field: 'klsrawat', header: 'Kelas Pelayanan' },
        { field: 'status', header: 'Status' },
        { field: 'inacbg_loginpemakai_id', header: 'Petugas' },

    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const loadLazyData = () => {
        setLoading(true);

        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }
        networkTimeout = setTimeout(() => {

            let fetchUrl = `${route('getLaporanKlaim')}/?page=${parseInt(lazyState.page + 1)}&per_page=${lazyState.rows}`;
            console.log(parseInt(lazyState.page + 1))
            axios.get(fetchUrl).then(
                (response) => {
                    console.log("response" , response.data.data)
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
        let fetchUrl = `${route('getLaporanKlaim')}/?page=${parseInt(lazyState.page + 1)}&per_page=${lazyState.rows}&range=${dateRange.length}&tanggal_mulai=${formData.tanggal_mulai}&tanggal_selesai=${formData.tanggal_selesai}&nosep=${formData.nosep}&periode=${formData.periode}&jenisRawat=${formData.jenisRawat}&kelasRawat=${formData.kelasRawat}&nama_pasien=${formData.nama_pasien}`;
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




    const Petugas = (rowData) => {
        let Petugas;
        Petugas = rowData.inacbg_loginpemakai_id ? rowData.inacbg_loginpemakai_id : '-';
        return Petugas;
    }


    const kelasPelayanan = (rowData) => {
        let kelasPelayanan;
        kelasPelayanan = rowData.klsrawat ? ` Kelas ${rowData.klsrawat}` : '-';
        return kelasPelayanan;
    }


    const bodyTipe = (rowData) => {
        let bodyTipe;
        bodyTipe = rowData.jnspelayanan ? rowData.jnspelayanan : '-';
        return bodyTipe;
    }

    const bodyTanggalMasuk = (rowData) => {
        let tanggalMasuk;
        tanggalMasuk = rowData.tgl_masuk ? rowData.tgl_masuk : '-';
        return tanggalMasuk;
    }

    const bodyTanggalPulang = (rowData) => {
        let tanggalPulang;
        tanggalPulang = rowData.tglpulang ? rowData.tglpulang : '-';
        return tanggalPulang;
    }

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
            <Head title="Laporan Klaim" />
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
                                    {/* Status Klaim */}

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>Nama:</label>
                                            <input type="text" className="form-control" name='nama_pasien' value={formData.nama_pasien} onChange={handleInputChange} />
                                        </div>
                                    </div>

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



                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label>No SEP:</label>
                                            <input type="text" className="form-control" name='nosep' value={formData.nosep} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    {/* Jenis Rawat */}

                                </div>

                                <div className="row">
                                    {/* Kelas Rawat */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Kelas Rawat:</label>
                                            <div className="d-flex">
                                                <div className="form-check mr-2">
                                                    <input type="radio" name="kelasRawat" className="form-check-input" value="1" checked={formData.kelasRawat === "1"} onChange={handleInputChange} />
                                                    <label className="form-check-label">Kelas 1</label>
                                                </div>
                                                <div className="form-check mr-2">
                                                    <input type="radio" name="kelasRawat" className="form-check-input" value="2" checked={formData.kelasRawat === "2"} onChange={handleInputChange} />
                                                    <label className="form-check-label">Kelas 2</label>
                                                </div>
                                                <div className="form-check mr-2">
                                                    <input type="radio" name="kelasRawat" className="form-check-input" value="3" checked={formData.kelasRawat === "3"} onChange={handleInputChange} />
                                                    <label className="form-check-label">Kelas 3</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="radio" name="kelasRawat" className="form-check-input" value="Semua Kelas" checked={formData.kelasRawat === "Semua Kelas"} onChange={handleInputChange} />
                                                    <label className="form-check-label">Semua Kelas</label>
                                                </div>
                                            </div>
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
                            <Column body={bodyTanggalMasuk} header="Tanggal Masuk" ></Column>
                            <Column body={bodyTanggalPulang} header="Tanggal Pulang" ></Column>
                            <Column field="nosep" header="No SEP" ></Column>
                            <Column field="nama_pasien" header="Nama Pasien" ></Column>

                            <Column body={bodyTipe} header="Tipe " ></Column>
                            <Column body={kelasPelayanan} header="Kelas Pelayanan" ></Column>
                            <Column body={Petugas} header="Petugas" ></Column>

                        </DataTable>
                    </Card>
                </div>
            </section>

        </AuthenticatedLayout>
    );
}
