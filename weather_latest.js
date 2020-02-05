const ftp = require("ftp");
const fs = require("fs");
var xmldoc = require('xmldoc');

class Reading {
    constructor(id, name, lat, lon, datetime) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.datetime = datetime;
        this.wind_dir = "?";
        this.wind_spd_kmh = -1;
    }
    language() {
        var env = process.env;
        return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || "en-AU";
    }
    get time() {
        return this.datetime.toLocaleString(this.language());
    }
    toString() {
        return `${this.id} ${this.name} ${this.time} ${this.wind_dir} ${this.wind_spd_kmh} (${this.lat},${this.lon}) ${this.Distance}`;
    }
}

var CANBERRA = [-35.2812958, 149.124822];
var READINGS = [];

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getinfo(elements, tag) {
    for (e of elements) {
        if (e.attr.type == tag) {
            return e.val;
        }
    }
    return null;
}
/*
<station wmo-id="94926" bom-id="070351" tz="Australia/Sydney" stn-name="CANBERRA AIRPORT" stn-height="577.05" type="AWS" lat="-35.3088" lon="149.2004" forecast-district-id="NSW_PW017" description="Canberra">
  <period index="0" time-utc="2020-02-02T00:40:00+00:00" time-local="2020-02-02T11:40:00+11:00" wind-src="OMD">
    <level index="0" type="surface">
      <element units="Celsius" type="apparent_temp">28.0</element>
      <element type="cloud">Mostly clear</element>
      <element type="cloud_oktas">1</element>
      <element units="Celsius" type="delta_t">8.8</element>
      <element units="km/h" type="gust_kmh">39</element>
      <element units="knots" type="wind_gust_spd">21</element>
      <element units="Celsius" type="air_temperature">31.3</element>
      <element units="Celsius" type="dew_point">17.9</element>
      <element units="hPa" type="pres">1010.5</element>
      <element units="hPa" type="qnh_pres">1010.5</element>
      <element units="%" type="rel-humidity">44</element>
      <element units="km" type="vis_km">40</element>
      <element type="wind_dir">WNW</element>
      <element units="deg" type="wind_dir_deg">284</element>
      <element units="km/h" type="wind_spd_kmh">32</element>
      <element units="knots" type="wind_spd">17</element>
      <element start-time-local="2020-02-02T09:00:00+11:00" end-time-local="2020-02-02T11:42:00+11:00" duration="162" start-time-utc="2020-02-01T22:00:00+00:00" end-time-utc="2020-02-02T00:42:00+00:00" units="mm" type="rainfall">0.0</element>
      <element start-time-local="2020-02-01T09:00:00+11:00" end-time-local="2020-02-02T09:00:00+11:00" duration="1440" start-time-utc="2020-01-31T22:00:00+00:00" end-time-utc="2020-02-01T22:00:00+00:00" units="mm" type="rainfall_24hr">0.0</element>
      <element start-time-local="2020-02-02T06:00:00+11:00" end-time-local="2020-02-02T21:00:00+11:00" start-time-utc="2020-02-01T19:00:00+00:00" end-time-utc="2020-02-02T10:00:00+00:00" units="Celsius" type="maximum_air_temperature" instance="running" time-utc="2020-02-01T23:22:00+00:00" time-local="2020-02-02T10:22:00+11:00">33.2</element>
      <element start-time-local="2020-02-01T18:00:00+11:00" end-time-local="2020-02-02T09:00:00+11:00" start-time-utc="2020-02-01T07:00:00+00:00" end-time-utc="2020-02-01T22:00:00+00:00" units="Celsius" type="minimum_air_temperature" instance="running" time-utc="2020-02-01T17:07:00+00:00" time-local="2020-02-02T04:07:00+11:00">26.7</element>
      <element start-time-local="2020-02-02T00:00:00+11:00" end-time-local="2020-02-03T00:00:00+11:00" start-time-utc="2020-02-01T13:00:00+00:00" end-time-utc="2020-02-02T13:00:00+00:00" units="knots" type="maximum_gust_spd" instance="running" time-utc="2020-02-01T23:59:00+00:00" time-local="2020-02-02T10:59:00+11:00">28</element>
      <element start-time-local="2020-02-02T00:00:00+11:00" end-time-local="2020-02-03T00:00:00+11:00" start-time-utc="2020-02-01T13:00:00+00:00" end-time-utc="2020-02-02T13:00:00+00:00" units="km/h" type="maximum_gust_kmh" instance="running" time-utc="2020-02-01T23:59:00+00:00" time-local="2020-02-02T10:59:00+11:00">52</element>
      <element start-time-local="2020-02-02T00:00:00+11:00" end-time-local="2020-02-03T00:00:00+11:00" start-time-utc="2020-02-01T13:00:00+00:00" end-time-utc="2020-02-02T13:00:00+00:00" type="maximum_gust_dir" instance="running" time-utc="2020-02-01T23:59:00+00:00" time-local="2020-02-02T10:59:00+11:00">W</element>
    </level>
  </period>
</station>
*/

/**
 * Load weather xml
 * @param {string} data 
 */
function loadweather(data) {
    var xml = new xmldoc.XmlDocument(data);
    console.log("XML Parsed.");
    var obs = xml.childNamed("observations");
    var stations = obs.childrenNamed("station");
    READINGS = [];
    for (let st of stations) {
        let lat = st.attr.lat;
        let lon = st.attr.lon;
        let id = st.attr["wmo-id"];
        let dist = Math.round(getDistanceFromLatLonInKm(CANBERRA[0], CANBERRA[1], parseFloat(lat), parseFloat(lon)));
        if (dist <= 60) {
            let p = st.childNamed("period");
            let record = new Reading(id, st.attr["stn-name"], lat, lon, new Date(p.attr["time-local"]));
            let lev = p.childNamed("level");
            let elements = lev.childrenNamed("element");
            for (e of elements) {
                record[e.attr.type] = e.val;
            }
            record.Distance=dist;
            let temp = record["air_temperature"];
            let winddir = record["wind_dir"];
            let windspeed = record["wind_spd_kmh"];
            //console.log(record.id + " " + record.name + " " + lat + "," + lon + " " + dist + "km " + temp + " " + winddir + " " + windspeed);
            READINGS.push(record);
            //console.log(record);
        }
    }
    for (r of READINGS) {
        console.log(r.toString());
    }
}

const URL_WEATHER = "ftp://ftp.bom.gov.au/anon/gen/fwo/IDN60920.xml";
console.log("Weather");
var client = new ftp();
client.on('ready', function () {
    console.log('Connected.');
    this.get('anon/gen/fwo/IDN60920.xml', function (error, stream) {
        if (error) {
            console.log("Error=" + error);
            client.end();
        }
        var mydata = "";
        stream.on('data', (data) => { mydata += data.toString(); });
        stream.on('end', () => {
            console.log("Done. " + mydata.length);
            client.end();
            loadweather(mydata);
        });
        console.log("Reading...");
        stream.resume();
    }
    );
});

client.connect({ host: "ftp.bom.gov.au" });
console.log("Request issued.");
