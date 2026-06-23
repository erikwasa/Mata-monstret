# TTS-arbetsflöde för Mata monstret

Röstfraserna samlas i `src/voice-lines.js`. Appen använder samma manifest när den letar efter egna MP3-filer i `audio/voice/`.

## 1. Lista fraser

```bash
npm run voice:list
```

## 2. Se vilka MP3-filer som saknas

```bash
npm run voice:missing
```

Kommandot returnerar felkod om någon fil saknas. Det passar därför även i enkel manuell kontroll före release.

## 3. Exportera underlag till TTS

CSV:

```bash
npm run voice:csv > audio/voice-lines.csv
```

JSON med alla fraser:

```bash
npm run voice:json > audio/voice-lines.json
```

JSON med bara saknade fraser:

```bash
npm run voice:tts-input > audio/voice-lines-missing.json
```

## 4. Skapa ljudfiler

Använd exporten som underlag i valfri TTS-tjänst. Varje rad har:

- `key`: filnamn utan `.mp3`
- `text`: frasen som ska läsas in
- `file`: målfil i repo:t

Exempel:

```text
give_banana -> audio/voice/give_banana.mp3
correct_mums -> audio/voice/correct_mums.mp3
```

## 5. Lägg in filerna

Spara genererade MP3-filer i `audio/voice/` med exakt samma namn som `key`.

## 6. Kontrollera igen

```bash
npm run voice:missing
```

När listan är tom finns alla röstfiler som appen förväntar sig.

## Dynamiska fraser

Vissa fraser innehåller barnets eller monstrets namn i appen. För egna MP3-filer används en neutral inspelning, till exempel `Monstret dansar!`. Om en MP3 saknas faller appen tillbaka till webbläsarens svenska talsyntes och kan då läsa den dynamiska texten.
