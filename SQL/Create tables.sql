DROP database IF EXISTS PINTICO_DB;
CREATE DATABASE IF NOT EXISTS PINTICO_DB;
USE PINTICO_DB;



-- Identifica a la entidad Provincia del pais
DROP TABLE IF EXISTS Provincia;
create table if not exists Provincia(
ID smallint not null unique auto_increment,
Nombre varchar(25) not null,
constraint pk_ID primary key (ID)
);

drop table if exists Canton;
create table if not exists Canton(
ID smallint not null unique auto_increment,
IDProvincia smallint not null,
Nombre varchar(50) not null,
constraint pk_CantonID primary key (ID),
foreign key (IDProvincia) references Provincia(ID)
);

Drop table if exists Distrito;
create table if not exists Distrito(
ID smallint not null unique auto_increment,
IDCanton smallint not null,
Nombre varchar(50) not null,
constraint pk_ID primary key (ID),
foreign key (IDCanton) references Canton(ID)
);

drop table if exists Direccion;
create table if not exists Direccion(
ID int not null unique auto_increment,
Descripcion varchar(300) not null,
DistritoID smallint not null,
GMaps_localizacion varchar(100) null,
constraint pk_ID primary key (ID),
foreign key (DistritoID) references Distrito(ID)
);


-- Identifica tipos de estados de pedidos
DROP TABLE IF EXISTS Status_pedido;
create table IF NOT EXISTS Status_Pedido(
ID smallint not null unique auto_increment,
Status_pedido varchar(50) not null,
constraint pk_ID primary key (ID)
);

-- Identifica un tipo de restaurante por el tipo de comida que sirve Hamburguesas, China, etc...
DROP TABLE IF EXISTS Tipo_Restaurante;
create table IF NOT EXISTS Tipo_Restaurante(
ID smallint not null unique auto_increment,
Tipo varchar(50) not null,
constraint pk_ID primary key (ID)
);

INSERT INTO TIPO_RESTAURANTE(TIPO) VALUES ('Sandwich'),('Café'),('Carnes'),('Sushi'),
('Alitas'),('Hamburguesas'),('Mexicana'),('Pollo'),('Batidos'),('Mariscos'),('Pastas'),
('Ensaladas'),('Típica'),('Caribeña'),('Peruana'),('Japonesa'),('Americana'),('Vegetariana')
,('Pastelería'),('Tacos');

-- Identifica un restaurante registrado en el sistema...
DROP TABLE IF EXISTS Restaurante;
create table IF NOT EXISTS Restaurante(
ID int not null unique auto_increment,
Nombre varchar(50) not null,
Telefono varchar(15) null,
Nombre_contacto varchar(50) not null,
Email varchar(50) null,
Delivery tinyint(1) not null,
Pickup tinyint(1) not null,
Pago_online tinyint(1) not null,
Orden_minima smallint not null,
Costo_delivery smallint null,
Link_fotos varchar(500) null,
ID_direccion int not null,
Activo bit not null,
Calificacion_general double not null,
foreign key (ID_Direccion) references Direccion(ID),
constraint pk_ID primary key (ID)
);


-- Identifica un tipo de grupo de producto, por ejemplo Pasteles de carne, de Papa etc...
DROP TABLE IF EXISTS Grupo_producto;
create table IF NOT EXISTS Grupo_Producto(
ID smallint not null unique auto_increment,
Nombre_grupo varchar(50) not null,
constraint pk_ID primary key (ID)
);


-- Identifica un producto de un restaurante registrado en el sistema...
DROP TABLE IF EXISTS Producto;
create table IF NOT EXISTS Producto(
ID int not null unique auto_increment,
Nombre varchar(50) not null,
Descripcion varchar(500) not null,
Grupo smallint not null,
Precio_unitario double not null,
ID_restaurante int not null,
Activo bit not null,
foreign key (ID_restaurante) references Restaurante(ID),
foreign key (Grupo) references Grupo_producto(ID),
constraint pk_ID primary key (ID)
);


-- Identifica un cliente/usuario de la app
DROP TABLE IF EXISTS Cliente;
Create table if not exists Cliente(
ID int not null unique auto_increment,
Nombre varchar(50) not null,
Email varchar(25) not null,
Contrasena varchar(250) not null,
Telefono1 varchar(10) not null,
Telefono2 varchar(10) null,
Fecha_nascimiento date null,
Numero_identificacion varchar(20) null,
Link_foto varchar(500) null,
Activo bit not null
);



-- Identifica un cliente/usuario de la app
DROP TABLE IF EXISTS Repartidor;
Create table if not exists Repartidor(
ID int not null unique auto_increment,
Nombre varchar(50) not null,
Email varchar(25) not null,
Contrasena varchar(250) not null,
Telefono1 varchar(10) not null,
Telefono2 varchar(10) not null,
Fecha_nascimiento date not null,
Numero_identificacion varchar(20) not null,
Link_foto varchar(500) not null,
Anotaciones varchar(1000) null,
Activo bit not null
);


-- Identifica productos favoritos por usuarios del sistema
DROP TABLE IF EXISTS Favoritos_X_Cliente;
Create table if not exists Favoritos_X_Cliente(
ID_Cliente int not null,
ID_producto int not null,
foreign key (ID_Cliente) references Cliente(ID),
foreign key (ID_producto) references Producto(ID)
);

-- Identifica diversas direcciones de envio que puede tener un usuario
DROP TABLE IF EXISTS Direcciones_X_Usuario;
CREATE TABLE IF NOT EXISTS Direcciones_X_Usuario(
ID int not null auto_increment unique,
ID_Cliente int not null,
ID_Direccion int not null,
foreign key (ID_Direccion) references Direccion(ID),
constraint pk_ID primary key (ID)
);



-- Identifica las horas de servicio de un restaurante
DROP TABLE IF EXISTS Horario_Restaurante;
CREATE TABLE IF NOT EXISTS Horario_Restaurante(
ID int not null auto_increment unique,
ID_Restaurante int not null,
Recibe_pedido varchar(8) not null,
Cierra_pedido varchar(8) not null,-- Por ejemplo puede ser calculado, ejemplo una hora antes 
Lunes varchar(11) not null,
Martes varchar(11) not null,
Miercoles varchar(11) not null,
Jueves varchar(11) not null,
Viernes varchar(11) not null,
Sabados varchar(11) not null,
Domingos varchar(11) not null,
Feriados varchar(11) null,
foreign key (ID_Restaurante) references Restaurante(ID),
constraint pk_ID primary key (ID)
);


-- Identifica un descuento de un restaurante registrado en el sistema
DROP TABLE IF EXISTS Descuento_Restaurante;
CREATE TABLE IF NOT EXISTS Descuento_Restaurante(
ID int not null auto_increment unique,
ID_Restaurante int not null,
Fecha_Inicio timestamp not null,
Fecha_Fin timestamp not null,
Cantidad_Disponible smallint not null,
Descripcion varchar(1000) not null,
Codigo_promocional varchar(10) not null,
foreign key (ID_Restaurante) references Restaurante(ID),
constraint pk_ID primary key (ID)
);

-- Identifica un descuento de un producto de un restaurante
DROP TABLE IF EXISTS Descuento_Producto;
CREATE TABLE IF NOT EXISTS Descuento_Producto(
ID int not null auto_increment unique,
ID_Producto int not null,
Fecha_Inicio timestamp not null,
Fecha_Fin timestamp not null,
Cantidad_Disponible smallint not null,
Descripcion varchar(1000) not null,
Codigo_Promocional varchar(10) not null,
Descuento double not null,
foreign key (ID_producto) references producto(ID),
constraint pk_ID primary key (ID)
);




-- Identifica un orden hecha por un cliente de la app
DROP TABLE IF EXISTS Orden;
CREATE TABLE IF NOT EXISTS Orden(
ID int not null auto_increment unique,
ID_Cliente int not null,
ID_Repartidor int  null,
Fecha_pedido timestamp not null,
Fecha_entrega timestamp null,
ID_direccion_entrega int not null,
Pago_online bit not null,
Pago_llegada bit not null,
Comentario varchar(1000) null,
Precio_delivery double null,
ID_descuento_restaurante int null,
ID_Status_pedido smallint not null,
foreign key (ID_Cliente) references Cliente(ID),
foreign key (ID_Repartidor) references Repartidor(ID),
foreign key (ID_Direccion_entrega) references Direccion(ID),
foreign key (ID_descuento_restaurante) references Descuento_Restaurante(ID),
foreign key (ID_Status_pedido) references Status_pedido(ID),
constraint pk_ID primary key (ID)
);


-- Identifica los detalles de una orden hecha por el app
DROP TABLE IF EXISTS Detalle_Orden;
CREATE TABLE IF NOT EXISTS Detalle_Orden(
ID int not null auto_increment unique,
ID_Orden int not null,
ID_producto int not null,
Cantidad smallint not null,
ID_Descuento_producto int null,
foreign key (ID_descuento_producto) references Descuento_producto(ID),
constraint pk_ID primary key (ID)
);

-- Identifica la calificacion de una orden en terminos de algunos puntos
DROP TABLE IF EXISTS Calificacion_Orden;
CREATE TABLE IF NOT EXISTS Calificacion_Orden(
ID int not null auto_increment unique,
ID_Orden int not null,
Comentario varchar(1000) null,
Precio_calidad double null,
Comida double null,
Tiempo double null,
Presentacion double null,
foreign key (ID_Orden) references Orden(ID),
constraint pk_ID primary key (ID)
);