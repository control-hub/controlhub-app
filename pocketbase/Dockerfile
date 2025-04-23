FROM alpine:latest

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    # this is needed only if you want to use scp to copy later your pb_data locally
    openssh

# Copy pb executable
COPY pocketbase pocketbase

# Set executable permissions
RUN chmod +x pocketbase

# Copy the local pb_data dir into the container
COPY ./pb_data /pb_data

# uncomment to copy the local pb_migrations dir into the container
# COPY ./pb_migrations /pb_migrations

# uncomment to copy the local pb_hooks dir into the container
# COPY ./pb_hooks /pb_hooks

EXPOSE 51568

# start PocketBase
CMD ["./pocketbase", "serve", "--http=0.0.0.0:51568"]
