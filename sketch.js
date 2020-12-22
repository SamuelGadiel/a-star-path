// Atividade 3 da Matéria PLIA
// Aluno: Samuel Gadiel de Ávila
// Matricula: 11721EAU005

new p5();
// Tamanho do tabuleiro
const cols = 25;
const rows = 25;

var grid = new Array(cols);

// Tamanho da celula
const cellwidth = 650 / cols;
const cellHeight = 650 / rows;


// const squares = (cols * rows);
// Essas são as coordenadas dos obstaculos que serão usados
let [wallsX, wallsY] = addWalls();

// Permite diagonais
let allowDiagonals = false;

let outputFailureP = undefined;
let outputSuccessP = undefined;
let outputFailureContainer = undefined;
let outputSuccessContainer = undefined;

// Lista de pontos a checar
let openSet = [];
// Lista de pontos checados
let closedSet = [];

let start;
let end;
let current;

// Lista de pontos do melhor caminho
let path;

// Função que é chamada quando clica no checkbox de diagonais
setDiagonals = () => allowDiagonals = !allowDiagonals;


// Dada uma lista, nesse caso openSet, remove um dado elemento quando encontrar ele por index
function rmvFromOpen(lista, elemento) {
    lista = lista.reverse();

    for (var i = 0; i < lista.length; i++) {
        if (lista[i] == elemento) {
            lista.splice(i, 1);
        }
    }

    lista = lista.reverse();
}

// Calcula a distancia entre dois pontos
heuristic = (a, b) => abs(a.x - b.x) + abs(a.y - b.y)

// Configurando quais vao ser as barreiras do grid
function addWalls() {
    const numWalls = 200;
    let wallX = [];
    let wallY = [];

    // Seleciona aleatoriamente pontos do grid e cria uma lista com esses pontos
    for (let i = 0; i < numWalls; i++) {
        x = random(cols);
        y = random(rows);
        wallX.push(Math.floor(x));
        wallY.push(Math.floor(y));
    }

    return [wallX, wallY];
}

// Insere os obstaculos no grid
function placeWalls(start, end) {
    for (let i = 0; i < wallsX.length; i++) {
        currentX = wallsX[i];
        currentY = wallsY[i];

        // ponto inicial e final são pontos proibidos de serem obstaculos
        disallowedWalls = [start, end];

        // Se ponto inicial ou final fizerem parte dos pontos selecionados pula aquele ponto
        // Se não fizer parte diz que aquele ponto será um obstaculo
        if (disallowedWalls.includes(grid[currentX][currentY])) {
            continue;
        } else {
            grid[currentX][currentY].isWall = true;
        }
    }
}

// Reinicia o loop
startPathfinding = () => loop()

// Reseta a aplicação para rodar um novo "jogo"
function clearPathfinding() {
    openSet = [];
    closedSet = [];
    path = [];

    outputFailureP.html("&nbsp;");
    outputSuccessP.html("");

    setup();
    draw();
}

// Limpa toda a grid e cria novos obstaculos para essa grid
function newWalls() {
    grid = [];
    [wallsX, wallsY] = [];

    // Seleciona novos pontos para serem os obstaculos
    [wallsX, wallsY] = addWalls();

    // reset do jogo
    clearPathfinding();
}

// -----------------------------------------------------------------------------------------------------------
function setup() {
    background(0);
    frameRate(15);

    // Captura as tags HTML
    // allowDiagonals = select("#diagonals");

    outputFailureP = select("#failureResultP");
    outputSuccessP = select("#successResultP");
    outputSuccessContainer = select(".success");
    outputFailureContainer = select(".failure");

    // allowDiagonals = diagInput.value();
    let cnv = createCanvas(650, 650);
    cnv.parent('canvasContainer');

    // Cria a matriz da grid
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // Para cada ponto do grid cria uma classe Square
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Square(i * cellwidth, j * cellHeight);
        }
    }

    // Ponto inicial e final
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    // Toma os pontos selecionados a serem obstaculos e os coloca no grid
    placeWalls(start, end);

    // Para cada ponto define quais serao os vizinhos
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    // Adiciona o ponto inicial à lista de pontos a serem analisados (openSet)
    openSet.push(start);
    noLoop();
}

// ---------------------------------------------------------------------------------------------------------------
function draw() {
    // Se houver pontos a serem analisados
    if (openSet.length > 0) {

        // Encontra o ponto com menor valor de F
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            // Se houverem dois pontos com o mesmo custo de F
            // toma aquele com maior gCost, ou seja, aquele que estiver mais longe do ponto inicial
            if (openSet[i].fCost == openSet[winner].fCost) {
                if (openSet[i].gCost > openSet[winner].gCost) {
                    winner = i;
                }
            }
        }

        // Proximo ponto avaliado será aquele com indice vencedor
        let current = openSet[winner];

        // QUando encontrar o final devemos mostrar o caminho
        if (current == end) {
            path = [];
            var tmp = current;
            path.push(tmp);

            // Retorna do fim ao inicio adicionando os pontos percorridos
            while (tmp.previous) {
                path.push(tmp.previous);
                tmp = tmp.previous;
            }

            // Mostra na tela quantos quadrados precisou percorrer
            outputFailureP.html("")
            outputSuccessP.html("")
            outputSuccessP.html("Solução: <br>" + path.length + " Quadrados")
            outputSuccessContainer.addClass("show")
            noLoop();
        }

        // Se não tiver encontrado o final continua o programa
        // Remove o ponto de openSet e adiciona em closedSet
        rmvFromOpen(openSet, current);
        closedSet.push(current);

        // Define os vizinhos do ponto atual
        const neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            // Checa se esse vizinho está no closedSet
            // Se estiver quer dizer que aquele vizinho já foi analisado
            if (!closedSet.includes(neighbor)) {
                // Distancia do ponto atual até o inicio + distancia do ponto atual
                // ao vizinho
                const tempG = current.gCost + heuristic(neighbor, current);

                // Se o vizinho não estiver no openSet, inclua para ser analisado depois
                // Se não, checa se o G calculado é maior que do vizinho
                // Se for, pula para o proximo indice pois esse é o melhor ponto
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tempG >= neighbor.gCost) {
                    continue;
                }

                // Se não for maior define o G do vizinho como sendo o G calculado
                neighbor.gCost = tempG;
                // Define a distancia desse ponto ao final
                neighbor.hCost = this.heuristic(neighbor, end);
                // E calcula o valor de F para esse ponto
                neighbor.fCost = neighbor.hCost + neighbor.gCost;
                // Por fim o vizinho recebe o ponto atual como sendo o ponto anterior
                // Tornando ele o ponto atual
                neighbor.previous = current;
            }
        }
        // Se nao houver mais pontos a serem analisados quer dizer que não tem solução
    } else {
        outputFailureP.html("")
        outputSuccessP.html("")
        outputFailureP.html("Sem Solução")
        outputFailureContainer.addClass("show")
    }


    // stroke(0);

    // Passa por todos os pontos pintando
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255, 255, 255));
        }
    }

    // Pinta todosos pontos analisados de vermelho
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(235, 64, 52));
    }

    // Pinta todos os pontos a serem analisados de verde
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(50, 168, 82));
    }

    // Se houver um caminho do inicio ao fim
    if (path) {
        // Passa por todos os pontos deste caminho
        for (var i = 0; i < path.length; i++) {
            // Pinta cada ponto de azul
            // path[i].show(color(168, 50, 136));
            path[i].show(color(52, 223, 235));

        }
    }

    // Mostra os pontos inicial e final
    start.show(color(252, 186, 3));
    end.show(color(66, 135, 245));
}