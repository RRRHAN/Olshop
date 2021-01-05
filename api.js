const express = require("express"),
    app = express(),
    cors = require("cors"),
    port = 4040

app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())

app.listen(port, () => console.log(`server run on port ${port}`))

let barang = require('./router/barang')
app.use('/barang', barang)

let admin = require('./router/admin')
app.use('/admin', admin)

let detail_transaksi = require('./router/detail_transaksi')
app.use('/detail_transaksi', detail_transaksi)

let transaksi = require('./router/transaksi')
app.use('/transaksi', transaksi)

let user = require('./router/user')
app.use('/user', user)