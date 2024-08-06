document.addEventListener('DOMContentLoaded', () => {
    // ページロード時にローカルストレージからデータを取得
    const savedItems = localStorage.getItem('items');
    const completedItems = localStorage.getItem('completedItems');
    if (savedItems) {
        document.getElementById('itemList').innerHTML = savedItems;
        addEventToButtons('deleteButton', deleteItem);
        addEventToButtons('completeButton', completeItem);
    }
    if (completedItems) {
        document.getElementById('completedList').innerHTML = completedItems;
        addEventToButtons('deleteButton', deleteItem);
    }
});

document.getElementById('addButton').addEventListener('click', addItem);
document.getElementById('exportButton').addEventListener('click', exportData);
document.getElementById('importInput').addEventListener('change', importData);

function addItem() {
    const itemInput = document.getElementById('itemInput');
    const quantityInput = document.getElementById('quantityInput');
    const itemList = document.getElementById('itemList');

    if (itemInput.value.trim() !== "") {
        const li = document.createElement('li');
        li.innerHTML = `<span>${itemInput.value} (${quantityInput.value})</span>
                        <button class="completeButton">完了</button>
                        <button class="deleteButton">削除</button>`;
        itemList.appendChild(li);

        itemInput.value = "";
        quantityInput.value = "";

        addEventToButtons('deleteButton', deleteItem);
        addEventToButtons('completeButton', completeItem);

        saveItems(); // 保存はイベント追加後に実行
    }
}

function deleteItem(event) {
    try {
        const button = event.target;
        const li = button.parentElement; // 修正: parentElementを使用して親要素を取得
        if (!li) {
            throw new Error('削除ボタンの親要素が見つかりません。');
        }
        li.classList.add('fade-out');
        li.addEventListener('animationend', () => {
            li.remove();
            saveItems();
        });
    } catch (error) {
        console.error('エラーが発生しました:', error.message);
    }
}

function completeItem(event) {
    try {
        const button = event.target;
        const li = button.parentElement; // 修正: parentElementを使用して親要素を取得
        if (!li) {
            throw new Error('完了ボタンの親要素が見つかりません。');
        }
        const completedList = document.getElementById('completedList');
        li.querySelector('.completeButton').remove();
        completedList.appendChild(li);
        saveItems();
    } catch (error) {
        console.error('エラーが発生しました:', error.message);
    }
}

function addEventToButtons(className, func) {
    document.querySelectorAll('.' + className).forEach(button => {
        button.removeEventListener('click', func);
        button.addEventListener('click', func);
    });
}

function saveItems() {
    const itemList = document.getElementById('itemList');
    const completedList = document.getElementById('completedList');
    localStorage.setItem('items', itemList.innerHTML);
    localStorage.setItem('completedItems', completedList.innerHTML);
}

function exportData() {
    const items = localStorage.getItem('items');
    const completedItems = localStorage.getItem('completedItems');
    const data = {
        items: items,
        completedItems: completedItems
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'memo-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        document.getElementById('itemList').innerHTML = data.items;
        document.getElementById('completedList').innerHTML = data.completedItems;
        addEventToButtons('deleteButton', deleteItem);
        addEventToButtons('completeButton', completeItem);
        saveItems();
    };
    reader.readAsText(file);
}