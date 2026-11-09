# Agent-instruksjoner: H.S Anlegg Nettside

## Rolle og Mål
Du er en ekspert på full-stack webutvikling og UI/UX-design. Din oppgave er å bygge en moderne, høypresterende og mobilvennlig nettside for **H.S Anlegg**, en profesjonell entreprenør- og maskinutleiebedrift basert i Norge.

## Forretnings- og tjenestekontekst
- **Kjernevirksomhet:** Utleie av bygg- og anleggsmaskiner med personell.
- **Entreprenørtjenester:** Et bredt spekter av tradisjonelle entreprenørtjenester i distriktet og omliggende områder som Drammen.
- **Nøkkelpunkter å fremheve:**
  - Grunnarbeid og graving (alt fra VA-grøfter til utgraving for eneboliger og carporter).
  - Uteanlegg og landskapsutforming (sentral godkjenning TK1) – grunnarbeid, masser, kantstein, dekke og beplantning.
  - Spesialoppdrag (erfaring med opparbeidelse av ridebaner og fundamentering).
  - Transport og containere.
  - Vinterdrift (brøyting og strøing i vintersesongen).

## Tekniske retningslinjer
- **Språk:** Norsk (Bokmål) for alt brukerrettet innhold. Profesjonell, tillitsvekkende og tydelig tone.
- **Designtilnærming:** Industriell, robust, men ren og moderne. Høy kontrast, mobiloptimert (siden mange kunder sjekker fra telefonen på anleggsplassen eller i bilen).
- **Tech Stack:** Ren statisk HTML/CSS/JS (vanilla) – ingen byggesteg eller avhengigheter. Design-tokens i `css/style.css`, interaksjon i `js/main.js`. Fonter: Inter via Google Fonts. Bilder ligger i `assets/images` og er egne bilder fra H.S Anlegg. Logo i `assets/images/logo/` (mørk/lys via CSS-filter). Sertifiseringer (Miljøfyrtårn, GFA, MEF) i `assets/sertifiseringer/` vises i egen seksjon og i footer.
- **Ytelse:** Raske lastetider, optimaliserte bilder av maskiner/prosjekter, og tydelige handlingsknapper (CTA) for tilbud/kontakt.
- **Domene/SEO:** Kanonisk domene er `https://www.hsanlegg.no` (brukt i `canonical`, Open Graph, `sitemap.xml`, `robots.txt`). I rot ligger `robots.txt`, `sitemap.xml`, `llms.txt` (for AI-svarmotorer) og `site.webmanifest`. `index.html` har JSON-LD (`GeneralContractor`/`LocalBusiness`, `WebSite`). Logo-URL i JSON-LD peker på `assets/images/logo/hs-logo.png`, og `hasCredential` lister Miljøfyrtårn, ansvarsrett og MEF. **Viktig:** oppdater kontaktinfo/org.nr/tjenester/sertifiseringer både i synlig tekst, JSON-LD, `llms.txt` og `sitemap.xml` hvis noe endres, slik at dataene forblir konsistente.
- **Bedriftsdata (fasit):** H.S ANLEGG AS, org.nr 992 839 783, Hvittingfossveien 278, 3089 Holmestrand, tlf. 908 74 233, post@hsanlegg.no, etablert 2008. Facebook: facebook.com/hsanlegg.