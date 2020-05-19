"use strict";

//region Variables
let increm=false;
let deletedRows=false;
//endregion

//region Main
$(document).ready(function () {
    let _selSymbol=$("#selSymbol");
	let _myChart=$("#myChart").hide();
	let newChart= new Chart(_myChart,{});

    $("#btnDownload").hide();
    $("#btnUpload").hide();

	$.getJSON("http://localhost:3000/companies", function(data) {
		for(let key in data)
		{
			$("<option>", {
                text: data[key]["desc"],
                value: data[key]["id"],
            }).appendTo($("#selSymbol"));
        }
    });

    _selSymbol.on("change",function() {
        DeleteRows();
        CreateRows(0);
        getGlobalQuotes(this.value, 0);
    });
    _selSymbol.prop("selectedIndex","-1");

    $("#search").on("keyup",function(){
        let str=$("#search").val();
        if(str.length>1)
        {
            _selSymbol.prop("selectedIndex","-1");
            if(!deletedRows)
            {
                DeleteRows();
            }
            getSymbolSearch(str);
        }
        else
        {
            if(increm==true)
            {
                DeleteRows();
            }
        }
    });
	
	$.getJSON("http://localhost:3000/sector", function(data) {
        for(let key in data)
        {
            if(key != "Meta Data")
            {
                $("<option>", {
                    text: key,
                    value: key,
                }).appendTo($("#selSector"));
            }
        }
		$("#selSector").prop("selectedIndex",0);
    });

	$("#selSector").on("change", function(){
        let sector=this.value;
        $.getJSON("http://localhost:3000/chart", function(data){
			newChart.destroy();
			newChart = new Chart(_myChart,data);
			let labels=data["data"]["labels"]=[];
			let values=data["data"]["datasets"][0]["data"]=[];
			let backgroundColor=data["data"]["datasets"][0]["backgroundColor"]=[];
			let borderColor=data["data"]["datasets"][0]["borderColor"]=[];

			$.getJSON("http://localhost:3000/sector",function(metaData){
                for(let key in metaData[sector])
                {
                    labels.push(key);
                    values.push(metaData[sector][key].replace("%", ""));
                    backgroundColor.push("rgba("+random(0,255)+","+random(0,255)+","+random(0,255)+",0.7)");
                    borderColor.push("rgba("+random(0,255)+","+random(0,255)+","+random(0,255)+",1)");
                }
                $("#btnDownload").show();
                $("#btnUpload").show();
                newChart.update();
                _myChart.show();
			});
        });
    });

    $("#btnDownload").on("click", function(){
        let url_base64jp = document.getElementById("myChart").toDataURL("image/jpg");
        let a =  document.getElementById("btnDownload");
        a.href = url_base64jp;
    });

    $("#btnUpload").on("click", function(){
        // client id of the project
        let clientId = "890146325177-mq3nffaoget1sv87pgrsgt029te3t1fp.apps.googleusercontent.com";
        // redirect_uri of the project
        let redirect_uri = "http://127.0.0.1:8080/index.html";
        // scope of the project
        let scope = "https://www.googleapis.com/auth/drive";
        // the url to which the user is redirected to
        let url = "";
        // the actual url to which the user is redirected to
        url = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=" + redirect_uri + "&prompt=consent&response_type=code&client_id=" + clientId + "&scope=" + scope + "&access_type=offline";

        let file = dataURItoBlob(document.getElementById("myChart").toDataURL("image/jpg"));
        console.log(file);
        let upload = new Upload(file);
        upload.doUpload();

        //window.location = url;
    });
});
//endregion

//region Other
function getGlobalQuotes(symbol, n) {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=F8R34RSCPRYURAUW";
    $.getJSON(url, function (data) {
            let globalQuoteData = data["Global Quote"];
            $("#symbol"+n).text(globalQuoteData["01. symbol"]);
            $("#previousClose"+n).text(globalQuoteData["08. previous close"]);
            $("#open"+n).text(globalQuoteData["02. open"]);
            $("#lastTrade"+n).text(globalQuoteData["05. price"]);
            $("#lastTradeTime"+n).text(globalQuoteData["07. latest trading day"]);
            $("#change"+n).text(globalQuoteData["09. change"]);
            $("#daysLow"+n).text(globalQuoteData["04. low"]);
            $("#daysHigh"+n).text(globalQuoteData["03. high"]);
            $("#volume"+n).text(globalQuoteData["06. volume"]);
        }
    );
}

function getSymbolSearch(str) {
    increm=true;
    let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + str + "&apikey=FKSX9C6YS41SG4Q7";
    $.getJSON(url, function (data) {
        let matches=data["bestMatches"];
        for(let i=0;i<matches.length-1; i++)
        {
            CreateRows(i);
            getGlobalQuotes(matches[i]["1. symbol"], i);
        }
    });
}

function CreateRows(n) {
    let tr=$("<tr>").addClass("deletableRows");

    $("<td>").prop("id", "symbol"+n).appendTo(tr);
    $("<td>").prop("id", "lastTrade"+n).appendTo(tr);
    $("<td>").prop("id", "lastTradeTime"+n).appendTo(tr);
    $("<td>").prop("id", "change"+n).appendTo(tr);
    $("<td>").prop("id", "open"+n).appendTo(tr);
    $("<td>").prop("id", "previousClose"+n).appendTo(tr);
    $("<td>").prop("id", "daysLow"+n).appendTo(tr);
    $("<td>").prop("id", "daysHigh"+n).appendTo(tr);
    $("<td>").prop("id", "volume"+n).appendTo(tr);
    tr.appendTo($("#table"));
    deletedRows=false;
}

function DeleteRows() {
    $(".deletableRows").remove();
    deletedRows=true;
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let blob = new Blob([ab], {type: mimeString});
    blob.name="ChartImage.jpg";
    //DriveApp.createFile(blob);
    return blob;
}

function random(min, max) {
    return Math.floor((max - min + 1) * Math.random()) + min;
}
//endregion

//region Upload
let Upload = function (file)
{
    this.file = file;
};

Upload.prototype.getType = function()
{
    localStorage.setItem("type",this.file.type);
    return this.file.type;
};
Upload.prototype.getSize = function()
{
    localStorage.setItem("size",this.file.size);
    return this.file.size;
};
Upload.prototype.getName = function()
{
    return this.file.name;
};
Upload.prototype.doUpload = function ()
{
    let that = this;
    let formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file, this.getName());
    formData.append("upload_file", true);

    $.ajax({
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));

        },
        url: "https://www.googleapis.com/upload/drive/v2/files",
        data:{
            uploadType:"media"
        },
        xhr: function () {
            let myXhr = $.ajaxSettings.xhr();
            /*if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }*/
            return myXhr;
        },
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    });
};
//endregion
