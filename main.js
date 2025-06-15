const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;

const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?';
const caracteresEspeciais = '©®™€¥±µ∞•¶§¤';
const caracteresUnicode = 'áàãâäéèêëíìîïóòõôöúùûüçñÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇÑ';
const emojis = '😀😃😄😁😆😅😂🤣😊😇😉😍😘😜🤪😎🤩';

const btnDiminuir = document.querySelector('#btn-diminuir');
const btnAumentar = document.querySelector('#btn-aumentar');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const nivelForca = document.querySelector('#nivelForca');
const valorEntropia = document.querySelector('.entropia');
const botaoGerar = document.querySelector('#botao-gerar');
const qrcodeContainer = document.getElementById('qrcode');

// Função que mostra/esconde o botão gerar senha conforme scroll
function controlarVisibilidadeBotao() {
    const alturaJanela = window.innerHeight;
    const scrollAtual = window.scrollY || window.pageYOffset;

    if (scrollAtual < alturaJanela) {
        botaoGerar.style.display = 'inline-block'; // mostrar botão
    } else {
        botaoGerar.style.display = 'none'; // esconder botão
    }
}

controlarVisibilidadeBotao();
window.addEventListener('scroll', controlarVisibilidadeBotao);

// Atualiza o botão Gerar conforme validações
function atualizaBotaoGerar() {
    const algumSelecionado = Array.from(checkbox).some(chk => chk.checked);
    if (tamanhoSenha < 6 || !algumSelecionado) {
        botaoGerar.disabled = true;
        botaoGerar.style.backgroundColor = '#999';
        botaoGerar.style.cursor = 'not-allowed';
    } else {
        botaoGerar.disabled = false;
        botaoGerar.style.backgroundColor = '#4CAF50';
        botaoGerar.style.cursor = 'pointer';
    }
}

btnDiminuir.onclick = () => {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
        numeroSenha.textContent = tamanhoSenha;
        atualizaBotaoGerar();
        geraSenha();
    }
};

btnAumentar.onclick = () => {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
        numeroSenha.textContent = tamanhoSenha;
        atualizaBotaoGerar();
        geraSenha();
    }
};

checkbox.forEach(c => {
    c.addEventListener('change', () => {
        atualizaBotaoGerar();
        geraSenha();
    });
});

botaoGerar.addEventListener('click', () => {
    if (!botaoGerar.disabled) {
        geraSenha();
    }
});

function geraSenha() {
    let alfabeto = '';

    if (checkbox[0].checked) alfabeto += letrasMaiusculas;
    if (checkbox[1].checked) alfabeto += letrasMinusculas;
    if (checkbox[2].checked) alfabeto += numeros;
    if (checkbox[3].checked) alfabeto += simbolos;
    if (checkbox[4] && checkbox[4].checked) alfabeto += caracteresEspeciais;
    if (checkbox[5] && checkbox[5].checked) alfabeto += caracteresUnicode;  // Unicode
    if (checkbox[6] && checkbox[6].checked) alfabeto += emojis;              // Emojis

    if (alfabeto.length === 0) {
        campoSenha.value = 'Selecione ao menos 1 opção!';
        nivelForca.style.width = '0%';
        nivelForca.style.background = 'transparent';
        valorEntropia.textContent = '';
        qrcodeContainer.innerHTML = '';
        return;
    }

    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        const indice = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[indice];
    }

    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
    gerarQRCode(senha);
}

function classificaSenha(tamanhoAlfabeto) {
    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    const dias = Math.floor((2 ** entropia) / (100e6 * 60 * 60 * 24));
    valorEntropia.textContent = `Um computador pode levar até ${dias.toLocaleString('pt-BR')} dias para descobrir essa senha.`;

    if (entropia > 57) {
        nivelForca.style.width = '100%';
        nivelForca.style.background = 'linear-gradient(to right, #00FF85, #00CC66)';
    } else if (entropia > 35) {
        nivelForca.style.width = '66%';
        nivelForca.style.background = 'linear-gradient(to right, #FAF408, #FFD700)';
    } else {
        nivelForca.style.width = '33%';
        nivelForca.style.background = 'linear-gradient(to right, #E71B32, #B00020)';
    }
}

function gerarQRCode(texto) {
    qrcodeContainer.innerHTML = '';
    if (!texto || texto === 'Selecione ao menos 1 opção!') return;

    new QRCode(qrcodeContainer, {
        text: texto,
        width: 160,
        height: 160,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

const botaoBaixar = document.getElementById('botao-baixar');

botaoBaixar.addEventListener('click', () => {
    const canvas = qrcodeContainer.querySelector('canvas');
    if (!canvas) {
        alert('Por favor, gere o QR code primeiro!');
        return;
    }
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
});

// Classificação por idade
const botaoVerificar = document.getElementById('botao-verificar');
const idadeInput = document.getElementById('idadeInput');
const resultadoIdade = document.getElementById('resultadoIdade');
const barraIdade = document.getElementById('barraIdade');

botaoVerificar.addEventListener('click', () => {
    const idade = parseInt(idadeInput.value, 10);

    if (isNaN(idade) || idade < 0) {
        resultadoIdade.textContent = 'Por favor, digite uma idade válida.';
        barraIdade.style.width = '0%';
        barraIdade.style.backgroundColor = 'transparent';
        return;
    }

    if (idade < 12) {
        resultadoIdade.textContent = 'Você é uma criança.';
        barraIdade.style.width = '33%';
        barraIdade.style.backgroundColor = '#FFA500'; // laranja
    } else if (idade < 18) {
        resultadoIdade.textContent = 'Você é um adolescente.';
        barraIdade.style.width = '66%';
        barraIdade.style.backgroundColor = '#1E90FF'; // azul
    } else {
        resultadoIdade.textContent = 'Você é um adulto.';
        barraIdade.style.width = '100%';
        barraIdade.style.backgroundColor = '#32CD32'; // verde
    }
});

// Gera a senha inicial ao carregar
geraSenha();
atualizaBotaoGerar();