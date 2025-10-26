# devTinder

Here’s a GitHub-friendly (≤350 characters) description for devTinder 👇 devTinder is a Node.js and Express-based matchmaking app for developers. It helps devs connect, collaborate, and find project partners based on shared skills and interests. Built with MongoDB, it offers authentication, profiles, and smart matching features.

# DevTinder API's

authRouter
-POST /sigup
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter

- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you

status: ignore, interested, accepted, rejected.
