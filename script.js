// Menunggu sampai semua konten HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================== */
    /* ===== (KODE KUIS & GAME MEMORY KAMU) ====== */
    /* =========================================== */
    // Kode game-game kamu yang lain ada di bawah sini...

    // Ambil form dan tombol submit-nya
    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');

    // Tambahkan event listener saat form di-submit
    quizForm.addEventListener('submit', (event) => {
        // Mencegah halaman refresh saat tombol submit diklik
        event.preventDefault();

        // --- GANTI JAWABAN YANG BENAR DI SINI ---
        const correctAnswers = {
            q1: 'b', // Jawaban benar untuk pertanyaan 1 adalah 'b'
            q2: 'c', // Jawaban benar untuk pertanyaan 2 adalah 'c'
            q3: 'a',  // Jawaban benar untuk pertanyaan 3 adalah 'a'
            q4: 'a'
        };

        let score = 0;
        const totalQuestions = Object.keys(correctAnswers).length;

        // Loop untuk cek setiap jawaban
        for (const question in correctAnswers) {
            // Ambil jawaban user yang dipilih
            const userInput = quizForm.querySelector(`input[name="${question}"]:checked`);

            if (userInput) {
                // Bandingkan jawaban user dengan kunci jawaban
                if (userInput.value === correctAnswers[question]) {
                    score++;
                }
            }
        }

        // Tampilkan hasil skor
        let resultMessage = `Skor kamu: ${score} dari ${totalQuestions}. `;

        if (score === totalQuestions) {
            resultMessage += "Wow! Bubu ingat semuanya! I Love You!";
        } else if (score >= totalQuestions / 2) {
            resultMessage += "Hampir sempurna! Ingatanmu bagus, hehe.";
        } else {
            resultMessage += "Issoke kalau kurang tepat ya bubu!";
        }

        resultDiv.textContent = resultMessage;
    });

    /* =========================================== */
    /* =========== LOGIKA GAME MEMORY ============ */
    /* =========================================== */

    // --- GANTI IKON-IKON INI SESUKAMU (HARUS BERPASANGAN) ---
    // Pastikan jumlahnya genap (total 8 kartu, 12 kartu, 16 kartu, dll)
    const cardIcons = [
        '❤️', '❤️', '🐼', '🐼', '🐻', '🐻', '💐', '💐'
    ]; // Total 8 kartu (4 pasang)

    const gameBoard = document.querySelector('.memory-game');
    const restartButton = document.getElementById('restart-memory');
    const memoryStatus = document.getElementById('memory-status');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchesFound = 0;
    let totalPairs = cardIcons.length / 2;

    // Fungsi untuk mengacak array (Fisher-Yates shuffle)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // Fungsi untuk membuat papan permainan
    function createBoard() {
        // Kosongkan papan dulu
        gameBoard.innerHTML = '';
        matchesFound = 0;
        memoryStatus.textContent = "Selamat bermain!";

        // Acak ikon-ikonnya
        const shuffledIcons = shuffle(cardIcons);

        shuffledIcons.forEach(icon => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            // Simpan data ikon di 'dataset'
            card.dataset.icon = icon;

            // Buat sisi depan dan belakang kartu
            card.innerHTML = `
                <div class="card-face card-front">${icon}</div>
                <div class="card-face card-back">❤️</div> 
            `;

            // Tambahkan kartu ke papan
            gameBoard.appendChild(card);

            // Tambahkan event listener untuk membalik kartu
            card.addEventListener('click', flipCard);
        });
    }

    // Fungsi utama saat kartu diklik
    function flipCard() {
        // 'this' adalah kartu yang diklik

        // Jangan lakukan apa-apa jika papan dikunci
        if (lockBoard) return;
        // Jangan lakukan apa-apa jika kartu yang sama diklik dua kali
        if (this === firstCard) return;

        this.classList.add('is-flipped');

        if (!hasFlippedCard) {
            // Ini adalah kartu pertama yang dibalik
            hasFlippedCard = true;
            firstCard = this;
        } else {
            // Ini adalah kartu kedua yang dibalik
            secondCard = this;
            lockBoard = true; // Kunci papan

            // Cek apakah cocok
            checkForMatch();
        }
    }

    // Fungsi untuk cek kecocokan
    function checkForMatch() {
        // Cek data ikon yang disimpan
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        if (isMatch) {
            // Jika cocok
            matchesFound++;
            disableCards();
            if (matchesFound === totalPairs) {
                // Semua cocok (Menang)
                memoryStatus.textContent = "Hore! Bubu berhasil cocokkin semua! 🎉";
            }
        } else {
            // Jika tidak cocok
            unflipCards();
        }
    }

    // Fungsi jika kartu cocok
    function disableCards() {
        // Kasih jeda waktu agar animasi flip-nya selesai
        // Animasi CSS kita kan 0.5s (500ms), jadi kita kasih 600ms
        setTimeout(() => {
            firstCard.classList.add('is-matched');
            secondCard.classList.add('is-matched');

            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);

            resetBoard();
        }, 600); // <-- INI BAGIAN PENTINGNYA
    }

    // Fungsi jika kartu tidak cocok
    function unflipCards() {
        // Kasih jeda waktu 1 detik agar user bisa lihat kartu kedua
        setTimeout(() => {
            firstCard.classList.remove('is-flipped');
            secondCard.classList.remove('is-flipped');

            resetBoard();
        }, 1000);
    }

    // Fungsi untuk reset state papan
    function resetBoard() {
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
    }

    // Event listener untuk tombol 'Mulai Ulang'
    restartButton.addEventListener('click', createBoard);

    // Langsung buat papan permainan saat halaman dimuat
    createBoard();

});