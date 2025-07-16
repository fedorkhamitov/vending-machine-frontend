Readme.txt
Реализация проекта 
"Тестовое задание
На разработку автомата по продаже напитков "

1. Backend

Используемые технологии:
 - .NET 8 / ASP.NET Core на сервере
 - PostgreSQL
 -  Entity Framework Core
 - Документация API: Swagger/Swashbuckle
 - Обработка Excel: EPPlus (OfficeOpenXml) для импорта каталога товаров (напитков)
 - DI & Repository Pattern
 
Проект выполнен по принципам чистой (Clean) архитектуры, с чётким разделением на четыре основных слоя:
1.1 Слой API (Presentation Layer)
Реализован в ASP .NET Core 8.0.
Контроллеры:
BrandsController (CRUD для брендов).
ProductsController (получение, фильтрация, импорт Excel, блокировка/освобождение автомата).
OrdersController (создание заказа, список и детали заказов, статус автомата).
1.2 Слой Application
Реализованы DTO-объекты (BrandDto, ProductDto, OrderDto, PriceRangeDto и т. д.), Интерфейсы сервисов (IBrandService, IProductService, IOrderService, IVendingMachineService).

Реализации сервисов:
BrandService, ProductService, OrderService.
ExcelCatalogImportService — импорт товаров из Excel (EPPlus).

1.3 Слой Domain
Реализованы сущности (Entities): Brand, Product, Order, Coin; Value Objects: Money, OrderItem.
Абстракции: базовый класс Entity, ValueObject.

1.4 Слой Infrastructure
Реализован ApplicationDbContext (EF Core + Npgsql для PostgreSQL), репозитории (BrandRepository, ProductRepository, OrderRepository, CoinRepository) — реализация CRUD и бизнес-логики хранения.

Конфигурация моделей (IEntityTypeConfiguration).

Сидирование начальных данных (DataSeed).
 
 Из необязательных требований выполнено:
 - Импорт Excel-файла: реализован сервис ExcelCatalogImportService и endpoint import-excel.
 Формат Excel-файла:
 Name	| Description |	Price |	BrandName |	StockQuantity - ЗАГОЛОВОК пропускается
Coca-Cola Classic	| Классика	| 85	| Coca-Cola	| 10
Fanta Orange |	Апельсиновая | 75 | Fanta |	8
Sprite Lime	| Описание ... | 122 | Sprite | 111

 
 2. Frontend
 
 Используемые технологии:
 - React 18 + TypeScript — компоненты, строго типизированный код.
 - Context API (CartContext) — управление состоянием корзины без Redux.
 - Webpack Dev Server с прокси — единая точка вызова бэкенда.
 - Fetch API с credentials: 'include' — передача сессионных cookie для блокировок и импортов.
 - CSS (модули и глобальные файлы) с переменными (:root) и CSS Grid/Flexbox для адаптивного макета.
 
 Структура приложения
App.tsx
– Логика переходов между страницами: «Каталог» → «Корзина» → «Оплата» → «Результат».
– Обёртка <CartProvider>.

ProductCatalog
– Фильтрация

Бренд: <select> (BrandFilter).

Стоимость: двойной ползунок (PriceSlider).
– Сетка товаров: CSS Grid, 4 колонки.
– Кнопки

«Импорт» открывает <input type="file"> и отправляет FormData на POST /api/products/import-excel.

«Выбрано» (счётчик из контекста) переходит в корзину.

ProductCard
– Отображение: имя, описание, бренд, цена, остаток.
– Кнопка:

Состояние «Выбрать» (оранжевая).

«Выбрано» (зелёная) после добавления в корзину.

«Закончился» (серая), если stockQuantity = 0.

Cart
– Список выбранных товаров, изменение количества, удаление.
– «Вернуться» и «Оформить» (переход к оплате).

Payment
– Управление монетами номиналом 1,2,5,10.
– Расчёт и отображение суммы и сдачи.

OrderResult
– Сообщение об успехе или ошибке оплаты.