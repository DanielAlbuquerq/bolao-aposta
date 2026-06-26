const VALOR_COTA = 10.00;

async function carregarApostas() {
    try {
        const resposta = await fetch('/api/apostas');
        const apostas = await resposta.json();
        
        const tbody = document.getElementById('lista-apostas');
        tbody.innerHTML = ''; 
        
        apostas.forEach(aposta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left;">${aposta.nome}</td>
                <td>${aposta.apelido || ''}</td>
                <td>${aposta.gols_br}</td>
                <td>${aposta.gols_jp}</td>
            `;
            tbody.appendChild(tr);
        });

        const totalParticipantes = apostas.length;
        document.getElementById('total-participantes').innerText = totalParticipantes;
        document.getElementById('valor-arrecadado').innerText = (totalParticipantes * VALOR_COTA).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    } catch (error) {
        console.error('Erro ao carregar apostas:', error);
    }
}

carregarApostas();