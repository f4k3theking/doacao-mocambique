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

    // Gerar identificador único para a transação
    const identifier = 'pix_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Payload correto para AmloPay (baseado na documentação)
    const payload = {
      identifier: identifier,
      amount: amount,
      client: {
        name: 'Doador Anônimo',
        email: 'doador@vakinhadaafrica.site',
        phone: '(11) 99999-9999',
        document: '000.000.000-00'
      },
      products: [
        {
          id: 'donation_001',
          name: `Doação Moçambique - R$ ${amount.toFixed(2)}`,
          quantity: 1,
          price: amount
        }
      ],
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +1 dia
      metadata: {
        source: 'website',
        campaign: 'mocambique'
      },
      callbackUrl: 'https://silver-dango-fef4bf.netlify.app/.netlify/functions/webhook'
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Endpoint correto da AmloPay
    const endpoint = 'https://app.amplopay.com/api/v1/gateway/pix/receive';

    try {
      console.log(`Chamando: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-public-key': publicKey,
          'x-secret-key': secretKey
        },
        body: JSON.stringify(payload)
      });

      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ SUCESSO!', JSON.stringify(result, null, 2));
        
        // Extrair dados do PIX da resposta
        const pixData = result.pix || {};
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            payment_id: result.transactionId,
            amount: amount,
            pix_qr_code: pixData.image,
            pix_code: pixData.code,
            status: result.status,
            message: 'PIX gerado com sucesso!',
            order_url: result.order?.url
          })
        };
      } else {
        const errorText = await response.text();
        console.log(`❌ Falhou: ${response.status} - ${errorText}`);
        
        let errorMessage = 'Erro ao gerar PIX';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // Se não conseguir parsear JSON, usa o texto direto
        }
        
        return {
          statusCode: response.status,
          headers,
          body: JSON.stringify({
            success: false,
            error: errorMessage,
            details: errorText
          })
        };
      }
    } catch (error) {
      console.log(`❌ Erro de conexão: ${error.message}`);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Erro de conexão: ${error.message}`
        })
      };
    }

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
