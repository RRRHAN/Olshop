const express = require("express"),
    app = express()

module.exports = app

let db = require("./db_connect")

// endpoint untuk menambah data detail_transaksi baru
app.post("/", (req, res) => {
    // prepare data
    let data = {
        kode_transaksi: req.body.kode_transaksi,
        kode_barang: req.body.kode_barang,
        jumlah: req.body.jumlah,
        harga_beli: req.body.harga_beli,
    }

    // create sql insert
    let sql = "insert into detail_transaksi set ?"

    // run query
    db.query(sql, data, (error, result) => {
        if (error) throw error
        res.json({
            message: result.affectedRows + " data berhasil disimpan",
        })
    })
})

// endpoint untuk mengubah data detail_transaksi
app.put("/:id", (req, res) => {
    let data = null,
        sql = null
        // paramter perubahan data
    let param = {
        kode_detail_transaksi: req.params.id,
    }

    // jika mengirim file = update data + reupload
    data = {
        kode_transaksi: req.body.kode_transaksi,
        kode_barang: req.body.kode_barang,
        jumlah: req.body.jumlah,
        harga_beli: req.body.harga_beli,
    }

    // create sql update
    sql = "update detail_transaksi set ? where ?"

    // run sql update
    db.query(sql, [data, param], (error, result) => {
        if (error) {
            res.json({
                message: error.message,
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah",
            })
        }
    })
})

// endpoint untuk menghapus data detail_transaksi
app.delete("/:kode_detail_transaksi", (req, res) => {
    let param = {
        kode_detail_transaksi: req.params.kode_detail_transaksi,
    }

    // create sql delete
    sql = "delete from detail_transaksi where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message,
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus",
            })
        }
    })
})

// endpoint ambil data barang
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from barang"

    // run query
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length,
        })
    })
})