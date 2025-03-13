<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    <script src="{{ asset('js/ziggy.js') }}"></script>

    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>