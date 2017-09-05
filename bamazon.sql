DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;


SELECT * FROM products
-- Creates new rows containing data in all named columns --
INSERT INTO auctions (item_name, category, starting_bid, highest_bid)
VALUES ("B's Faves", "Angels & Airwaves", 5, 10);

INSERT INTO playlists (id, title, artist, genre)
VALUES (0, "B's Faves", "Angels & Airwaves", "Rock");

INSERT INTO playlists (id, title, artist, genre)
VALUES (0, "c", "c", "RAP");
CREATE TABLE products(
  -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows. --
  item_id INTEGER(255) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50),
  department_name VARCHAR(50),
  price decimal(10,2),
  
  stock_quantity INTEGER(255),
  -- Creates a boolean column called "mastered" which will automatically fill --
  -- with TRUE when a new row is made and the value isn't otherwise defined. --
  PRIMARY KEY (item_id)
);

-- Creates new rows
INSERT INTO products (product_name, department_name, price)
VALUES ("Asus Laptop", "Electronics", 1000.00);

INSERT INTO programming_languages (language, rating)
VALUES ("JS", 99);

INSERT INTO programming_languages (language, rating)
VALUES ("JQuery", 98);

INSERT INTO programming_languages (language, rating)
VALUES ("MySQL", 70);