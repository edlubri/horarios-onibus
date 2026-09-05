const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const erro = document.querySelector("#erro");
const tabela = document.querySelector("#tabela");


function esc(valor) {
    return String(valor ?? "").replace(/[&<>'"]/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    }[c]));
}


function limparNomeColuna(valor) {
    return String(valor ?? "")
        .replace(/^#\s*/, "")
        .trim();
}


function criarTabela(periodo, indice) {

    const colunas = periodo.colunas || [];
    const horarios = periodo.horarios || [];

    if (!colunas.length || !horarios.length) {
        return "";
    }

    let html = "";

    html += '<section class="horario-periodo">';

    html += '<div class="periodo-titulo">';
    html += periodo.nome.toUpperCase() === "SÁBADO" ? "<strong>SÁBADO</strong>" : esc(periodo.nome);
    html += "</div>";

    html += '<div class="table-wrap">';
    html += "<table>";

    html += "<thead>";
    html += "<tr>";

    for (const coluna of colunas) {

        const nome = limparNomeColuna(coluna);

        html += "<th>" + esc(nome) + "</th>";
    }

    html += "</tr>";
    html += "</thead>";

    html += "<tbody>";

    for (const horario of horarios) {

        html += "<tr>";

        for (let i = 0; i < colunas.length; i++) {

            const valor = horario[i] ?? "";

            if (valor === "/") {
                html += '<td class="sem-horario">/</td>';
            } else {
                html += "<td>" + esc(valor) + "</td>";
            }
        }

        html += "</tr>";
    }

    html += "</tbody>";
    html += "</table>";
    html += "</div>";
    html += "</section>";

    return html;
}


async function carregarLinha() {

    try {

        if (!id) {
            throw new Error("Nenhuma linha foi informada.");
        }

        const resposta = await fetch(
            "./data/linhas.json?nocache=" + Date.now()
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao carregar JSON: HTTP " + resposta.status
            );
        }

        const data = await resposta.json();

        const linha = (data.linhas || []).find(
            item => String(item.id) === String(id)
        );

        if (!linha) {
            throw new Error(
                "Linha " + id + " não encontrada."
            );
        }

        document.title =
            linha.codigo + " - Horários de Ônibus";

        document.querySelector("#numero").textContent =
            linha.codigo;

        document.querySelector("#titulo").textContent =
            linha.titulo;

        document.querySelector("#dias").textContent =
            linha.dias;

        document.querySelector("#trajeto").textContent =
            linha.trajeto;


        // =====================================================
        // PERÍODOS
        // =====================================================

        const periodos = Array.isArray(linha.periodos)
            ? linha.periodos
            : [];

        if (periodos.length === 0) {
            throw new Error(
                "A linha não possui períodos de horários."
            );
        }


        // Renderiza TODOS os períodos encontrados no JSON
        tabela.innerHTML = "";

        for (const periodo of periodos) {

            tabela.insertAdjacentHTML(
                "beforeend",
                criarTabela(periodo, periodos.indexOf(periodo))
            );
        }


        console.log(
            "Linha carregada:",
            linha.codigo
        );

        console.log(
            "Períodos encontrados:",
            periodos.length
        );

        periodos.forEach((periodo, indice) => {

            console.log(
                "[" + indice + "]",
                periodo.nome,
                "->",
                periodo.horarios.length,
                "horários"
            );

        });

    } catch (e) {

        console.error(e);

        erro.hidden = false;
        erro.textContent = e.message;
    }
}


carregarLinha();


