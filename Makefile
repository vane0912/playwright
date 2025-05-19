report:
	npx playwright show-report

failed:
	npx playwright test --last-failed
all: 
	npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ --workers 2 || true
	npx playwright test /tests/admin/
admin: 
	npx playwright test /tests/admin/
passport: 
	npx playwright test /tests/Passport-tests/