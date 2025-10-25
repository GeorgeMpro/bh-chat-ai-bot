# Game Plan

- [ ] Answer the:
  synchronization - How will you architect a chat room that is fully synchronized the client and the server?
  - solved using websockets: bidirectional connection & persistent

## NX Monorepo

- add Nx after working skeleton

## Front End

- [ ] working skeleton
  - [ ] user login
  - [ ] user logout
  - [ ] user msg
  - [ ] previous messages
- [ ] mock chatbot
  - [ ] recognize relevant chatbot msg
  - [ ] query online a solution
  - [ ] set tone
- [ ] mock server
- [ ] real server connection
- [ ] deploy on Firebase

### User

- [ ] login
  - can log out
  - prompted to log in
  - can post if logged in
  - ? handle same name?
  - ? choose an avatar from pool ?

### Message

- click to edit/emoji
- allow edit
  - a user can edit HIS messages
  - add "edited"
- add emojis
  - ? who added the emoji?

### Testing

- unit test
- small integration/UI interaction tests?

## Backend

- store chat history
  - ?who reacted to your message??
- logged in users
- [ ] deploy on Railway

### Chatbot

- under specific TODO

## Design

- [ ] go over chat examples
- [ ] responsive to different screen sizes
- [ ] consideration for accessibility(A11y)
- ? dark mode?

## Polish / Doco / Deployment

- firebase
- [ ]  readme
- [ ]  extract reusable design
- setup
- consideration
  - limited testing
  - no auth
- future ideas
