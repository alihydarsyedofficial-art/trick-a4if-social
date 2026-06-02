require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Directory Setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// প্রো-ফিচার: একসাথে ১০টি পর্যন্ত ফাইল আপলোড করার সাপোর্ট
const upload = multer({ storage: storage });

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

app.get('/', (req, res) => {
    res.send('TRICK A4IF Pro Backend is Running with Multi-Image Support!');
});

// মেইন আপলোড এন্ডপয়েন্ট: 'files' কি (key) ব্যবহার করবে
app.post('/upload', upload.array('files', 10), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        console.log(`Processing ${files.length} files...`);

        // প্রতিটি ফাইল টেলিগ্রামে পাঠানোর জন্য Promise.all ব্যবহার করা হচ্ছে (ফাস্ট আপলোড)
        const fileIds = await Promise.all(
            files.map(async (file) => {
                const photo = await bot.sendPhoto(process.env.TELEGRAM_CHAT_ID, fs.createReadStream(file.path));
                
                // টেলিগ্রামে পাঠানোর পর ফাইল ডিলিট
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                
                // সবচেয়ে বড় সাইজের ছবির file_id রিটার্ন করবে
                return photo.photo[photo.photo.length - 1].file_id;
            })
        );

        res.json({ 
            success: true, 
            fileIds: fileIds // এখানে ছবির ID-গুলোর এরে (array) যাবে
        });
    } catch (error) {
        console.error('Upload Error:', error);
        // যেকোনো এরর হলে আপলোড ফোল্ডার পরিষ্কার করা
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
});

// ইমেজ সার্ভিং এন্ডপয়েন্ট (যা আগের মতই কাজ করবে)
app.get('/image/:fileId', async (req, res) => {
    try {
        const fileLink = await bot.getFileLink(req.params.fileId);
        res.redirect(fileLink);
    } catch (error) {
        res.status(404).send('Image not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));