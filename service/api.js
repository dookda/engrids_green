const express = require('express');
const app = express.Router();
const con = require("./db");
const cv = con.dat;


app.post("/api/pin-insert", (req, res) => {
    const { stype, sdesc, img, geom } = req.body;
    const pkid = "img" + Date.now();
    const sql =
        "INSERT INTO survey (stype, sdesc, pkid, img, geom) " +
        "VALUES ($1,$2,$3,$4,ST_SetSRID(st_geomfromgeojson($5), 4326))";
    const val = [stype, sdesc, pkid, img, geom];
    cv.query(sql, val).then(() => {
        res.status(200).json({
            status: "success",
            message: "insert data"
        });
    });
});

app.post("/api/pin-update", (req, res) => {
    const { stype, sdesc, img, geom, id } = req.body;
    let sql, val;
    if (img == "-") {
        sql =
            "UPDATE survey SET stype=$1,sdesc=$2," +
            "geom=ST_SetSRID(st_geomfromgeojson($3), 4326) WHERE id=$4";
        val = [stype, sdesc, geom, id];
    } else {
        sql =
            "UPDATE survey SET stype=$1,sdesc=$2,img=$3," +
            "geom=ST_SetSRID(st_geomfromgeojson($4), 4326) WHERE id=$5";
        val = [stype, sdesc, img, geom, id];
    }

    // console.log(val)
    cv.query(sql, val).then(() => {
        res.status(200).json({
            status: "success",
            message: "insert data"
        });
    });
});

app.get("/api/pin-getdata", (req, res) => {
    const sql =
        "SELECT id,stype,sdesc,simg,pkid,img,st_x(geom) as lon,st_y(geom) as lat FROM survey";
    let jsonFeatures = [];
    cv.query(sql).then(data => {
        var rows = data.rows;
        rows.forEach(e => {
            // console.log(e.img)
            let feature = {
                type: "Feature",
                properties: e,
                geometry: {
                    type: "Point",
                    coordinates: [e.lon, e.lat]
                }
            };
            jsonFeatures.push(feature);
        });
        let geoJson = {
            type: "FeatureCollection",
            features: jsonFeatures
        };
        res.status(200).json(geoJson);
    });
});

app.get("/api/pin-getimg/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT id,img FROM acc_img WHERE id = $1";
    val = [id];
    cv.query(sql, val).then(data => {
        res.status(200).json({
            status: "success",
            message: "get disease",
            data: data.rows
        });
    });
});

app.post("/api/pin-delete", (req, res) => {
    const { id } = req.body;
    console.log(id);
    const sql = "DELETE FROM survey WHERE id=$1";
    const val = [id];
    cv.query(sql, val).then(() => {
        res.status(200).json({
            status: "success",
            message: "deleted data"
        });
    });
});

// end pin form

app.get("/api/getgreen/:lat/:lon", (req, res) => {
    const lat = req.params.lat;
    const lon = req.params.lon;
    const buff = 10;
    const sql = `SELECT cname as name, csname as descriptio, cscode as subcode_1 FROM pk_green_09082020 
      WHERE ST_DWithin(ST_Transform(geom,3857), 
      ST_Transform(ST_GeomFromText('POINT(${lon} ${lat})',4326), 3857), ${buff}) = 'true'`;
    cv.query(sql).then(data => {
        res.status(200).json({
            status: "success",
            message: "get disease",
            data: data.rows
        });
    });
});

app.get("/api/getgreenbycom", (req, res) => {
    const sql = `SELECT * FROM pivot_green_31aug2020`;

    cv.query(sql).then(data => {
        res.status(200).json({
            status: "success",
            data: data.rows
        });
    });
})

app.get("/api/getgreenarea", (req, res) => {
    const sql = `SELECT cname, sum(pk_g_rai) FROM pk_green_09082020
    GROUP BY cname ORDER BY cname`;

    cv.query(sql).then(data => {
        res.status(200).json({
            status: "success",
            data: data.rows
        });
    });
})



module.exports = app;