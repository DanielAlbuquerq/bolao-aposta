const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Supabase (Lendo as chaves ocultas do Render)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para LER todas as apostas
app.get('/api/apostas', async (req, res) => {
    const { data, error } = await supabase
        .from('apostas')
        .select('*')
        .order('id', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Rota para SALVAR nova aposta
app.post('/api/apostas', async (req, res) => {
    // Pegamos os dados e forçamos os gols a serem números inteiros (parseInt)
    const nome = req.body.nome;
    const apelido = req.body.apelido;
    const gols_br = parseInt(req.body.gols_br, 10);
    const gols_jp = parseInt(req.body.gols_jp, 10);
    
    const { data, error } = await supabase
        .from('apostas')
        .insert([{ nome, apelido, gols_br, gols_jp }])
        .select();
        
    if (error) {
        // Isso vai imprimir o erro exato no painel do Render para facilitar!
        console.error("Erro do Supabase:", error); 
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: data[0].id });
});

// Rota para DELETAR uma aposta pelo ID
app.delete('/api/apostas/:id', async (req, res) => {
    const id = req.params.id;
    
    const { error } = await supabase
        .from('apostas')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Aposta excluída com sucesso" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});