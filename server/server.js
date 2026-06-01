require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// ১. CORS এরর চিরতরে দূর করার জন্য মজবুত কনফিগারেশন
app.use(cors({
    origin: '*', // সব ওয়েবসাইট থেকে রিকোয়েস্ট অ্যালাউ করবে
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// ২. 'uploads' ফোল্ডারটি রেন্ডার সার্ভারে না থাকলে স্বয়ংক্রিয়ভাবে তৈরি করার লজিক
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// মাল্টার কনফিগারেশনে সঠিক ডিরেক্টরি পাথ সেট করা
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// সিকিউর ভেরিয়েবল
const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

// রুট রাউট
app.get('/', (req, res) => {
    res.send('TRICK A4IF Backend is Running Successfully with Upload Directory fixed!');
});

// ফাইল আপলোড এন্ডপয়েন্ট
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.error('No file received in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`File received successfully: ${file.path}`);

        // টেলিগ্রামে পাঠানো
        const photo = await bot.sendPhoto(CHAT_ID, fs.createReadStream(file.path));
        
        // ফাইলটি পাঠানো শেষে ডিলিট করা
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        res.json({ 
            success: true, 
            url: photo.photo[photo.photo.length - 1].file_id 
        });
    } catch (error) {
        console.error('Telegram or Server Error:', error);
        // যদি এরর হয় তাও লোকাল ফাইল ডিলিট করার চেষ্টা করা
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// ৩. টেলিগ্রাম থেকে ছবি এনে ফ্রন্টএন্ডে দেখানোর ম্যাজিক এন্ডপয়েন্ট (নতুন যোগ করা হয়েছে)
app.get('/image/:fileId', async (req, res) => {
    try {
        const fileLink = await bot.getFileLink(req.params.fileId);
        // সরাসরি টেলিগ্রামের ছবির লিংকে রিডাইরেক্ট করে দেবে
        res.redirect(fileLink);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(404).send('Image not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));