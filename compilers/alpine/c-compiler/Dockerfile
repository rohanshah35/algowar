FROM alpine:3.21

RUN apk add --no-cache gcc musl-dev bash

WORKDIR /workspace

COPY entrypoint.sh /workspace/entrypoint.sh
RUN chmod +x /workspace/entrypoint.sh

ENTRYPOINT ["/workspace/entrypoint.sh"]
