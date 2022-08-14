"use strict";

// get String from localStorage
// parse String to Array
let url = 'https://api.jsonbin.io/b/5df0ef6a1c19843d88ea45a0'
const button = document.querySelector(".button");
const input = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const loadingElem = document.querySelector(".loading");
const syncingElem = document.querySelector(".syncing");

const db = {data: [], idCounter: 0};
const dataBaseName = "myDatabase";
let dbString = localStorage.getItem(dataBaseName);

let req = new XMLHttpRequest();
syncingElem.classList.remove('hide')
req.addEventListener("load", () => {
  loadingElem.classList.add('hide')
  syncingElem.classList.add('hide')
  dbString = req.responseText

  let dbFromAPI = JSON.parse(dbString);
  if (dbFromAPI === null) return;

  db.idCounter = dbFromAPI.idCounter
  for (let i = 0; i < dbFromAPI.data.length; i++) {
    db.data[i] = dbFromAPI.data[i];
    createToDo(dbFromAPI.data[i]);
  }
});
req.open("GET", url+'/latest', true);
req.setRequestHeader("Content-type", "application/json");
req.send();

const addToDo = function() {
  if (/^\s*$/.test(input.value)) {
    input.focus();
    input.value = "";
    return;
  }

  let todo = {id: db.idCounter, name: input.value, complete: false}
  db.idCounter++
  db.data.push(todo);
  createToDo(todo);

  input.value = "";
  input.focus();
  
  updateRemoteJSON()
};

const createToDo = function (todo) {
  const li = document.createElement("li");
  li.id = todo.id

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = todo.complete
  li.appendChild(check);

  const span = document.createElement("span");
  let textNode = document.createTextNode(todo.name);
  span.appendChild(textNode);
  li.appendChild(span);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑️";
  li.appendChild(deleteButton);

  todoList.appendChild(li);
}

const updateRemoteJSON = function() {
  localStorage.setItem(dataBaseName, JSON.stringify(db))
  let req = new XMLHttpRequest();
  syncingElem.classList.remove('hide')
  req.addEventListener("load", () => {
    syncingElem.classList.add('hide')
  })
  req.open("PUT", url, true);
  req.setRequestHeader("Content-type", "application/json");
  req.setRequestHeader("X-Master-Key", "$2b$10$Ww3bBgGGmWoDrgZaf75dJugLHg1a.9BBCwcBXQyHok6zmFE2OX4wm");
  req.send(JSON.stringify(db));
}

input.focus();

button.addEventListener("click", addToDo);
input.addEventListener("keydown", function(event) {
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    addToDo();
  }
});

todoList.addEventListener("click", function(event) {
  if (event.target.nodeName === "INPUT") {
    let todo = db.data.find(todo=>todo.id === parseInt(event.target.parentElement.id))
    todo.complete = !todo.complete
    updateRemoteJSON()
  }
  if (event.target.nodeName === "SPAN") {
    event.target.parentElement.children[0].click();
  }
  if (event.target.nodeName === "BUTTON") {
    event.target.parentElement.style.display = "none";
    db.data = db.data.filter(todo=>todo.id !== parseInt(event.target.parentElement.id))
    updateRemoteJSON()
  }
  if (event.target.nodeName === "LI") {
    event.target.children[0].click();
  }

  input.focus();
});