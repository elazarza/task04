// variable declaraitons
var addBtn = document.querySelector("#submit");
var clrBtn = document.querySelector("#clear");
var notes = [];
var note = {};
var id = checkIfEmpty();
var panel = document.querySelector("#notepanel");
var storageItem;
var delID;
var storageItemD;

document.onload = showNotes(), attach();

//button events
addBtn.addEventListener("click", addNote);
clrBtn.addEventListener("click", clearForm);

// clearing the form and focusing
function clearForm() {
    var textC = document.querySelector("#text");
    var dateC = document.querySelector("#dateinput");
    var timeC = document.querySelector("#timeinput");
    textC.value = "";
    dateC.value = "";
    timeC.value = "";
    textC.focus();
}

//gives the current top note id for adding
function checkIfEmpty() {
    var x = localStorage.getItem("notes");

    if (x == null) {
        return -1;
    } else {
        var y = JSON.parse(x);
        return y.length - 1;
    }
}
// writes a new enrty and showing the note on screen without reloading the whole list
function addNote() {
    var text = document.querySelector("#text");
    var date = document.querySelector("#dateinput");
    var time = document.querySelector("#timeinput");

    if (text.value == "" || date.value == "") {
        alert("Date and task content are requiered!");
        return;
    }

    note = { "text": `${text.value}`, "date": `${date.value}`, "time": `${time.value}` };
    notes.push(note);
    storageItem = JSON.stringify(notes);
    localStorage.setItem("notes", storageItem);
    showNewNote(text, date, time);
    attach();
    clearForm();
}

// deletes notes with x ID
function delNote() {
    notes = JSON.parse(localStorage.getItem("notes"));
    delID = Number(this.id);
    notes.splice(delID, 1);
    storageItemD = JSON.stringify(notes);
    localStorage.setItem("notes", storageItemD);
    id--;
    parent = document.querySelector("#notepanel");
    child = document.querySelector(`#note${delID}`);
    parent.removeChild(child);

}

// showing the new note on screen without reloading list
function showNewNote(text, date, time = "") {
    id++;
    div = document.createElement("div");
    div.setAttribute("class", "panelnote trans");
    div.setAttribute("id", `note${id}`);
    ix = document.createElement("i");
    ix.setAttribute("class", "fas fa-times");
    ix.setAttribute("id", `${id}`);
    divText = document.createElement("div");
    divText.setAttribute("class", "textnote");
    textNode = document.createTextNode(`${text.value}`);
    divText.appendChild(textNode);
    divDate = document.createElement("div");
    divDate.setAttribute("class", "datenote");
    textNode = document.createTextNode(`${date.value} ${time.value}`);
    divDate.appendChild(textNode);
    div.appendChild(ix);
    div.appendChild(divText);
    div.appendChild(divDate);
    notepanel.appendChild(div);

}

//showing notes when document loads
function showNotes() {

    storageItem = localStorage.getItem("notes");
    if (storageItem == null) return;
    notes = JSON.parse(storageItem);
    var notepanel = document.querySelector("#notepanel");
    var div;
    var ix;
    var divText;
    var divDate;
    var textNode;

    for (var i = 0; i < notes.length; i++) {
        div = document.createElement("div");
        div.setAttribute("class", "panelnote");
        div.setAttribute("id", `note${i}`);
        ix = document.createElement("i");
        ix.setAttribute("class", "fas fa-times");
        ix.setAttribute("id", `${i}`);
        divText = document.createElement("div");
        divText.setAttribute("class", "textnote");
        textNode = document.createTextNode(notes[i].text);
        divText.appendChild(textNode);
        divDate = document.createElement("div");
        divDate.setAttribute("class", "datenote");
        textNode = document.createTextNode(`${notes[i].date} ${notes[i].time}`);
        divDate.appendChild(textNode);
        div.appendChild(ix);
        div.appendChild(divText);
        div.appendChild(divDate);
        notepanel.appendChild(div);
    }
}

//attaches following ID to the new added note
function attach() {
    var delBtn = document.querySelectorAll(".fas");
    for (var i = 0; i < delBtn.length; i++) {
        delBtn[i].addEventListener('click', delNote);
    }
}