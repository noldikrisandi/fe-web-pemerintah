ini adalah Donggala APP. Dimana setiap user bisa memberikan aspirasi kepada pemerintah daerah

Panduan untuk menggunakan asplikasi Donggala APP.

1. Silahkan login, jika belum punya akun silahkan registrasi (pastikan ingat passwordnya karena ini di hash jadi tidak ada satupun orang pun yang tahu dan tidak ada fitur ubah password)
2. Setelah login anda akan membaca panduan penggunaan aplikasinya. Di dahsboard juga disuguhkan dengan aspirasi yang sudah diinput oleh semua user tetapi hanya menampilkan 3 data saja per status aspirasi agar tidak terlalu banyak data di dashboar
3. dibagian menu ada "Form Aspirasi", anda bisa menginputkan aspirasi. Tetapi dibatasi setiap 7 hari anda hanya bisa menginput maksimal 2 aspirasi.
4. pada menu "Semua Aspirasi" anda bisa melihat semua aspirasi yang telah masuk ke Donggala APP, beserta grafiknya.
5. Anda bisa melihat semua aspirasi yang anda inputkan melalui menu "Aspirasi Saya".
6. Anda bisa melihat dan mengedit profil anda melalui menu "Profil Saya".
7. Anda bisa logout dari aplikasi Donggala APP melalui menu "Logout".


Panduan untuk tim Ruangguru yang akan menguji aplikasi Donggala APP
1. Anda dapat menjalankan aplikasi ini di local dengan mengakses terminal dan mengarahkannya ke project ini.
2. ketik "npm run dev" kemudian enter untuk menjalankannya.
3. secara default aplikasi ini akan mengarah ke api api-web-pemerintah-production.up.railway.app/ karena api nya sudah saya deploy. Tapi jika mau mengaksesnya di local anda bisa mendownload foldernya di github saya dengan mengunjungi link https://github.com/noldikrisandi/api-web-pemerintah
4. Setelah mendownload atau clone https://github.com/noldikrisandi/api-web-pemerintah anda bisa menjalankannya dengan mengakses terminal dan mengarahkannya ke project yang anda berhasil anda download/clone kemudian ketikan perintah di terminal "go run main.go". Server API akan berjalan di http://localhost:8080/.
5. Penting jika anda ingin menjalankan aplikasi Donggala APP yang mengakses data melalui server http://localhost:8080/. Anda harus merubah konfigurasi API aplikasi Donnggala APP dengan membuka folder src/api/apiconnection.js, anda bisa langsung mengubah konfigurasinya.
Anda akan menemui skrip
// bisa koneksi dengan local 8080 atau langsung railway
const apiBaseUrl = 'https://api-web-pemerintah-production.up.railway.app/';
// const apiBaseUrl = 'http://localhost:8080/';

Ubah skrip di atas menjadi
// bisa koneksi dengan local 8080 atau langsung railway
// const apiBaseUrl = 'https://api-web-pemerintah-production.up.railway.app/';
const apiBaseUrl = 'http://localhost:8080/';

Jika anda mau menghapus konfigurasi ke railway nya juga bisa
const apiBaseUrl = 'http://localhost:8080/';

6. Anda bisa menjadi admin untuk mengubah status dan keterangan status, dengan melakukan login sebagai admin, silahkan mengakses /loginadmin. setelah login anda akan masuk ke halaman /aspirasilist.
7. Anda bisa menggunakan email "admin2@admin.com" password "pass2". Anda juga bisa registrasi sebagai admin baru dengan mengakses /registeradmin. Sebenarnya ini tidak aman karena menjadi satu dengan alamat yang di akses oleh user dan banyak orang, tetapi karena tugasnya hanya dalam satu project maka saya menempatkan akses admin di sini. 

Informasi Penting Lainnya
1. di dalam github ini saya tidak menghapus file Edit.jsx karena tidak menutup kemungkinan akan saya gunakan, karena itu saya juga menonaktifkan routing untuk halaman Edit.jsx. Jika anda mau mengakses halaman Edit.jsx maka fitur hapus datanya tidak akan berfungsi karena tabel-tabel di sini ada yang terkoneksi jadi tidak diberikan akses hapus oleh postgressql karena memang baiknya seperti itu.
2. Saya juga tidak mengapus func untuk menghapus data aspirasi sekalipun tidak bisa digunakan karena memang tabelnya saling terkoneksi, tetapi saya tidak menghapus func nya karena suatu saat siapa tahu dibutuhkan.

Jika ada kendala saat menjalankan aplikasi bisa menghubungi saya kakak-kakak/bapak-bapak/ibu-ibu.

Terimakasih 
Noldi Krisandi