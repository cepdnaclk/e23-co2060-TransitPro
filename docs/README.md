---
layout: home
permalink: index.html

# Please update this with your repository name and project title
repository-name: e23-co2060-TransitPro
title: TransitPro - Smart Transport Management System
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template, and add more information required for your own project"

<!-- Once you fill the index.json file inside /docs/data, please make sure the syntax is correct. (You can use this tool to identify syntax errors)

Please include the "correct" email address of your supervisors. (You can find them from https://people.ce.pdn.ac.lk/ )

Please include an appropriate cover page image ( cover_page.jpg ) and a thumbnail image ( thumbnail.jpg ) in the same folder as the index.json (i.e., /docs/data ). The cover page image must be cropped to 940×352 and the thumbnail image must be cropped to 640×360 . Use https://croppola.com/ for cropping and https://squoosh.app/ to reduce the file size.

If your followed all the given instructions correctly, your repository will be automatically added to the department's project web site (Update daily)

A HTML template integrated with the given GitHub repository templates, based on github.com/cepdnaclk/eYY-project-theme . If you like to remove this default theme and make your own web page, you can remove the file, docs/_config.yml and create the site using HTML. -->

# TransitPro – Smart Transport Management System

---

## Team
-  E/23/017, N.A.N.D.N.Arachchi, [email](mailto:e23017@eng.pdn.ac.lk)
-  E/23/077, J.Dinojan, [email](mailto:e23077@eng.pdn.ac.lk)
-  E/23/454, T.T.R.Yapa, [email](mailto:e23454@eng.pdn.ac.lk)
-  E/23/455, H.P.L.N.Yash, [email](mailto:e23455@eng.pdn.ac.lk)

<!-- Image (photo/drawing of the final hardware) should be here -->

<!-- This is a sample image, to show how to add images to your page. To learn more options, please refer [this](https://projects.ce.pdn.ac.lk/docs/faq/how-to-add-an-image/) -->

<!-- ![Sample Image](./images/sample.png) -->

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture )
3. [Software Designs](#hardware-and-software-designs)
4. [Testing](#testing)
5. [Conclusion](#conclusion)
6. [Links](#links)

## Introduction

Managing transport services and rental vehicles using manual or poorly integrated systems often leads to scheduling conflicts, overbooking, and reduced user satisfaction. TransitPro is a web-based smart transport and rental vehicle management system designed to improve travel planning and booking convenience. The platform enables users to view daily transport schedules, explore route details, and book transport services based on real-time availability, seating capacity, and comfort preferences such as AC or non-AC options. In addition to scheduled transport services, the system supports rental vehicle bookings for personal or group travel. Automated availability checks prevent overbooking and ensure reliable service. TransitPro also provides an administrator dashboard for managing vehicles, routes, schedules, and bookings efficiently.


## Solution Architecture

TransitPro follows a three-tier architecture consisting of a frontend, backend, and database layer. The frontend is developed using React to provide a responsive and user-friendly interface for users and administrators. The backend is implemented using Node.js and Express, exposing RESTful APIs to handle authentication, bookings, schedules, and vehicle management. MongoDB is used as the database to store user data, vehicle details, routes, schedules, and booking records. The frontend communicates with the backend through secure HTTP requests, while the backend manages business logic and data validation before interacting with the database.

## Software Designs

The system is divided into multiple modules including user management, transport scheduling, vehicle booking, rental management, and administration. User interfaces are designed to be intuitive and responsive, allowing easy navigation across schedules, routes, and bookings. The database design uses collections for users, vehicles, routes, schedules, and bookings to ensure efficient data retrieval and scalability. RESTful API endpoints are structured to support modular development and future feature expansion. Role-based access control is implemented to separate user and administrator functionalities.


## Testing

Testing was carried out at both module and system levels to ensure reliability and correctness. Unit testing was performed on backend API endpoints to validate booking logic, availability checks, and data handling. Integration testing ensured proper communication between the frontend, backend, and database. User interface testing was conducted to verify responsiveness and usability across different devices. Test results confirmed that the system correctly prevents overbooking, displays real-time schedules, and handles rental and transport bookings accurately.

## Conclusion

TransitPro successfully delivers a scalable and user-friendly transport and rental vehicle management solution. The system improves booking accuracy, reduces manual effort, and enhances user experience through real-time availability and comfort-based vehicle selection. Future enhancements may include mobile application support, GPS-based vehicle tracking, online payment integration, and advanced analytics for transport optimization.

## Links

- [Project Repository](https://github.com/cepdnaclk/e23-co2060-TransitPro){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/e23-co2060-TransitPro){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/){:target="_blank"}
- [University of Peradeniya](https://eng.pdn.ac.lk/){:target="_blank"}

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
