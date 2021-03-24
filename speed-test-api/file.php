<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');

    $file = file_get_contents('php://input');
    file_put_contents('upload', $file);