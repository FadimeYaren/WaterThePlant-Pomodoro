document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("feedback-form");
    const feedbackList = document.getElementById("feedback-list");

    // LocalStorage'dan geri bildirimleri yükle
    function loadFeedback() {
        const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        feedbackList.innerHTML = "";
        feedbacks.forEach(feedback => {
            const feedbackItem = document.createElement("div");
            feedbackItem.classList.add("feedback-item");
            feedbackItem.innerHTML = `<strong>${feedback.username}</strong> - <em>${feedback.title}</em>
                                      <p>${feedback.message}</p>`;
            feedbackList.appendChild(feedbackItem);
        });
    }

    loadFeedback();

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const username = document.getElementById("username").value;
        const title = document.getElementById("title").value;
        const message = document.getElementById("message").value;

        if (username && title && message) {
            const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
            feedbacks.push({ username, title, message });
            localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

            form.reset();
            loadFeedback();
        }
    });
});
