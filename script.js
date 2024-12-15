   const surahs = [
            "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
            "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
            "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
            "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
            "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
            "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
            "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
            "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
            "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
            "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
            "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
            "المسد", "الإخلاص", "الفلق", "الناس"
        ];
    let currentVerses = [];

        function createSurahList() {
            const surahListElement = document.getElementById('surah-list');
            surahs.forEach((surah, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'surah-item';
                listItem.innerHTML = `
                    <a href="#" data-surah-index="${index}">
                        <span class="surah-number">${index + 1}</span>
                        ${surah}
                    </a>
                `;
                surahListElement.appendChild(listItem);
            });
        }

        function initializeAudioPlayer() {
            const surahList = document.getElementById('surah-list');
            const audioPlayer = document.getElementById('audio-player');
            const currentSurahElement = document.getElementById('current-surah');
            const searchInput = document.getElementById('search-input');
            const verseDisplay = document.getElementById('verse-display');

            surahList.addEventListener('click', (e) => {
                e.preventDefault();
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    const surahIndex = parseInt(e.target.closest('a').getAttribute('data-surah-index'));
                    playSurah(surahIndex);
                }
            });

            // تحسين وظيفة البحث للبحث بالاسم أو الرقم
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const surahListItems = surahList.querySelectorAll('.surah-item');

                surahListItems.forEach((item, index) => {
                    const surahName = surahs[index].toLowerCase();
                    const surahNumber = (index + 1).toString();
                    if (surahName.includes(searchTerm) || surahNumber.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            async function playSurah(index) {
                const audioSource = audioLinks[index];
                audioPlayer.src = audioSource;
                audioPlayer.style.display = 'block';
                currentSurahElement.textContent = `السورة الحالية: ${surahs[index]}`;

                try {
                    const response = await fetch(`https://api.alquran.cloud/v1/surah/${index + 1}`);
                    const data = await response.json();
                    currentVerses = data.data.ayahs.map(ayah => ayah.text);
                    displayVerses(currentVerses);
                    audioPlayer.play();
                } catch (error) {
                    console.error('Error fetching verses:', error);
                    verseDisplay.textContent = 'عذرًا، حدث خطأ أثناء تحميل الآيات.';
                }
            }

            function displayVerses(verses) {
                verseDisplay.innerHTML = '';
                verses.forEach((verse, index) => {
                    const verseElement = document.createElement('div');
                    verseElement.className = 'verse';
                    verseElement.innerHTML = `
                        <span class="verse-number">${index + 1}</span>
                        ${verse}
                    `;
                    verseDisplay.appendChild(verseElement);
                });

                // إضافة أنيميشن للآيات
                const verseElements = verseDisplay.querySelectorAll('.verse');
                verseElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('highlight');
                        setTimeout(() => el.classList.remove('highlight'), 2000);
                    }, index * 100);
                });
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            createSurahList();
            initializeAudioPlayer();
        });

        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        function setTheme(theme) {
            if (theme === 'dark') {
                body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                body.classList.remove('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }

        function toggleTheme() {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            setTheme(newTheme);
        }

        // تهيئة الثيم
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }

        themeToggle.addEventListener('click', toggleTheme);

        // إضافة أنيميشن للعناصر عند التحميل
        function addFadeInAnimation() {
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        window.addEventListener('load', addFadeInAnimation);
