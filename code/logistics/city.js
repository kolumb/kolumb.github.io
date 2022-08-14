"use strict";
const lang = location.pathname.match(/^\/(\w\w)\//)?.[1] || "uk"
const translations =
    { names:
        { uk: [
        "Київ",
        "Харків",
        "Одеса",
        "Дніпро",
        "Донецьк",
        "Запоріжжя",
        "Львів",
        "Кривий Ріг",
        "Миколаїв",
        "Севастополь",
        "Маріуполь",
        "Луганськ",
        "Вінниця",
        "Макіївка",
        "Сімферополь",
        "Херсон",
        "Полтава",
        "Чернігів",
        "Черкаси",
        "Хмельницький",
        "Чернівці",
        "Житомир",
        "Суми",
        "Рівно",
        "Горлівка",
        "Івано-Франківск",
        "Каменське",
        "Кропивницький",
        "Тернопіль",
        "Кременчук",
        "Луцьк",
        "Біла Церква",
        "Краматорск",
        "Мелітополь",
        "Керч",
        "Ужгород",
        "Слав'янськ",
        "Нікополь",
        "Бердянськ",
        "Алчевськ",
        "Євпаторія",
        "Бровари",
        "Павлоград",
        "Северодонецьк",
        "Кам'янець-Подільський",
        "Лисичанск",
        "Александрія",
        "Хрустальний",
        "Єнакієво",
        "Стаханів(Кадієвка)",
        "Констянтинівка",
        "Північна точка України",
        "Східна точка України",
        "Південна точка України",
        "Західна точка України",
        ]
        , ru: [
        "Киев",
        "Харьков",
        "Одесса",
        "Днепр",
        "Донецк",
        "Запорожье",
        "Львов",
        "Кривой Рог",
        "Николаев",
        "Севастополь",
        "Мариуполь",
        "Луганск",
        "Винница",
        "Макеевка",
        "Симферополь",
        "Херсон",
        "Полтава",
        "Чернигов",
        "Черкассы",
        "Хмельницкий",
        "Черновцы",
        "Житомир",
        "Сумы",
        "Ровно",
        "Горловка",
        "Ивано-Франковск",
        "Каменское",
        "Кропивницкий",
        "Тернополь",
        "Кременчуг",
        "Луцк",
        "Белая Церковь",
        "Краматорск",
        "Мелитополь",
        "Керчь",
        "Ужгород",
        "Славянск",
        "Никополь",
        "Бердянск",
        "Алчевск",
        "Евпатория",
        "Бровары",
        "Павлоград",
        "Северодонецк",
        "Каменец-Подольский",
        "Лисичанск",
        "Александрия",
        "Красный Луч(Хрустальный)",
        "Енакиево",
        "Стаханов(Кадиевка)",
        "Константиновка",
        "Северная точка Украины",
        "Восточная точка Украины",
        "Южная точка Украины",
        "Западная точка Украины",
        ]
        , en: [
        "Kyiv",
        "Харків",
        "Одеса",
        "Дніпро",
        "Донецьк",
        "Запоріжжя",
        "Львів",
        "Кривий Ріг",
        "Миколаїв",
        "Севастополь",
        "Маріуполь",
        "Луганськ",
        "Вінниця",
        "Макіївка",
        "Сімферополь",
        "Херсон",
        "Полтава",
        "Чернігів",
        "Черкаси",
        "Хмельницький",
        "Чернівці",
        "Житомир",
        "Суми",
        "Рівно",
        "Горлівка",
        "Івано-Франківск",
        "Каменське",
        "Кропивницький",
        "Тернопіль",
        "Кременчук",
        "Луцьк",
        "Біла Церква",
        "Краматорск",
        "Мелітополь",
        "Керч",
        "Ужгород",
        "Слав'янськ",
        "Нікополь",
        "Бердянськ",
        "Алчевськ",
        "Євпаторія",
        "Бровари",
        "Павлоград",
        "Северодонецьк",
        "Кам'янець-Подільський",
        "Лисичанск",
        "Александрія",
        "Хрустальний",
        "Єнакієво",
        "Стаханів(Кадієвка)",
        "Констянтинівка",
        "Північна точка України",
        "Східна точка України",
        "Південна точка України",
        "Західна точка України",
        ]
        }
    }

class City extends Entity {
    static hashMap = {};
    static cellSize = 13;
    static drawCellSize = 8;
    static cells = [];
    static namesIndex = 0;
    static names = translations.names[lang];
    static created = new Array(this.names.length - 4).fill(false);
    static coordinates = [
        new Vector(50.4501, 30.5234),
        new Vector(49.9935, 36.230383),
        new Vector(46.482526, 30.72331),
        new Vector(48.464717, 35.046183),
        new Vector(48.015883, 37.80285),
        new Vector(47.8388, 35.139567),
        new Vector(49.839683, 24.029717),
        new Vector(47.910483, 33.391783),
        new Vector(46.975033, 31.994583),
        new Vector(44.61665, 33.525367),
        new Vector(47.097133, 37.543367),
        new Vector(48.574041, 39.307815),
        new Vector(49.233083, 28.468217),
        new Vector(48.045956, 37.96669),
        new Vector(44.952117, 34.102417),
        new Vector(46.635417, 32.616867),
        new Vector(49.588267, 34.551417),
        new Vector(51.4982, 31.28935),
        new Vector(49.444433, 32.059767),
        new Vector(49.422983, 26.987133),
        new Vector(48.292079, 25.935837),
        new Vector(50.25465, 28.658667),
        new Vector(50.9077, 34.7981),
        new Vector(50.6199, 26.251617),
        new Vector(48.3071, 38.029633),
        new Vector(48.922633, 24.711117),
        new Vector(48.523117, 34.613683),
        new Vector(48.507933, 32.262317),
        new Vector(49.553517, 25.594767),
        new Vector(49.065783, 33.410033),
        new Vector(50.747233, 25.325383),
        new Vector(49.796798, 30.131085),
        new Vector(48.738967, 37.58435),
        new Vector(46.855022, 35.3587),
        new Vector(45.357314, 36.468293),
        new Vector(48.6208, 22.287883),
        new Vector(48.8532, 37.6053),
        new Vector(47.56746, 34.394815),
        new Vector(46.773771, 36.803478),
        new Vector(48.471339, 38.813441),
        new Vector(45.19045, 33.366867),
        new Vector(50.511083, 30.7909),
        new Vector(48.529448, 35.903257),
        new Vector(48.948177, 38.487877),
        new Vector(48.696716, 26.582536),
        new Vector(48.906615, 38.443361),
        new Vector(48.66327, 33.096787),
        new Vector(48.140637, 38.936736),
        new Vector(48.236899, 38.208216),
        new Vector(48.560407, 38.648718),
        new Vector(48.523943, 37.707581),
        new Vector(52.334444, 33.288611),
        new Vector(49.259167, 40.198056),
        new Vector(44.386389, 33.777222),
        new Vector(48.430556, 22.163889),
    ];
    static uvMap;
    static init() {
        this.uvMap = [];
        let min = new Vector(Infinity, Infinity);
        let max = new Vector(-Infinity, -Infinity);
        let mapAspectRatioFix = 0.65;
        this.cellSize = lesser / 55;
        this.drawCellSize = lesser / 90;
        this.coordinates.map((c) => {
            min.x = Math.min(min.x, c.x);
            min.y = Math.min(min.y, c.y * mapAspectRatioFix);
            max.x = Math.max(max.x, c.x);
            max.y = Math.max(max.y, c.y * mapAspectRatioFix);
        });
        const diagonal = max.sub(min);
        const screenAspectRatio = width / height;
        const mapAspectRatio = diagonal.y / diagonal.x;
        let sizeFactor;
        if (screenAspectRatio > 1) {
            if (mapAspectRatio > 1) {
                if (screenAspectRatio > mapAspectRatio) {
                    sizeFactor = lesser / diagonal.x;
                } else {
                    sizeFactor = bigger / diagonal.y;
                }
            } else {
                sizeFactor = lesser / diagonal.x;
            }
        } else {
            if (mapAspectRatio > 1) {
                sizeFactor = lesser / diagonal.y;
            } else {
                if (screenAspectRatio > mapAspectRatio) {
                    sizeFactor = lesser / diagonal.y;
                } else {
                    sizeFactor = bigger / diagonal.x;
                }
            }
        }
        this.coordinates.map((c) => {
            this.uvMap.push(
                c
                    .mult(new Vector(1, mapAspectRatioFix))
                    .sub(min)
                    .scale(sizeFactor)
                    .swap()
                    .mult(new Vector(1, -1))
                    .add(
                        new Vector(
                            width / 2 - (diagonal.y * sizeFactor) / 2,
                            (height + diagonal.x * sizeFactor) / 2
                        )
                    )
            );
        });
        let cellIndex = 0;
        let factor = 0.75;
        for (let i = 0; i < 100; i++) {
            const radius = this.cellSize * i * factor;
            const circleLength = Math.PI * 2 * radius;
            const numberOfSteps =
                Math.floor(circleLength / (this.cellSize * factor)) + 1;
            const radiusStep = (this.cellSize * factor) / numberOfSteps;
            for (let j = 0; j < numberOfSteps; j++) {
                const angle = (j * Math.PI * 2) / numberOfSteps;
                const x = Math.cos(angle) * (radius + radiusStep * j);
                const y = Math.sin(angle) * (radius + radiusStep * j);
                const boxX = Math.round(x / this.cellSize);
                const boxY = Math.round(y / this.cellSize);
                let hash = boxX + "," + boxY;
                if (this.hashMap[hash] === undefined) {
                    this.hashMap[hash] = cellIndex;
                    cellIndex++;
                    this.cells.push(new Vector(boxX, boxY));
                }
            }
        }
    }
    constructor(v, index = City.namesIndex) {
        super(v);
        this.cargos = new Array(1024).fill(false);
        this.name = City.names[index];
        City.created[index] = true;
    }
    getEmptySpot() {
        for (let i = 0; i < this.cargos.length; i++) {
            if (this.cargos[i] === false) {
                this.cargos[i] = true;
                return City.cells[i];
            }
        }
    }
    clearSpot(hash) {
        const cargoIndex = City.hashMap[hash];
        this.cargos[cargoIndex] = false;
    }
}
