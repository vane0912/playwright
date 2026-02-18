report:
	npx playwright show-report
failed:
	npx playwright test --last-failed 
all: 
	npx percy exec -- npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ /tests/visual/ --workers 2 
admin: 
	npx playwright test /tests/admin/
test: 
	npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ --workers 2 

refactor: 
	npx playwright test uk_eta_sk.spec.js --headed
translations:
	npx playwright test /tests/Translation 

test2:
	npx playwright test jamaica.spec.js --headed