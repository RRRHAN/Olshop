const express = require("express"),
    app = express()

module.exports = app

let db = require("./db_connect")

// endpoint untuk menambah data transaksi baru
app.post("/", (req, res) => {
    // prepare data
    let data = {
        id_user: req.body.id_user,
        tgl_transaksi: req.body.tgl_transaksi
    }

    // create sql insert
    let sql = "insert into transaksi set ?"

    // run query
    db.query(sql, data, (error, result) => {
        if (error) throw error
        res.json({
            message: result.affectedRows + " data berhasil disimpan",
        })
    })
})

// endpoint untuk mengubah data transaksi
app.put("/:id", (req, res) => {
    let data = null,
        sql = null
        // paramter perubahan data
    let param = {
        kode_transaksi: req.params.id,
    }

    // jika mengirim file = update data + reupload
    data = {
        id_user: req.body.id_user,
        tgl_transaksi: req.body.tgl_transaksi
    }

    // create sql update
    sql = "update transaksi set ? where ?"

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

// endpoint untuk menghapus data transaksi
app.delete("/:kode_transaksi", (req, res) => {
    let param = {
        kode_transaksi: req.params.kode_transaksi,
    }

    // create sql delete
    sql = "delete from transaksi where ?"

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

// endpoint ambil data transaksi
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from transaksi"

    // run query
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length,
        })
    })
})