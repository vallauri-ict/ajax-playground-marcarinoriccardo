"use strict";
let name=0;
let mail=0;
let born=0;
let locate=0;
let phone=0;
let pswd=0;
let person;
let index=0;

$(function() {
    inviaRichiesta("", aggiornaPagina);
    $("#values_list li:nth-child(1)").hover(function () {
        name=1;
        mail=0;
        born=0;
        locate=0;
        phone=0;
        pswd=0;
        index=1;
        classFunction(index);
    });
    $("#values_list li:nth-child(2)").hover(function () {
        name=0;
        mail=1;
        born=0;
        locate=0;
        phone=0;
        pswd=0;
        index=2;
        classFunction(index);
    });
    $("#values_list li:nth-child(3)").hover(function () {
        name=0;
        mail=0;
        born=1;
        locate=0;
        phone=0;
        pswd=0;
        index=3;
        classFunction(index);
    });
    $("#values_list li:nth-child(4)").hover(function () {
        name=0;
        mail=0;
        born=0;
        locate=1;
        phone=0;
        pswd=0;
        index=4;
        classFunction(index);
    });
    $("#values_list li:nth-child(5)").hover(function () {
        name=0;
        mail=0;
        born=0;
        locate=0;
        phone=1;
        pswd=0;
        index=5;
        classFunction(index);
    });
    $("#values_list li:nth-child(6)").hover(function () {
        name=0;
        mail=0;
        born=0;
        locate=0;
        phone=0;
        pswd=1;
        index=6;
        classFunction(index);
    });
});

function getNewUser() {
    inviaRichiesta("", aggiornaPagina);
    classFunction(index);
}

function inviaRichiesta(parametri, callBack) {
  $.ajax({
    url: "https://randomuser.me/api", //default: currentPage
    type: "GET",
    data: parametri,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    dataType: "json",
    async: true, // default
    timeout: 5000,
    success: callBack,
    error: function(jqXHR, test_status, str_error) {
      alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
    }
  });
}

function classFunction(i) {
    let nameSelected="#values_list li:nth-child("+i+")";
    let st;
    for(let j=1;j<=6;j++)
    {
        if(j==i)
        {
            $(nameSelected).addClass("active");
        }
        else
        {
            $("#values_list li:nth-child("+j+")").removeClass("active");
        }
    }
    switch(i) {
        case 1:
            $("#user_value").html(person.name.title + " " + person.name.first + " " + person.name.last);
            $("#user_title").html("Hy, my name is");
            break;
        case 2:
            st=person.email;
            $("#user_value").html(st.toLowerCase());
            $("#user_title").html("My email address is");
            break;
        case 3:
            let date=(person.dob.date).split("-");
            $("#user_value").html((date[2].split("T")[0])+"/"+date[1]+"/"+date[0]);
            $("#user_title").html("My birthday is");
            break;
        case 4:
            $("#user_value").html(person["location"]["street"]["name"]);
            $("#user_title").html("My address is");
            break;
        case 5:
            $("#user_value").html(person.cell);
            $("#user_title").html("My phone number is");
            break;
        case 6:
            st=person.login.password;
            $("#user_value").html(st.toLowerCase());
            $("#user_title").html("My password is");
            break;
    }
}

function aggiornaPagina(data) {
  console.log(data);
  person = data.results[0];
  $("#user_photo img").attr("src", person.picture.large);
  classFunction(1);
  // alert(st);
}
