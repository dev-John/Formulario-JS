var xml;
var opt = document.getElementById('options');
var quizQst;
var globalIndex;
var qstList = [];
var dicionario = [];
var acertosTentativa1 = 0;
var acertosTentativa2 = 0;
var acertosTentativa3 = 0;
var tentativaAtual = 1;


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

    updateOrInsert(obj); //Insere ou atualiza a resposta no JSON
    console.log(item)

    if(element.style.backgroundColor == 'red'){
        element.style.backgroundColor = '#4CAF50';
        removeFromDictionary(element.id); // Retira do JSON pois o usuario retirou a resposta
    }
    else
    {
        resetQuestionaryColors(); //Reseta as cores do questionário (cor que identifica resposta)
        element.style.backgroundColor = 'red'; //Adiciona a cor vermelha para identificar resposta
    }

    checkQuestions(); //Verifica se todas as questões foram respondidas
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
    if(dicionario != null){
        for(i = 0; i < dicionario.length; i++){
            if(dicionario[i].Resp == "" || dicionario.length != 10) formCompleto = false; 
        }
    }

    if(formCompleto) document.getElementById('btnFinalizar').style.display = 'block';
    else 
    {
        document.getElementById('btnFinalizar').style.display = 'none';
        // document.getElementById('btnProx').style.display = 'none';
    }
}

function showResults(){
    console.log(dicionario);
    console.log(qstList);
    document.getElementById('btnFinalizar').style.display = 'none';
    if(tentativaAtual != 3)
        document.getElementById('btnAgain').style.display = 'block';

    for(let i = 0; i < dicionario.length; i++){
        let lastChar = dicionario[i].Resp.substr(-1);
        if(lastChar == qstList[i].Correta && dicionario.length == 10){
            if(tentativaAtual == 1 && acertosTentativa1 < 10){
                acertosTentativa1 = acertosTentativa1 + 1;
            }
            if(tentativaAtual == 2 && acertosTentativa1 < 10){
                acertosTentativa2 = acertosTentativa2 + 1;
            }
            if(tentativaAtual == 3 && acertosTentativa1 < 10){
                acertosTentativa3 = acertosTentativa3 + 1;
            }
        }
    }

    console.log("voce acertou: " + acertosTentativa1);
    document.getElementById('resultText').style.display = 'block';
    
    if(tentativaAtual == 1)
        document.getElementById('resultText').innerText = 'Você acertou ' + acertosTentativa1*10 + '% das questões'
    if(tentativaAtual == 2)
        document.getElementById('resultText').innerText = 'Você acertou ' + acertosTentativa2*10 + '% das questões'
    if(tentativaAtual == 3)
        document.getElementById('resultText').innerText = 'Você acertou ' + acertosTentativa3*10 + '% das questões'

    if(tentativaAtual == 1){
        document.getElementById('tip').style.display = 'block';
        if(acertosTentativa1 < 5) document.getElementById('tip').innerText = 'Você precisa estudar mais.';
        if(acertosTentativa1 >= 5 && acertosTentativa1 < 8) document.getElementById('tip').innerText = 'Nada mal.';
        if(acertosTentativa1 >= 8) document.getElementById('tip').innerText = 'Excelente, parabéns!.';
    }
    if(tentativaAtual == 2){
        document.getElementById('tip').style.display = 'block';
        if(acertosTentativa2 < 5) document.getElementById('tip').innerHTML = 'Você precisa estudar mais.';
        if(acertosTentativa2 >= 5 && acertosTentativa2 < 8) document.getElementById('tip').innerHTML = 'Nada mal.';
        if(acertosTentativa2 >= 8) document.getElementById('tip').innerHTML = 'Excelente, parabéns!.';
    }
    if(tentativaAtual == 3){
        document.getElementById('tip').style.display = 'block';
        if(acertosTentativa3 < 5) document.getElementById('tip').innerHTML = 'Você precisa estudar mais.';
        if(acertosTentativa3 >= 5 && acertosTentativa3 < 8) document.getElementById('tip').innerHTML = 'Nada mal.';
        if(acertosTentativa3 >= 8) document.getElementById('tip').innerHTML = 'Excelente, parabéns!.';
    }

    if(tentativaAtual == 3){
        mostrarResultadosFinais();
    }
}

function reiniciarTentativa(){
    tentativaAtual = tentativaAtual + 1;
    dicionario = [];
    globalIndex = 0;
    document.getElementById('resultText').style.display = 'none';
    document.getElementById('tip').style.display = 'none';
    document.getElementById('btnAgain').style.display = 'none';
    fulfillPages(0);
}

function mostrarResultadosFinais(){
    document.getElementById('tent1').innerHTML = 'Seus acertos na primeira tentativa: ' + acertosTentativa1;
    document.getElementById('tent2').innerHTML = 'Seus acertos na segunda tentativa: ' + acertosTentativa2;
    document.getElementById('tent3').innerHTML = 'Seus acertos na terceira tentativa: ' + acertosTentativa3;
}