function openModal() {
    document.getElementById("mangaModal").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
}

function closeModal() {
    document.getElementById("mangaModal").style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
}

function addManga() {
    let url = document.getElementById("mangaUrl").value;
    if (url) {
        let saved_manga = JSON.parse(localStorage.getItem("savedManga")) || {};
        if (!saved_manga.hasOwnProperty(url)) {
            fetch(`https://13.214.130.193:5000/import_manga?url=${url}`)
            .then(response => response.json())
            .then(data => {
                saved_manga[url] = data;
                saved_manga[url]["last_read"] = 0;
                localStorage.setItem("savedManga", JSON.stringify(saved_manga));
                updateMangaList();
            })
            .catch(error => console.error("Error fetching chapters:", error));
            alert("Manga URL added: " + url);
        } else {
            alert("This URL is already added.");
        }
        closeModal();
    }
}

function updateMangaList() {
    let saved_manga = JSON.parse(localStorage.getItem("savedManga")) || [];
    let mangaContainer = document.getElementById("manga_container");
    mangaContainer.innerHTML = "";

//     <div class="manga">
//     <img class="manga_thumbnail"
//         src="https://images.squarespace-cdn.com/content/v1/6670add926f2a64cd00fb0e7/d2f9b9c1-ab9c-4fe2-a793-d6a8634ac920/character+chii.png">
//     <h4 class="title">
//         <u>Chiikawa</u>
//     </h4>
// </div>

    Object.keys(saved_manga).forEach(url => {
        
        let a = document.createElement("a");
        let d = document.createElement("div");
        let unread_d = document.createElement("div");
        let img = document.createElement("img");
        let h4 = document.createElement("h4");
        let u = document.createElement("u");
        
        fetch(`https://13.214.130.193:5000/get_last?source=${encodeURIComponent(saved_manga[url]['source'])}&id=${encodeURIComponent(saved_manga[url]['manga_id'])}`)
        .then(response => response.json())
        .then(data => {
            last_read = saved_manga[url]['last_read'];
            new_chapters = data["last_chapter"] - last_read

            if (new_chapters) {
                unread_d.innerHTML = new_chapters
                d.appendChild(unread_d);
            }
        })
        .catch(error => console.error("Error fetching last chapter:", error));
        
        a.href = `manga.html?source=${saved_manga[url]['source']}&id=${saved_manga[url]['manga_id']}&url=${url}`
        d.classList.add("manga");
        unread_d.classList.add("unread");
        img.classList.add("manga_thumbnail");
        img.src = saved_manga[url]["thumbnail_url"];
        h4.classList.add("title");
        u.innerHTML = saved_manga[url]["manga_title"]
        a.appendChild(d);
        d.appendChild(img);
        d.appendChild(h4);
        h4.appendChild(u);
        mangaContainer.appendChild(a);
    });
}

// Load saved manga URLs when the page loads
document.addEventListener("DOMContentLoaded", updateMangaList);