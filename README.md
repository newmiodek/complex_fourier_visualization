# O Programie

Ten program przyjmuje narysowany przez użytkownika kształt, traktuje go jako
funkcję okresową (f: R -> C) i wylicza wartości współczynników zespolonego
wariantu szeregu Fouriera będącego aproksymacją tej funkcji, tj. przekształca
tą funkcję do postaci f(t) = Σ(od k=-N)(do N) (C_k\*e^(2πitk)), gdzie t∈R,
N,k∈Z, C_k∈C. Następnie puszcza w ruch takie "wskazówki zegara", które zaczną
wytyczać narysowany kształt. Każda z tych wskazówek reprezentuje jeden z
elementów szeregu (C_k\*e^(2πitk)). Wskazówki są ułożone w kolejności k=0, k=1,
k=-1, k=2, k=-2, itd. Ten program ma być próbą odtworzenia animacji pokazanej w
filmie pod linkiem (https://www.youtube.com/watch?v=r6sGWTCMz2k) wykorzystując
matematykę która została tam wytłumaczona. Napisałem go podczas pandemii i
pierwotnie był w C++, ale przepisałem go do JS, żebym mógł go łatwiej wysyłać i
pokazywać. Od czasu napisania tego programu nauczyłem się co nieco i gdybym miał
go dzisiaj pisać jeszcze raz to widze jakie rzeczy byłyby do polepszenia.

# Jak go używać

Po wejściu w index.html w przeglądarce otworzy się zakładka z czarnym ekranem.
Po nim można rysować używając myszki. Jak już się coś narysuje i puści się
myszkę to program wyliczy wszystkie współczynniki i puści w ruch wskazówki. Jak
wskazówki już się ruszają to można cały obraz przesuwać myszką, przybliżać i
oddalać kółkiem, oraz przyspieszać ruch wskazówek (przyciskiem 'W') i go
zwalniać ('S'). Rysunek można zetrzeć przyciskiem 'X'.<br>
Polecam rysować powoli, bo wtedy program dokładniej wszystko może wyliczyć.
Narysowane kształty powinny kończyć się tam gdzie się zaczynały, ale jeśli się
nie dotrzyma tej zasady to efekt też będzie ciekawy.

# Prezentacja

https://github.com/user-attachments/assets/8a263e0b-b29c-419a-a08b-4fa2b8f60c56
