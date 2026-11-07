create table categories
(
    id_category   int generated always as identity primary key,
    category_name varchar(100) not null unique
);

create table products
(
    id_product   int generated always as identity primary key,
    product_name varchar(100) not null,
    category_id  int references categories (id_category),
    quantity     int          not null,
    price        int           default 0 check (price >= 0),
    rating       numeric(3, 2) default 0.00 check (rating >= 0 and rating <= 5.00),
    status       boolean       default false
);

create table cart
(
    id_cart     int generated always as identity primary key,
    product_id  int references products (id_product),
    category_id int references categories (id_category),
    price       int default 0 check (price >= 0)
);

create table profile
(
    id_profile       int generated always as identity primary key,
    email            varchar(100) not null,
    profile_password varchar(100) not null,
    is_active        boolean default false,
    activation_link  varchar(500) not null
);

create table tokens
(
    id_token      int generated always as identity primary key,
    user_id       varchar(100)          not null,
    refresh_token varchar(500) not null
);