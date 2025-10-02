## 🚀 Instalação e Execução

1. **Clone o repositório**

   ```bash
   git clone [https://github.com/LeonardoFMiranda/ghn-mobile.git](https://github.com/LeonardoFMiranda/ghn-mobile.git)
   ```
   ```bash
   cd ghn-mobile
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. Configure a chave da NewsAPI
   Crie um arquivo .env na raiz do projeto e adicione:
   ```EXPO_PUBLIC_NEWS_API_KEY=sua_chave_aqui```

5. Execute o app
   ```bash
   npx expo star
   ```
   O app estará disponível para uso:
   Android (Via emulador)
   Web (Via clicando a tecla W)
   IOS (Via ter dispositivo fisico)

## ✨ Principais Funcionalidades

- 🔍 **Busca de notícias** com scroll infinito  
- 📰 **Destaque para as 3 principais notícias** em um grid especial  
- 📑 **Card vertical** para as demais notícias
- ⭐ **Favoritos persistentes** via `async-storage`  
- 📂 **Categorias** com menu lateral (sidebar) estilizado

---

## 🛠️ Decisões Técnicas

- **React Native + Expo + TypeScript** → Tipagem forte e melhor manutenção  
- **Componentização** → Componentes reutilizáveis como `MainNewsGrid` e `NewsListVertical` para replicar layouts  
- **NewsAPI** → Consumo da API pública, com filtro de idioma e domínios indesejados   
- **Scroll infinito** → Implementado via evento de scroll + paginação da API  
- **Persistência de favoritos** → `async-storage` para manter favoritos entre sessões  

---

## 📸 Layout

- Grid especial para destaques  
- Lista Vertical para demais notícias  
- Sidebar de categorias  

