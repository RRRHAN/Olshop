const express = require("express"),
    app = express(),
    md5 = require('md5'),
    multer = require("multer"),
    path = require("path"),
    fs = require("fs")

module.exports = app

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image/user');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "user-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({
    storage: storage
})

let db = require('./db_connect')

// endpoint untuk menambah data user baru
app.post("/", upload.single("foto"), (req, res) => {
    // prepare data
    let data = {
        nama_user: req.body.nama_user,
        alamat: req.body.alamat,
        foto: req.file.filename,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // create sql insert
    let sql = "insert into user set ?"

    // run query
    db.query(sql, data, (error, result) => {
        if (error) throw error
        res.json({
            message: result.affectedRows + " data berhasil disimpan"
        })
    })

})

// endpoint untuk mengubah data user
app.put("/:id", upload.single("foto"), (req, res) => {
    let data = null,
        sql = null
        // paramter perubahan data
    let param = {
        id_user: req.params.id
    }

    // jika mengirim file = update data + reupload
    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            nama_user: req.body.nama_user,
            alamat: req.body.alamat,
            username: req.body.username,
            password: md5(req.body.password)
        }
    } else if (req.file) {
        // jika mengirim file = update data + reupload
        data = {
            nama_user: req.body.nama_user,
            alamat: req.body.alamat,
            foto: req.file.filename,
            username: req.body.username,
            password: md5(req.body.password)
        }

        // get data yg akan diupdate utk mendapatkan nama file yang lama
        sql = "select * from user where ?"
            // run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
                // tampung nama file yang lama
            let fileName = result[0].foto

            // hapus file yg lama
            let dir = path.join(__dirname, "..", "image", "user", fileName)
            fs.unlink(dir, (error) => {})
        })
    }

    // create sql update
    sql = "update user set ? where ?"

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

// endpoint untuk menghapus data user
app.delete("/:id_user", (req, res) => {
    let param = {
        id_user: req.params.id_user
    }

    // ambil data yang akan dihapus
    let sql = "select * from user where ?"
        // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error

        // tampung nama file yang lama
        let fileName = result[0].foto

        // hapus file yg lama
        let dir = path.join(__dirname, "..", "image", "user", fileName)
        fs.unlink(dir, (error) => {
            // create sql delete
            sql = "delete from user where ?"

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
    })


})

// endpoint ambil data user
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from user"

    // run query
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})