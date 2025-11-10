# Simulador de Escalonamento - Hospital Digital

## Descrição do Projeto

Este projeto implementa um Simulador de Escalonamento de Processos inspirado no ambiente de um hospital digital, onde:

- Pacientes representam Processos
- Médicos representam Núcleos de CPU

O objetivo é compreender e comparar o comportamento dos principais algoritmos de escalonamento em diferentes condições de carga, prioridade e quantidade de recursos disponíveis.

## Como Executar

### Pré-requisitos

- Visual Studio Code instalado
- Extensão Live Server instalada no VS Code

### Passos para Execução

1. Abra o projeto no VS Code:

   ```bash
   # Navegue até a pasta do projeto e abra no VS Code
   code .
   ```

2. Instale a extensão Live Server (se ainda não tiver):

   - Vá em Extensions (Ctrl+Shift+X)
   - Pesquise por "Live Server"
   - Instale a extensão desenvolvida por Ritwick Dey

3. Execute o projeto:

   - Clique com o botão direito no arquivo `index.html`
   - Selecione "Open with Live Server"
   - Ou clique no botão "Go Live" no canto inferior direito do VS Code

4. Acesse a aplicação:
   - O navegador abrirá automaticamente em `http://127.0.0.1:5500/` ou similar
   - O simulador estará pronto para uso

## Como Usar

### Configuração Inicial

1. Selecione o algoritmo
2. Escolha o número de médicos: 1, 2 ou 4 núcleos de CPU
3. Adicione pacientes com os seguintes parâmetros:
   - Nome do paciente
   - Tempo de Chegada (Arrival Time)
   - Duração do Atendimento (Burst Time)
   - Prioridade (1 = maior prioridade)

### Execução da Simulação

1. Clique em "Adicionar" para incluir cada paciente
2. Clique em "Simular" para executar o escalonamento
3. Visualize os resultados no diagrama de Gantt e métricas

## Métricas Calculadas

- Tempo Médio de Espera (Average Waiting Time)
- Tempo Médio de Execução (Turnaround Time)
- Total de Trocas de Contexto
- Utilização Média dos Médicos (porcentagem de tempo ocupado)

## Cenários de Simulação Recomendados

### Cenário 1 – Emergência Crítica

- Configuração: 1 Médico disponível
- Pacientes: Poucos, com níveis de urgência muito diferentes
- Objetivo: Observar tratamento de processos de alta prioridade

### Cenário 2 – Plantão Lotado

- Configuração: 2 Médicos disponíveis
- Pacientes: Muitos, chegando continuamente
- Objetivo: Verificar comportamento sob carga intensa

### Cenário 3 – Hospital Moderno

- Configuração: 4 Médicos disponíveis
- Pacientes: Chegada aleatória, diferentes características
- Objetivo: Avaliar comportamento com recursos abundantes

## Tecnologias Utilizadas

- HTML5 - Estrutura da interface
- CSS3 - Estilização e layout responsivo
- JavaScript - Lógica de programação e algoritmos

## Notas Técnicas

- Para fins deste trabalho, assume-se que a duração (Burst Time) de cada processo é conhecida no momento de sua chegada
- O simulador considera tempos discretos para simplificação

---

_Desenvolvido para fins educacionais - Disciplina de Sistemas Operacionais_
