DROP DATABASE IF EXISTS blog;
CREATE DATABASE blog;

\c blog;

CREATE TABLE posts(
  id      SERIAL PRIMARY KEY,
  title   VARCHAR(50) NOT NULL,
  blurb   TEXT
);

INSERT INTO posts(title, blurb) VALUES('The Life of an Ant', 'I am an ant.');
