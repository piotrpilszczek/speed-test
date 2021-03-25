const PING_URL = "https://speedtestapi.000webhostapp.com/ping.php";
const FILE_URL = "https://peter.antproject.pl/file.php"
const BYTES = 1024 * 1024;
let MB = BYTES * 5;

const handleTest = () => {
    let statusField = document.getElementById("statusField");

    let mbs = document.getElementById("megabytes").value;
    if(mbs < 1 || mbs > 90) {
        statusField.innerText = "Wpisz poprawną wartość (Liczba musi być pomiędzy 1MB a 90MB)!"
        return;
    }

    MB = BYTES * mbs;

    handleButtons(false);

    let button = document.getElementById("button1");

    button.innerText = "Trwa wykonywanie testu...";
    statusField.innerText = `Test niedługo się rozpocznie. Dane o wielkości ${MB / BYTES} megabajtów zostaną przesłane do pliku na serwerze.`;

    let data = "d=";
    for(let i = 0; i < MB - 2; i++) data += "k";

    let startTime = new Date().getTime();
    return handlePing(PING_URL, data).then(() => {
        let endTime = new Date().getTime();
        let time = endTime - startTime;
        let speed = 1000 * (MB / BYTES) / time;
        this.speed1 = Math.floor(speed * 800) / 100;
        statusField.innerText = `Test trwał: ${time}ms. Prędkość: ${Math.floor(speed * 800) / 100}Mb/s`
    })
    .finally(() => {
        handleButtons(true)
        button.innerText = "Wykonaj test (prześlij dane)";
    });
}

const handlePing = (url, data) => {
    return new Promise(resolve => {
        resolve(postData(url, data));
    });
}

const postData = (url, data, size = MB / BYTES, file = false) => {
    return new Promise((resolve) => {
        document.getElementById("statusField").innerText = `Trwa przesyłanie danych o wielkości ${size} megabajtów... \n (może to potrwać od paru sekund do paru minut - w zależności od szybkości łącza)`;
        resolve(fetch(url, {
            body: !file ? new Blob( [ data ], { type: 'text/plain' } ) : data,
            method: "POST"
        }));
    })
}

const handleFileTest = () => {
    let files = document.getElementById("file").files;

    if(files.length < 1) {
        document.getElementById("statusField").innerText = "Wybierz plik!";
        return;
    }

    if(files[0].size > 128 * 1024 * 1024) {
        document.getElementById("statusField").innerText = "Plik powinien mieć mniej niż 128MB!";
        return;
    }

    handleButtons(false);

    let button = document.getElementById("button2");
    let statusField = document.getElementById("statusField");

    let size = Math.floor(files[0].size / 1000) / 1000;

    button.innerText = "Trwa wykonywanie testu...";
    statusField.innerText = `Test niedługo się rozpocznie. Plik o wielkości ${size}MB zostanie przesłany na serwer.`;

    let startTime = new Date().getTime();
    return postData(FILE_URL, files[0], size, true).then(() => {
        let endTime = new Date().getTime();
        let time = endTime - startTime;
        let speed = 1000 * size / time;
        this.speed2 = Math.floor(speed * 800) / 100;
        statusField.innerText = `Test trwał: ${time}ms. Prędkość: ${Math.floor(speed * 800) / 100}Mb/s`
    })
    .finally(() => {
        handleButtons(true)
        button.innerText = "Wykonaj test (prześlij plik - wymaga wybrania lokalnego pliku)";
    });
}

const handleAllTests = () => {
    let files = document.getElementById("file").files;

    if(files.length < 1) {
        document.getElementById("statusField").innerText = "WYBIERZ PLIK!";
        return;
    }

    handleButtons(false);
    handleTest().then(() => {
        handleFileTest().then(() => {
            document.getElementById("statusField").innerText = `Średnia prędkość przesyłu, to ${Math.floor((this.speed1 + this.speed2) / 0.02) / 100}Mb/s!`
        })
    })
}

const handleButtons = enabled => {
    const ids = ["button1", "button2", "mainButton"];
    ids.forEach(id => document.getElementById(id).disabled = !enabled);
}

const fileSelected = () => {
    document.getElementById("fileChosen").innerText = document.getElementById("file").files[0].name;
}
