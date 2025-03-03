## Inicialização do projeto

Faça um arquivo `.env` e coloque as informações indicadas no `.env.local.example`. Após isso, execute o comando no bash para executar o programa para fins de desenvolvimento:

```bash
npm run dev
```

## Implementação de Dados Pessoais

Foi implementada a funcionalidade de preenchimento dos dados pessoais na seção "Minha Conta" com dados vindos do servidor. A implementação inclui:

1. **Serviço de API**: Criação de um serviço para fazer chamadas à API do backend e obter os dados pessoais do usuário.
   - Arquivo: `src/app/minhaconta/services/userAccount.ts`

2. **Hook Personalizado**: Criação de um hook para gerenciar o estado e a lógica de carregamento dos dados pessoais.
   - Arquivo: `src/app/minhaconta/hooks/useUserPersonalData.ts`

3. **Componente de Estado de Carregamento**: Criação de um componente para exibir feedback visual durante o carregamento dos dados.
   - Arquivo: `src/app/minhaconta/components/ui/LoadingState.tsx`

4. **Atualização do Componente de Dados Pessoais**: Atualização do componente para utilizar o hook e exibir os dados vindos do servidor.
   - Arquivo: `src/app/minhaconta/features/dados-pessoais/DadosPessoais.tsx`

### Melhorias Implementadas

1. **Correção na Exibição de Dados**: Garantia de que todos os campos (username, email e telefone) sejam exibidos corretamente.

2. **Tratamento de Campos Vazios**: Adição de mensagem informativa quando um campo não possui valor.

3. **Funcionalidade de Atualização**: Implementação da estrutura para atualização dos dados pessoais.

4. **Feedback Visual**: Adição de botão de atualização e indicadores de carregamento.

5. **Depuração**: Ferramentas para depurar a resposta da API e entender a estrutura dos dados.

### Como testar

1. Certifique-se de que o backend está rodando na porta 3000 (ou na porta configurada no arquivo `.env`).
2. Inicie o frontend com `npm run dev`.
3. Faça login no sistema.
4. Acesse a seção "Minha Conta" e verifique se os dados pessoais estão sendo carregados corretamente.

### Estrutura de arquivos

```
front/src/app/minhaconta/
├── components/
│   ├── debug/
│   │   └── ApiDebugger.tsx
│   └── ui/
│       ├── InfoCard.tsx
│       └── LoadingState.tsx
├── features/
│   └── dados-pessoais/
│       └── DadosPessoais.tsx
├── hooks/
│   └── useUserPersonalData.ts
├── services/
│   ├── test.ts
│   └── userAccount.ts
└── types/
    └── index.ts
```
