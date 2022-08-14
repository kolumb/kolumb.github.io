"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", {alpha: false});
let width, height;
let pause = false;

const HistoryElem = document.querySelector('#HistoryElem')

resizeHandler();

let attrForce = 10
let repForce = 44000
let maxSpeed = 0.1
let antyGravity = 0.001

const commits = []
// commits.push(new Commit(commits[commits.length - 1]))
commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))

frame();
