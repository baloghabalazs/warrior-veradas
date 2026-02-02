export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const SAPI_ENDPOINT = "https://sw.salesautopilot.com/v4/subscribers/166453/signup";
    // Ideally, the API Key should be an environment variable
    const SAPI_KEY = "xk4hdcd222eqct4tzg5egw7kke9noja7";

    try {
        const response = await fetch(SAPI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ns-api-key': SAPI_KEY
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SAPI Error:', errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
