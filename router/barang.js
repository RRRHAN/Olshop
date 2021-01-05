const express = require("express"),
    app = express(),
    multer = require("multer"),
    path = require("path"),
    fs = require("fs")

module.exports = app


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image/barang');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "barang-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({
    storage: storage
})

let db = require('./db_connect')

// endpoint untuk menambah data barang baru
app.post("/", upload.single("image"), (req, res) => {
    // prepare data
    let data = {
        nama_barang: req.body.nama_barang,
        harga: req.body.harga,
        stok: req.body.stok,
        deskripsi: req.body.deskripsi,
        image: req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into barang set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if (error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

// endpoint untuk mengubah data barang
app.put("/:id", upload.single("image"), (req, res) => {
    let data = null,
        sql = null
        // paramter perubahan data
    let param = {
        kode_barang: req.params.id
    }

    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            stok: req.body.stok,
            deskripsi: req.body.deskripsi
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            stok: req.body.stok,
            deskripsi: req.body.deskripsi,
            image: req.file.filename
        }

        // get data yg akan diupdate utk mendapatkan nama file yang lama
        sql = "select * from barang where ?"
            // run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
                // tampung nama file yang lama
            let fileName = result[0].image

            // hapus file yg lama
            let dir = path.join(__dirname, "..", "image", "barang", fileName)
            fs.unlink(dir, (error) => {})
        })

    }

    // create sql update
    sql = "update barang set ? where ?"

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

// endpoint untuk menghapus data barang
app.delete("/:kode_barang", (req, res) => {
    let param = {
        kode_barang: req.params.kode_barang
    }

    // ambil data yang akan dihapus
    let sql = "select * from barang where ?"
        // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error

        // tampung nama file yang lama
        let fileName = result[0].image

        // hapus file yg lama
        let dir = path.join(__dirname, "..", "image", "barang", fileName)
        console.log(dir)
        fs.unlink(dir, (error) => {
            // create sql delete
            sql = "delete from barang where ?"

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

// endpoint ambil data barang
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from barang"

    // run query
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})