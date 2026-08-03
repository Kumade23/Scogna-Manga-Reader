# 📖 Scogna Manga Reader

Benvenuto su **Scogna Manga Reader**! Questa è un'applicazione web creata per farti leggere i tuoi manga preferiti in modo semplice, veloce e comodo, sia dal computer che dal telefono.

🌐 **Clicca qui per usare l'app:** [https://scogna-manga-reader.vercel.app/](https://scogna-manga-reader.vercel.app/)

## ✨ Cosa puoi fare con questa app?

- **Lettura a scorrimento verticale**: Leggi i manga scorrendo verso il basso, proprio come faresti con un Webtoon o sui social network. Niente più click per cambiare pagina!
- **Zoom facile dal telefono**: Usa comodamente due dita per ingrandire i disegni e un dito per spostarti nell'immagine senza impazzire.
- **Ricerca intelligente**: Trova subito il manga che vuoi leggere digitando il titolo.
- **Libreria e Cronologia**: Salva i manga che ti piacciono nella tua "Libreria" e riprendi la lettura esattamente da dove l'avevi lasciata grazie alla "Cronologia" automatica.

## 🛠️ Come avviare il progetto sul tuo PC (per principianti)

Se vuoi scaricare questo progetto e farlo funzionare sul tuo computer per fare delle modifiche, segui questi 3 semplici passi:

1. **Scarica il codice:**
   Usa il terminale per clonare il progetto sul tuo computer:
   ```bash
   git clone https://github.com/tuo-nome-utente/manga-reader-standalone.git
   cd manga-reader-standalone
   ```

2. **Installa i programmi necessari:**
   Assicurati di aver installato [Node.js](https://nodejs.org/) sul tuo computer, poi scrivi questo comando per scaricare i file necessari al progetto:
   ```bash
   npm install
   ```

3. **Accendi il sito:**
   Ora puoi avviare l'applicazione! Digita questo comando:
   ```bash
   npm run dev
   ```
   Ti apparirà un link (di solito `http://localhost:5173/`). Cliccaci sopra per vedere il tuo sito aperto nel browser!

## 🌐 Dietro le quinte (Come funziona la magia)

Di solito, quando un sito web cerca di prendere delle immagini o dei dati da un altro server, i browser (come Chrome o Safari) lo bloccano per motivi di sicurezza (un blocco chiamato "CORS"). 

Per evitare questo blocco e far funzionare il sito gratuitamente senza dover pagare e accendere un tuo server privato, questa app utilizza un trucchetto offerto da **Vercel** (il servizio gratuito dove è ospitato il sito). Vercel si occupa di prendere i dati dai server dei manga in modo sicuro e li passa alla tua app senza far arrabbiare il browser. Così tutto funziona in modo fluido, veloce e gratis!
