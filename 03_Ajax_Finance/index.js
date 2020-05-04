"use strict";

$(document).ready(function () {
    let slctSymbol=$("#slctSymbol");
    let chart=$("#myChart").hide();
    let myChart= new Chart(chart,{});

    slctSymbol.prop("selectedIndex","-1");
    
    slctSymbol.on("change",function() {
        $(".deletableRows").remove();
        createRows(0);
        getGlobalQuotes(this.value, 0);
    });

    $("#search").on("keyup",function(){
        let str=$("#search").val();
        if(str.length>=2)
        {
            $(".deletableRows").remove();
            getSymbolSearch(str);
        }
    });
	
	$.getJSON("http://localhost:3000/sector", function(data)
    {
        for(let key in data)
        {
            if(key != "Meta Data")
            {
                $("<option>", {
                    text: key,
                    value: key,
                }).appendTo($("#slctSector"));
            }
        }
		$("#slctSector").prop("selectedIndex",-1);
    });
	
	
	$("#slctSector").on("change", function(){
        let sector=this.value;

        $.getJSON("http://localhost:3000/chart", function(data){
			myChart.destroy();
			myChart = new Chart(chart,data);
			let labels=data["data"]["labels"]=[];
			let values=data["data"]["datasets"][0]["data"]=[];
			let backgroundColor=data["data"]["datasets"][0]["data"]["backgroundColor"]=[];
			let borderColor=data["data"]["datasets"][0]["data"]["borderColor"]=[];
			
			$.getJSON("http://localhost:3000/sector",function(metaData){
			for(let key in metaData[sector])
			{
				labels.push(key);
				values.push(metaData[sector][key].replace("%", ""));
				borderColor.push("rgba(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ", 1)");
				backgroundColor.push("rgba(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ", 0.2)");
			}
				
                myChart.update();
                chart.show();
			});
        });
    });
});

function getGlobalQuotes(symbol, n) {
    let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=9W3WBFZDS1SDT2TV";
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

function getSymbolSearch(keywords) {
    let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + keywords + "&apikey=9W3WBFZDS1SDT2TV";
    $.getJSON(url, function (data) {
        let dataMatches=data["bestMatches"];
        for(let i=0;dataMatches.length; i++)
        {
            createRows(i);
            getGlobalQuotes(dataMatches[i]["1. symbol"], i);
        }
    });
}

function createRows(n) {
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
}

document.getElementById("download").addEventListener('click', function(){
    let url_base64jp = document.getElementById("myChart").toDataURL("image/jpg");
    let a =  document.getElementById("download");
    a.href = url_base64jp;
});

function random(min, max) {
    return Math.floor((max - min + 1) * Math.random()) + min;
}