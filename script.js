
var isEditing = false;
var memoToEdit = null;
var memoList = [];

// Load memos from local storage on page load
function loadMemosFromLocalStorage() {
    var storedMemos = localStorage.getItem("memos");
    if (storedMemos) {
        memoList = JSON.parse(storedMemos);
        memoList.forEach(function (memo) {
            displayMemo(memo.content);
        });
    }
}

// Save memos to local storage
function saveMemosToLocalStorage() {
    localStorage.setItem("memos", JSON.stringify(memoList));
}

// Function to display a memo
function displayMemo(memoText) {
    var memoItem = document.createElement("div");
    memoItem.className = "memo";

    var memoContent = document.createElement("div");
    memoContent.textContent = memoText;

    var editButton = document.createElement("button");
    editButton.textContent = "수정";

    editButton.addEventListener("click", function () {
        isEditing = true;

        document.getElementById("memo").value = memoContent.textContent;

        document.getElementById("add-button").textContent = "저장";
        memoToEdit = memoContent;

        var indexToEdit = memoList.findIndex(m => m.content === memoText);
        if (indexToEdit > -1) {
            memoList.splice(indexToEdit, 1);
        }
    });


    memoItem.appendChild(memoContent);
    memoItem.appendChild(editButton);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", function () {
        var indexToDelete = memoList.findIndex(m => m.content === memoText);
        if (indexToDelete > -1) {
            memoList.splice(indexToDelete, 1);
        }
        memoItem.remove();
        saveMemosToLocalStorage();
    });

    memoItem.appendChild(deleteButton);


    document.getElementById("memo-list").appendChild(memoItem);
}

document.getElementById("add-button").addEventListener("click", function () {
    var memoText = document.getElementById("memo").value;
    if (memoText.trim() !== "") {
        if (isEditing && memoToEdit) {
            memoToEdit.textContent = memoText;
            isEditing = false;
            memoToEdit = null;
            document.getElementById("memo").value = "";
            document.getElementById("add-button").textContent = "추가";
        } else {
            var newMemo = {
                content: memoText,
                subMemos: []
            };

            memoList.push(newMemo);

            displayMemo(memoText);
            document.getElementById("memo").value = "";  // Clear the memo input field

        }
        // Save memos to local storage whenever a memo is added or edited
        saveMemosToLocalStorage();
    }
});

// Load memos from local storage when the page loads
loadMemosFromLocalStorage();
