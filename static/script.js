const lettersInput = document.getElementById("letters");
const hide3Checkbox = document.getElementById("hide_3_letters");

// Только русские буквы + CAPS
lettersInput.addEventListener("input", () => {
    const pos = lettersInput.selectionStart;
    lettersInput.value = lettersInput.value
        .replace(/[^а-яё]/gi, "")
        .toUpperCase();
    lettersInput.setSelectionRange(pos, pos);
});

// Enter — поиск
lettersInput.addEventListener("keydown", e => {
    if (e.key === "Enter") solve();
});

function solve() {
    const letters = lettersInput.value.toLowerCase();
    if (!letters) return;

    fetch("/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            letters,
            min_length: hide3Checkbox.checked ? 4 : 3
        })
    })
    .then(res => res.json())
    .then(words => {
        const div = document.getElementById("words");
        const hadWords = div.children.length > 0;

        div.innerHTML = "";

        words.sort((a, b) => a.length - b.length || a.localeCompare(b));

        words.forEach((w, i) => {
            const item = document.createElement("div");
            item.className = `word-item word-len-${w.length}`;
            item.textContent = w.toUpperCase();
            item.style.animationDelay = `${i * 0.02}s`;
            item.onclick = () => navigator.clipboard.writeText(w);

            div.appendChild(item);
        });

        if (words.length && !hadWords) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }, 200);
        }
    });
}

function clearWords() {
    document.getElementById("words").innerHTML = "";
    lettersInput.value = "";
    lettersInput.focus();
}

// Горячие клавиши
document.addEventListener("keydown", e => {
    if (e.key === "Delete") clearWords();
    if (e.key === "3") {
        hide3Checkbox.checked = !hide3Checkbox.checked;
        if (lettersInput.value.trim()) solve();
    }
});

// Автофильтр
hide3Checkbox.addEventListener("change", () => {
    if (lettersInput.value.trim()) solve();
});
