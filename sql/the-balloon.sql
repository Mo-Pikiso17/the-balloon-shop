CREATE TABLE valid_color(id SERIAL PRIMARY KEY NOT NULL, color_name text NOT NULL, count INTEGER);

CREATE TABLE invalid_color(id SERIAL PRIMARY KEY NOT NULL, color_name text NOT NULL, count INTEGER, parentID INT, FOREIGN KEY(parentID) REFERENCES valid_color(id));
);

INSERT INTO valid_color(color_name, count)VALUES ('Orange', 1);
INSERT INTO valid_color(color_name, count)VALUES ('Purple', 1);
INSERT INTO valid_color(color_name, count)VALUES ('Lime', 1);



