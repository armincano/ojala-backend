CREATE DATABASE ojala;

CREATE TABLE IF NOT exists visitor(
	id			serial primary key,
	first_name	varchar(30) not null,
	last_name	varchar(30) not null,
	email		varchar(30) not null,
	"age"		int not null
);

CREATE TABLE IF NOT exists visitor_issue(
	id			serial primary key,
	visitor_id	int,
	issue		varchar(15) not null,
	submit_date	date not null,
	constraint fk_visitor_id foreign key(visitor_id) references visitor(id)
);

CREATE TABLE IF NOT EXISTS "admin"(
	id			serial PRIMARY KEY,
	"user"		varchar(30) not null,
	email		varchar(30) not null,
	"password"	varchar(75) not null
);

-- Adding example registries
insert into visitor (first_name,last_name ,email, "age") values
('Işıl','Cano','letsrockthis@gmail.com',24),
('Barış','Rodríguez','livinginbarcelona@gmail.com', 32);
insert into visitor_issue (visitor_id,issue,submit_date) values
(1,'app-install','2023-11-05'),
(2,'app-mistake','2023-11-05'),
(1,'other','2023-11-05');

INSERT INTO "admin" ("user",email,"password") values
('linus_torvalds','ojala3@mail.com','$2b$10$a7ElUO1aUXGMeIbi.hSKXOzB58VQtYlSGT9udYtpsfZTszSxq2J2a');

