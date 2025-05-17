report:
	npx playwright show-report

failed:
	npx playwright test --last-failed
all: 
	npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/
	npx playwright test /tests/Admin/
	
test: 
	npx playwright test /tests/admin/

docs: 
	npx playwright test /tests/Travel documents/
passport: 
	npx playwright test /tests/Passport-tests/