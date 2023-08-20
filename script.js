var isEditing = false;
var memoToEdit = null;
var memoList = [];

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

            var memoItem = document.createElement("div");
            memoItem.className = "memo";

            var memoContent = document.createElement("div");
            memoContent.textContent = memoText;

            var editButton = document.createElement("button");
            editButton.textContent = "수정";
            editButton.addEventListener("click", function () {
                isEditing = true;
                memoToEdit = memoContent;
                document.getElementById("memo").value = memoContent.textContent;
                document.getElementById("add-button").textContent = "수정";
            });

            var deleteButton = document.createElement("button");
            deleteButton.textContent = "삭제";
            deleteButton.addEventListener("click", function () {
                if (memoToEdit === memoContent) {
                    isEditing = false;
                    memoToEdit = null;
                    document.getElementById("add-button").textContent = "추가";
                }
                var index = memoList.indexOf(newMemo);
                if (index !== -1) {
                    memoList.splice(index, 1);
                }
                memoListDisplay(); // 메모 목록을 다시 표시
            });

            var addSubMemoButton = document.createElement("button");
            addSubMemoButton.textContent = "피드백 추가";
            addSubMemoButton.addEventListener("click", function () {
                var subMemoText = prompt("피드백를 입력하세요:");
                if (subMemoText && subMemoText.trim() !== "") {
                    newMemo.subMemos.push(subMemoText);
                    memoListDisplay(); // 메모 목록을 다시 표시
                }
            });

            memoItem.appendChild(memoContent);
            memoItem.appendChild(editButton);
            memoItem.appendChild(deleteButton);
            memoItem.appendChild(addSubMemoButton);
            memoListDisplay(); // 메모 목록을 다시 표시
            document.getElementById("memo").value = "";
        }
    }
});


function createMemoElement(index) {
    var memoItem = document.createElement("div");
    memoItem.className = "memo";

    var memoContent = document.createElement("div");
    memoContent.textContent = memoList[index].content;

    var editButton = document.createElement("button");
    editButton.textContent = "수정";
    editButton.addEventListener("click", createEditHandler(index));

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", createDeleteHandler(index));

    var addSubMemoButton = document.createElement("button");
    addSubMemoButton.textContent = "피드백";
    addSubMemoButton.addEventListener("click", createAddSubMemoHandler(index));

    memoItem.appendChild(memoContent);
    memoItem.appendChild(editButton);
    memoItem.appendChild(deleteButton);
    memoItem.appendChild(addSubMemoButton);

    // 피드백 표시
    for (var j = 0; j < memoList[index].subMemos.length; j++) {
        var subMemo = document.createElement("div");
        subMemo.textContent = " - " + memoList[index].subMemos[j];
        memoItem.appendChild(subMemo);
    }

    return memoItem;
}





// 메모 목록을 표시하는 함수
function memoListDisplay() {
    var memoListElement = document.getElementById("memo-list");
    memoListElement.innerHTML = ""; // 목록 초기화

    for (var i = 0; i < memoList.length; i++) {
        var memoItem = createMemoElement(i);
        memoListElement.appendChild(memoItem);
    }
}

// 메모 수정 버튼 핸들러를 생성하는 함수
function createEditHandler(index) {
    return function () {
        isEditing = true;
        memoToEdit = memoList[index].content;
        document.getElementById("memo").value = memoList[index].content;
        document.getElementById("add-button").textContent = "수정";
    };
}

// 메모 삭제 버튼 핸들러를 생성하는 함수
function createDeleteHandler(index) {
    return function () {
        if (memoToEdit === memoList[index].content) {
            isEditing = false;
            memoToEdit = null;
            document.getElementById("add-button").textContent = "추가";
        }
        memoList.splice(index, 1);
        memoListDisplay();
    };
}

// 피드백 추가 버튼 핸들러를 생성하는 함수
function createAddSubMemoHandler(index) {
    return function () {
        var subMemoText = prompt("피드백를 입력하세요:");
        if (subMemoText && subMemoText.trim() !== "") {
            memoList[index].subMemos.push(subMemoText);
            memoListDisplay();
        }
    };
}

// 초기 메모 목록 표시
memoListDisplay();
