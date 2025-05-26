report:
	npx playwright show-report
failed:
	npx playwright test --last-failed --headed
all: 
	npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ --workers 2 
admin: 
	npx playwright test /tests/admin/
test: 
	npx playwright test pre_and_post_payment.spec

passport:
	npx playwright test /tests/Passport-tests/ 