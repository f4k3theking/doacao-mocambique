<?php
// Arquivo para testar a API AmloPay diretamente

// Configurações AmloPay
$publicKey = 'murillot2004_f443f52tx77685f5';
$secretKey = '5gu5mbg909m53xs9cph9kb08dftavp2zyuzq7j05cm1uf20cuykqrxeq00dpprce';

// URL da AmloPay para testar
$urlsToTest = [
    'https://app.amplopay.com/api/v1/payments',
    'https://app.amplopay.com/api/v1/charges',
    'https://app.amplopay.com/api/v1/pix'
];

$testPayload = [
    'amount' => 10.00,
    'currency' => 'BRL',
    'payment_method' => 'pix',
    'description' => 'Teste PIX - Doação Moçambique',
    'customer' => [
        'name' => 'Teste',
        'email' => 'teste@teste.com',
        'document' => '00000000000'
    ],
    'notification_url' => 'https://vakinhadaafrica.site/webhook',
    'return_url' => 'https://vakinhadaafrica.site'
];

echo "<h1>Teste da API AmloPay</h1>\n";
echo "<pre>\n";

foreach ($urlsToTest as $url) {
    echo "===========================================\n";
    echo "Testando URL: $url\n";
    echo "===========================================\n";
    
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($testPayload),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . $secretKey,
            'X-Public-Key: ' . $publicKey
        ],
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'TestAmloPay/1.0'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    echo "HTTP Code: $httpCode\n";
    if ($error) {
        echo "Erro cURL: $error\n";
    }
    echo "Resposta (primeiros 500 chars):\n";
    echo substr($response, 0, 500) . "\n";
    echo "\n";
    
    // Tentar também com Authorization Basic
    echo "--- Testando com Authorization Basic ---\n";
    
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($testPayload),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Basic ' . base64_encode($publicKey . ':' . $secretKey)
        ],
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_USERAGENT => 'TestAmloPay/1.0'
    ]);
    
    $response2 = curl_exec($ch);
    $httpCode2 = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error2 = curl_error($ch);
    
    curl_close($ch);
    
    echo "HTTP Code: $httpCode2\n";
    if ($error2) {
        echo "Erro cURL: $error2\n";
    }
    echo "Resposta (primeiros 500 chars):\n";
    echo substr($response2, 0, 500) . "\n";
    echo "\n\n";
}

echo "</pre>";
?>
