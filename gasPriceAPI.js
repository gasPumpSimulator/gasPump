function getGasPrice()
{
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        console.log(this.responseURL);
    }
    });

    xhr.open("GET", "https://api.collectapi.com/gasPrice/stateUsaPrice?state=IN");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("authorization", "apikey 3VPp5ZoC23c68hlJ0iHBlO:73TDPEioJrqgodErELhNnq");

    xhr.send(data);
    console.log(data);
}
