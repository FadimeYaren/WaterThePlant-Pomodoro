// Dark mode toggle function
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Logo changing
    const logo = document.getElementById("logo");
    if (document.body.classList.contains('dark-mode')) {
        logo.src = "img/general/logowhite.png"; // white logo for dark mode
    } else {
        logo.src = "img/general/logoblack.png"; // black logo for light mode
    }
}

const translations = {
    tr: {
        home: "Anasayfa",
        notes: "Notlar",
        pomodoro: "Pomodoro",
        todos: "Yapılacaklar Listesi",
        title: "Yapılacaklar Listesi",
        content: "Bir seferde bir işi halledin.",
        emptyMessage: "Yapılacaklar listeniz boş.",
        work: "İş",
        personal: "Kişisel",
        education: "Eğitim",
        addItemLabel: "Yapılacaklar listesine ekle",
        newItemPlaceholder: "Ne yapmanız gerekiyor?",
        priorityLevel: "Öncelik Seviyesi:",
        priority: "Öncelik: 3",
        addButton: "Ekle"
    },
    en: {
        home: "Home",
        notes: "Notes",
        pomodoro: "Pomodoro",
        todos: "To-Do List",
        title: "To-Do List",
        content: "Get things done, one item at a time.",
        emptyMessage: "Your to-do list is empty.",
        work: "Work",
        personal: "Personal",
        education: "Education",
        addItemLabel: "Add to the to-do list",
        newItemPlaceholder: "What do you need to do?",
        priorityLevel: "Priority Level:",
        priority: "Priority: 3",
        addButton: "Add Item"
    },
    de: {
        home: "Startseite",
        notes: "Notizen",
        pomodoro: "Pomodoro",
        todos: "To-Do-Liste",
        title: "To-Do-Liste",
        content: "Erledige die Dinge, einen Gegenstand nach dem anderen.",
        emptyMessage: "Deine To-Do-Liste ist leer.",
        work: "Arbeit",
        personal: "Persönlich",
        education: "Bildung",
        addItemLabel: "Zur To-Do-Liste hinzufügen",
        newItemPlaceholder: "Was musst du tun?",
        priorityLevel: "Prioritätsstufe:",
        priority: "Priorität: 3",
        addButton: "Hinzufügen"
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

setLanguage('en'); // Default language
