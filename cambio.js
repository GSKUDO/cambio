$(document).ready(function(){
    $("table, td, th, tr").css("border", "1px solid green");
    $("table").css("margin", "auto");
    $("th").css("width", "200px");
    $("h1").css("text-align", "center");
    $("h1").css("color", "green");
    $("p").css("text-align", "center");
    $("#ultimacotacao").css("border", "1px solid green");
    $("#ultimacotacao").css("margin", "auto");
    $("canvas").css("margin", "auto");

    let moedaoption;
    

    $.ajax({ url: "https://economia.awesomeapi.com.br/json/all"})
    .done( (data) => {
        Object.entries(data).forEach( (moeda) => {
            $("#listademoedas").append(`<option>${moeda[0]}</option>`);
        })
    });

    $("#listademoedas").on("change",function(){
        moedaoption = $("#listademoedas").val();
        $.ajax({url:`https://economia.awesomeapi.com.br/json/${moedaoption}-BRL`})
        .done((data)=>{
            moedaesc = Object.values(data)[0];
            $("#moeda").html("Moeda: " + moedaesc.name);
            $("#ultima").html("Última Cotação: " + moedaesc.bid);
            $("#data").html("Data: " + moedaesc.create_date);
            $("#vlminimo").html("Valor Mínimo: " + moedaesc.low);
            $("#vlmaximo").html("Valor Máximo: " + moedaesc.high);
            $("#vlfechamento").html("Valor de Fechamento: " + moedaesc.ask);       
        });

    })

    $("#buscar").on("click",function(){
        $("#resultado").html("")
        const inicio = $("#dataum").val().replaceAll("-","");
        const fim = $("#datadois").val().replaceAll("-","");
        $.ajax({url:`https://economia.awesomeapi.com.br/${moedaoption}-BRL/${10**20}?start_date=${inicio}&end_date=${fim}`}).done(function (data){
            const nomedamoeda = $("#listademoedas").val();
            const arraycotacao = [];
            const arraydata = [];
            data.forEach(moedas=>{
                const dia = new Date(moedas.timestamp*1000).getDate();
                const mes = new Date(moedas.timestamp*1000).getMonth() +1;
                const ano = new Date(moedas.timestamp*1000).getFullYear();               
                arraycotacao.push(moedas.bid);
                arraydata.push(`${dia}/${mes}/${ano}`)
                $("#resultado").append(`<tr><td>${nomedamoeda}</td><td>${dia}/${mes}/${ano}</td><td>${moedas.low}</td><td>${moedas.high}</td><td>${moedas.bid}</td></tr>`)
            })

            
            new Chart("myChart", {
              type: "line",
              data: {
                labels: arraydata,
                datasets: [{
                  fill: false,
                  lineTension: 0,
                  backgroundColor: "green",
                  borderColor: "green",
                  data: arraycotacao
                }]
              },
              options: {
                legend: {display: false},
                scales: {
                  yAxes: parseInt(arraycotacao),
                }
              }
            });
        });
      
    })
})

