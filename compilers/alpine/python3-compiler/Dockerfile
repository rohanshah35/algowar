FROM alpine:3.13

RUN apk add --no-cache python3 bash

WORKDIR /workspace

COPY entrypoint.sh /workspace/entrypoint.sh
RUN chmod +x /workspace/entrypoint.sh

ENTRYPOINT ["/workspace/entrypoint.sh"]
