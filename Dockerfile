FROM node:22-slim AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-slim
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
