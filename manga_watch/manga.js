function checkRead(id) {
    let saved_manga = JSON.parse(localStorage.getItem("savedManga")) || {};
    const { source, chapter_id, url } = getQueryParams();

    checks = document.getElementsByClassName("read");
    if (checks[checks.length-id].checked) {
        // if box is checked
        for (var i = checks.length-id; i < checks.length; i++) {
            checks[i].checked = true;
        }
        saved_manga[url]["last_read"] = id;
        localStorage.setItem("savedManga", JSON.stringify(saved_manga));
    } else {
        // if box is unchecked
        for (var i = checks.length-id; i > 0; i--) {
            checks[i].checked = false;
        }
        saved_manga[url]["last_read"] = id-1;
        localStorage.setItem("savedManga", JSON.stringify(saved_manga));
    }
}

function markRead(id) {
    let saved_manga = JSON.parse(localStorage.getItem("savedManga")) || {};
    const { source, chapter_id, url } = getQueryParams();

    checks = document.getElementsByClassName("read");
    // if box is checked
    for (var i = checks.length-id; i < checks.length; i++) {
        checks[i].checked = true;
    }
    saved_manga[url]["last_read"] = id;
    localStorage.setItem("savedManga", JSON.stringify(saved_manga));
}

// Function to get URL parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        source: params.get("source"),
        id: params.get("id"),
        url: params.get("url")
    };
}

// Function to fetch chapters from Flask backend
function fetchChapters() {
    const { source, id, url } = getQueryParams();
    
    if (!source || !id) {
        console.error("Missing source or id in URL parameters.");
        return;
    }

    fetch(`https://frankfurters.duckdns.org/get_chapters?source=${encodeURIComponent(source)}&id=${encodeURIComponent(id)}`)
        .then(response => response.json())
        .then(data => {
            let saved_manga = JSON.parse(localStorage.getItem("savedManga")) || {};
            last_read = saved_manga[url]["last_read"];
            displayChapters(data, last_read);
        })
        .catch(error => console.error("Error fetching chapters:", error));
}

// Function to display chapters on the page
function displayChapters(data, last_read) {
    // fetch saved manga data
    const container = document.getElementById("manga_table");
    container.innerHTML = "<tr>" +
    '<th width="10%">Chapter</th>' +
    '<th width="80%">Title</th>' +
    '<th width="10%">Read?</th>' +
    '</tr>'; // Clear previous content

    if (data.chapters && data.chapters.length > 0) {
        data.chapters.forEach(chapter => {
            let read = (parseInt(chapter['chapter_no']) <= parseInt(last_read))

            const chapterRow = document.createElement("tr");
            const chapterNo = document.createElement("td");
            const chapterTitle = document.createElement("td");
            const lastRead = document.createElement("td");

            chapterRow.id = chapter['chapter_no'];
            chapterNo.innerHTML = chapter['chapter_no'];
            chapterTitle.innerHTML = `<a href="${chapter['chapter_url']}" onclick="markRead(this.parentElement.parentElement.id)" target="_blank">${chapter['chapter_title']}</a>`;
            lastRead.innerHTML = `<input class="read" onclick="checkRead(this.parentElement.parentElement.id)" type="checkbox" ${read? "checked":""}>`;
            chapterRow.appendChild(chapterNo);
            chapterRow.appendChild(chapterTitle);
            chapterRow.appendChild(lastRead);
            container.appendChild(chapterRow);
        });
    } else {
        container.innerHTML = "<p>No chapters found.</p>";
    }
}

// Run when page loads
window.onload = fetchChapters;
