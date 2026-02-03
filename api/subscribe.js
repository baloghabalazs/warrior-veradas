export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Credentials
    const SAPI_USER = "baloghabalazs@gmail.com";
    const SAPI_KEY = "xk4hdcd222eqct4tzg5egw7kke9noja7";

    // IDs
    const NL_ID = "166453"; // Newsletter ID
    const NS_ID = "327110"; // Form ID

    // Correct Endpoint for subscribe
    const SAPI_ENDPOINT = `https://restapi.emesz.com/subscribe/${NL_ID}/form/${NS_ID}`;

    try {
        // Create Basic Auth Header
        const authHeader = 'Basic ' + Buffer.from(SAPI_USER + ':' + SAPI_KEY).toString('base64');

        const response = await fetch(SAPI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SAPI Error Status:', response.status);
            console.error('SAPI Error Body:', errorText);

            return res.status(response.status).json({
                error: 'Upstream API Error',
                details: errorText,
                status: response.status
            });
        }

        // Response handling
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            data = { message: text };
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Proxy Catch Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
