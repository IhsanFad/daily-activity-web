const API_URL = "https://script.google.com/macros/s/AKfycbxdgafxvKkpYV05bq0yV22E3OhHoLNMD3sx53ddAabt-QL7q7Z-QBbEyPObMKeOgnYT/exec"



function toast(msg){

let t=document.getElementById("toast")

t.innerText=msg
t.style.display="block"

setTimeout(()=>{
t.style.display="none"
},2000)

}



// format tanggal Indonesia
function formatTanggal(dateString){

let date = new Date(dateString)

let hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"]
let bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]

let h = hari[date.getDay()]
let t = date.getDate()
let b = bulan[date.getMonth()]
let y = date.getFullYear()

let jam = date.getHours().toString().padStart(2,'0')
let menit = date.getMinutes().toString().padStart(2,'0')

return `${h}, ${t} ${b} ${y} ${jam}:${menit}`

}



// tambah data kegiatan
function tambahData(){

  let data = {

    action: "add",
    tanggal: document.getElementById("tanggal").value,
    kegiatan: document.getElementById("kegiatan").value,
    lokasi: document.getElementById("lokasi").value

  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(res => {

    if(res.status === "success"){

      // Hapus semua isi input setelah berhasil disimpan
      document.getElementById("tanggal").value = "";
      document.getElementById("kegiatan").value = "";
      document.getElementById("lokasi").value = "";

      toast("Data berhasil disimpan");

      // Refresh tabel dan statistik
      loadData();

    } else {

      toast("Data gagal disimpan");

    }

  })
  .catch(error => {

    console.error("Error:", error);

    toast("Terjadi kesalahan saat menyimpan data");

  });

}


// load data dari spreadsheet
function loadData(){

fetch(API_URL)
.then(r=>r.json())
.then(data=>{

let table=""

let today=0
let week=0
let month=0

let now=new Date()

data.forEach(d=>{

let tgl=new Date(d.tanggal)

if(tgl.toDateString()==now.toDateString()) today++

if(tgl.getMonth()==now.getMonth()) month++

let diff=(now - tgl)/(1000*60*60*24)

if(diff<=7) week++


table+=`

<tr>

<td>${formatTanggal(d.tanggal)}</td>
<td>${d.kegiatan}</td>
<td>${d.lokasi}</td>

<td>
<button onclick="hapus('${d.id}')">Delete</button>
</td>

</tr>

`

})

document.getElementById("tableData").innerHTML=table

document.getElementById("today").innerText=today
document.getElementById("week").innerText=week
document.getElementById("month").innerText=month

})

}



// hapus data
function hapus(id){

fetch(API_URL,{

method:"POST",
body:JSON.stringify({
action:"delete",
id:id
})

})
.then(r=>r.json())
.then(res=>{

toast("Data dihapus")

loadData()

})

}



loadData()
