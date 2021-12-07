let socket = new WebSocket("ws://localhost:8080/server/websocket");

window.onload = () => {
    socket.onopen = function () {
        console.log("Connection established at " + socket.url);
    }

    socket.onerror = function (e) {
        console.log("Error: " + e);
    }

    socket.onmessage = function (e) {
        console.log("Received: " + e.data);
        let res = JSON.parse(e.data);
        print(res);
    }

    socket.onclose = function () {
        console.log("Server closed. You can close the tab.");
    }

    //Binds input field and button with enter key.
    document.querySelector("#url").addEventListener("keyup", event => {
        if(event.key !== "Enter") return;
        document.querySelector("#button").click();
        event.preventDefault();
    });

    //Select all button.
    $('#select-all').click(function() {
        let checked = this.checked;
        $('input[type="checkbox"]').each(function() {
            this.checked = checked;
        });
    })

    //Check the input
    $('#url').on('keyup', function() {

        let url = correctURL($(this).val())

        if (!isValidDomain(url)) {
            $('#url').css('border-color','#fd5f5f');
            $('.regex').text('Veuillez entrer un nom de domaine valide.').css('color', '#fd5f5f');
        }
        else {
            $('.regex').text('Nom de domaine valide.').css('color', '#33e633');
            $('#url').css('border-color','#33e633');
        }

        let str = "";
        if (~$(this).val().indexOf("http://")) {str = "http://";}
        if (~$(this).val().indexOf("https://")) {str = "https://";}
        if (~$(this).val().indexOf("www.")) {str = str + "www.";}

        if(str) {$("p[class='text-warning mb-0']").text("Attention \"" + str + "\" sera exclu");}
        else {$("p[class='text-warning mb-0']").text("");}
    });
}

//Send request
function send() {
    clearConsole();

    let url = document.getElementById("url").value;

    url = correctURL(url);

    if(isValidDomain(url)) {
        if(createRecords().length>0) {
            let data = [];
            data.push(url);
            data.push(createRecords());
            console.log("Records: " + data[1]);
            console.log("Sending: " + JSON.stringify(data));
            socket.send(JSON.stringify(data));
        }
        else {
            alert("Vous devez cocher au moins 1 enregistrement.")
        }
    }
    else {
        alert(url + " n'est pas un nom de domaine valide.")
    }
}

//Print results
function print(data){
    showHTML("results");
    location.href = "#results";

    let element = document.getElementById("resultat");

    clearHTML(element);

    data.forEach( function(v) {
        //Add <article class="mb-2"></article> to resultat
        let article = document.createElement("article");
        article.className = "mb-2";
        element.appendChild(article);

        //Add <h class="pl-2" style="color: rgb(208 209 230);font-weight: bold;"></h> to article
        let header = document.createElement("h");
        header.className = "pl-2";
        header.style.color = "rgb(208 209 230)";
        header.style.fontWeight = "bold";
        article.appendChild(header);

        //Fill <h> element
        let hNode = document.createTextNode("• " + v[0] + ": ");
        header.appendChild(hNode);

        //Create a breakline element, ready to use
        let br = document.createElement("br");

        v.forEach( function(value, index) {
            //Add <p class="mb-0 px-4"></p> to article
            let paragraph = document.createElement("p");
            paragraph.className = "mb-0 px-4";
            article.appendChild(paragraph);

            //Fill <p> element
            if (v.length === 1) {
                let pNode = document.createTextNode("Aucune donnée trouvée.");
                paragraph.appendChild(pNode);
            } else {
                if (index !== 0) {
                    let pNode = document.createTextNode("- " + v[index]);
                    paragraph.appendChild(pNode);
                }
            }
            //Add <br> to article
            article.appendChild(br);
        })
    })
    console.log("Results printed.");
}
//Return array of strings representing the records to request
function createRecords(){
    let records = [];
    for (let i=1; i<$('input:checkbox').length; i++) {
        let checkBox = document.getElementById("record"+i);
        if(checkBox.checked){
            records.push(checkBox.value);
        }
    }
    return records;
}

function clearHTML(element){
    element.innerHTML = "";
}
function clearConsole(){
    console.clear();
    if (socket.readyState === 1){
        console.log("Connected at " + socket.url);
    }
}
function correctURL(url){
    url = url.replace("http://", "");
    url = url.replace("https://", "");
    url = url.replace("www.", "");
    return url;
}
function isValidDomain(domain) {
    const regex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

    return regex.test(domain);
}
function showHTML(elementID){
    document.getElementById(elementID).style.visibility = "visible";
}