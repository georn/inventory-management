export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'file',
    path: process.env.DATABASE_FILE_PATH || 'data/boxes.json',
  },
  qrCode: {
    baseUrl: process.env.QR_CODE_BASE_URL || 'https://yourapp.com/boxes/',
  },
});
