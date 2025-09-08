exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Permitir OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Só aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Método não permitido' })
    };
  }

  try {
    // Suas credenciais AmloPay
    const publicKey = 'murillot2004_f443f52tx77685f5';
    const secretKey = '5gu5mbg909m53xs9cph9kb08dftavp2zyuzq7j05cm1uf20cuykqrxeq00dpprce';

    // Ler dados
    const data = JSON.parse(event.body);
    const amount = parseFloat(data.amount || 0);

    if (amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Valor inválido' })
      };
    }

    console.log(`Gerando PIX para R$ ${amount}`);

    // Payload para AmloPay
    const payload = {
      amount: amount,
      currency: 'BRL',
      payment_method: 'pix',
      description: `Doação Moçambique - R$ ${amount.toFixed(2)}`,
      customer: {
        name: 'Doador Anônimo',
        email: 'doador@vakinhadaafrica.site',
        document: '00000000000'
      }
    };

    // Tentar diferentes endpoints
    const endpoints = [
      'https://app.amplopay.com/api/v1/charges',
      'https://app.amplopay.com/api/v1/payments',
      'https://api.amplopay.com/v1/charges',
      'https://api.amplopay.com/v1/payments'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Testando: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${secretKey}`,
            'X-Public-Key': publicKey
          },
          body: JSON.stringify(payload)
        });

        console.log(`Status: ${response.status}`);
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ SUCESSO!', JSON.stringify(result));
          
          // Procurar dados do PIX na resposta
          const pixData = {
            qr_code: result.qr_code || result.qr_code_url || (result.data && result.data.qr_code),
            pix_code: result.pix_code || result.copy_paste || (result.data && result.data.copy_paste),
            payment_id: result.id || result.payment_id || (result.data && result.data.id)
          };

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              payment_id: pixData.payment_id,
              amount: amount,
              pix_qr_code: pixData.qr_code,
              pix_code: pixData.pix_code,
              status: 'pending',
              message: 'PIX gerado com sucesso!'
            })
          };
        } else {
          const errorText = await response.text();
          console.log(`❌ Falhou: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ Erro: ${error.message}`);
      }
    }

    // Se chegou aqui, todos falharam
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Todos os endpoints falharam. Verifique se a conta AmloPay está ativa.'
      })
    };

  } catch (error) {
    console.error('Erro geral:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: `Erro interno: ${error.message}`
      })
    };
  }
};
