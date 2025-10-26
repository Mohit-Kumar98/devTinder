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

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
/feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

skip = (page - 1) \* limit;
