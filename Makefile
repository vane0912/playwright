report:
	npx playwright show-report --report-dir=/test-results-2

failed:
	npx playwright test --last-failed --headed
all: 
	npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ --workers 2 
admin: 
	npx playwright test /tests/admin/
test: 
	npx playwright test embassy_visa.spec.js

passport:
	npx playwright test /tests/Passport-tests/