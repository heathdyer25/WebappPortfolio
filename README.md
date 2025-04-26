WebApp Portfolio
Heath Dyer


# Introduction

Welcome to my WebApp Portfolio.

# Directions

First, you will need to configure the environment file. The .env.template is provided, you can fill them in will values. Example values are listed below.
```
# Our super secret API key
API_SECRET_KEY=heath_is_swag #for howler
API_KEY=nvruR4SBoeYD9HZbl7TfxJUEstd1Mz6A #for shounen showdown

# Database access information
MYSQL_ROOT_PASSWORD=TE471iGbkiT6gditgfMu4UOm8Jaup7WO
MYSQL_DATABASE=shounenshowdown
MYSQL_USER=hadyer
MYSQL_PASSWORD=Password123!

# Database service information
DB_HOST=shounen-database
DB_PORT=3306

# Hosting ports
PYF_PORT=3000
HOWLER_PORT=3001
SHOUNEN_PORT=3002
```

These web app modules are hosted via docker via a reverse proxy on the local host. To start running, navigate to the root directory and run:
```
docker compose up
```

Then in your web browser navigate to.
```
localhost
```

By default you will be taken to the Shounen Showdown application. To navigate to a specific project, add the name of the project you want to view to the url. The names of the projects can be found below in the Portfolio contents section. The links are also given below:

https://localhost
https://localhost/static-sites
https://localhost/calculator
https://localhost/pay-your-friends
https://localhost/howler


## Porfolio Contents

(1) **StaticSites** are two static HTML pages, a newspaper site and a simple statistic dashboard with arbitrary data. This demonstrates my ability to implement basic HTML wireframes and create CSS styling rules for modern looking UI designs.

[Link to StaticSites](./StaticSites)

(2) **Calculator** is a basic arithmic calculator implemented via an FSM. This demonstrates my ability to implement basic functionalty onto HTML pages using JavaScript.

[Link to Calculator](./Calculator)

(3) **PayYourFriends** is a simple Express-js application to submit a form. This demonstrates my ability to implement HTML forms, frontend and backend form valdiation, and serve simple web apps via a server.

[Link to Pay Your Friends](./PayYourFriends)

(4) **Howler** is a simple implementation of a social media site. This demonstrates my ability to apply server-client computing principles, implement RESTful APIs, JWT Authentication, and created dynamic web pages.

[Link to Howler](./Howler)

(4) **ShounenShowdown** is a full-stack web application that acts as a trading card game similar to Pokemon, but features Anime characters. Demonstrates all of the above, plus knowledge of relational databases, PWA capabilities, and more.

[Link to ShounenShowndown](./ShounenShowdown)