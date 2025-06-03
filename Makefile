report:
	npx playwright show-report
failed:
	npx playwright test --last-failed --headed
all: 
	npx percy exec -- npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ --workers 2 
admin: 
	npx playwright test /tests/admin/
test: 
	npx playwright test rush.spec.js --headed
percy:
	npx percy exec -- npx playwright test tests/visual/testfile.spec.js
passport:
	npx playwright test /tests/Passport-tests/ 