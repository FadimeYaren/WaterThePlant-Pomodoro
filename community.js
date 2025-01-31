import { addDoc, collection, doc, getDocs, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "./firebase.js";

// 📌 Yeni konu ekleme fonksiyonu
document.getElementById("thread-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const email = document.getElementById("email").value.trim();

    if (title === "" || description === "" || email === "") {
        console.warn("UYARI: Lütfen tüm alanları doldurun!");
        return;
    }

    try {
        const newThreadRef = doc(collection(db, "forum-documents"));
        await setDoc(newThreadRef, {
            title,
            description,
            email,
            username: email.split("@")[0], // Kullanıcı ismini e-posta ön ekinden al
            timestamp: Date.now()
        });

        console.log("Başlık eklendi, ID:", newThreadRef.id);
        console.log("Başlık başarıyla eklendi.");
        document.getElementById("thread-form").reset();
    } catch (error) {
        console.error("Firestore'a eklenirken hata oluştu:", error);
    }
});

// 📌 Firestore’dan başlıkları çekme (Tıklanınca yorumları aç)
const threadsContainer = document.getElementById("threads");

onSnapshot(collection(db, "forum-documents"), (snapshot) => {
    threadsContainer.innerHTML = ""; // Önceki başlıkları temizle
    snapshot.forEach((doc) => {
        const thread = doc.data();
        const threadDiv = document.createElement("div");
        threadDiv.className = "thread-box";
        threadDiv.innerHTML = `
            <h3>${thread.title}</h3>
            <p>${thread.description}</p>
        `;
        threadDiv.onclick = () => showComments(doc.id, thread.title, thread.description);
        threadsContainer.appendChild(threadDiv);
    });
});

// 📌 Yorumları gösterme fonksiyonu (Artık sol sütunda)
window.showComments = async function(threadId, title, description) {
    console.log("Konu açıldı:", title);

    document.getElementById("threads").style.display = "none"; 
    document.getElementById("comment-section").style.display = "block"; 

    document.getElementById("thread-title").textContent = title;
    document.getElementById("thread-description").textContent = description;

    document.getElementById("breadcrumb-arrow").style.display = "inline"; 
    document.getElementById("current-thread").textContent = title; 

    const commentsContainer = document.getElementById("comments");
    commentsContainer.innerHTML = ""; 

    try {
        const commentsSnapshot = await getDocs(collection(db, `forum-documents/${threadId}/comments`));
        if (!commentsSnapshot.empty) {
            commentsSnapshot.forEach((doc) => {
                const comment = doc.data();
                const commentDiv = document.createElement("div");
                commentDiv.className = "comment-box";
                commentDiv.innerHTML = `<p>${comment.message}</p><small>${comment.username} (${comment.user_email})</small>`;
                commentsContainer.appendChild(commentDiv);
            });
        } else {
            commentsContainer.innerHTML = "<p>Henüz yorum yok. İlk yorumu ekleyin!</p>";
        }
    } catch (error) {
        console.error("Yorumlar yüklenirken hata oluştu:", error);
        commentsContainer.innerHTML = "<p>Yorumlar yüklenemedi.</p>";
    }

    document.getElementById("thread-form-container").classList.add("hidden");
    document.getElementById("comment-form-container").classList.remove("hidden");

    document.getElementById("comment-section").classList.remove("hidden");
    document.getElementById("comment-form").dataset.threadId = threadId;
};

// 📌 Yorum ekleme fonksiyonu (Alert kaldırıldı, Console mesajı eklendi)
document.getElementById("comment-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const commentText = document.getElementById("comment").value.trim();
    const commentEmail = document.getElementById("comment-email").value.trim();
    const threadTitle = document.getElementById("thread-title").textContent; 
    let threadId = null;

    if (commentText === "" || commentEmail === "") {
        console.warn("UYARI: Lütfen tüm alanları doldurun!");
        return;
    }

    console.log("Yorum ekleniyor:", { threadTitle, commentText, commentEmail });

    try {
        // 📌 Konunun Firestore ID'sini bul
        const querySnapshot = await getDocs(collection(db, "forum-documents"));
        querySnapshot.forEach((doc) => {
            if (doc.data().title === threadTitle) {
                threadId = doc.id;
            }
        });

        if (!threadId) {
            console.error("Hata: Konu ID'si bulunamadı!");
            return;
        }

        // 📌 Firestore'a yorum ekleme işlemi
        await addDoc(collection(db, `forum-documents/${threadId}/comments`), {
            user_email: commentEmail,
            username: commentEmail.split("@")[0], 
            message: commentText,
            timestamp: Date.now()
        });

        console.log("Yorum başarıyla eklendi:", { threadId, commentText, commentEmail });
        document.getElementById("comment-form").reset(); 

        // 📌 Yorum ekledikten sonra sayfayı güncelle
        showComments(threadId, document.getElementById("thread-title").textContent, document.getElementById("thread-description").textContent);
    } catch (error) {
        console.error("Yorum eklerken hata oluştu:", error);
    }
});

// 📌 Geri dönme fonksiyonu (Alert kaldırıldı, Console mesajı eklendi)
window.backToThreads = function() {
    console.log("Geri dön butonuna basıldı.");

    document.getElementById("comment-section").style.display = "none";
    document.getElementById("threads").style.display = "block";

    document.getElementById("breadcrumb-arrow").style.display = "none";
    document.getElementById("current-thread").textContent = "";

    document.getElementById("comment-form-container").classList.add("hidden");
    document.getElementById("thread-form-container").classList.remove("hidden");
};
