<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $asunto }}</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        html, body {
            font-family: 'Roboto', sans-serif;
        } 

        .message {
            background-color: #efefef;
            border-radius: 20px;
            margin-top: 10px;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <a href="{{ env('FRONT_URL') }}" style="display: inline-block;">
            <img src="https://api.ecommercesy.com/images/icono-super.png" class="logo" alt="Talleres Logo">
        </a>
    </div>

    <div class="body">
        <p>{{ $nombre }} ha enviado el siguiente el siguiente mensaje.</p>
        
        <div class="message">{{ $mensaje }}</div>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} {{ config('app.name') }}. @lang('All rights reserved.')</p>
    </div>
</body>
</html>