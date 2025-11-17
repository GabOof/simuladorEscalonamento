// Vetor global que armazena os pacientes cadastrados
const pacientes = [];

// ------------------------------------------------------------
// Adiciona novo paciente
// ------------------------------------------------------------
document.getElementById("addPaciente").addEventListener("click", () => {
  // Captura e valida os campos de entrada
  const nome = document.getElementById("nome").value.trim();
  const chegada = parseInt(document.getElementById("chegada").value);
  const duracao = parseInt(document.getElementById("duracao").value);
  const prioridade = parseInt(document.getElementById("prioridade").value);

  // Verifica se todos os campos foram preenchidos corretamente
  if (!nome || isNaN(chegada) || isNaN(duracao) || isNaN(prioridade)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  // Armazena o novo paciente no vetor principal
  pacientes.push({ nome, chegada, duracao, prioridade });

  // Atualiza a tabela exibida na interface
  atualizarTabela();

  // Limpa os campos para o próximo cadastro
  document.getElementById("nome").value = "";
  document.getElementById("chegada").value = "";
  document.getElementById("duracao").value = "";
  document.getElementById("prioridade").value = "";
});

// ------------------------------------------------------------
// Atualiza dinamicamente a tabela de pacientes cadastrados
// ------------------------------------------------------------
function atualizarTabela() {
  const tbody = document.querySelector("#tabelaPacientes tbody");
  tbody.innerHTML = "";

  // Cria uma linha de tabela para cada paciente
  pacientes.forEach((paciente) => {
    const linha = `
      <tr>
        <td>${paciente.nome}</td>
        <td>${paciente.chegada}</td>
        <td>${paciente.duracao}</td>
        <td>${paciente.prioridade}</td>
      </tr>
    `;
    tbody.innerHTML += linha;
  });
}

// ------------------------------------------------------------
// Inicia a simulação
// ------------------------------------------------------------
document.getElementById("simular").addEventListener("click", () => {
  const algoritmo = document.getElementById("algoritmo").value;
  const medicos = parseInt(document.getElementById("medicos").value);

  // Impede execução sem pacientes cadastrados
  if (pacientes.length === 0) {
    alert("Adicione ao menos um paciente!");
    return;
  }

  // Escolhe qual algoritmo de escalonamento será utilizado
  if (algoritmo === "sjf") {
    executarSJF([...pacientes], medicos);
  } else if (algoritmo === "srtf") {
    executeSRTF([...pacientes], medicos);
  }

  // else if (algoritmo === "rr") executarRR([...pacientes], medicos);
  // else if (algoritmo === "prioridade") executarPrioridade([...pacientes], medicos);
});
