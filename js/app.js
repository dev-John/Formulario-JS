var xml;
var opt = document.getElementById('options');
var quizQst;
var globalIndex;
var qstList = [];
var dicionario = [];

$(document).ready(function(){
    quizQst = document.getElementById('quizQuestion');
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && this.status ==200){
            xml = ajax.responseXML;

            numeros = sortQuestions(xml);

            for(let i = 0; i < 10; i++){
                let titulo = xml.documentElement.children[numeros[i]].children[0].innerHTML; //pega o título
                let alternativaA = xml.documentElement.children[numeros[i]].children[1].innerHTML; //pega a questao 1
                let alternativaB = xml.documentElement.children[numeros[i]].children[2].innerHTML; //pega a questao 2
                let alternativaC = xml.documentElement.children[numeros[i]].children[3].innerHTML; //pega a questao 3
                let alternativaD = xml.documentElement.children[numeros[i]].children[4].innerHTML; //pega a questao 4
                let alternativaE = xml.documentElement.children[numeros[i]].children[5].innerHTML; //pega a questao 4
                let correta = xml.documentElement.children[numeros[i]].children[6].innerHTML; //pega a questão correta
                obj = {
                    Titulo: titulo,
                    AlternativaA: alternativaA,
                    AlternativaB: alternativaB,
                    AlternativaC: alternativaC,
                    AlternativaD: alternativaD,
                    AlternativaE: alternativaE,
                    Correta: correta
                }
                qstList.push(obj);                
            }
            fulfillPages(0);
        }
    }
    ajax.open("GET", "files/questions.xml");
    ajax.send();
})

function fulfillPages(index){
    globalIndex = index;

    resetQuestionaryColors();
    resetPaginatorColors('white');
    
    document.getElementById('pag' + index).style.backgroundColor = '#4CAF50'
    document.getElementById('pag' + index).style.color = 'white'

    for(let i = 0; i < dicionario.length; i++){
        if(dicionario[i].Aba == index){
            document.getElementById(dicionario[i].Resp).style.backgroundColor = 'red';
        }
    }

    quizQst.innerHTML = qstList[index].Titulo;
    document.getElementById('alternativaA').innerHTML = qstList[index].AlternativaA;
    document.getElementById('alternativaB').innerHTML = qstList[index].AlternativaB;
    document.getElementById('alternativaC').innerHTML = qstList[index].AlternativaC;
    document.getElementById('alternativaD').innerHTML = qstList[index].AlternativaD;
    document.getElementById('alternativaE').innerHTML = qstList[index].AlternativaE;
}

function selectThis(item){
    let element = document.getElementById(item.id);

    obj = {
        Aba: globalIndex,
        Resp: element.id
    }

    updateOrInsert(obj);


    if(element.style.backgroundColor == 'red'){
        element.style.backgroundColor = '#4CAF50';
        removeFromDictionary(element.id);
    }
    else
    {
        resetQuestionaryColors();
        element.style.backgroundColor = 'red';
    }

    checkQuestions();
}

function updateOrInsert(obj){

    let boolKey = 0;

    for(let i = 0; i < dicionario.length; i++){
        if(dicionario[i].Aba == obj.Aba){ //UPDATE
            dicionario[i].Resp = obj.Resp;
            boolKey = 1;
        }
    }

    if(boolKey == 0){ //INSERT
        dicionario.push(obj);
    }
}

function removeFromDictionary(item){
    dicionario[globalIndex].Resp = "";
}

function resetQuestionaryColors(){
    document.getElementById('alternativaA').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaB').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaC').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaD').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaE').style.backgroundColor = "#4CAF50"
}

function resetPaginatorColors(color){    
    for(let i = 0; i < 10; i++){
        document.getElementById('pag' + i).style.backgroundColor = color;
        document.getElementById('pag' + i).style.color = 'black' 
    }
}

function sortQuestions(xml){
    let numeros = [];

    while(numeros.length < 10){
        let random = Math.floor(Math.random() * 50);
        if(numeros.indexOf(random) == -1){
            numeros.push(random);
        }
    }

    return numeros;
}

function checkQuestions(){
    console.log(dicionario);
    let formCompleto = true;
    for(i = 0; i < 10; i++){
        if(dicionario[i].Resp == "") formCompleto = false; 
    }

    if(formCompleto) document.getElementById('btnProx').style.display = 'block';
    else document.getElementById('btnProx').style.display = 'none';
}