// Add text button click event handler
document.getElementById("add__text__button").addEventListener("click", addText)


// Add text on press enter key event handler
document.getElementById("text__input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault()
        document.getElementById("add__text__button").click()
    }
})


// Add text snippet to Clipyboard UI
function addSnippetToClipyboard(id, text) {
    // Text element
    const textSnippetP = document.createElement('p')
    textSnippetP.setAttribute("class", "text__snippet")
    textSnippetP.innerText = text

    // Copy button
    const copyButtonSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'
    const copyButtonDiv = document.createElement('div')
    copyButtonDiv.setAttribute("class", "copy__text__button")
    copyButtonDiv.innerHTML = copyButtonSvgCode
    copyButtonDiv.addEventListener("click", function () {
        copyText(id)
    })

    // Delete button
    const deleteButtonSvgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>'
    const deleteButtonDiv = document.createElement('div')
    deleteButtonDiv.setAttribute("class", "delete__text__button")
    deleteButtonDiv.innerHTML = deleteButtonSvgCode
    deleteButtonDiv.addEventListener("click", function () {
        deleteText(id)
    })

    const clipyboardItemDiv = document.createElement('div')
    clipyboardItemDiv.setAttribute("id", id)
    clipyboardItemDiv.setAttribute("class", "clipyboard__item")
    clipyboardItemDiv.appendChild(textSnippetP)
    clipyboardItemDiv.appendChild(copyButtonDiv)
    clipyboardItemDiv.appendChild(deleteButtonDiv)

    document.getElementById("clipyboard__items").prepend(clipyboardItemDiv)

}

// Load saved snippets
chrome.storage.local.get(null, function (items) {
    var allKeys = Object.keys(items);
    allKeys.sort(function(a, b) {
        return a - b;
    });
    
    allKeys.sort()
    allKeys.forEach((key) => {
        chrome.storage.local.get([key]).then((result) => {
            addSnippetToClipyboard(key, result[key])
        })
    }
    )
});

// Add text snippet to Clipyboard UI and save to storage
function addText() {
    const newText = document.getElementById("text__input").value
    document.getElementById("text__input").value = ''
    document.getElementById("text__input").focus()

    if (newText) {
        // const id = crypto.randomUUID().toString()
        const date = Date.now()

        chrome.storage.local.set({ [date]: newText }).then(() => {
            addSnippetToClipyboard(date, newText)
        })
    }
}

// Copy text to clipboard
function copyText(id) {
    chrome.storage.local.get([id]).then((result) => {
        navigator.clipboard.writeText(result[id])
    })
}

// Delete text from clipyboard
function deleteText(id) {
    chrome.storage.local.remove([id]).then(() => {
        document.getElementById(id).remove()
    })
}