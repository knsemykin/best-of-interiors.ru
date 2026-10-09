# Проверка первого этапа — 2026-10-09

- npm run build: успешно, одна статическая страница.
- npm audit: 0 уязвимостей после обновления sharp до 0.35.5.
- Desktop и viewport 390×844: визуально проверены; горизонтального переполнения нет.
- Мобильное меню: открывается/закрывается, aria-expanded меняется.
- Категория: диалог открывается с нужным названием, закрывается кнопкой.
- FAQ: раскрывается, текст ответа доступен в DOM.
- Все три отображаемых изображения загружены; локальные ссылки на assets и якоря проверены.
- Один H1; JSON-LD корректно разбирается; Organization, WebSite, AboutPage.
- Консоль браузера: ошибок не обнаружено.
- Превью закрыто от индексации через meta robots noindex, follow.
- Lighthouse / полевые CWV и поисковые позиции не измерялись.

GitHub: https://github.com/knsemykin/best-of-interiors.ru
Timeweb project: https://timeweb.cloud/my/projects/3017763
App Platform: тариф согласован пользователем. Приложение 267437 создано в проекте 3017763. Сборка 97f448b успешна, статус «В сети». Node.js 24, npm run build, /dist. Технический адрес https://knsemykin-best-of-interiors-ru-2cea.twc1.net — на момент проверки DNS возвращает NXDOMAIN, поэтому внешняя HTTP-проверка не завершена. Основной домен best-of-interiors.ru не подключён. Изменения после 97f448b затрагивают только документацию и .gitignore.

## Dark visual revision
- Graphite background, blue accents, burgundy surfaces, larger text throughout.
- Body text 18px, introductory copy 22px desktop / 20px mobile.
- Generated abstract background, CSS transform animation, reveal motion, reduced-motion support and pause button.
- Checked desktop and 390px mobile: no horizontal overflow; pause control sets animation-play-state to paused; browser console has no errors.

## Moscow ranking — 2026-10-09
- `npm run build` and `npm run check:ranking` pass in preview and `SITE_INDEXABLE=true` modes; final local build restored to preview.
- All 175 imported scores and competition ranks recomputed; two segments 164/11; excluded 80 candidates not published.
- Static HTML: one H1, unique IDs, valid internal hash targets, three PROMO cards, schema list counts, dimensioned images, no AggregateRating, no clickable contact blocks.
- HTML ~1.66 MB uncompressed, ~84 KB gzip. Ranking client JS ~10 KB. Main 1800w WebP ~72 KB. Actual host compression still requires production verification.
- In-app browser: name search, price <=3000 (5 results), commercial segment (11 results), empty state/reset, pagination, deep link to Hot Walls (page 12/14), two-studio comparison, personal form and all three quiz steps.
- Unchecked consent prevents completion; completed preview explicitly reports no delivery; closing clears form fields.
- Desktop and mobile 390px inspected. Fixed grid min-width causing horizontal overflow. Contacts details open correctly and stay within width. Viewport restored after check.
- No Lighthouse/field-CWV or ranking-position claims. No real data sent, no new paid services enabled.
