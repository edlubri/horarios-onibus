# Horários de Ônibus — protótipo

Protótipo de site responsivo para consulta dos horários a partir da planilha Excel.

## Atualizar os dados

1. Substitua `data/horarios_coletivo.xlsx` pela nova planilha.
2. Execute:

```powershell
python scripts\importar_excel.py
```

3. O arquivo `public/data/linhas.json` será atualizado.

## Testar localmente

Dentro da pasta do projeto:

```powershell
python -m http.server 8000 --directory public
```

Depois abra `http://localhost:8000` no navegador.

> O servidor local é necessário porque o navegador pode bloquear `fetch()` de JSON quando o HTML é aberto diretamente pelo arquivo.

## Próximas etapas

- revisar a apresentação dos horários por linha;
- tratar especificamente dias úteis/sábado/domingo quando a planilha indicar mais de um bloco;
- revisar as abas especiais;
- adicionar identidade visual;
- publicar gratuitamente;
- gerar o QR Code único para a página inicial.
