CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes Integer default 0 );

insert into blogs (author, url, title, likes) values ('Me', 'lalala.com', 'my title', 1); insert into blogs (author, url, title, likes) values ('Me again', 'lalala.com', 'my title again', 5);