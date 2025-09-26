const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("results");

searchButton.addEventListener("click", showResults);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    showResults();
  }
});

async function showResults() {
  const input = searchInput.value.trim();
  if (!input) {
    alert("Please enter a word");
    return;
  }
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${input}`;

  searchResults.innerHTML = `<h1 class="fw-bold mb-2 placeholder-glow">
                        <span class="placeholder col-6 rounded-5"></span>
                      </h1>
                    <p class="text-muted mb-2 placeholder-glow">
                        <span class="placeholder col-4 rounded-3"></span></p>
                    <hr class="mb-2" />

                    <p class="text-primary fw-bold fst-italic mb-1 placeholder-glow"><span class="placeholder col-3 rounded-3"></span></p>
                    <p class="text-secondary placeholder-glow"
                      >
                      <span class="placeholder col-12 rounded-3"></span>
                      <span class="placeholder col-6 rounded-3"></span></p
                    >
                    <p class="text-primary fw-bold fst-italic mb-1 placeholder-glow"><span class="placeholder col-3 rounded-3"></span></p>
                    <p class="text-secondary placeholder-glow"
                      >
                      <span class="placeholder col-12 rounded-3"></span>
                      <span class="placeholder col-6 rounded-3"></span></p
                    >
    `;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    const data = await res.json();
    displayData(data);
  } catch (err) {
    searchResults.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Could not fetch definition. Please try again.
      </div>
    `;
    console.error(err);
  }
  searchInput.value = "";
}
function displayData(data) {
  searchResults.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    searchResults.innerHTML = `
      <div class="alert alert-danger" role="alert">
        No results found. Please try again.
      </div>
    `;
    return;
  }

  const entry = data[0];
  if (!entry) {
    searchResults.innerHTML = `<div class="alert alert-danger" role="alert">
    No results found. Please try again.
</div>`;
    return;
  }
  let html = `
    <h1 class="fw-bold mb-2">${entry.word}</h1>
    <p class="text-muted mb-2">${entry.phonetic || ""}</p>
    <hr class="mb-2" />
  `;

  entry.meanings.forEach((meaning) => {
    const partOfSpeech = meaning.partOfSpeech;
    const definition =
      meaning.definitions[0]?.definition || "No definition available";
    html += `
      <p class="text-primary fw-bold fst-italic mb-1">${partOfSpeech}</p>
      <span class="text-secondary">${definition}</span>
    `;
  });

  searchResults.innerHTML = html;
}
