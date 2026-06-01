require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// আপলোডের জন্য ফোল্ডার তৈরি রাখা
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const upload = multer({ dest: 'uploads/' });

// সিকিউর ভেরিয়েবল
const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

// রুট পেজে একটি মেসেজ যেন "Cannot GET" না দেখায়
app.get('/', (req, res) => {
    res.send('TRICK A4IF Backend is Running Successfully!');
});

// ফাইল আপলোড এন্ডপয়েন্ট
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        // টেলিগ্রামে পাঠানো
        const photo = await bot.sendPhoto(CHAT_ID, fs.createReadStream(file.path));
        
        // ফাইলটি ডিলিট করা
        fs.unlinkSync(file.path);

        res.json({ 
            success: true, 
            url: photo.photo[photo.photo.length - 1].file_id 
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));