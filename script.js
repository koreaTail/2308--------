
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

    var feedbackButton = document.createElement("button");
    feedbackButton.textContent = "피드백";
    feedbackButton.addEventListener("click", function () {
        var feedbackInput = document.createElement("input");
        feedbackInput.type = "text";
        feedbackInput.placeholder = "피드백을 입력하세요...";

        var saveFeedbackButton = document.createElement("button");
        saveFeedbackButton.textContent = "저장";
        saveFeedbackButton.addEventListener("click", function () {
            var feedbackText = feedbackInput.value;
            if (feedbackText.trim() !== "") {
                var feedbackDiv = document.createElement("div");
                feedbackDiv.textContent = "피드백: " + feedbackText;
                memoItem.appendChild(feedbackDiv);

                // Update the memo object with the feedback
                var index = memoList.findIndex(m => m.content === memoText);
                if (index > -1) {
                    if (!memoList[index].subMemos) {
                        memoList[index].subMemos = [];
                    }
                    memoList[index].subMemos.push(feedbackText);
                    saveMemosToLocalStorage();
                }

                // Remove the feedback input and save button after saving the feedback
                memoItem.removeChild(feedbackInput);
                memoItem.removeChild(saveFeedbackButton);
            }
        });

        memoItem.appendChild(feedbackInput);
        memoItem.appendChild(saveFeedbackButton);
    });
    memoItem.appendChild(feedbackButton);



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

            // Update the memo list with the edited content
            var editedMemo = {
                content: memoText,
                subMemos: []
            };
            memoList.push(editedMemo);

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
