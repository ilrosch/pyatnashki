install:
	npm ci

validate:
	npx html-validator --quiet '--ignore=Trailing slash on void elements'

lint:
	npx eslint .

lint-fix:
	npx eslint --fix .