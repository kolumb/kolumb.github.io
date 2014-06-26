var livingManInput = document.getElementById('livingMan');
var livingMan;
var benefitManInput = document.getElementById('benefitMan');
var benefitMan;
var heatingInput = document.getElementById('heating');
var heating;
var benefitInput = document.getElementById('benefit');
var benefit;

var prevMonthColdInput = document.getElementById('prevMonthCold');
var prevMonthCold;
var currMonthColdInput = document.getElementById('currMonthCold');
var currMonthCold;
var spentColdOutput = document.getElementById('spentCold');
var spentCold;
var tariffColdInput = document.getElementById('tariffCold');
var tariffCold;
var costColdOutput = document.getElementById('costCold');
var costCold;

var prevMonthHotInput = document.getElementById('prevMonthHot');
var prevMonthHot;
var currMonthHotInput = document.getElementById('currMonthHot');
var currMonthHot;
var spentHotOutput = document.getElementById('spentHot');
var spentHot;
var tariffHotInput = document.getElementById('tariffHot');
var tariffHot;
var costHotOutput = document.getElementById('costHot');
var costHot;

var toPayWaterOutput = document.getElementById('toPayWater');
var toPayWater;

var prevMonthElectrInput = document.getElementById('prevMonthElectr');
var prevMonthElectr;
var currMonthElectrInput = document.getElementById('currMonthElectr');
var currMonthElectr;
var spentElectrOutput = document.getElementById('spentElectr');
var spentElectr;
var tariffElectrInput = document.getElementById('tariffElectr');
var tariffElectr;
var toPayElectrInput = document.getElementById('toPayElectr');
var toPayElectr;
var gazInput = document.getElementById('gaz');
var gaz;
var radioInput = document.getElementById('radio');
var radio;
var toPayInput = document.getElementById('toPay');
var toPay;

var benefitManPercent;
var livingCostCold;
var benefitCostCold;
var livingCostHot;
var benefitCostHot;

function getData(){
    livingMan = parseFloat(livingManInput.value,10);
    benefitMan = parseFloat(benefitManInput.value,10);
    heating = parseFloat(heatingInput.value,10);
    benefit = parseFloat(benefitInput.value,10);
    prevMonthCold = parseFloat(prevMonthColdInput.value,10);
    currMonthCold = parseFloat(currMonthColdInput.value,10);
    tariffCold = parseFloat(tariffColdInput.value,10);
    prevMonthHot = parseFloat(prevMonthHotInput.value,10);
    currMonthHot = parseFloat(currMonthHotInput.value,10);
    tariffHot = parseFloat(tariffHotInput.value,10);
    prevMonthElectr = parseFloat(prevMonthElectrInput.value,10);
    currMonthElectr = parseFloat(currMonthElectrInput.value,10);
    tariffElectr = parseFloat(tariffElectrInput.value,10);
    toPayElectr = parseFloat(toPayElectrInput.value,10);
    gaz = parseFloat(gazInput.value,10);
    radio = parseFloat(radioInput.value,10);
    toPay = parseFloat(toPayInput.value,10);
}


var DATA={}, INPUTS=[].slice.call(document.querySelectorAll("input"));

INPUTS.forEach(function(elm) {

    elm.onblur = function(e) {
        localStorage[e.target.id] = e.target.value;
        computeAll();
    };

});
(window.computeAll = function() {
    getData();


    benefitManPercent = benefitMan/livingMan;

    spentCold = currMonthCold - prevMonthCold;
    localStorage.spentCold=spentCold;
    livingCostCold = tariffCold*spentCold*(1-benefitManPercent);
    benefitCostCold = tariffCold*spentCold*benefitManPercent*(1-benefit/100);
    costCold = livingCostCold + benefitCostCold;
    localStorage.costCold = costCold.toFixed(4);

    spentHot = currMonthHot - prevMonthHot;
    localStorage.spentHot=spentHot;
    livingCostHot = tariffHot*spentHot*(1-benefitManPercent);
    benefitCostHot = tariffHot*spentHot*benefitManPercent*(1-benefit/100);
    costHot = livingCostHot + benefitCostHot;
    localStorage.costHot = costHot.toFixed(4);

    toPayWater = costCold + costHot + heating;
    localStorage.toPayWater = toPayWater.toFixed(4);


    spentElectr = currMonthElectr - prevMonthElectr;
    localStorage.spentElectr = spentElectr;
    toPayElectr = spentElectr*tariffElectr/100;
    localStorage.toPayElectr = toPayElectr.toFixed(4);

    toPay = toPayWater + toPayElectr + gaz + radio;
    localStorage.toPay = toPay.toFixed(4);


    INPUTS.forEach(
        function(elm) {
            if(localStorage[elm.id]){
                try { elm.value = Number(localStorage[elm.id]); } catch(e) {}
            }
        }
    );


})();
computeAll();

/*var value = localStorage[elm.id] || 0;
isNaN(parseFloat(value))*/
