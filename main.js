
var isEditing = false;
var memoToEdit = null;
var memoList = [];

// 페이지 로드 시 로컬 스토리지에서 메모를 불러옵니다
function loadMemosFromLocalStorage() {
    var storedMemos = localStorage.getItem("memos");
    if (storedMemos) {
        memoList = JSON.parse(storedMemos);
        memoList.forEach(function (memo) {

            displayMemo(memo);

            // 메모에 대한 응답을 표시합니다
            if (memo.subMemos && memo.subMemos.length > 0) {
                memo.subMemos.forEach(function (answerText) {
                    var answerDiv = document.createElement("div");
                    answerDiv.textContent = "응답: " + answerText;
                    document.getElementById("memo-list").lastChild.appendChild(answerDiv);
                });
            }
        });
    }
}

// 메모를 로컬 스토리지에 저장합니다
function saveMemosToLocalStorage() {
    localStorage.setItem("memos", JSON.stringify(memoList));
}

// 메모를 표시하는 함수입니다
function displayMemo(memo) {
    var memoItem = document.createElement("div");
    memoItem.className = "memo";


    var memoContent = document.createElement("div");
    memoContent.textContent = memo.content;
    memoContent.classList.add("기도제목");

    var editButton = document.createElement("button");
    editButton.textContent = "수정";

    editButton.addEventListener("click", function () {
        isEditing = true;

        document.getElementById("memo").value = memo.content;

        document.getElementById("add-button").textContent = "저장";
        memoToEdit = memo;


        var indexToEdit = memoList.findIndex(m => m.content === memoToEdit.textContent);
        memoToEdit.index = indexToEdit;

        if (indexToEdit > -1) {
            var memoText = document.getElementById("memo").value;
            memoList[indexToEdit].content = memoText;
            // Instead of creating a new memo, update the existing memo directly
            memoList[indexToEdit].date = memoList[indexToEdit].date; // This line might not be necessary
        }


    });



    var dateDiv = document.createElement("div");
    dateDiv.className = "memo-date";
    dateDiv.textContent = memo.date || '';
    memoItem.appendChild(dateDiv);

    memoItem.appendChild(memoContent);

    memoItem.appendChild(editButton);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", function () {
        var indexToDelete = memoList.findIndex(m => m.content === memo.content);
        if (indexToDelete > -1) {
            memoList.splice(indexToDelete, 1);
        }
        memoItem.remove();
        saveMemosToLocalStorage();
    });


    memoItem.appendChild(deleteButton);

    var answerButton = document.createElement("button");
    answerButton.textContent = "주시는 마음";
    answerButton.addEventListener("click", function () {
        var answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.placeholder = "메시지를 입력하세요...";

        var saveanswerButton = document.createElement("button");
        saveanswerButton.textContent = "저장";
        saveanswerButton.addEventListener("click", function () {
            var answerText = answerInput.value;
            if (answerText.trim() !== "") {
                var answerDiv = document.createElement("div");
                answerDiv.textContent = "주신 마음: " + answerText;
                memoItem.appendChild(answerDiv);

                // Update the memo object with the answer
                var index = memoList.findIndex(m => m.content === memo.content);
                if (index > -1) {
                    if (!memoList[index].subMemos) {
                        memoList[index].subMemos = [];
                    }
                    memoList[index].subMemos.push(answerText);
                    saveMemosToLocalStorage();
                }

                // 응답을 저장한 후 응답 입력 및 저장 버튼을 제거합니다
                memoItem.removeChild(answerInput);
                memoItem.removeChild(saveanswerButton);
                saveMemosToLocalStorage();
            }
        });

        memoItem.appendChild(answerInput);
        memoItem.appendChild(saveanswerButton);
    });
    memoItem.appendChild(answerButton);



    document.getElementById("memo-list").appendChild(memoItem);
}

document.getElementById("add-button").addEventListener("click", function () {
    var memoText = document.getElementById("memo").value;
    if (memoText.trim() !== "") {
        if (isEditing && memoToEdit) {
            // Update the content of the existing memo instead of pushing a new one
            memoToEdit.content = memoText;
            displayMemo(memoToEdit);  // Update the displayed memo list
            isEditing = false;
            memoToEdit = null;
            document.getElementById("memo").value = "";
            document.getElementById("add-button").textContent = "추가";
        } else {
            var currentDate = new Date();
            var formattedDate = "<" + currentDate.getFullYear() + "-" +
                (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
                currentDate.getDate().toString().padStart(2, '0') + ">";

            var newMemo = {
                date: formattedDate,
                content: memoText,
                subMemos: []
            };

            memoList.push(newMemo);
            displayMemo(newMemo);
            document.getElementById("memo").value = "";
        }
        saveMemosToLocalStorage();
    }
});

loadMemosFromLocalStorage();

// Ensure the code runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Dark mode toggle logic
    document.getElementById("dark-mode-toggle").addEventListener("click", function () {
        if (document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        }
    });

    // Load user's theme preference from local storage
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
});
