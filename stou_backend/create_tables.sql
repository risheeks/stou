DROP TABLE ORDER_FOOD;
DROP TABLE ORDERS;
DROP TABLE FOOD_ALLERGEN;
DROP TABLE FOOD;
DROP TABLE COOK_CUISINES;
DROP TABLE CUISINES;
DROP TABLE FAVORITE_HOMECOOKS;
DROP TABLE USER;
DROP TABLE ROLES;


CREATE TABLE ROLES (
    ROLE_ID INT(1) NOT NULL PRIMARY KEY,
    ROLE_DESC VARCHAR(20) NOT NULL
);

INSERT INTO ROLES (ROLE_ID, ROLE_DESC) VALUES (1, "COOK");
INSERT INTO ROLES (ROLE_ID, ROLE_DESC) VALUES (2, "CUSTOMER");
INSERT INTO ROLES (ROLE_ID, ROLE_DESC) VALUES (3, "ADMIN");


CREATE TABLE USER (
    PICTURE VARCHAR(500),
    FIRST_NAME VARCHAR(50),
    LAST_NAME VARCHAR(50),
    EMAIL VARCHAR(50) NOT NULL,
    PASSWORD VARCHAR(64) NOT NULL,
    ROLE INT(1) NOT NULL,
    LOCATION INT,
    RATING FLOAT,
    ABOUT_ME VARCHAR(150),
    PRIMARY KEY (EMAIL, ROLE),
    FOREIGN KEY (ROLE) REFERENCES ROLES(ROLE_ID)
);

-- INSERT INTO USER (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE) VALUES ("NR", "NR", "NR@NR.COM", "NR_PASS", 1);
-- INSERT INTO USER (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE) VALUES ("SID", "BOT", "SID@BOT.COM", "SID_PASS", 2);
-- INSERT INTO USER (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE) VALUES ("MIL", "MIL", "MIL@MIL.COM", "MIL_PASS", 1);
-- INSERT INTO USER (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE, LOCATION) VALUES ("AKSH", "AY", "ASH@AY.COM", "ASH_PASS", 2, 47907);
-- INSERT INTO USER (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE, LOCATION) VALUES ("ADR", "RAJ", "ADR@RAJ.COM", "RAJ_PASS", 3, 47906);

CREATE TABLE CUISINES (
    CUISINE VARCHAR(50) PRIMARY KEY
);


CREATE TABLE COOK_CUISINES (
    EMAIL VARCHAR(50),
    CUISINE VARCHAR(50),
    FOREIGN KEY (EMAIL) REFERENCES USER(EMAIL),
    FOREIGN KEY (CUISINE) REFERENCES CUISINES(CUISINE),
    PRIMARY KEY (EMAIL, CUISINE)
);

-- INSERT INTO COOK_CUISINES (EMAIL, CUISINE) VALUES ("NR@NR.COM", "INDIAN");
-- INSERT INTO COOK_CUISINES (EMAIL, CUISINE) VALUES ("NR@NR.COM", "ITALIAN");
-- INSERT INTO COOK_CUISINES (EMAIL, CUISINE) VALUES ("MIL@MIL.COM", "MEDITERANEAN");
-- INSERT INTO COOK_CUISINES (EMAIL, CUISINE) VALUES ("MIL@MIL.COM", "MEXICAN");




CREATE TABLE FOOD (
    PICTURE VARCHAR(500),
    FOOD_ID VARCHAR(40) PRIMARY KEY,
    COOK_EMAIL VARCHAR(50) NOT NULL,
    TITLE VARCHAR(50) NOT NULL,
    DESCRIPTION VARCHAR(150),
    CUISINE VARCHAR(50),
    PRICE FLOAT NOT NULL,
    CALORIES INT,
    VALID VARCHAR(10),
    FOREIGN KEY (CUISINE) REFERENCES CUISINES(CUISINE),
    FOREIGN KEY (COOK_EMAIL) REFERENCES USER(EMAIL)
);

-- INSERT INTO FOOD (FOOD_ID, COOK_EMAIL, TITLE, PRICE, CALORIES) VALUES ("EQAFWEFWEWFWEFWEFW", "NR@NR.COM", "CHICKEN TIKKA MASALA", 30, 400);


CREATE TABLE FOOD_ALLERGEN (
    FOOD_ID VARCHAR(40),
    ALLERGEN VARCHAR(50),
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(FOOD_ID),
    PRIMARY KEY(FOOD_ID, ALLERGEN)
);


CREATE TABLE ORDERS (
    ORDER_ID VARCHAR(40) PRIMARY KEY,
    ORDERED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    COOK_EMAIL VARCHAR(50) NOT NULL,
    CUSTOMER_EMAIL VARCHAR(50) NOT NULL,
    INSTRUCTIONS VARCHAR(150),
    DELIVERY_TIME TIMESTAMP,
    ORDER_ADDRESS VARCHAR(200),
    ORDER_STATUS VARCHAR(20),
    PAYMENT_KEY VARCHAR(100),
    FOREIGN KEY (COOK_EMAIL) REFERENCES USER(EMAIL),
    FOREIGN KEY (CUSTOMER_EMAIL) REFERENCES USER(EMAIL)
);


-- INSERT INTO ORDERS(COOK_EMAIL, CUSTOMER_EMAIL, FOOD) VALUES ("NR@NR.COM", "SID@BOT.COM", (SELECT FOOD_ID FROM FOOD WHERE TITLE="CHICKEN TIKKA MASALA"));

CREATE TABLE FAVORITE_HOMECOOKS (
    COOK_EMAIL VARCHAR(50) NOT NULL,
    CUSTOMER_EMAIL VARCHAR(50) NOT NULL,
    FOREIGN KEY (COOK_EMAIL) REFERENCES USER(EMAIL),
    FOREIGN KEY (CUSTOMER_EMAIL) REFERENCES USER(EMAIL),
    PRIMARY KEY(COOK_EMAIL, CUSTOMER_EMAIL)
);

CREATE TABLE FAVORITE_FOOD (
    FOOD_ID VARCHAR(50) NOT NULL,
    EMAIL VARCHAR(50) NOT NULL,
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(FOOD_ID),
    FOREIGN KEY (EMAIL) REFERENCES USER(EMAIL),
    PRIMARY KEY(FOOD_ID, EMAIL)
);
	
-- INSERT INTO FAVORITE_HOMECOOKS(COOK_EMAIL, CUSTOMER_EMAIL) VALUES ("ayush@gmail.com", "patel716@purdue.edu");
-- INSERT INTO FAVORITE_HOMECOOKS(COOK_EMAIL, CUSTOMER_EMAIL) VALUES ("newtester@gmail.com", "patel716@purdue.edu");

CREATE TABLE ORDER_FOOD (
    ORDER_ID VARCHAR(40),
    FOOD_ID VARCHAR(40),
    QUANTITY INT NOT NULL,
    PRICE FLOAT NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ORDER_ID),
    FOREIGN KEY (FOOD_ID) REFERENCES FOOD(FOOD_ID),
    PRIMARY KEY(ORDER_ID, FOOD_ID)
);