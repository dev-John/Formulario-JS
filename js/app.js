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
                let questao1 = xml.documentElement.children[i].children[1].innerHTML; //pega a questao 1
                let questao2 = xml.documentElement.children[i].children[2].innerHTML; //pega a questao 2
                let questao3 = xml.documentElement.children[i].children[3].innerHTML; //pega a questao 3
                let questao4 = xml.documentElement.children[i].children[4].innerHTML; //pega a questao 4
                let correta = xml.documentElement.children[i].children[5].innerHTML; //pega a questão correta
                obj = {
                    Titulo: titulo,
                    Questao1: questao1,
                    Questao2: questao2,
                    Questao3: questao3,
                    Questao4: questao4,
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
    document.getElementById('questao1').innerHTML = qstList[index].Questao1;
    document.getElementById('questao2').innerHTML = qstList[index].Questao2;
    document.getElementById('questao3').innerHTML = qstList[index].Questao3;
    document.getElementById('questao4').innerHTML = qstList[index].Questao4;
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
    document.getElementById('questao1').style.backgroundColor = "#4CAF50"
    document.getElementById('questao2').style.backgroundColor = "#4CAF50"
    document.getElementById('questao3').style.backgroundColor = "#4CAF50"
    document.getElementById('questao4').style.backgroundColor = "#4CAF50"

    for(let i = 0; i < 10; i++){
        document.getElementById('pag' + i).style.backgroundColor = 'white' 
        document.getElementById('pag' + i).style.color = 'black' 
    }
}
    // let teste = document.getElementById('pag1');
    // console.log(dicionario);
    
    //o segredo é pegar o id do item clicado, o id da pagina atual
    //e linka-los atraves de um JSON chave/valor