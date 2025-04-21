export default async function handler(req, res) {
    if (req.method === 'POST') {
      const response = await fetch('http://127.0.0.1:5000/generate_paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  
