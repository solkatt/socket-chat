# socket-chat

I den här inlämningen skall ni skapa en chatt-baserad app som låter användare chatta med varandra i realtid. Kommunikationen skall sättas upp och göras med socket.io. Varje klient skall kunna skapa ett nytt rum alternativt gå in i ett befintligt rum. När ett nytt rum skapas kan ett lösenord anges, detta lösenord måste isåfall anges då en klient försöker gå med i rummet. Samtliga rum skall visas i en lista med sortering på låsta- och öppna rum (låsta rum har lösenord). En klient skall kunna gå in i ett rum genom att klicka på det i listan och är detta ett låst rum måste hen ange rätt lösenord för att komma in. Ett rum skall automatiskt försvinna då det inte längre finns några klienter kvar i rummet.

Ni väljer själva om ni vill använda en utökad utvecklings-stack i projektet, notera att detta inte är ett krav. Exempel på ramverk ni kan lägga till i er stack är: Typescript, React, mm. Låt kreativiteten flöda!

För att bli godkänd på den här uppgiften MÅSTE ni använda GIT och GitHub. Inlämningen sker som vanligt via Zenit där lämnar in er projektmapp som en zip-fil. I projektmappen ska det finnas (utöver all kod) en README.md fil som innehåller en titel, beskrivning av uppgiften och vad som krävs för att bygga och starta projektet, samt en länk till GitHub repot. Notera att om instruktioner för hur projektet byggs och startas inte finns eller om instruktionerna är felaktiga kommer uppgiften bli underkänd.

Utöver koden ska en muntligt presentation skall genomföras per grupp där ni demar programmet ni har skapat.

Para ihop er i grupp om tre - ni väljer själva vem ni jobbar med.

Läs noga igenom hela uppgiftsbeskrivningen tillsammans innan ni börjar.

Krav för godkänt:

En fungerade chatt där användaren kan välja ett eget visningsnamn
Det ska gå att skapa och joina ett rum med eller utan lösenord
Tomma rum ska automatiskt försvinna
Samtliga rum skall vara synligt i en lista där låsta & öppna rum är tydligt separerade
Git & GitHub har använts
Projektmappen innehåller en README.md fil (läs ovan för mer info)
Uppgiften lämnas in i tid!
Krav för väl godkänt:

Alla punkter för godkänt är uppfyllda
Varje rum i listan skall även visa vilka klienter som finns i rummet
När någon håller på att skriva ett meddelande skall det synas för alla andra i rummet
Det ska gå att skriva kommandon ”/” för att utföra en operation som integrerar med tredjepart API’er - minst 2 kommandon
