const cps = "images/copas/";
const crg = "images/coringas/";
const spd = "images/espadas/";
const ors = "images/ouros/";
const ps = "images/paus/";

const c_brdR = '5px'; //  carta border radius
const c_wth = '128px'; // carta width
const c_hth = '240px'; // carta height

const btnDraw = document.getElementById('btnDraw');
const btnHold = document.getElementById('btnHold');
const btnRestart = document.getElementById('btnRestart')

const baralho = [
    { naipe: 'copas', abrev: 'c' },
    { naipe: 'paus', abrev: 'p' },
    { naipe: 'ouros', abrev: 'o' },
    { naipe: 'espadas', abrev: 'e' },
];

const cartas = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let coringas = ['C8_JKR', 'G_JKR', 'F_JKR', 'A_JKR'];
let coringas_deck = 4;


let plrHold = false;
let botHold = false;

let p_cartas = 0;
let b_cartas = 0;

let plyr1 = [];
let bot = [];

let p_pontos = 0;
let b_pontos = 0;

let g_valor = RNG(6) + 1;
let a_valor = RNG(10) + 1;

console.log(g_valor);
console.log(a_valor);


function teste(valor) {
    if (valor == 1) {
        plyr1.forEach(function (c) {
            console.log("mão : " + c);
        });
    }

    if (valor == 0) {
        bot.forEach(function (c) {
            console.log("mão bot: " + c);
        });
    }
}


// ------------------------------------------------------------------------------ FUNCOES JOGO

function RNG(max_ni) {
    return Math.floor(Math.random() * max_ni);
}

function botJoga() {
    if (b_cartas < 5 && !botHold) {
        const carta_selec = selecionaCarta(0);

        //----- padrao da carta bot
        carta_selec.style.width = c_wth;
        carta_selec.style.height = c_hth;
        carta_selec.style.borderRadius = c_brdR;
        carta_selec.style.backgroundColor = 'white';
        carta_selec.style.transform = 'scaleY(-1)';
        // --------------------

        var posicao = document.getElementById('b_c_' + b_cartas);
        posicao.appendChild(carta_selec);

        b_cartas++;
    }

    calcPontos();

    if (b_pontos >= 16) {
        botHold = true;
        document.getElementById('b_isHold').innerText = 'HOLD';
    }

    teste(0);
    if (b_cartas == 5){
        botHold = true;
        document.getElementById('b_isHold').innerText = 'HOLD';
    }
    verificaFim();
    if (!botHold && plrHold) botJoga();
}

function calcPontos() {
    let czm_p = false;
    let czm_b = false;

    p_pontos = 0;
    b_pontos = 0;

    bot.forEach(e => {
        if (isNaN(e)) {
            if (e == 'A' || e == 'J' || e == 'Q' || e == 'K') {
                b_pontos += 10;
            } else {
                switch (e) {
                    case 'C8_JKR':
                        czm_b = true;
                        break;
                    case 'F_JKR':
                        const mesa = document.getElementById('mesa');
                        mesa.style.backgroundImage = "url('images/Felps_Real.png')";
                        b_pontos += 5;
                        break;
                    case 'G_JKR':
                        b_pontos += g_valor;
                        p_pontos -= g_valor;
                        break;
                    case 'A_JKR':
                        b_pontos += a_valor;
                        break;
                    default:
                        console.log("ERRO CALCULO PONTOS CORINGAS");
                        break;
                }
            }
        } else {
            b_pontos += parseInt(e);
        }
    });
    if (b_pontos > 21) {
        bot.forEach(e => {
            if (e == 'A' && b_pontos > 21) {
                b_pontos -= 9;
            }
        });
    }

    plyr1.forEach(e => {
        if (isNaN(e)) {
            if (e == 'A' || e == 'J' || e == 'Q' || e == 'K') {
                p_pontos += 10;
            } else {
                switch (e) {
                    case 'C8_JKR':
                        czm_p = true;
                        break;
                    case 'F_JKR':
                        const mesa = document.getElementById('mesa');
                        mesa.style.backgroundImage = "url('images/Felps_Real.png')";
                        p_pontos += 5;
                        break;
                    case 'G_JKR':
                        p_pontos += g_valor;
                        b_pontos -= g_valor;
                        break;
                    case 'A_JKR':
                        p_pontos += a_valor;
                        break;
                    default:
                        console.log("ERRO CALCULO PONTOS CORINGAS");
                        break;
                }
            }
        } else {
            p_pontos += parseInt(e);
        }
    });

    if (czm_b) {
        b_pontos = Math.floor(b_pontos * 0.);
        b_pontos += 8;
        p_pontos = Math.ceil(p_pontos * 0.8);
    }

    if (czm_p) {
        p_pontos = Math.floor(p_pontos * 0.8);
        p_pontos += 8;
        b_pontos = Math.ceil(b_pontos * 0.8);
    }

    if (b_pontos > 21) {
        bot.forEach(e => {
            if (e == 'A' && b_pontos > 21) {
                b_pontos -= 9;
            }
        });
    }

    
    if (p_pontos > 21) {
        plyr1.forEach(e => {
            if (e == 'A' && p_pontos > 21) {
                p_pontos -= 9;
            }
        });
    }

    let placar_p = document.getElementById('placar_p');
    let placar_b = document.getElementById('placar_b');

    placar_p.innerText = p_pontos;
    placar_b.innerText = b_pontos;
}

function verificaFim() {
    if (botHold && plrHold) {
        const res = document.getElementById('resultado');
        const msgm_res = document.getElementById('msgm_res');

        if (p_pontos <= 21){
            res.innerText = "VITÓRIA!";
            if (b_pontos < p_pontos){
                msgm_res.innerText = "Jogador fez mais pontos!";
            }

            if (b_pontos > p_pontos){
                if (b_pontos > 21){
                    msgm_res.innerText = "Bot fez mais de 21 pontos!";
                } else  if (b_pontos == 21){
                    res.innerText = "DERROTA!";
                    msgm_res.innerText = "Bot fez 21 pontos!";
                } else {
                    res.innerText = "DERROTA!";
                    msgm_res.innerText = "Bot fez mais pontos!";
                }
            }

            if(p_pontos == 21){
                msgm_res.innerText = "Jogador fez 21 pontos!";
            }

            if (b_pontos == p_pontos){
                res.innerText = "EMPATE!";
                msgm_res.innerText = "Ambos fizeram a mesma quantidade de pontos!";
            }
        } else {
            res.innerText = "DERROTA!";
            if(b_pontos <= 21){
                msgm_res.innerText = "Jogador fez mais de 21 pontos!";

                if (b_pontos > p_pontos) msgm_res.innerText = "Bot fez mais pontos!";
                if (b_pontos == 21) msgm_res.innerText = "Bot fez 21 pontos!";
            }

            if(b_pontos > 21){
                res.innerText = "EMPATE!";
                msgm_res.innerText = "Ambos fizeram mais de 21 pontos!";
            }
        }
       
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('telaFim').style.display = 'block';
    }
}

function selecionaCarta(jogando) {
    const carta_selec = document.createElement('img');
    let naipe = RNG(5);
    if (coringas_deck == 0) naipe = RNG(4);
    if (naipe != 4) {
        let carta = RNG(13);
        switch (naipe) {
            case 0:
                carta_selec.src = cps + cartas[carta] + '.png';
                break;
            case 1:
                carta_selec.src = spd + cartas[carta] + '.png';
                break;
            case 2:
                carta_selec.src = ors + cartas[carta] + '.png';
                break;
            case 3:
                carta_selec.src = ps + cartas[carta] + '.png';
                break;
        }
        if (jogando == 1) {
            plyr1[p_cartas] = cartas[carta];
        } else {
            bot[b_cartas] = cartas[carta];
        }
    } else {
        let carta = RNG(coringas_deck);
        let aux;

        if (jogando == 1) {
            plyr1[p_cartas] = coringas[carta];
        } else {
            bot[b_cartas] = coringas[carta];
        }

        carta_selec.src = crg + coringas[carta] + '.png';

        aux = coringas[coringas_deck - 1];
        coringas[coringas_deck - 1] = coringas[carta];
        coringas[carta] = aux;
        coringas_deck--;
    }

    return carta_selec;
}

// ------------------------------------------------------------------------------ FUNCOES BOTOES

function draw() {
    if (p_cartas < 5) {
        const carta_selec = selecionaCarta(1);

        //----- padrao da carta
        carta_selec.style.width = c_wth;
        carta_selec.style.height = c_hth;
        carta_selec.style.borderRadius = c_brdR;
        carta_selec.style.backgroundColor = 'white';
        // --------------------

        var posicao = document.getElementById('p_c_' + p_cartas);
        posicao.appendChild(carta_selec);

        p_cartas++;
        teste(1);
        calcPontos();
    }
    if (p_cartas == 5) hold();

    verificaFim();
    if (!botHold) botJoga();
}

function hold() {
    plrHold = true;
    document.getElementById('p_isHold').innerText = 'HOLD';
    calcPontos();

    btnDraw.disabled = true;
    btnHold.disabled = true;

    btnHold.classList.replace('btnhold', 'btnhold_des');
    btnDraw.classList.replace('btndraw', 'btndraw_des');

    if (!botHold) {
        botJoga();
    } else {
        verificaFim();
    }
}

function restart() {
    location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
    btnDraw.addEventListener('click', draw);
    btnHold.addEventListener('click', hold);
    btnRestart.addEventListener('click', restart);
});
