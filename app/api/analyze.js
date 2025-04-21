export default async function handler(req, res) {
    if (req.method == 'POST') {
        const { repoUrl } = req.body;

        if(!repoUrl) {
            return res.status(400).json({ error: 'Repository URL is required' });
        }

        console.log('Received repoUrl:', repoUrl);

        res.status(200).json({
            message: `Started analysis for ${repoUrl}`,
            repoUrl: repoUrl
        });
    } else{
        res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }};