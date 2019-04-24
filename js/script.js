let maincoins;
document.onload = getAll();

let srcBtn = document.querySelector("#searchbtn");
srcBtn.addEventListener("click", searchCoin);
let homeBtn = document.querySelector("#home");
homeBtn.addEventListener("click", getAll);
function getAll() {
    let url = "https://api.coingecko.com/api/v3/coins/list";
    let div = document.querySelector("#main");
    div.innerHTML = "";
    function cb(xhr) {
        let jsonobj = JSON.parse(xhr.responseText);
        maincoins = jsonobj.concat();
        let jsonobjsp = jsonobj.splice(0, 99);
        populateDiv(jsonobjsp);
    }
    // method url , cllback
    ajaxFetch('GET', url, cb);
}

function searchCoin(e) {
    console.log(e.target);
    let a = document.querySelector("#Search").value;
    let coinName = a.toLowerCase();
    let div = document.querySelector("#main");
    div.innerHTML ="";
    let coinsrc = maincoins.find(o => o.symbol === coinName);
    populateDiv(coinsrc,e);
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
        let tempID = "c" + coinarr.id;
        divCardHeader.innerHTML = ` ${coinarr.symbol} <label class="switch">
        <input id="cardcheck" name="c${coinarr.id}" type="checkbox" ${checkedCoins.includes(tempID) ? 'checked' : ''}>
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
            let tempID = "c" + coinarr[i].id;
            divCardHeader.innerHTML = `
            ${coinarr[i].symbol} <label class="switch">
            <input id="cardcheck" name="c${coinarr[i].id}" type="checkbox" ${checkedCoins.includes(tempID) ? 'checked' : ''}>
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
    try { checkLSTime(coinID); } catch (e) { console.log("no such id") }
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
        console.log(e);
        let coin = document.getElementsByName(`${e.target.name}`);
        console.log(coin);
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


    for (var i = 0; i < coins.length; i++) {
        let coin = coins[i].substr(1);
        let url = `https://api.coingecko.com/api/v3/coins/${coin}`;
        let div = document.querySelector(".modal-content");
        div.innerHTML = `<span class="close">&times;</span>`;
        function cb(xhr) {
            let jsonobj = JSON.parse(xhr.responseText);

            populateModal(jsonobj);
        }
        // method url , cllback
        ajaxFetch('GET', url, cb);


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
    let tempID = "c" + coin.id;
    divCardHeader.innerHTML = `
    ${coin.symbol} <label class="switch">
    <input id="cardcheck" name="c${coin.id}" type="checkbox" ${checkedCoins.includes(tempID) ? 'checked' : ''}>
    <span class="slider round"></span>
    </label>`;

    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body text-primary");
    divCardBody.setAttribute("id", "cardbody");
    divCardBody.innerHTML = `
    <h5 id="coinname" class="card-title">${coin.name}</h5>
    `
        ;

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

function showLive() {
    let div = document.querySelector("#main");
    div.innerHTML="";

}
