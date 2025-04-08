const canvas = document.getElementById("mansZimejums");
const ctx = canvas.getContext("2d");

// Spēles objekti
let man_x = 0; // "man" x ass
let man_y = 0; // "man" y ass
const man_width = 85; // "man" platums
const man_height = 85; // "man" augstums
const ManImg = new Image(); 
ManImg.src = "man.png"; // "man" attēls

let nauda_x = 0; // "nauda" x ass
let nauda_y = 0; // "nauda" y ass
const nauda_width = 35; // "nauda" platums
const nauda_height = 35; // "nauda" augstums
const NaudaImg = new Image();
NaudaImg.src = "nauda.png"; // "nauda" attēls

// Spēles mainīgie
let score = 0;
let nauds_speed = 3; // "nauda" krišanas ātrums
const FPS = 40; // Kadri sekundē
let time_remaining = 20;

// Restartēt spēli
function restart_game() {
    time_remaining = 20;
    score = 0;
    nauds_speed = 3;
}

// Pārbauda, vai divi objekti pārklājas
function ImagesTouching(x1, y1, obj1, x2, y2, obj2) {
    if (x1 >= x2 + obj2.width || x1 + obj1.width <= x2) return false; // Pārāk tālu uz sāniem
    if (y1 >= y2 + obj2.height || y1 + obj1.height <= y2) return false; // Pārāk tālu augšā/apakšā
    return true; // Saskaras
}

// Atjaunina spēles laukumu
function Laukums() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Notīra laukumu

    // Parāda rezultātu
    ctx.fillStyle = "purple";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    // Zīmē "man" objektu
    man_y = canvas.height - man_height; // "man" vienmēr atrodas apakšā
    ctx.drawImage(ManImg, man_x, man_y, man_width, man_height);

    // Parāda atlikušo laiku
    ctx.fillText("Time Remaining: " + Math.round(time_remaining), 10, 45);

    if (time_remaining <= 0) { // Ja laiks ir beidzies
        ctx.fillStyle = "red";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.font = "bold 20px Arial";
        ctx.fillText("Press S to play again", canvas.width / 2, (canvas.height / 2) + 50);
        ctx.textAlign = "left";
    } else {
        time_remaining -= 1 / FPS; // Samazina atlikušo laiku

        // Kustina "nauda" uz leju
        nauda_y += nauds_speed;

        // Ja "nauda" iziet ārpus ekrāna, tā tiek pārvietota atpakaļ uz augšu
        if (nauda_y > canvas.height) {
            nauda_y = 0;
            nauda_x = Math.random() * (canvas.width - nauda_width);
        }
    }

    // Zīmē "nauda"
    ctx.drawImage(NaudaImg, nauda_x, nauda_y, nauda_width, nauda_height);

    // Pārbauda, vai "man" un "nauda" saskaras
    if (ImagesTouching(man_x, man_y, { width: man_width, height: man_height }, nauda_x, nauda_y, { width: nauda_width, height: nauda_height })) {
        score += 1; // Palielina rezultātu
        nauds_speed += 0.5; // Palielina "nauda" ātrumu
        nauda_x = -nauda_width; // Paslēpj "nauda", lai nepieļautu tūlītēju saskari
    }
}

// Atjaunina spēles laukumu ik pēc noteikta intervāla
setInterval(Laukums, 1000 / FPS);

// Apstrādā taustiņu nospiešanu
function MyKeyDownHandler(event) {
    if (event.keyCode === 37 && man_x > 0) { // Kreisā bulta
        man_x -= 10;
    }
    if (event.keyCode === 39 && man_x + man_width < canvas.width) { // Labā bulta
        man_x += 10;
    }
    if (event.keyCode === 83) { // Taustiņš "S"
        restart_game();
    }
    event.preventDefault();
}

// Klausās taustiņu nospiešanas notikumus
addEventListener("keydown", MyKeyDownHandler);

// Pielāgo spēles laukuma izmērus
canvas.width = Math.min(window.innerWidth - 20, 400);
canvas.height = Math.min(window.innerHeight - 20, 400);