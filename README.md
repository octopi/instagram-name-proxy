# instagram-name-proxy
## Why
Because the Instagram API really needs a /users/USERNAME/media/recent endpoint.

## How

1. Grab your Instagram access token and `export INSTAGRAM_TOKEN=<your token>`
2. `npm install`
3. `foreman start`
4. Basic usage is: `http://instagram-name-proxy-instance/<instagram_username>`. All the [/media/recent](http://instagram.com/developer/endpoints/users/) parameters are supported. A common use case is pagination, where you should take the `next_max_id` field from a response and pass it in as a `max_id` query param.
