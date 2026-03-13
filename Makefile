report:
	npx playwright show-report
failed:
	npx playwright test --last-failed --headed
all: 
	npx percy exec -- npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ /tests/visual/ --workers 2 
admin: 
	npx playwright test /tests/admin/
test: 
	npx playwright test /tests/Travel documents/ /tests/Passport-tests/ /tests/Mobile/ --workers 3 

refactor: 
	npx playwright test uspsPassport.spec.js
translations:
	npx playwright test /tests/Translation 

fastPassport:
	npx playwright test /tests/Passport-tests/Fastpassport

status:
	npx playwright test payments.spec.js extra_order.spec.js different_currency.spec.js currency_mobile.spec.js