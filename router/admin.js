const express = require("express"),
    app = express(),
    md5 = require('md5')

module.exports = app

let db = require('./db_connect')

// endpoint untuk menambah data admin baru
app.post("/", (req, res) => {
    // prepare data
    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // create sql insert
    let sql = "insert into admin set ?"

    // run query
    db.query(sql, data, (error, result) => {
        if (error) throw error
        res.json({
            message: result.affectedRows + " data berhasil disimpan"
        })
    })

})

// endpoint untuk mengubah data admin
app.put("/:id", (req, res) => {
    let data = null,
        sql = null
        // paramter perubahan data
    let param = {
        id_admin: req.params.id
    }

    // jika mengirim file = update data + reupload
    data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // create sql update
    sql = "update admin set ? where ?"

    // run sql update
    db.query(sql, [data, param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})

// endpoint untuk menghapus data admin
app.delete("/:kode_admin", (req, res) => {
    let param = {
        id_admin: req.params.kode_admin
    }

    // create sql delete
    sql = "delete from admin where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus"
            })
        }
    })
})

// endpoint ambil data admin
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from admin"

    // run query
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})