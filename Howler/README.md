# Howler

## Questions

**Howler** is a simple implementation of a social media site. This demonstrates my ability to apply server-client computing principles, implement RESTful APIs, JWT Authentication, and created dynamic web pages. Try logging in as "student" with "password". You can also navigate to any users profile at /:username

## API Documentation

Method | Route                          | Description
------ | ------------------------------ | ---------
`POST` | `/login`                 | Log in user with username
`POST` | `/logout`                | Log out the current user
`POST` | `/register`                | Creates new user account
`GET` | `/users/current`               | If user is logged in gets current user
`GET`  | `/users/:userId`               | Retrieves a user by its Id
`GET`  | `/users`                       | Retrieves user and querys by username
`POST`  | `/howls`	                    | Creates new howl by authenticated user
`GET`  | `/users/:userId/howls`	            | Gets all howls by a specific user
`GET`  | `/follows/howls`	        | Gets all howls by users authenticated user is following
`GET`  | `/users/:userId/follows`                 | Gets all users a user is following by UserID
`POST`  | `/follows/:followingId`	        | Posts to authenticated user's followed users by adding a  follower
`DELETE` | `/follows/:followingId`	        | Deletes from authenticated user's followed users by removing a follower
