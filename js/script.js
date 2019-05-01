let maincoins,click,stay,int, rdata={},clickCount=0;single=0;;
// let click;
// let stay;
// let rdata = {};
// let int;
// let clickCount = 0;
// let single = 0;
document.onload = getAll();

$("#about").click(about);
$("#searchbtn").click(searchCoin);
$("#home").click(getAll).click(clicked);
$("#live").click(clicked).click(liveReport);

function clicked(e) { click = e.target.innerHTML; if (click == "Live Reports" && checkedCoins == "") { stay = true; alert("Please select a coin"); } if (click == 'Live Reports') { clickCount++ } }

function getAll() {
    single=0;
    $("#srcmsg").html("");
    $("#Search").show();
    $("#searchbtn").show();
    clearInterval(int);
    let url = "https://api.coingecko.com/api/v3/coins/list";
    $("#main").html("").css("height", "");
    function cb(xhr) {
        let jsonobj = JSON.parse(xhr.responseText);
        maincoins = jsonobj.concat();
        let jsonobjsp = jsonobj.splice(0, 99);
        populateDiv(jsonobjsp);
    }
    ajaxFetch('GET', url, cb);
    $("#error").html("");
}

function searchCoin(e) {
    $("#srcmsg").html("");
    let a = document.querySelector("#Search").value;
    if (a == "") { alert("Enter coin's name."); return; }
    let coinName = a.toLowerCase();
    let div = document.querySelector("#main");
    let coinsrc = maincoins.find(o => o.symbol === coinName);
    if (!coinsrc) { $("#srcmsg").html("No coins found.") } else {
        div.innerHTML = "";
        populateDiv(coinsrc, e);
    }
}

function populateDiv(coinarr, e = null) {
    if (e !== null) {
        let div = document.querySelector("#main");
        let divCard = document.createElement("div");
        divCard.setAttribute("class", "card border-primary mb-3");
        divCard.setAttribute("style", "max-width: 18rem;");
        divCard.setAttribute("id", "card");

        let divCardHeader = document.createElement("div");
        divCardHeader.setAttribute("id", "cardheader");
        divCardHeader.setAttribute("class", "card-header");
        let tempID = "c" + coinarr.symbol;
        divCardHeader.innerHTML = ` ${coinarr.symbol} <label class="switch">
        <input id="cardcheck" name="c${coinarr.symbol}" type="checkbox" ${checkedCoins.includes(tempID) ? 'checked' : ''}>
        <span class="slider round"></span>
        </label>`;

        let divCardBody = document.createElement("div");
        divCardBody.setAttribute("class", "card-body text-primary");
        divCardBody.setAttribute("id", "cardbody");
        divCardBody.innerHTML = `
            <h5 id="coinname" class="card-title">${coinarr.name}</h5>
            <p id="p${coinarr.id}" class="card-text" style="display:none"><img id="s${coinarr.id}" style="display:none" src="images/200.gif"></p>
            <button name="${coinarr.id}" class="btn btn-primary mb-2" id="moreinfo">More Info...</button>`;

        divCard.appendChild(divCardHeader);
        divCard.appendChild(divCardBody);
        div.appendChild(divCard);
    }
    if (e === null) {
        let div = document.querySelector("#main");
        for (var i = 0; i < coinarr.length; i++) {
            let divCard = document.createElement("div");
            divCard.setAttribute("class", "card border-primary mb-3");
            divCard.setAttribute("style", "max-width: 18rem;");
            divCard.setAttribute("id", "card");

            let divCardHeader = document.createElement("div");
            divCardHeader.setAttribute("id", "cardheader");
            divCardHeader.setAttribute("class", "card-header");
            let tempID = "c" + coinarr[i].symbol;
            divCardHeader.innerHTML = `
            ${coinarr[i].symbol} <label class="switch">
            <input id="cardcheck" name="c${coinarr[i].symbol}" type="checkbox" ${checkedCoins.includes(tempID) ? 'checked' : ''}>
            <span class="slider round"></span>
            </label>`;

            let divCardBody = document.createElement("div");
            divCardBody.setAttribute("class", "card-body text-primary");
            divCardBody.setAttribute("id", "cardbody");
            divCardBody.innerHTML = `
            <h5 id="coinname" class="card-title">${coinarr[i].name}</h5>
            <p id="p${coinarr[i].id}" class="card-text" style="display:none"><img id="s${coinarr[i].id}" style="display:none" src="images/200.gif"></p>
            <button name="${coinarr[i].id}" class="btn btn-primary mb-2" id="moreinfo">More Info...</button>`;

            divCard.appendChild(divCardHeader);
            divCard.appendChild(divCardBody);
            div.appendChild(divCard);


        }
    }
    let infobtn = document.querySelectorAll("#moreinfo");
    for (var i = 0; i < infobtn.length; i++) {
        infobtn[i].addEventListener("click", getMoreInfo);
    }
    let checkbox = document.querySelectorAll("#cardcheck");
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].addEventListener("click", checked);
    }
}

function getMoreInfo(e) {
    let coinID = e.target.name;
    try { checkLSTime(coinID); } catch (e) {  }
    let pinfo = document.querySelector("#p" + coinID);
    if (pinfo.getAttribute("style") == "display:none") {
        pinfo.setAttribute("style", "display:block")
    } else { pinfo.setAttribute("style", "display:none") }
    let storageItem = localStorage.getItem(`${coinID}`);
    if (storageItem == null) {
        let url = "https://api.coingecko.com/api/v3/coins/" + coinID;
        function cb(xhr) {
            let jsoncoinp = xhr.responseText;
            let twoMinutes = new Date();
            twoMinutes.setMinutes(twoMinutes.getMinutes() + 2);
            let values = [];
            values.push(jsoncoinp);
            values.push(twoMinutes);
            try {
                localStorage.setItem(`${e.target.name}`, JSON.stringify(values));
                setTimeout(function () { checkLSTime(coinID) }, 180000);
            } catch (e) { }
            let jsoncoin = JSON.parse(jsoncoinp);
            pinfo.innerHTML = `
            <div id="insideimg"><img src="${jsoncoin.image.small}"> </div>
            <p>USD: ${jsoncoin.market_data.current_price.usd}$</p>
            <p>EUR: ${jsoncoin.market_data.current_price.eur}€</p>
            <p>ILS: ${jsoncoin.market_data.current_price.ils}₪</p>
        `;
        }
        let spanID = document.querySelector("#s" + e.target.name);
        loadingGif(spanID);
        ajaxFetch('GET', url, cb);
    } else {
        let tempLS = JSON.parse(storageItem);
        let jsoncoin = JSON.parse(tempLS[0]);
        pinfo.innerHTML = `
        <div id="insideimg"><img src="${jsoncoin.image.small}"> </div>
        <p>USD: ${jsoncoin.market_data.current_price.usd}$</p>
        <p>EUR: ${jsoncoin.market_data.current_price.eur}€</p>
        <p>ILS: ${jsoncoin.market_data.current_price.ils}₪</p>
    `;
    }
}

function loadingGif(id) {
    $(document).ajaxStart(function () {
        // show loader on start
        $(id).css("display", "block");
    }).ajaxSuccess(function () {
        // hide loader on success
        $(id).css("display", "none");
    });
}

function checkLSTime(id) {
    var values = localStorage.getItem(id);
    var valuesp = JSON.parse(values);
    var olddate = new Date(valuesp[1]);
    if (olddate < new Date()) {
        localStorage.removeItem(id);
    }

}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


let checkCount = 0;
let checkedCoins = [];
function checked(e) {
    let modal = document.querySelector("#myModal");
    if (modal.style.display == 'block') {
        modal.style.display = 'none';
        let coin = document.getElementsByName(`${e.target.name}`);
        coin[0].checked = false;
    }
    if (checkCount == 4 && e.target.checked == true) {
        checkCount++;
        checkedCoins.push(e.target.name);
        openModal(checkedCoins);
        return;
    }
    if (e.target.checked == true && checkCount < 5) {
        checkCount++;
        checkedCoins.push(e.target.name);
    }
    if (e.target.checked == false) {
        checkCount--;
        checkedCoins.remove(`${e.target.name}`);
    }
    if (checkCount == 5 && e.target.checked == true) {
        e.target.checked = false;
        return;
    }
}

function openModal(coins) {
    let modal = document.getElementById('myModal');
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    let div = document.querySelector(".modal-content");
    div.innerHTML = `<span class="close">&times;</span><p>Choose a coin to remove from the list, or exit to continue.</p>`;
    for (var i = 0; i < coins.length; i++) {
        let coin = coins[i].substr(1);
        let coinmodal = maincoins.find(o => o.symbol === coin);
        populateModal(coinmodal);
    }
    modal.style.display = "block";
}

function populateModal(coin) {
    let div = document.querySelector(".modal-content");
    let divCard = document.createElement("div");
    divCard.setAttribute("class", "card border-primary mb-3");
    divCard.setAttribute("style", "max-width: 18rem;");
    divCard.setAttribute("id", "card");

    let divCardHeader = document.createElement("div");
    divCardHeader.setAttribute("id", "cardheader");
    divCardHeader.setAttribute("class", "card-header");
    let tempID = "c" + coin.symbol;
    divCardHeader.innerHTML = `
    ${coin.symbol} <label class="switch">
    <input id="cardcheck" name="c${coin.symbol}" type="checkbox" ${checkedCoins.includes(tempID) ? 'checked' : ''}>
    <span class="slider round"></span>
    </label>`;

    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body text-primary");
    divCardBody.setAttribute("id", "cardbody");
    divCardBody.innerHTML = `
    <h5 id="coinname" class="card-title">${coin.name}</h5>
    `;

    divCard.appendChild(divCardHeader);
    divCard.appendChild(divCardBody);
    div.appendChild(divCard);

    let checkbox = document.querySelectorAll("#cardcheck");
    for (var i = 0; i < checkbox.length; i++) {
        checkbox[i].addEventListener("click", checked);
    }
    let span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        document.getElementById('myModal').style.display = "none";
    }
}


function liveReport() {
    $("#srcmsg").html("");
    if (stay == true) { stay = false; return }
    $("#Search").hide();
    $("#searchbtn").hide();
    let div = document.querySelector("#main");
    div.innerHTML = "";
    div.style = "height: 300px; width: %80;";
    let temp = checkedCoins.concat();
    let coins1 = temp.map(a => a.toUpperCase());
    let coins = coins1.map(b => b.substr(1));
    for (var i = 0; i < coins.length; i++) {
        window['dataPoints' + i] = [];
    }
    let data2 = [];
    let usd;
    var options = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: `${coins.join(",")} to USD`
        },
        axisX: {
            valueFormatString: "hh:mm:ss"
        },
        axisY: {
            title: "USD",
            titleFontSize: 24,
            includeZero: true,
            valueFormatString: "$#.########"

        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: data2
    };

    function addData(data) {
        rdata = {};
        Object.assign(rdata, data);
        if (data.Response == "Error") {
            single = 1;
            let msg = "<p style='margin:auto; color:red;'>An error occurd, cannot find the symbol:" + data.Message.slice(data.Message.indexOf("toSymbols") + 9, data.Message.length) + "Please remove it from the list.</p>";
            setTimeout(() => $("#main").html(msg), 1000); 
            clearInterval(int); 
            return;
        }
        for (var i = 0; i < Object.keys(data).length; i++) {
            try {
                usd = data[Object.keys(data)[i]].USD;
                window['dataPoints' + i].push({ x: new Date(), y: usd });
            } catch (e) { }
        }
        let missing = coins.filter(arr1Item => !Object.keys(data).includes(arr1Item));
        if (missing != 0) { $("#error").html(`<p style="color:red;margin:auto;margin-top:10px;">Notice: the coin ${missing} is not available, only the others will show</p>`) }
    }
    let coinsjson = coins.join(",");

    function update() {
        clearInterval(int);
        $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsjson}&tsyms=USD`, addData).success(() => { loadChart(); if (single == 0) { int = setTimeout(update, 2000) }; });

    }

    let stopit = 1;
    update();
    
    function loadChart() {
        if (stopit == 1) {
            for (var i = 0; i < Object.keys(rdata).length; i++) {
                data2.push({
                    type: "spline",
                    name: Object.keys(rdata)[i],
                    showInLegend: true,
                    xValueFormatString: "hh:mm:ss",
                    yValueFormatString: "$#.#########",
                    dataPoints: window['dataPoints' + i]
                });
            }
            stopit = 2;
        }
        if (click !== "Home") {
            $("#main").CanvasJSChart(options);
        }
    }

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
    
}

function about() {
    clearInterval(int);
    $("#main").html("").css("height", "");
    let content = `
     <div id="aboutContent"><p><h1>Real-Time Coins project.<h1></p>
     <p id="contenttext"><h6>Get live information about crypto currncies, and stay Updated!</h6></p>
     <p><h3>By Elazar Zadiki.<h3></p>
     <img src="images/giphy.gif" id="gif" />
     <p>All rights reserved &copy;</p></div>
     `;
    $("#main").html("").html(content);
    $("#error").html("");
}
