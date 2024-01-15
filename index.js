// ----------------------------------------------------------------------------- without databse

// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const path = require('path'); // Import modul 'path'

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// app.use(express.static(path.join(__dirname)));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// io.on('connection', (socket) => {
//     console.log('Client terhubung');

//     socket.on('pesan', (data) => {
//         console.log('Pesan dari client:', data);
//         io.emit('pesan', 'Pesan dari server: ' + data);
//     });

//     socket.on('disconnect', () => {
//         console.log('Client terputus');
//     });
// });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//     console.log(`Server berjalan di http://localhost:${PORT}`);
// });

// ------------------------------------------------------------------------------------------------------- with database

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const pool = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pesan', (req, res) => {
    pool.query('SELECT isi_pesan FROM pesan', (error, results) => {
        if (error) {
            throw error;
        }

        const pesan = results.map(result => result.isi_pesan);
        res.json(pesan);
    });
});

io.on('connection', (socket) => {
    console.log('Client terhubung');

    socket.on('ambilPesanDatabase', () => {
        pool.query('SELECT isi_pesan FROM pesan', (error, results) => {
            if (error) {
                throw error;
            }

            const pesan = results.map(result => result.isi_pesan);

            socket.emit('pesanDatabase', pesan);
        });
    });

    socket.on('pesan', (data) => {
        console.log('Pesan dari client:', data);

        pool.query('INSERT INTO pesan (isi_pesan) VALUES (?)', [data], (error, results) => {
            if (error) {
                throw error;
            }

            console.log('Pesan berhasil disimpan ke database');

            io.emit('pesan', 'Pesan dari server: ' + data);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client terputus');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
