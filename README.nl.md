[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/CharliVanNood/ProjectSteam/blob/master/README.md)
[![nl](https://img.shields.io/badge/lang-nl-green.svg)](https://github.com/CharliVanNood/ProjectSteam/blob/master/README.nl.md)

# ProjectSteam
ProjectSteam is een applicatie die het mogelijk maakt games op zo veel mogelijk devices te kunnen spelen.
Ooit last gehad dat je een windows only game niet kan spelen op een 10 jaar oude telefoon? Nee?
Wij ook niet, daarom hebben wij deze streaming applicatie gemaakt om dit alsnog mogelijk te maken.
Dan vraagt u zich vast af hoe je een toetsenbord gaat gebruiken op een telefoon, je wilt natuurlijk geen bluetooth keyboard mee nemen.
Ook hier hebben wij een oplossing voor, door input emulation is het mogelijk deze functies nogsteeds mogelijk te maken.

# De website
## Korte omschrijving:
De website is gemaakt in de combinatie HTML, CSS en JavaScript, dit geeft ons de nodige vrijheid om ons project te kunnen realiseren.
Voor het renderen van individuele pixels is het nodig om een snelle taal te gebruiken, javascript is hier voldoende voor.
Ook is het belangrijk dat de client data live kan ontvangen, anders is het niet echt streamen. Ja dit is mogelijk met Python,
toch hebben wij ervoor gekozen dit te doen in javascript om de rest van de features mogelijk te maken.

## De Homepage
Op de homepage is het mogelijk je gespeelde uren te zien en recent gespeelde games opnieuw te spelen.

## De Profile Page
Op de profile page is het mogelijk om vrienden toe te voegen en uw profiel aan te passen.

## De Search Page
Op de search page is het mogelijk nieuwe games te ontdekken of terug te vinden.

## De Analytics Page
Op de analytics page is het mogelijk uw data in te zien en up to date te blijven met de nieuwste trends. Deze data zal opgeslagen worden in een centrale database zodat deze te vergelijken zijn met andere datasets

## Beschikbare pagina's
- Home
    - Game
- Profile
- Analytics
- Search
    - Game

# Het streamen van game beeld en user input
## Waarom nodejs?
Voor het streaming deel van het programma maken wij gebruik van nodejs, dit is omdat nodejs op sommige vlakken veel sneller is dan python.
Deze snelheid hebben wij nodig om de ping laag te houden maar ook om afbeeldingen met veel detail te kunnen streamen.
