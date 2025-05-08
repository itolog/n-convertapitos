.PHONY : dev

# Development
dev:
	docker compose -f docker-compose.dev.yml up -d --build

dev-stop:
	docker compose -f docker-compose.dev.yml stop

dev-down:
	docker compose -f docker-compose.dev.yml down
# Production
prod:
	docker compose up -d --build

prod-stop:
	docker compose stop

prod-down:
	docker compose down

docker-stop-all:
	docker stop $$(docker ps -a -q) || true
