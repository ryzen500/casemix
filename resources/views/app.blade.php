<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

    <link rel="stylesheet" href="{{ asset('assets/vendors/iconly/bold.css') }}">

    <link rel="stylesheet" href="{{ asset('assets/vendors/perfect-scrollbar/perfect-scrollbar.css') }}">

    <link rel="stylesheet" href="{{ asset('assets/vendors/bootstrap-icons/bootstrap-icons.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/bootstrap.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/app.css') }}">

    <link rel="shortcut icon" href="{{asset('assets/images/favicon.svg')}}" type="image/x-icon">
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
</head>
<style>
      .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
        background: #ecfeff;
        border-color: #ecfeff;
        color: #0e7490;
    }
    .p-overlaypanel .p-overlaypanel-close {
        background: #06b6d4;
        color: #ffffff;
        width: 2rem;
        height: 2rem;
        transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
        border-radius: 50%;
        position: absolute;
        top: -1rem;
        right: -1rem;
    }
    td {
        color:black;
    }
    .p-jc-center{
        text-align:center;
    }
    .p-tabview-nav-container {
        border-bottom: 1px solid;
    }
    .p-tabview{
        border : 1px solid black;
        margin-bottom: 10px;
    }
    .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
        background: #ffffff;
        border-color: #06b6d4;
        color: #06b6d4;
    }
    /* .table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-bottom: 40px !important;
    } */

    /* .table td {
    padding: 7px 10px;
    border: 1px solid;
    }

    .word-break {
    word-break: break-all;
    } */
    /* .table>:not(:last-child)>:last-child>* {
        border : 1px solid black !important;
    } */
     /* Change the default border color */
    .p-dropdown {
        border: 1px solid black !important;
        border-radius: 5px; /* Optional: Add rounded corners */
    }
    /* Center the OverlayPanel */
    .p-overlaypanel {
        position: fixed;
        /* transform: translate(0%, 0%); */
        top : 180px !important;
    }
    .p-button {
    font-size: 16px; /* Example for button */
    }

    .p-dropdown {
    font-size: 14px; /* Example for dropdown */
    }

    .p-inputtext {
    font-size: 14px; /* Example for input text */
    color: black;
    }
    input{
        color: black;
    }
    .form-control {
        color: black;
    }
    .p-component{
        font-size: 14px;
    }
    *{
        font-size: 14px ;
    }
    .full-width-autocomplete {
        width: 100% !important;
    }
    .p-autocomplete {
        width: 100% !important;
    }
    .p-autocomplete-input {
        width: 100% !important;
    }

</style>
<body >
    @inertia
</body>
    <script src="{{asset('assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js')}}"></script>

    <script src="{{asset('assets/js/bootstrap.bundle.min.js')}}"></script>


    <script src="{{asset('assets/js/pages/dashboard.js')}}"></script>

    <!-- <script src="assets/js/main.js"></script> -->
    <script src="{{asset('assets/vendors/chartjs/Chart.min.js')}}"></script>
    <script src="{{asset('assets/js/pages/ui-chartjs.js')}}"></script>
</html>