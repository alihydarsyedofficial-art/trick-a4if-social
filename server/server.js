require('dotenv').config(); // এনভায়রনমেন্ট ভেরিয়েবল লোড হবে
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

// সিকিউর ভেরিয়েবল ব্যবহার
const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: false });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const photo = await bot.sendPhoto(CHAT_ID, fs.createReadStream(file.path));
        fs.unlinkSync(file.path);

        res.json({ url: photo.photo[photo.photo.length - 1].file_id });
    } catch (error) {
        res.status(500).json({ error: 'Hacking attempt or Server error' });
    }
});

app.listen(3000, () => console.log('Secure server running on port 3000'));