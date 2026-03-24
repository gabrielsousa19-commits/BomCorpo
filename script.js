function salvarUsuario(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

function pegarUsuario() {
  return JSON.parse(localStorage.getItem("usuario"));
}

function estaLogado() {
  return localStorage.getItem("logado") === "true";
}

function logar() {
  localStorage.setItem("logado", "true");
}

function logout() {
  localStorage.removeItem("logado");
  window.location.href = "index.html";
}

function protegerPagina() {
  if (!estaLogado()) {
    window.location.href = "login.html";
  }
}

function criarConta(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuario = { nome, email, senha };
  salvarUsuario(usuario);
  logar();

  window.location.href = "onboarding.html";
}

function fazerLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const usuario = pegarUsuario();

  if (!usuario) {
    alert("Nenhuma conta encontrada. Crie uma conta primeiro.");
    return;
  }

  if (email === usuario.email && senha === usuario.senha) {
    logar();

    const dados = JSON.parse(localStorage.getItem("dadosSaude"));
    if (dados) {
      window.location.href = "inicio.html";
    } else {
      window.location.href = "onboarding.html";
    }
  } else {
    alert("E-mail ou senha incorretos.");
  }
}

function salvarOnboarding(event) {
  event.preventDefault();

  const dados = {
    objetivo: document.getElementById("objetivo").value,
    idade: Number(document.getElementById("idade").value),
    sexo: document.getElementById("sexo").value,
    altura: Number(document.getElementById("altura").value),
    peso: Number(document.getElementById("peso").value),
    atividade: Number(document.getElementById("atividade").value),
    treinosSemana: Number(document.getElementById("treinosSemana").value)
  };

  localStorage.setItem("dadosSaude", JSON.stringify(dados));
  window.location.href = "inicio.html";
}

function calcularIMC(peso, alturaCm) {
  const alturaM = alturaCm / 100;
  return peso / (alturaM * alturaM);
}

function classificarIMC(imc) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidade";
}

function calcularTMB(sexo, peso, altura, idade) {
  if (sexo === "Masculino") {
    return 10 * peso + 6.25 * altura - 5 * idade + 5;
  }
  return 10 * peso + 6.25 * altura - 5 * idade - 161;
}

function calcularCalorias(dados) {
  const tmb = calcularTMB(dados.sexo, dados.peso, dados.altura, dados.idade);
  return Math.round(tmb * dados.atividade);
}

function pegarDadosSaude() {
  return JSON.parse(localStorage.getItem("dadosSaude"));
}

function pegarTreinosConcluidos() {
  return JSON.parse(localStorage.getItem("treinosConcluidos")) || [];
}

function salvarTreinosConcluidos(lista) {
  localStorage.setItem("treinosConcluidos", JSON.stringify(lista));
}

function nomeDiaHoje() {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return dias[new Date().getDay()];
}

function marcarTreinoHoje() {
  const hoje = nomeDiaHoje();
  let treinos = pegarTreinosConcluidos();

  if (!treinos.includes(hoje)) {
    treinos.push(hoje);
    salvarTreinosConcluidos(treinos);
  }

  renderizarFoguinhos();
  alert("Treino de hoje marcado como concluído.");
}

function renderizarFoguinhos() {
  const fogoGrid = document.getElementById("fogoGrid");
  if (!fogoGrid) return;

  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const treinos = pegarTreinosConcluidos();

  fogoGrid.innerHTML = dias.map(dia => `
    <div class="fogo-card">
      <div class="fogo-dia">${dia}</div>
      <div class="fogo-icone ${treinos.includes(dia) ? "fogo-ativo" : "fogo-inativo"}">🔥</div>
    </div>
  `).join("");
}

function gerarTreinosPorSemana(qtd) {
  const planos = {
    2: [
      { nome: "Treino A", desc: "Corpo inteiro: pernas, peito, costas e abdômen." },
      { nome: "Treino B", desc: "Corpo inteiro com foco em resistência e técnica." }
    ],
    3: [
      { nome: "Treino A", desc: "Peito, ombro e tríceps." },
      { nome: "Treino B", desc: "Costas e bíceps." },
      { nome: "Treino C", desc: "Pernas e abdômen." }
    ],
    4: [
      { nome: "Treino A", desc: "Peito e tríceps." },
      { nome: "Treino B", desc: "Costas e bíceps." },
      { nome: "Treino C", desc: "Pernas." },
      { nome: "Treino D", desc: "Ombro e abdômen." }
    ],
    5: [
      { nome: "Treino A", desc: "Peito." },
      { nome: "Treino B", desc: "Costas." },
      { nome: "Treino C", desc: "Pernas." },
      { nome: "Treino D", desc: "Ombros." },
      { nome: "Treino E", desc: "Braços e abdômen." }
    ],
    6: [
      { nome: "Treino A", desc: "Peito e tríceps." },
      { nome: "Treino B", desc: "Costas e bíceps." },
      { nome: "Treino C", desc: "Pernas anteriores." },
      { nome: "Treino D", desc: "Ombro e abdômen." },
      { nome: "Treino E", desc: "Posterior de pernas e glúteos." },
      { nome: "Treino F", desc: "Braços e cardio leve." }
    ]
  };

  return planos[qtd] || [];
}

function gerarDietaTexto(objetivo) {
  if (objetivo === "Emagrecer") {
    return {
      estrategia: "Déficit calórico leve, foco em proteínas, vegetais, frutas e menos ultraprocessados.",
      cafe: "Ovos, fruta e aveia.",
      almoco: "Arroz, feijão, frango grelhado e salada.",
      lanche: "Iogurte natural ou fruta com castanhas.",
      jantar: "Proteína magra, legumes e carboidrato moderado."
    };
  }

  if (objetivo === "Ganhar massa") {
    return {
      estrategia: "Superávit calórico moderado, com proteínas e carboidratos de qualidade.",
      cafe: "Ovos, pão integral, banana e leite.",
      almoco: "Arroz, feijão, carne magra, legumes e salada.",
      lanche: "Vitamina com fruta, aveia e pasta de amendoim.",
      jantar: "Frango, macarrão ou arroz, legumes e fonte proteica."
    };
  }

  return {
    estrategia: "Dieta equilibrada com proteínas, carboidratos complexos, gorduras boas e hidratação.",
    cafe: "Fruta, ovos e pão integral.",
    almoco: "Prato balanceado com proteína, arroz, feijão e salada.",
    lanche: "Iogurte, fruta ou sanduíche leve.",
    jantar: "Refeição leve e nutritiva com boa distribuição de nutrientes."
  };
}

function carregarInicio() {
  const usuario = pegarUsuario();
  const dados = pegarDadosSaude();
  if (!usuario || !dados) return;

  const imc = calcularIMC(dados.peso, dados.altura).toFixed(1);
  const calorias = calcularCalorias(dados);
  const classificacao = classificarIMC(Number(imc));
  const planoTreinos = gerarTreinosPorSemana(dados.treinosSemana);
  const hojeIndice = new Date().getDay();
  const indicePlano = hojeIndice === 0 ? 0 : (hojeIndice - 1) % planoTreinos.length;
  const treinoHoje = planoTreinos[indicePlano] || { nome: "Descanso", desc: "Hoje é um bom dia para recuperação." };

  document.getElementById("nomeUsuarioInicio").textContent = usuario.nome;
  document.getElementById("objetivoInicio").textContent = dados.objetivo;
  document.getElementById("imcInicio").textContent = `${imc} • ${classificacao}`;
  document.getElementById("caloriasInicio").textContent = `${calorias} kcal/dia`;
  document.getElementById("frequenciaInicio").textContent = `${dados.treinosSemana}x por semana`;
  document.getElementById("treinoHojeTitulo").textContent = treinoHoje.nome;
  document.getElementById("treinoHojeTexto").textContent = treinoHoje.desc;
}

function carregarTreinos() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const lista = gerarTreinosPorSemana(dados.treinosSemana);
  const container = document.getElementById("treinosLista");
  const resumo = document.getElementById("treinosResumo");

  resumo.textContent = `Seu plano foi montado para ${dados.treinosSemana} treinos por semana, com foco em ${dados.objetivo.toLowerCase()}.`;

  container.innerHTML = lista.map(item => `
    <div class="card-coracao card-doenca">
      <h3>${item.nome}</h3>
      <p>${item.desc}</p>
    </div>
  `).join("");
}

function carregarDieta() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const calorias = calcularCalorias(dados);
  const dieta = gerarDietaTexto(dados.objetivo);

  document.getElementById("metaCalorica").textContent = `${calorias} kcal/dia estimadas`;
  document.getElementById("estrategiaDieta").textContent = dieta.estrategia;
  document.getElementById("cafeManha").textContent = dieta.cafe;
  document.getElementById("almoco").textContent = dieta.almoco;
  document.getElementById("lanche").textContent = dieta.lanche;
  document.getElementById("jantar").textContent = dieta.jantar;
}

function carregarProgresso() {
  const dados = pegarDadosSaude();
  if (!dados) return;

  const imc = calcularIMC(dados.peso, dados.altura);
  const treinos = pegarTreinosConcluidos();

  document.getElementById("progressoImc").textContent = imc.toFixed(1);
  document.getElementById("progressoClassificacao").textContent = classificarIMC(imc);
  document.getElementById("treinosFeitosTexto").textContent = `${treinos.length} dia(s) marcados nesta semana`;
  document.getElementById("progressoFrequencia").textContent = `${dados.treinosSemana}x por semana`;
}

function carregarPerfil() {
  const usuario = pegarUsuario();
  const dados = pegarDadosSaude();
  if (!usuario || !dados) return;

  document.getElementById("perfilNome").textContent = usuario.nome;
  document.getElementById("perfilEmail").textContent = usuario.email;
  document.getElementById("perfilObjetivo").textContent = dados.objetivo;
  document.getElementById("perfilIdade").textContent = `${dados.idade} anos`;
  document.getElementById("perfilCorpo").textContent = `${dados.altura} cm • ${dados.peso} kg`;
  document.getElementById("perfilTreinos").textContent = `${dados.treinosSemana}x por semana`;
}