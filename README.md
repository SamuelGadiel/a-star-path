# Implementação Algoritmo A-Star
> Implementação do algorítmo de busca de caminho A-Star em JavaScript

## Visualização
Você pode acessar o projeto clicando [neste link](https://samuelgadiel.github.io/a-star-path/)

https://user-images.githubusercontent.com/22757108/157590721-4214fdb6-c9f7-457d-a69e-b0a2a989f610.mov


## Construção
Algoritmo junta a heurística do algoritmo de Busca de Largura e a formalidade do algoritmo de Djikstra.
Cada ponto tem conhecimento de seus vizinhos, do ponto anterior a ele e dos seus custos (fCost, gCost e hCost)
Foi utilizada a biblioteca p5.js como framework do projeto.

## Funcionalidade

A ideia do projeto é obter o caminho mais otimizado entre dois pontos de um labirinto gerado aleatóriamente.
Os pontos de início e final estão localizados em diagonais opostas.

<img width="880" alt="image" src="https://user-images.githubusercontent.com/22757108/157589155-beffd875-51a9-4709-a284-1d9338d8b26b.png">

É possivel ativar a passagem por caminhos na diagonal, ou permitindo que o caminho seja gerado apenas horizontal e verticalmente.

### Ignorando caminhos diagonais
<img width="866" alt="image" src="https://user-images.githubusercontent.com/22757108/157589276-d5f7aabc-5fac-4494-87c5-1d1c069de1d4.png">

### Considerando caminhos diagonais
<img width="874" alt="image" src="https://user-images.githubusercontent.com/22757108/157589309-9ce12d91-8df5-4584-9720-f57474fb6cb1.png">
