async function carregarApostasAdmin() {
    try {
        const resposta = await fetch('/api/apostas');
        const apostas = await resposta.json();
        
        const tbody = document.getElementById('lista-admin');
        tbody.innerHTML = ''; 
        
        apostas.forEach(aposta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: left;">${aposta.nome}</td>
                <td>${aposta.apelido || ''}</td>
                <td class="placar-num">${aposta.gols_br}</td>
                <td class="placar-x">x</td>
                <td class="placar-num">${aposta.gols_jp}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar apostas:', error);
    }
}

document.getElementById('form-aposta').addEventListener('submit', async (e) => {
    e.preventDefault();
    const novaAposta = {
        nome: document.getElementById('nome').value,
        apelido: document.getElementById('apelido').value,
        gols_br: document.getElementById('gols-br').value,
        gols_jp: document.getElementById('gols-jp').value
    };

    try {
        const resposta = await fetch('/api/apostas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaAposta)
        });

        if (resposta.ok) {
            document.getElementById('form-aposta').reset();
            carregarApostasAdmin(); 
        }
    } catch (error) {
        alert('Erro ao registrar aposta.');
    }
});

async function deletarAposta(id) {
    if(confirm("Tem certeza que deseja excluir esta aposta?")) {
        try {
            const resposta = await fetch(`/api/apostas/${id}`, { method: 'DELETE' });
            if (resposta.ok) {
                carregarApostasAdmin(); // Atualiza a tabela
            }
        } catch (error) {
            alert('Erro ao excluir aposta.');
        }
    }
}

carregarApostasAdmin();