import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';
import { IUser } from './types';

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

let userData: IUser[] = [];

app.use(cors());

app.post('/api/files', upload.single('file'), async (req, res) => {
  const { file } = req;

  if (!file) return res.status(500).json({ message: 'File is required' });

  if (file.mimetype !== 'text/csv')
    return res.status(500).json({ message: 'File must be CSV' });

  try {
    const csv = file.buffer.toString('utf-8');
    userData = csvToJson.fieldDelimiter(',').csvStringToJson(csv);
  } catch (error) {
    return res.status(500).json({ message: 'Error parsing CSV' });
  }

  return res
    .status(200)
    .json({ data: userData, message: 'Files uploaded successfully' });
});

app.get('/api/users', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(200).json({ data: userData });

  if (typeof q !== 'string')
    return res
      .status(500)
      .json({ message: `Query params 'q' must be a string` });

  const search = q.toLowerCase();

  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search)
    );
  });

  return res.status(200).json({ data: filteredData });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
