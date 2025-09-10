const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
const ctx = overlay.getContext('2d');

let selectedFace = null;

async function setup() {
    // Load model face-api.js
    await faceapi.nets.tinyFaceDetector.loadFromUri('models');

    // akses webcam
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error("Error accessing webcam:", err));
}

startButton.addEventListener('click', async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

    if (detections.length > 0) {
        // Pilih wajah acak
        selectedFace = detections[Math.floor(Math.random() * detections.length)];

        // Bersihkan canvas
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        // Gambar kotak merah di wajah terpilih
        const { x, y, width, height } = selectedFace.box;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x, y, width, height);

        // Zoom / crop
        const zoomFactor = 2; // bisa diubah
        const zoomX = Math.max(x - width / zoomFactor, 0);
        const zoomY = Math.max(y - height / zoomFactor, 0);
        const zoomW = Math.min(width * zoomFactor, video.width - zoomX);
        const zoomH = Math.min(height * zoomFactor, video.height - zoomY);

        ctx.drawImage(video, zoomX, zoomY, zoomW, zoomH, 0, 0, overlay.width, overlay.height);
    } else {
        alert("Tidak ada wajah terdeteksi!");
    }
});

// jalankan setup
setup();
