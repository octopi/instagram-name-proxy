# instagram-name-server
## Why
Because the Instagram API really needs a /users/USERNAME/media/recent endpoint.

## How

1. Grab your Instagram access token and `export INSTAGRAM_TOKEN=<your token>`
2. `npm install`
3. `foreman start`
4. Basic usage is: `http://instagram-name-server-instance/<instagram_username>[?max_id=next_max_id]` where `max_id` is the [pagination parameter](http://instagram.com/developer/endpoints/) provided by Instagram. `next_max_id` is returned in a response from instagram-name-server
