var xml;
var opt = document.getElementById('options');
var quizQst;
var globalIndex;
var qstList = [];
var dicionario = [];

$(document).ready(function(){
    // document.getElementById('pag1').style.backgroundColor = 'black';

    quizQst = document.getElementById('quizQuestion');
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && this.status ==200){
            xml = ajax.responseXML;
            let tam = xml.documentElement.children.length

            for(let i = 0; i < tam; i++){
                let titulo = xml.documentElement.children[i].children[0].innerHTML; //pega o título
                let alternativaA = xml.documentElement.children[i].children[1].innerHTML; //pega a questao 1
                let alternativaB = xml.documentElement.children[i].children[2].innerHTML; //pega a questao 2
                let alternativaC = xml.documentElement.children[i].children[3].innerHTML; //pega a questao 3
                let alternativaD = xml.documentElement.children[i].children[4].innerHTML; //pega a questao 4
                let alternativaE = xml.documentElement.children[i].children[5].innerHTML; //pega a questao 4
                let correta = xml.documentElement.children[i].children[6].innerHTML; //pega a questão correta
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

    resetColors();

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
    let deleted = false;

    if(!deleted){
        obj = {
            Aba: globalIndex,
            Resp: element.id
        }
    
        updateOrInsert(obj);
    }
    console.log(dicionario)

    if(element.style.backgroundColor == 'red'){
        element.style.backgroundColor = '#4CAF50';
        deleted = true;
        removeFromDictionary(element.id);
    }
    else
    {
        resetColors();
        element.style.backgroundColor = 'red';
    }
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

function resetColors(){
    document.getElementById('alternativaA').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaB').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaC').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaD').style.backgroundColor = "#4CAF50"
    document.getElementById('alternativaE').style.backgroundColor = "#4CAF50"

    for(let i = 0; i < 10; i++){
        document.getElementById('pag' + i).style.backgroundColor = 'white' 
        document.getElementById('pag' + i).style.color = 'black' 
    }
}
    // let teste = document.getElementById('pag1');
    // console.log(dicionario);
    
    //o segredo é pegar o id do item clicado, o id da pagina atual
    //e linka-los atraves de um JSON chave/valor