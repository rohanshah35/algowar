FROM alpine:3.13

RUN apk add --no-cache g++ bash

WORKDIR /workspace

COPY entrypoint.sh /workspace/entrypoint.sh
RUN chmod +x /workspace/entrypoint.sh

ENTRYPOINT ["/workspace/entrypoint.sh"]