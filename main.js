const pacientes = [];

document.getElementById("addPaciente").addEventListener("click", () => {
  const nome = document.getElementById("nome").value.trim();
  const chegada = parseInt(document.getElementById("chegada").value);
  const duracao = parseInt(document.getElementById("duracao").value);
  const prioridade = parseInt(document.getElementById("prioridade").value);

  if (!nome || isNaN(chegada) || isNaN(duracao) || isNaN(prioridade)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  pacientes.push({ nome, chegada, duracao, prioridade });
  atualizarTabela();
});

function atualizarTabela() {
  const tbody = document.querySelector("#tabelaPacientes tbody");
  tbody.innerHTML = "";
  pacientes.forEach((p) => {
    const linha = `<tr>
      <td>${p.nome}</td>
      <td>${p.chegada}</td>
      <td>${p.duracao}</td>
      <td>${p.prioridade}</td>
    </tr>`;
    tbody.innerHTML += linha;
  });
}

document.getElementById("simular").addEventListener("click", () => {
  const algoritmo = document.getElementById("algoritmo").value;
  const medicos = parseInt(document.getElementById("medicos").value);

  if (pacientes.length === 0) {
    alert("Adicione ao menos um paciente!");
    return;
  }

  if (algoritmo === "sjf") {
    simularSJF([...pacientes], medicos);
  }
});
