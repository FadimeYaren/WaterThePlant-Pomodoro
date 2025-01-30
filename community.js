import { addDoc, collection, doc, getDocs, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "./firebase.js";

// 📌 Yeni konu ekleme fonksiyonu
document.getElementById("thread-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const email = document.getElementById("email").value.trim();

    if (title === "" || description === "" || email === "") {
        alert("Lütfen tüm alanları doldurun!");
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
        alert("Başlık başarıyla eklendi!");
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
    document.getElementById("threads").style.display = "none"; // Konu listesini gizle
    document.getElementById("comment-section").style.display = "block";

    document.getElementById("thread-title").textContent = title;
    document.getElementById("thread-description").textContent = description;

    document.getElementById("current-thread").textContent = title; // Breadcrumb güncelle

    const commentsContainer = document.getElementById("comments");
    commentsContainer.innerHTML = "";

    const commentsSnapshot = await getDocs(collection(db, `forum-documents/${threadId}/comments`));
    commentsSnapshot.forEach((doc) => {
        const comment = doc.data();
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment-box";
        commentDiv.innerHTML = `<p>${comment.message}</p><small>${comment.username} (${comment.user_email})</small>`;
        commentsContainer.appendChild(commentDiv);
    });

    // 📌 Yorum ekleme formunu bağla
    document.getElementById("comment-form").onsubmit = async (e) => {
        e.preventDefault();
        const commentText = document.getElementById("comment").value;
        const commentEmail = document.getElementById("comment-email").value;

        await addDoc(collection(db, `forum-documents/${threadId}/comments`), {
            user_email: commentEmail,
            username: commentEmail.split("@")[0], // Kullanıcı ismini e-posta ön ekinden al
            message: commentText,
            timestamp: Date.now()
        });

        alert("Yorum eklendi!");
        document.getElementById("comment-form").reset();
        showComments(threadId, title, description); // Sayfayı güncelle
    };
};

// 📌 Geri dönme fonksiyonu (Yorumları kapatınca konu listesini geri getir)
window.backToThreads = function() {
    document.getElementById("comment-section").style.display = "none";
    document.getElementById("threads").style.display = "block"; // Konu listesini geri getir
    document.getElementById("current-thread").textContent = "Ana Sayfa"; // Breadcrumb sıfırla
};
