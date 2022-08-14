"use strict";

const resizeHandler = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    lesser = width < height ? width : height;
    bigger = width > height ? width : height;
    ctx.font = Math.round(lesser * 0.025) + "px sans-serif";
    ctx.textAlign = "center";
    citiPadding = lesser / 7;
    City.init();
    cities.map((city, i) => {
        city.pos = City.uvMap[i];
    });
    if (pause) render();
};
addEventListener("resize", resizeHandler);

const canvas = document.querySelector("#Canvas");
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
document.querySelector("#FullScreenElem").addEventListener("click", () => {
    toggleFullScreen();
});
setTimeout(
    () => (document.querySelector("#MenuCheckbox").checked = true),
    1500
);

const addCityElem = document.querySelector("#AddCityElem");
const addSomeCity = () => {
    const avaiableCities = City.created
        .map((created, i) => (created ? -1 : i))
        .filter((i) => i > -1);
    const avaiableIndex = avaiableCities[0];
    if (avaiableIndex === City.names.length - 4) return;
    if (cities[avaiableIndex]) {
        City.created[avaiableIndex] = true;
    } else {
        cities[avaiableIndex] = new City(
            City.uvMap[avaiableIndex],
            avaiableIndex
        );
    }
    cityNumberInput.value = City.created.filter((b) => b).length;
};
addCityElem.addEventListener("click", addSomeCity);
const cityNumberInput = document.querySelector("#CityNumberInput");
cityNumberInput.addEventListener("input", (e) => {
    const avaiableCities = City.created
        .map((created, i) => (created ? i : -1))
        .filter((i) => i > -1);
    const desiredNumberOfCities = e.target.value - avaiableCities.length;
    if (desiredNumberOfCities < 0) {
        for (let i = 0; i < -desiredNumberOfCities; i++) {
            removeLastCity();
        }
    } else if (desiredNumberOfCities > 0) {
        for (let i = 0; i < desiredNumberOfCities; i++) {
            addSomeCity();
        }
    }
});
const removeCityElem = document.querySelector("#RemoveCityElem");
const removeLastCity = () => {
    const avaiableCities = City.created
        .map((created, i) => (created ? i : -1))
        .filter((i) => i > -1);
    const avaiableIndex = avaiableCities[avaiableCities.length - 1];
    if (avaiableIndex === undefined) {
        return;
    }
    City.created[avaiableIndex] = false;
    cityNumberInput.value = City.created.filter((b) => b).length;
};
removeCityElem.addEventListener("click", removeLastCity);

const addCarElem = document.querySelector("#AddCarElem");
const addSomeCar = () => {
    cars.push(new Car());
    carNumberInput.value = cars.filter((car) => car.hired).length;
};
addCarElem.addEventListener("click", addSomeCar);
const carNumberInput = document.querySelector("#CarNumberInput");
carNumberInput.addEventListener("input", (e) => {
    const desiredNumberOfCars =
        Math.min(1024, e.target.value) - cars.filter((car) => car.hired).length;
    if (desiredNumberOfCars < 0) {
        for (let i = 0; i < -desiredNumberOfCars; i++) {
            removeSomeCar();
        }
    } else if (desiredNumberOfCars > 0) {
        for (let i = 0; i < desiredNumberOfCars; i++) {
            addSomeCar();
        }
    }
    carNumberInput.value = cars.filter((car) => car.hired).length;
});
const removeCarElem = document.querySelector("#RemoveCarElem");
const removeSomeCar = () => {
    let carsOnRun = cars.filter((car) => car.hired);
    if (carsOnRun.length === 0) return;
    carsOnRun[carsOnRun.length - 1].hired = false;
    carNumberInput.value = cars.filter((car) => car.hired).length;
};
removeCarElem.addEventListener("click", removeSomeCar);

const pauseElem = document.querySelector("#PauseElem");
pauseElem.addEventListener("click", () => {
    pause = !pause;
    mouseDrag = false;
    mouseDownState = false;
    pauseElem.textContent = "▶";
    if (pause === false) {
        pauseElem.textContent = "| |";
        frame();
    }
});

const ctx = canvas.getContext("2d");
let width;
let height;
let lesser;
let bigger;
let citiPadding;

let pause = false;
const cities = [];

resizeHandler();

let mouseDownState = false;
let mouseDrag = false;
const mouseDownPos = new Vector(0, 0);
let lastMousePos = new Vector();

function randomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b},1)`;
}
function clamp(n, limit) {
    let lim = Math.abs(limit);
    if (n < 0) {
        if (Math.abs(n) > lim) {
            return -lim;
        }
    } else {
        if (Math.abs(n) > lim) {
            return lim;
        }
    }
    return n;
}

function tick() {
    cars.map((car) => car.update());
}
function render() {
    ctx.fillStyle = pause ? "rgba(200,200,180,0.5)" : "rgba(200,200,200,0.1)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";

    cars.map((car) => car.draw());
}

City.namesIndex = 0;
let closestCityIndex = -1;
let closestCreatedCityIndex = -1;
for (let i = 0; i < 4; i++) {
    cities.push(new City(City.uvMap[City.namesIndex]));
    City.namesIndex++;
}
cityNumberInput.value = City.created.filter((b) => b).length;

const cars = [];
for (let i = 0; i < 20; i++) {
    cars.push(
        new Car(new Vector(width * Math.random(), height * Math.random()))
    );
}
carNumberInput.value = cars.length;

function frame() {
    tick();
    render();
    if (closestCreatedCityIndex !== -1) {
        ctx.fillStyle = "rgba(180,50,70,.1)";
        ctx.strokeStyle = "rgba(180,50,70,.1)";
        const cityPos = City.uvMap[closestCreatedCityIndex];
        ctx.beginPath();
        ctx.moveTo(lastMousePos.x, lastMousePos.y);
        ctx.lineTo(cityPos.x, cityPos.y);
        ctx.stroke();
        ctx.fillRect(
            cityPos.x - City.drawCellSize / 2,
            cityPos.y - City.drawCellSize / 2,
            City.drawCellSize,
            City.drawCellSize
        );
    }
    cities.map((city, i) => {
        if (!city || !City.created[i]) return;
        ctx.fillStyle = city.color;
        ctx.fillText(city.name, city.pos.x, city.pos.y - citiPadding / 2);
        city.color = "rgba(0,0,0,.2)";
    });
    if (closestCityIndex !== -1) {
        ctx.fillStyle = "rgba(50,180,70,.3)";
        ctx.strokeStyle = "rgba(50,180,70,.3)";
        const cityPos = City.uvMap[closestCityIndex];
        ctx.fillText(
            City.names[closestCityIndex],
            cityPos.x,
            cityPos.y - citiPadding / 2
        );

        ctx.beginPath();
        ctx.moveTo(lastMousePos.x, lastMousePos.y);
        ctx.lineTo(cityPos.x, cityPos.y);
        ctx.stroke();
        ctx.fillRect(
            cityPos.x - City.drawCellSize / 2,
            cityPos.y - City.drawCellSize / 2,
            City.drawCellSize,
            City.drawCellSize
        );
    }
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
frame();

const keydownHandler = function(e) {
    if (
        (e.code === "Space" && e.target.tagName !== "BUTTON") ||
        e.code === "KeyP"
    ) {
        pause = !pause;
        mouseDrag = false;
        mouseDownState = false;
        pauseElem.textContent = "▶";
        if (pause === false) {
            pauseElem.textContent = "| |";
            frame();
        }
    }
};

const mouseDownHandler = function(e) {
    mouseDownState = true;
    mouseDownPos.set(e.pageX, e.pageY);
    if (e.button === 2) return;

    if (!City.uvMap[closestCityIndex] || City.created[closestCityIndex]) return;
    cities[closestCityIndex] = new City(
        City.uvMap[closestCityIndex],
        closestCityIndex
    );
    cityNumberInput.value = City.created.filter((b) => b).length;

    findClosestCity(mouseDownPos);
};
const mouseMoveHandler = function(e) {
    lastMousePos.set(e.pageX, e.pageY);
    findClosestCity(lastMousePos);
};
const findClosestCity = (pos) => {
    closestCityIndex = -1;
    closestCreatedCityIndex = -1;
    let minDist = Infinity;
    let minCreatedDist = Infinity;
    City.uvMap.map((cityPos, i) => {
        const dist = cityPos.dist(pos);
        if (i < City.names.length - 4 && dist < lesser / 3) {
            if (City.created[i] === false) {
                if (dist < minDist) {
                    minDist = dist;
                    closestCityIndex = i;
                }
            } else if (City.created[i] === true) {
                if (dist < minCreatedDist) {
                    minCreatedDist = dist;
                    closestCreatedCityIndex = i;
                }
            }
        }
    });
};
document.querySelector("#maxForceElem").addEventListener("input", (e) => {
    Car.maxForce = e.target.value;
});
window.addEventListener("keydown", keydownHandler);
Canvas.addEventListener("mousedown", mouseDownHandler);
Canvas.addEventListener("mousemove", mouseMoveHandler);
Canvas.addEventListener("contextmenu", function(e) {
    mouseDownState = true;
    mouseDownPos.set(e.pageX, e.pageY);

    City.created[closestCreatedCityIndex] = false;
    cityNumberInput.value--;
    findClosestCity(mouseDownPos);
    e.preventDefault();
});
