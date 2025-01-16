<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/bootstrap.css">

    <link rel="stylesheet" href="assets/vendors/iconly/bold.css">

    <link rel="stylesheet" href="assets/vendors/perfect-scrollbar/perfect-scrollbar.css">
    <link rel="stylesheet" href="assets/vendors/bootstrap-icons/bootstrap-icons.css">
    <link rel="stylesheet" href="assets/css/app.css">
    <link rel="shortcut icon" href="assets/images/favicon.svg" type="image/x-icon">
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
</style>
<body >
    @inertia
</body>
    <script src="assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js"></script>

    <script src="assets/js/bootstrap.bundle.min.js"></script>


    <script src="assets/js/pages/dashboard.js"></script>

    <!-- <script src="assets/js/main.js"></script> -->
    <script src="assets/vendors/chartjs/Chart.min.js"></script>
    <script src="assets/js/pages/ui-chartjs.js"></script>
</html>