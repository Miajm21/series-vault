const aVer = document.getElementById("aVer");
const emDia = document.getElementById("emDia");
const paraVer = document.getElementById("paraVer");
const terminadas = document.getElementById("terminadas");
const desistidas = document.getElementById("desistidas");

const contAver = document.getElementById("contAver");
const contEmDia = document.getElementById("contEmDia");
const contParaVer = document.getElementById("contParaVer");
const contTerminadas = document.getElementById("contTerminadas");
const contDesistidas = document.getElementById("contDesistidas");

let series = JSON.parse(localStorage.getItem("series")) || [];
let filtro = "";

function guardar() {
    localStorage.setItem("series", JSON.stringify(series));
}

document.getElementById("importarBackup").addEventListener("click", function () {

    document.getElementById("ficheiroBackup").click();

});

document.getElementById("ficheiroBackup").addEventListener("change", function (event) {

    const ficheiro = event.target.files[0];

    if (!ficheiro) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (e) {

        try {

            const dados = JSON.parse(e.target.result);

            if (!Array.isArray(dados)) {
                alert("Backup inválido.");
                return;
            }

            const confirmar = confirm(
                "Substituir todas as séries atuais pelo backup?"
            );

            if (!confirmar) {
                return;
            }

            series = dados;

            guardar();
            mostrarSeries();

            alert("Backup importado com sucesso!");

        } catch {

            alert("Erro ao importar o backup.");

        }

    };

    leitor.readAsText(ficheiro);

});
    document.getElementById("exportarBackup").addEventListener("click", function () {

    const dados = JSON.stringify(series, null, 2);

    const blob = new Blob(
        [dados],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "series-vault-backup.json";

    link.click();

    URL.revokeObjectURL(url);

});

document.getElementById("pesquisa").addEventListener("input", function () {
    filtro = this.value.toLowerCase();
    mostrarSeries();
});

document.getElementById("adicionarSerie").addEventListener("click", function () {

    const nomeSerie = prompt("Nome da série:");

    if (!nomeSerie) {
        return;
    }

    const categoriaEscolhida = prompt(
        "Categoria:\n\n" +
        "1 - A Ver\n" +
        "2 - Em Dia\n" +
        "3 - Para Ver\n" +
        "4 - Terminada\n" +
        "5 - Desistida"
    );

    let categoria = "aVer";
    let temporada = "";
    let episodio = "";

    if (categoriaEscolhida === "2") categoria = "emDia";
    if (categoriaEscolhida === "3") categoria = "paraVer";
    if (categoriaEscolhida === "4") categoria = "terminadas";
    if (categoriaEscolhida === "5") categoria = "desistidas";

    if (categoria === "aVer") {
        temporada = prompt("Temporada atual:") || "-";
        episodio = prompt("Episódio atual:") || "-";
    }

    series.push({
        nome: nomeSerie,
        categoria: categoria,
        temporada: temporada,
        episodio: episodio
    });

    guardar();
    mostrarSeries();

});

function mostrarSeries() {

    aVer.innerHTML = "";
    emDia.innerHTML = "";
    paraVer.innerHTML = "";
    terminadas.innerHTML = "";
    desistidas.innerHTML = "";

    let totalAver = 0;
    let totalEmDia = 0;
    let totalParaVer = 0;
    let totalTerminadas = 0;
    let totalDesistidas = 0;

    for (let i = 0; i < series.length; i++) {

        if (!series[i].nome.toLowerCase().includes(filtro)) {
            continue;
        }

        const linha = document.createElement("div");

        const nome = document.createElement("span");
        nome.textContent = series[i].nome;

        const info = document.createElement("p");

        if (series[i].categoria === "aVer") {
            info.textContent =
                "T" + series[i].temporada +
                " • E" + series[i].episodio;
        }

        if (series[i].categoria === "emDia") {
            info.textContent = "✅ Em Dia";
        }

        if (series[i].categoria === "paraVer") {
            info.textContent = "🤔 Para Ver";
        }

        if (series[i].categoria === "terminadas") {
            info.textContent = "🏁 Terminada";
        }

        if (series[i].categoria === "desistidas") {
            info.textContent = "❌ Desistida";
        }

        const btnVer = document.createElement("button");
        btnVer.textContent = "📺";

        const btnDia = document.createElement("button");
        btnDia.textContent = "✅";

        const btnParaVer = document.createElement("button");
        btnParaVer.textContent = "🤔";

        const btnTerminada = document.createElement("button");
        btnTerminada.textContent = "🏁";

        const btnDesistida = document.createElement("button");
        btnDesistida.textContent = "❌";

        const btnEpisodio = document.createElement("button");
        btnEpisodio.textContent = "➕E";

        const btnTemporada = document.createElement("button");
        btnTemporada.textContent = "➡️T";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "🗑️";

        btnVer.onclick = function () {
            series[i].categoria = "aVer";
            guardar();
            mostrarSeries();
        };

        btnDia.onclick = function () {
            series[i].categoria = "emDia";
            guardar();
            mostrarSeries();
        };

        btnParaVer.onclick = function () {
            series[i].categoria = "paraVer";
            guardar();
            mostrarSeries();
        };

        btnTerminada.onclick = function () {
            series[i].categoria = "terminadas";
            guardar();
            mostrarSeries();
        };

        btnDesistida.onclick = function () {
            series[i].categoria = "desistidas";
            guardar();
            mostrarSeries();
        };

        btnEpisodio.onclick = function () {

            if (series[i].categoria !== "aVer") {
                return;
            }

            let episodioAtual = parseInt(series[i].episodio);

            if (!isNaN(episodioAtual)) {
                series[i].episodio = episodioAtual + 1;
            }

            const serieAtualizada = series.splice(i, 1)[0];
            series.unshift(serieAtualizada);

            guardar();
            mostrarSeries();

        };

        btnTemporada.onclick = function () {

            if (series[i].categoria !== "aVer") {
                return;
            }

            let temporadaAtual = parseInt(series[i].temporada);

            if (!isNaN(temporadaAtual)) {

                series[i].temporada = temporadaAtual + 1;
                series[i].episodio = 1;

                guardar();
                mostrarSeries();

            }

        };

        btnEditar.onclick = function () {

            const novoNome = prompt(
                "Nome da série:",
                series[i].nome
            );

            if (novoNome !== null && novoNome.trim() !== "") {
                series[i].nome = novoNome;
            }

            if (series[i].categoria === "aVer") {

                const novaTemporada = prompt(
                    "Temporada:",
                    series[i].temporada
                );

                const novoEpisodio = prompt(
                    "Episódio:",
                    series[i].episodio
                );

                if (novaTemporada !== null) {
                    series[i].temporada = novaTemporada;
                }

                if (novoEpisodio !== null) {
                    series[i].episodio = novoEpisodio;
                }
            }

            guardar();
            mostrarSeries();

        };

        btnApagar.onclick = function () {

            const confirmar = confirm(
                'Tem a certeza que quer apagar "' +
                series[i].nome +
                '"?'
            );

            if (!confirmar) {
                return;
            }

            series.splice(i, 1);

            guardar();
            mostrarSeries();

        };

        linha.appendChild(nome);
        linha.appendChild(info);

        linha.appendChild(btnVer);
        linha.appendChild(btnDia);
        linha.appendChild(btnParaVer);
        linha.appendChild(btnTerminada);
        linha.appendChild(btnDesistida);
        linha.appendChild(btnEpisodio);
        linha.appendChild(btnTemporada);
        linha.appendChild(btnEditar);
        linha.appendChild(btnApagar);

        if (series[i].categoria === "aVer") {
            aVer.appendChild(linha);
            totalAver++;
        }

        if (series[i].categoria === "emDia") {
            emDia.appendChild(linha);
            totalEmDia++;
        }

        if (series[i].categoria === "paraVer") {
            paraVer.appendChild(linha);
            totalParaVer++;
        }

        if (series[i].categoria === "terminadas") {
            terminadas.appendChild(linha);
            totalTerminadas++;
        }

        if (series[i].categoria === "desistidas") {
            desistidas.appendChild(linha);
            totalDesistidas++;
        }
    }

    contAver.textContent = totalAver;
    contEmDia.textContent = totalEmDia;
    contParaVer.textContent = totalParaVer;
    contTerminadas.textContent = totalTerminadas;
    contDesistidas.textContent = totalDesistidas;
}

mostrarSeries();