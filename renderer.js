
function dealChapters(content) {
    const chapters = parseChapters(content);
    displayChapters(chapters);
}

// document.getElementById('fileInput').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const text = e.target.result;
//             const chapters = parseChapters(text);
//             displayChapters(chapters);
//         };
//         reader.readAsText(file);
//     }
// });

function parseChapters(text) {
    // 简单根据“第*章”划分章节，实际情况可能更复杂
    const chapterRegex = /第[一二三四五六七八九十百千\d]+章/g;
    const sections = text.split(chapterRegex).filter(section => section.trim());

    return sections.map((section, index) => {
        const title = `第${index + 1}章`;
        return { title, content: section.trim() };
    });
}

function displayChapters(chapters) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    chapters.forEach(chapter => {
        const chapterElement = document.createElement('div');
        const titleElement = document.createElement('h2');
        const contentElement = document.createElement('p');

        titleElement.textContent = chapter.title;
        contentElement.textContent = chapter.content;

        chapterElement.appendChild(titleElement);
        chapterElement.appendChild(contentElement);

        output.appendChild(chapterElement);
    });
}

module.exports = {
    dealChapters
}