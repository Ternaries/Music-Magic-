DROP TABLE IF EXISTS songslist;

CREATE TABLE songslist (
id SERIAL PRIMARY KEY,
image VARCHAR(255),
title VARCHAR(255),
description TEXT,
artist VARCHAR(255),
audio VARCHAR(255)
);