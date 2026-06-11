# AquaMatch 🐠

AquaMatch to nowoczesny, pełnostosowy (Full-Stack) system ekspercki służący do analizy kompatybilności obsady akwarium. Dzięki niemu akwaryści mogą bezpiecznie planować i dobierać gatunki zwierząt do swoich zbiorników, unikając błędów prowadzących do konfliktów terytorialnych, problemów z parametrami wody czy nadmiernego obciążenia biologicznego (Bioload).

Zamiast sztucznej inteligencji, system opiera się na **deterministycznym silniku regułowym**, który zapewnia 100% niezawodności i natychmiastowe podsumowanie stanu akwarium.

## 🚀 Technologie

Projekt wykorzystuje nowoczesny stos technologiczny (tzw. PFRN / Python, FastAPI, React, Node):

- **Frontend:**
  - React.js + Vite (TypeScript)
  - Tailwind CSS (stylowanie)
  - React Router DOM (routing)
  - Axios (komunikacja API)
  - Context API (zarządzanie stanem, autoryzacja)
  
- **Backend:**
  - Python 3.11
  - Django & Django REST Framework
  - PostgreSQL (Baza danych)
  - djangorestframework-simplejwt (JSON Web Tokens - uwierzytelnianie)

- **Infrastruktura:**
  - Docker & Docker Compose (konteneryzacja i orkiestracja środowiska)

## 🌟 Funkcjonalności

Zgodnie z wymaganiami projektowymi, aplikacja posiada 5 głównych, wyodrębnionych funkcjonalności:
1. **Konfiguracja parametrów środowiska** – krok w kreatorze pozwalający ustalić typ wody (słodkowodna/morska) oraz pojemność zbiornika.
2. **Katalog i wyszukiwarka gatunków** – interaktywna baza danych (z tagami i filtrowaniem po typie środowiska), umożliwiająca wirtualne dodawanie gatunków do akwarium.
3. **Deterministyczny silnik walidacji** – analizujący dane w czasie rzeczywistym. Sprawdza wymagania wodne, zachowania (agresja terytorialna, drapieżnictwo) oraz liczy obciążenie zbiornika na podstawie zadeklarowanego litrażu (Bioload).
4. **Moduł raportowania** – szczegółowe podsumowanie analizy. Zwraca `Compatibility Score` (punkty od 0 do 100), listę ewentualnych ostrzeżeń (Warnings) i wykorzystaną pojemność biologiczną.
5. **Autoryzacja i zarządzanie zbiornikami** – system rejestracji i logowania użytkowników, dzięki któremu mogą oni powracać do wcześniej zapisanych akwariów w swoim kokpicie.

## 🐳 Jak uruchomić projekt lokalnie?

Instalacja i uruchomienie są bardzo proste, o ile posiadasz zainstalowanego [Dockera](https://www.docker.com/).

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/Rez1stor/AquaMatch-web-app.git
   cd AquaMatch-web-app
   ```
2. Uruchom środowisko za pomocą Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Aplikacja automatycznie przeprowadzi migracje bazy i wstrzyknie do niej przykładowe dane (tzw. seedy), by od razu można było testować reguły silnika.
4. Gotowe! Otwórz przeglądarkę i wejdź na:
   - **Aplikacja kliencka (React):** [http://localhost:5173](http://localhost:5173)
   - **Dokumentacja API (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)

## 📄 Struktura Projektu

- `/backend` - kod źródłowy serwera FastAPI wraz z logiką walidacji (`engine.py`)
- `/frontend` - aplikacja kliencka napisana w React.js z widokami podzielonymi na pliki (`DashboardView`, `AquariumBuilderView` itp.)
- `docker-compose.yml` - konfiguracja powiązań między PostgreSQL, FastAPI i Reactem.

---
*Projekt zrealizowany indywidualnie w celach akademickich przez Matviia Ravlyka.*
