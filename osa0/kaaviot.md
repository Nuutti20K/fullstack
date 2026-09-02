0.4
```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note left of server: Palvelin vastaanottaa muistiinpanon datan ja lähettää selaimelle uudelleenohjauspyynnön
    server-->>browser: Redirect
    deactivate server

    Note right of browser: Selain tekee uuden GET pyynnön palvelimen vastauksen perusteella, <br>jonka jälkeen tapahuu samat asiat kuin materiaalissa annetussa esimerkissä 

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server    

```
0.5
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: SPA-sovelluksen renderöinti on lähes sama kuin edellisenkin version, <br>erona on vain ladattava JavaScript-tiedosto

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server    

```
0.6
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Selain lähettää muistiinpanon JSON-muodossa palvelimelle

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Palvelin vastaa statuskoodilla 201 created
    server-->>browser: 201
    deactivate server
    
```
